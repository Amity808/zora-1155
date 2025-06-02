import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Use private environment variable (without NEXT_PUBLIC prefix)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Remove NEXT_PUBLIC prefix
  // Remove dangerouslyAllowBrowser fla yesg - not needed for server-side
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not configured');
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
    });

    if (!response.data || response.data.length === 0 || !response.data[0].url) {
      return res.status(500).json({ error: 'No image returned from OpenAI' });
    }
    
    const imageUrl = response.data[0].url;
    return res.status(200).json({ imageUrl });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'OpenAI request failed',
        details: error.message 
      });
    }
    
    return res.status(500).json({ error: 'Unknown error occurred' });
  }
}