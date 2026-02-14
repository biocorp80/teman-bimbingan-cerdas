// api/chat.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, model } = req.body;
  
  // AMBIL KEY DARI VERCEL ENVIRONMENT VARIABLES (AMAN!)
  const apiKey = process.env.OPENROUTER_API_KEY; 

  if (!apiKey) {
    return res.status(500).json({ error: 'Server API Key not configured' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model || "google/gemini-2.0-flash-001",
        messages: messages,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://dosbing.ai', // Ganti dengan domain Anda nanti
          'X-Title': 'Dosbing AI Client'
        }
      }
    );

    // Kirim balik jawaban AI ke frontend
    res.status(200).json(response.data);
    
  } catch (error) {
    console.error("OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
}
