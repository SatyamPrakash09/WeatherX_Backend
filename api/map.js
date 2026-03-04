import { Router } from 'express';

const router = Router();
const OWM_API_KEY = process.env.openWeatherApi;

const VALID_LAYERS = ['clouds_new', 'temp_new', 'wind_new'];

router.get('/tiles/:layer/:z/:x/:y', async (req, res) => {
  const { layer, z, x, y } = req.params;

  if (!VALID_LAYERS.includes(layer)) {
    return res.status(400).json({ error: 'Invalid layer' });
  }

  try {
    const tileUrl = `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${OWM_API_KEY}`;
    const response = await fetch(tileUrl);
    const buffer = await response.arrayBuffer();

    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Tile error:', err);
    res.status(500).json({ error: 'Failed to fetch tile' });
  }
});

export default router;