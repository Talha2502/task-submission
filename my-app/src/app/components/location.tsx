"use client";

import React, { useState, useEffect } from 'react';

interface Position {
  latitude: number | null;
  longitude: number | null;
}

function MyLocation() {
  const [position, setPosition] = useState<Position>({ latitude: null, longitude: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.log("Geolocation is not available in your browser.");
    }
  }, []);

  return (
    <div>
      <h2>My Current Location</h2>
      {position.latitude !== null && position.longitude !== null ? (
        <p>
          Latitude: {position.latitude}, Longitude: {position.longitude}
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MyLocation;
