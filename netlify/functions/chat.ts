export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) };
    }

    const GROQ_API_KEY = process.env.VITE_AI_API_KEY;

    if (!GROQ_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'API key is not configured' }) };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are OmniAI, an advanced predictive AI connected to the Flare Time Series Oracle (FTSO) and Flare Data Connector (FDC). 
Your job is to provide market analysis and predictions for cryptocurrencies (BTC, ETH, XRP) and African Weather markets (Nairobi, Accra, Cape Town). 
Keep your responses short, hacker-themed, and confident. Always include a percentage probability for your predictions.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch from Groq API' }) };
    }

    const data = await response.json();
    return { 
      statusCode: 200, 
      body: JSON.stringify({ response: data.choices[0].message.content }) 
    };

  } catch (error) {
    console.error('Server error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
