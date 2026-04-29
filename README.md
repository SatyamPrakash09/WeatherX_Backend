# ⛅ WeatherX — Backend API

A lightweight **Express.js** REST API that aggregates weather data from multiple providers ([OpenWeatherMap](https://openweathermap.org/) & [WeatherAPI](https://www.weatherapi.com/)) and serves it to the WeatherX mobile app.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Current Weather** | Fetches real-time weather from two providers and returns a combined response |
| **3-Day Forecast** | Retrieves multi-day forecast data by city name or coordinates |
| **Weather Map Tiles** | Proxies OpenWeatherMap tile layers (clouds, temperature, wind) for map overlays |
| **Map Grid Data** | Generates a 9-point weather grid around a location for map visualization |

---

## 🛠️ Tech Stack

- **Runtime** — [Bun](https://bun.sh/)
- **Framework** — [Express 5](https://expressjs.com/)
- **HTTP Client** — [Axios](https://axios-http.com/)
- **Weather Providers** — OpenWeatherMap API, WeatherAPI
- **Environment** — dotenv

---

## 📁 Project Structure

```
backend/
├── index.js            # Entry point — imports and boots the server
├── server.js           # Express app setup, routes, and middleware
├── config.js           # Loads environment variables via dotenv
├── api/
│   ├── weatherData.js  # Current weather handler (OpenWeather + WeatherAPI)
│   ├── forecastData.js # Forecast handler (OpenWeather + WeatherAPI)
│   └── map.js          # Map data grid + tile proxy routes
├── package.json
├── .env                # API keys (not committed)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (or Node.js 18+)
- API keys from:
  - [OpenWeatherMap](https://openweathermap.org/api) → free tier works
  - [WeatherAPI](https://www.weatherapi.com/) → free tier works

### 1. Clone & Install

```bash
cd backend
bun install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
openWeatherApi=YOUR_OPENWEATHERMAP_API_KEY
weatherApi=YOUR_WEATHERAPI_KEY
```

### 3. Run the Server

```bash
# Development (auto-restart on file changes)
bun run dev

# Production
bun run start
```

The server starts on **`http://localhost:3000`**.

---

## 📡 API Endpoints

### `GET /`

Health check.

**Response:**
```json
{ "status": "Running" }
```

---

### `GET /weather`

Returns current weather data from both providers.

| Query Param | Type | Required | Description |
|---|---|---|---|
| `city` | string | ✳️ | City name (e.g. `London`) |
| `lat` | number | ✳️ | Latitude |
| `lon` | number | ✳️ | Longitude |

> ✳️ Either `city` **or** `lat` + `lon` must be provided.

**Example:**
```
GET /weather?city=Delhi
GET /weather?lat=28.6139&lon=77.2090
```

**Response:**
```json
{
  "openWeather": { ... },
  "weatherApi": { ... }
}
```

---

### `GET /forecast`

Returns forecast data (up to 3 days) from both providers.

| Query Param | Type | Required | Description |
|---|---|---|---|
| `city` | string | ✳️ | City name |
| `lat` | number | ✳️ | Latitude |
| `lon` | number | ✳️ | Longitude |

**Example:**
```
GET /forecast?city=Mumbai
```

---

### `GET /api/map/data`

Returns a 9-point weather grid and tile URLs for map overlays.

| Query Param | Type | Required | Description |
|---|---|---|---|
| `lat` | number | ✅ | Latitude |
| `lon` | number | ✅ | Longitude |

**Response:**
```json
{
  "center": { "lat": 28.61, "lon": 77.20 },
  "grid": [
    { "lat": 24.61, "lon": 73.20, "temp_c": 32.5, "wind_kph": 12.3, "cloud": 45, "condition": "Haze" },
    ...
  ],
  "tiles": {
    "clouds": "http://localhost:3000/api/map/tiles/clouds_new/{z}/{x}/{y}",
    "temp": "http://localhost:3000/api/map/tiles/temp_new/{z}/{x}/{y}",
    "wind": "http://localhost:3000/api/map/tiles/wind_new/{z}/{x}/{y}"
  }
}
```

---

### `GET /api/map/tiles/:layer/:z/:x/:y`

Proxies OpenWeatherMap tile images. Supported layers: `clouds_new`, `temp_new`, `wind_new`.

Returns a `image/png` with 1-hour cache headers.

---

## 📝 License

ISC
