import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { generatePixelArtImage } from './geminiService.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 5 });
app.use('/api/', limiter);

app.post('/api/generate', async (req, res) => {
  try {
    const prompt = String(req.body.prompt || '').trim();
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    if (prompt.length > 200) {
      return res.status(400).json({ error: 'Prompt too long' });
    }
    const sanitizedPrompt = prompt.replace(/[^\w\s.,!?'-]/g, '');
    const imageUrl = await generatePixelArtImage(sanitizedPrompt);
    res.json({ imageUrl });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
