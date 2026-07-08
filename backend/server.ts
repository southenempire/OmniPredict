import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config({ path: '../.env' }); // Load the API key from the root .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Initialize the OpenAI client pointing to the Groq API endpoint
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.json({ 
        reply: "Error: No GROQ_API_KEY found in the .env file. Please add your Groq API key to use the AI!" 
      });
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.text
    }));

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are the OmniAI Assistant, a friendly and conversational AI integrated into the OmniPredict documentation.
OmniPredict is a privacy-first, omni-chain prediction market protocol built on the Flare Network.
It uses FTSO (Flare Time Series Oracle) for decentralized crypto prices and FDC (Flare Data Connector) for trustless real-world event resolution.
Engage in natural, small-talk friendly conversations while remaining helpful and technically accurate about the protocol. DO NOT use any markdown formatting like ** or ##. Respond in pure plain text only.`
        },
        ...formattedHistory,
        {
          role: "user",
          content: message
        }
      ],
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error processing the AI request.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ OmniPredict AI Backend running locally on http://localhost:${PORT}`);
});
