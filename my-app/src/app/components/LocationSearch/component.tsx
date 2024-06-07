import React, { useState, useEffect, useRef } from 'react';
import useGoogleMapsScript from '../../hooks/useGoogleMapScript';
import styles from './styles.module.css';
import RestaurantList from '../RestaurantList/component';
import { setRestaurantsList } from '../../../../redux/actions';
import { useDispatch } from 'react-redux';

interface LocationSearchProps {
  location: string;
  onLocationChange: (newLocation: string) => void;
  RestaurantList: (restaurants:[])=>{}
}

const LocationSearch: React.FC<LocationSearchProps> = ({ location, onLocationChange, RestaurantList }) => {
  const dispatch = useDispatch();
  
  const [inputValue, setInputValue] = useState(location);
  const [restaurants, setRestaurants] = useState<[]>([])
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const apiKey = "AIzaSyDWNtFs8Gbg7w7uy82SlU4gzmjS6IErBLA";
  const isLoaded = useGoogleMapsScript(apiKey);

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current!);
      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }
  }, [isLoaded]);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address && place.geometry) {
        setInputValue(place.formatted_address);
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        onLocationChange(place.formatted_address);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onLocationChange(newValue);
  };

  const getLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );

        const { latitude, longitude } = position.coords;
        const latLng = {
          lat: latitude,
          lng: longitude,
        };

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            setInputValue(address);
            setCoordinates(latLng);
            onLocationChange(address);
          } else {
            console.error('No results found or status not OK');
          }
        });
      } catch (error) {
        console.error('Error getting the current position:', error);
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // const sendData = ()=>{
  // }

  const handleFindRestaurant = async () => {
    let currentCoordinates = coordinates;
    if (!currentCoordinates) {
      // If coordinates are not available, use the address in the text field to get them
      const geocoder = new google.maps.Geocoder();
      try {
        const result = await new Promise((resolve, reject) => {
          geocoder.geocode({ address: inputValue }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const location = results[0].geometry.location;
              resolve({ lat: location.lat(), lng: location.lng() });
            } else {
              reject('Geocode was not successful for the following reason: ' + status);
            }
          });
        });
        currentCoordinates = result as { lat: number; lng: number };
        setCoordinates(currentCoordinates);
      } catch (error) {
        console.error('Error geocoding the address:', error);
        return;
      }
    }

    const query = `
      query Restaurants($latitude: Float, $longitude: Float) {
        nearByRestaurants(latitude: $latitude, longitude: $longitude) {
          offers {
            _id
            name
            tag
            restaurants
            __typename
          }
          sections {
            _id
            name
            restaurants
            __typename
          }
          restaurants {
            _id
            name
            image
            slug
            address
            location {
              coordinates
              __typename
            }
            deliveryTime
            minimumOrder
            tax
            reviewData {
              total
              ratings
              reviews {
                _id
                __typename
              }
              __typename
            }
            categories {
              _id
              title
              foods {
                _id
                title
                __typename
              }
              __typename
            }
            rating
            isAvailable
            openingTimes {
              day
              times {
                startTime
                endTime
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
    const variables = {
      latitude: currentCoordinates.lat,
      longitude: currentCoordinates.lng,
    };

    try {
      const response = await fetch('https://enatega-multivendor.up.railway.app/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: "Restaurants",
          query: query,
          variables: variables,
        }),
      });
      const data = await response.json();
      setRestaurants(data?.data?.nearByRestaurants?.restaurants);
      RestaurantList(restaurants)

      // dispatch(setRestaurantsList({restaurants: restaurants}));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  return (
    <div className={styles.locationSearchContainer}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className={styles.locationInput}
        list="locationOptions"
      />
      <datalist id="locationOptions">
        {/* Optionally, you can map previous searches or suggested locations here */}
      </datalist>
      <button onClick={getLocation} className={styles.locateMeButton}>
        Locate Me
      </button>
      <button onClick={handleFindRestaurant} className={styles.findButton}>
        Find Restaurant
      </button>
    </div>
  );
};

export default LocationSearch;
