// pages/api/generate-image.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true // Use NON-public key here
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
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
    return res.status(500).json({ error: 'OpenAI request failed' });
  }
}
