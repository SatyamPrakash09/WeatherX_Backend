import { Router } from 'express';

const router = Router();
const OWM_API_KEY = process.env.openWeatherApi;

const VALID_LAYERS = ['clouds_new', 'temp_new', 'wind_new'];



router.get('/data', async (req, res) => {
  const { lat, lon } = req.query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Valid lat and lon are required' });
  }

  // Construct dynamic base URL from the request host
  const protocol = req.protocol === 'http' && req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : req.protocol;
  const host = req.get('host');
  const dynamicBaseUrl = `${protocol}://${host}`;

  // Generate a premium grid of points around the center for visualization
  const grid = [];
  const offset = 4; // degrees
  
  for (let dLat = -offset; dLat <= offset; dLat += offset) {
    for (let dLon = -offset; dLon <= offset; dLon += offset) {
      grid.push({
        lat: latitude + dLat + (Math.random() - 0.5),
        lon: longitude + dLon + (Math.random() - 0.5),
        temp_c: 20 + Math.random() * 15,
        wind_kph: Math.random() * 50,
        cloud: Math.random() * 100,
        condition: 'Clear'
      });
    }
  }

  res.json({
    center: { lat: latitude, lon: longitude },
    grid,
    tiles: {
      clouds: `${dynamicBaseUrl}/api/map/tiles/clouds_new/{z}/{x}/{y}`,
      temp: `${dynamicBaseUrl}/api/map/tiles/temp_new/{z}/{x}/{y}`,
      wind: `${dynamicBaseUrl}/api/map/tiles/wind_new/{z}/{x}/{y}`
    }
  });
});

router.get('/tiles/:layer/:z/:x/:y', async (req, res) => {
  const { layer, z, x, y } = req.params;

  if (!VALID_LAYERS.includes(layer)) {
    return res.status(400).json({ error: 'Invalid layer' });
  }

  try {
    const tileUrl = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/{y}.png?appid=${OWM_API_KEY}`;
    const response = await fetch(tileUrl);
    
    if (!response.ok) {
        throw new Error(`OWM Tile API returned ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Tile error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tile' });
  }
});

export default router;