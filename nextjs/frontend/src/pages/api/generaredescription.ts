import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI } = require("@google/generative-ai")

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GOOGLE_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { imageBase64 } = req.body;

            if (!imageBase64) {
                return res.status(400).json({ error: 'No image provided' });
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getModel(MODEL_NAME);

            const prompt = "Generate a short description for this image:";

            const imageContent = {
                mimeType: "image/jpeg",
                data: imageBase64
            };

            const generationConfig = {
                temperature: 0.9,
                topP: 1,
                topK: 1,
                maxOutputTokens: 2048,
            };

            const safetySettings = [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
            ];

            const parts = [
                prompt,
                imageContent,
            ];

            const result = await model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
                safetySettings,
            });

            const response = result.response;
            const text = response.text();

            res.status(200).json({ description: text });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to generate description' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb',
        },
    },
};