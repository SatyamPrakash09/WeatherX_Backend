import { configDotenv } from "dotenv";
import express from 'express'
import cors from 'cors'
import { getWeatherData } from './api/weatherData.js'
import { getForecastData } from './api/forecastData.js'

configDotenv();

const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req, res)=>{
    console.log(`Inside Server`)
    res.status(200).json({"status":"Running"})
})

// Current Weather Route
app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;
    if (!city && !(lat && lon)) {
        return res.status(400).json({ error: "City or coordinates are required" });
    }
    try {
        const data = await getWeatherData({ city, lat, lon });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in /weather:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// Forecast Route
app.get('/forecast', async (req, res) => {
    const { city, lat, lon } = req.query;
    if (!city && !(lat && lon)) {
        return res.status(400).json({ error: "City or coordinates are required" });
    }
    try {
        const data = await getForecastData({ city, lat, lon });
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in /forecast:", error.message);
        res.status(500).json({ error: "Failed to fetch forecast data" });
    }
});

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})