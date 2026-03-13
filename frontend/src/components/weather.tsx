import React, { useState, useEffect } from "react";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

const Weather: React.FC = () => {
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const dateObj = new Date();
    const month = monthNames[dateObj.getUTCMonth()];
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    setDate(`${month} ${day}, ${year}`);
  }, []);

  const getWeather = async () => {
    const apiKey = "6498cca2617d214c78df11180084ce69";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      setWeather(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div className="weather-container">
      <h2>{date}</h2>

      <div>
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div>
          <h3>{weather.name}</h3>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Feels like: {weather.main.feels_like}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;