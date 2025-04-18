import React, { useState } from 'react';
import axios from 'axios';
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

    const { latitude, longitude } = location;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&key=${apiKey}`
      );
      setPlaces(response.data.results);
    } catch (error) {
      setError('Failed to fetch places');
      console.error(error);
    }
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

      <div className="mt-4">
        {places.length > 0 && (
          <ul>
            {places.map((place, index) => (
              <li key={index}>
                <h3 className="text-lg font-bold">{place.name}</h3>
                <p>{place.vicinity}</p>
              </li>
            ))}
          </ul>
        )}
        {places.length === 0 && location && <p>No places found nearby.</p>}
      </div>
    </div>
  );
};

export default App;
