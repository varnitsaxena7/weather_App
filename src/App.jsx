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
`;

const WeatherDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  const [city, setCity] = useState("New Delhi");
  const [weatherData, setWeatherData] = useState(null);

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
        </LeftColumn>
        <RightColumn>
          <div className="w-full max-w-lg p-6 bg-white bg-opacity-10 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-4 text-center">Today's Highlights</h1>
            {weatherData && (
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
              </div>
            )}
          </div>
        </RightColumn>
      </FlexContainer>
    </AppContainer>
  );
}

export default App;
