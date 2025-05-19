import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI, InlineDataPart, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"; // Replace require with import

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GOOGLE_API_KEY || "";

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not defined");
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { imageBase64 } = req.body;

            if (!imageBase64) {
                return res.status(400).json({ error: 'No image provided' });
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: MODEL_NAME});

            const prompt = "Generate a short description for this image:";

            const imageContent: InlineDataPart = {
                // mimeType: "image/jpeg",
                // data: imageBase64
                inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64
                }
            };

            const generationConfig = {
                temperature: 0.9,
                topP: 1,
                topK: 1,
                maxOutputTokens: 2048,
            };

            const safetySettings = [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
                },
            ];

            const parts = [
                {text: prompt},
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