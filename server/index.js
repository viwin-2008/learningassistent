import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini Client safely from server env
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

// Health Check
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({ status: 'ok', serverTime: new Date().toISOString(), hasGeminiKey: hasKey });
});

// 1. AI Chat Route
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const ai = getAIClient();
    if (!ai) {
      return res.json({ text: `[Server Key Not Set] EduGenie is running in simulated response mode. Please configure GEMINI_API_KEY in server .env.` });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err) {
    console.error("Server API Error (/api/chat):", err.message);
    res.status(500).json({ error: err.message || 'Error generating AI chat response' });
  }
});

// 2. Smart Notes Route
app.post('/api/generate-notes', async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.status(400).json({ error: 'Gemini API Key missing on server' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Document Summarizer Route
app.post('/api/summarize', async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.status(400).json({ error: 'Gemini API Key missing on server' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Quiz Generator Route
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { prompt } = req.body;
    const ai = getAIClient();
    if (!ai) {
      return res.status(400).json({ error: 'Gemini API Key missing on server' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ text: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`EduGenie Backend Server running securely on port ${PORT}`);
});
