import './config.js'
import express from 'express'
import cors from 'cors'
import { getWeatherData } from './api/weatherData.js'
import { getForecastData } from './api/forecastData.js'
import mapRoutes from './api/map.js'
import rateLimit from 'express-rate-limit'

const app = express()

// Trust proxy for correct protocol detection behind reverse proxies
app.set('trust proxy', 1)

// CORS — restrict origins in production via ALLOWED_ORIGINS env var
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : undefined // undefined = allow all (dev mode)

app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined))
app.use(express.json())

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})
app.use(limiter)

app.get('/', (req, res) => {
    res.status(200).json({ "status": "Running" })
})

// Current Weather Route
app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (!city && !(Number.isFinite(parsedLat) && Number.isFinite(parsedLon))) {
        return res.status(400).json({ error: "Valid city name or coordinates (lat, lon) are required" });
    }

    try {
        const query = city ? { city } : { lat: parsedLat, lon: parsedLon };
        const data = await getWeatherData(query);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in /weather:", error.message);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// Forecast Route
app.get('/forecast', async (req, res) => {
    const { city, lat, lon } = req.query;
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (!city && !(Number.isFinite(parsedLat) && Number.isFinite(parsedLon))) {
        return res.status(400).json({ error: "Valid city name or coordinates (lat, lon) are required" });
    }

    try {
        const query = city ? { city } : { lat: parsedLat, lon: parsedLon };
        const data = await getForecastData(query);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error in /forecast:", error.message);
        res.status(500).json({ error: "Failed to fetch forecast data" });
    }
});

app.use('/api/map', mapRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})