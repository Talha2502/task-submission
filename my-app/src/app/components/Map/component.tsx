"use client";

import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import LocationSearch from '../LocationSearch/component';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

const mapStyles = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

interface MapProps {
  restaurantsArray: (restaurants:[])=>{}
}


const MyMapComponent: React.FC<MapProps> = ({restaurantsArray}) => {
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [restaurants, setRestaurants] = useState<[]>([])
  console.log(restaurants)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latLng = {
          lat: latitude,
          lng: longitude,
        };
        setCurrentPosition(latLng);
        fetchAddress(latLng);
      },
      () => {
        console.error('Error getting the current position');
      }
    );
  }, []);

  useEffect(()=>{
    if(restaurants){
      restaurantsArray(restaurants)
    }
  },[restaurants])

  const fetchAddress = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        setCurrentAddress(results[0].formatted_address);
      } else {
        console.error('Error fetching the address');
      }
    });
  };

  const handleLocationChange = async (address: string) => {
    if (!address.trim()) {
      console.error('Address cannot be empty');
      return;
    }

    const geocoder = new google.maps.Geocoder();
    const latLng = await new Promise<google.maps.LatLng | undefined>((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].geometry.location);
        } else if (status === "ZERO_RESULTS") {
          console.error(`Unable to find location for ${address}`);
          reject(new Error('Unable to find location'));
        } else {
          console.error(`Geocoding error: ${status}`);
          reject(new Error(`Geocoding error: ${status}`));
        }
      });
    }).catch(error => {
      console.error(error.message);
      return undefined;
    });

    if (latLng) {
      setCurrentPosition({ lat: latLng.lat(), lng: latLng.lng() });
      setCurrentAddress(address);
    }
  };


  return (
    <LoadScript googleMapsApiKey={"AIzaSyDWNtFs8Gbg7w7uy82SlU4gzmjS6IErBLA"}>
      <div style={{ position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || defaultCenter}
          zoom={10}
          options={{ styles: mapStyles }}
        >
          {currentPosition && <Marker position={currentPosition} />}
        </GoogleMap>
        <LocationSearch location={currentAddress} onLocationChange={handleLocationChange} RestaurantList={setRestaurants}/>
      </div>
    </LoadScript>
  );
};

export default MyMapComponent;
