import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const OPENWEATHER_API_KEY = process.env.openWeatherApi;
const WEATHERAPI_KEY = process.env.weatherApi;

export async function getWeatherData(query) {
    try {
        let openWeatherUrl, weatherApiUrl;
        
        if (query.lat && query.lon) {
            openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
            weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${query.lat},${query.lon}`;
        } else if (query.city) {
            openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query.city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
            weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${query.city}`;
        } else {
            throw new Error("Missing city or coordinates");
        }

        const openWeatherResponse = await axios.get(openWeatherUrl);
        const weatherApiResponse = await axios.get(weatherApiUrl);

        return {
            openWeather: openWeatherResponse.data,
            weatherApi: weatherApiResponse.data
        };
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        throw error;
    }
}
