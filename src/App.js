import React, { useState } from 'react';
import axios from 'axios';
//const router = require('express').Router()
//module.exports = router
//import config from './conf.js';

const apiKey = process.env.REACT_APP_API_KEY;

const App = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);


  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setError(null); // clear any previous error
        
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setLocation(null); // clear any previous location
      }
    );
  };

  const getNearbyPlaces = async () => {
    if (!location) {
      setError('Please get your location first!');
      return;
    }

    const data = {
      "includedTypes": ["restaurant"],
      "maxResultCount": 10,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location.latitude,
            "longitude": location.longitude
          },
          "radius": 500.0
        }
      }
    };

    try {
      const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.displayName,places.location,places.formattedAddress,places.primaryType,places.rating,places.websiteUri'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      const result = await response.json();
      

      if (result && result.places) {
        console.log(result.places.length);
        //console.log('Type of result.places:', Array.isArray(result.places));
        for(let i = 0; i < result.places.length; i++){
          console.log(result.places[i]);
        }
        setPlaces(result.places); // Update state with places
        //console.log(places);
        //for(let i = 0; i < places.length; i++){
          //console.log(places[i]);
        //}
        setError(null); // Clear any previous errors
      } else {
        setPlaces([]); // No places found
        setError('No places found nearby.');
      }
    } catch (error) {
      setError('Failed to fetch places');
      console.error(error);
    }
    /*
    let data = {
      "includedTypes": ["restaurant"],
      "maxResultCount": 10,
      "locationRestriction": {
        "circle": {
          "center": {
            "latitude": location.latitude,
            "longitude": location.longitude},
          "radius": 500.0
        }
      }
    };

    fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName'
      }, 
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .then(setPlaces(data))
    .catch(error => console.error('Error:', error));
    */
    /*
    if (!location) {
      setError('Please get your location first!');
      return;
    }

    const { latitude, longitude } = location;

    try {
      // Make a request to your backend API to fetch nearby places
      const response = await axios.get(
        `/api/nearby?lat=${latitude}&lng=${longitude}`
      );

      if (response.data.status === "OK") {
        setPlaces(response.data.results);
        setError(null);
      } else {
        setError(`Failed to fetch nearby places: ${response.data.status}`);
      }
    } catch (error) {
      setError('Failed to fetch places');
      console.error(error);
    }
    */
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Restaurant Roulette</h1>
      <h2 className="text-xl font-bold mb-2">Find your next restaurant</h2>

      <button
        onClick={getLocation}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Get Location
      </button>

      <div className="mt-4">
        {location ? (
          <p>
            Latitude: {location.latitude} <br />
            Longitude: {location.longitude}
          </p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p>Click the button to get your location.</p>
        )}
      </div>

      <button
        onClick={getNearbyPlaces}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Get Nearby Places
      </button>

      <div id="display-names" className="mt-4">
  {places.length > 0 ? (
    <ul className="space-y-4">
      {places.map((place, index) => (
        <li key={index} className="border p-4 rounded shadow">
          <h3 className="text-lg font-semibold">
            {place.displayName?.text || 'No Name'}
          </h3>
          <p>
            <strong>Address:</strong> {place.formattedAddress || 'N/A'}
          </p>
          <p>
            <strong>Rating:</strong> {place.rating ? `${place.rating} ⭐` : 'No rating'}
          </p>
          {place.websiteUri && (
            <p>
              <a
                href={place.websiteUri}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Visit website
              </a>
            </p>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p>No places loaded yet.</p>
  )}
</div>
    </div>
  );
};

export default App;
