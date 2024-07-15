import React, { useEffect, useState } from "react";
import Temperature from "./componenets/Temperature";
import Highlights from "./componenets/Highlights";
import LottieAnimation from "./componenets/LottieAnimation";
import styled from "styled-components";

// Import animation files
import sunnyAnimation from "./animations/sunny.json";
import rainAnimation from "./animations/rain.json";
import cloudyAnimation from "./animations/cloudy.json";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #282c34;
  color: white;
  font-family: 'Arial', sans-serif;

  @media (max-width: 768px) {
    height: auto;
    padding: 20px;
  }
`;

const WeatherDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const HighlightsContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 12px;
  }
`;
const StyledButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  margin-top: 100px;
  background: #282c34;
  border: 2px solid #fff;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
    margin-top: 50px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
    margin-top: 25px;
  }
`;


function App() {
  const [city, setCity] = useState("New Delhi");
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);

  useEffect(() => {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=b9c09a397ef041c0ab555715240205&q=${city}&aqi=no`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not get data");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setWeatherData(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [city]);

  useEffect(() => {
    const fetchAirQualityData = async () => {
      setAirQualityData(null);
      try {
        const response = await fetch(`https://api.waqi.info/feed/${city}/?token=62a5a6baa4dedbc43a32ccd472ee1401433f7797`);
        const result = await response.json();
        if (result.status === "ok") {
          setAirQualityData(result.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (error) {
        setError('Failed to fetch data');
      }
    };

    fetchAirQualityData();
  }, [city]);

  const getAnimationData = () => {
    if (!weatherData) return null;
    const condition = weatherData.current.condition.text.toLowerCase();

    if (condition.includes("sunny")) {
      return sunnyAnimation;
    } else if (condition.includes("rain")) {
      return rainAnimation;
    } else if (condition.includes("cloud")) {
      return cloudyAnimation;
    } else {
      return sunnyAnimation; // default animation
    }
  };

  return (
    <AppContainer>
      <FlexContainer>
        <LeftColumn>
          <div className="w-full max-w-xs">
            {weatherData && (
              <Temperature
                setCity={setCity}
                stats={{
                  temp: weatherData.current.temp_c,
                  condition: weatherData.current.condition.text,
                  isDay: weatherData.current.is_day,
                  location: weatherData.location.name,
                  time: weatherData.location.localtime,
                }}
              />
            )}
            {weatherData && <LottieAnimation animationData={getAnimationData()} width={300} height={300} />}
          </div>
          <StyledButton href="https://pollen-2v1o.onrender.com/" target="_blank" rel="noopener noreferrer">View Pollen Data</StyledButton>
        </LeftColumn>
        <RightColumn>
          <div className="w-full max-w-lg p-4 bg-white bg-opacity-10 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">Today's Highlights</h1>
            {weatherData && airQualityData && (
              <div className="grid grid-cols-2 gap-4">
                <Highlights
                  stats={{
                    title: "Wind Status",
                    value: weatherData.current.wind_mph,
                    unit: "mph",
                    direction: weatherData.current.wind_dir,
                  }}
                />
                <Highlights
                  stats={{
                    title: "Humidity",
                    value: weatherData.current.humidity,
                    unit: "%",
                  }}
                />
                <Highlights
                  stats={{
                    title: "Visibility",
                    value: weatherData.current.vis_miles,
                    unit: "miles",
                  }}
                />
                <Highlights
                  stats={{
                    title: "Air Pressure",
                    value: weatherData.current.pressure_mb,
                    unit: "mb",
                  }}
                />
                <Highlights
                  stats={{
                    title: "UV Index",
                    value: weatherData.current.uv,
                    unit: "",
                  }}
                />
                <Highlights
                  stats={{
                    title: "Cloud Cover",
                    value: weatherData.current.cloud,
                    unit: "%",
                  }}
                />
                <Highlights
                  stats={{
                    title: "AQI",
                    value: airQualityData.aqi,
                    unit: "",
                  }}
                />
                <Highlights
                  stats={{
                    title: "Pollutant(Main)",
                    value: airQualityData.dominentpol,
                    unit: "",
                  }}
                />
                <Highlights
                  stats={{
                    title: `${airQualityData.dominentpol} value`,
                    value: airQualityData.iaqi[airQualityData.dominentpol.toLowerCase()].v,
                    unit: "µg/m³",
                  }}
                />
                <Highlights
                  stats={{
                    title: `Feels Like`,
                    value: weatherData.current.feelslike_c,
                    unit: "°C",
                  }}
                />
              </div>
            )}
          </div>
        </RightColumn>
      </FlexContainer>
    </AppContainer>
  );
}

export default App;
