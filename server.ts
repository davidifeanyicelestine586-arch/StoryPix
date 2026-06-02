/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure Gemini Client is initialized with appropriate User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper function to create a text-based simple hash to seed illustrations during fallbacks
  const getPromptSeed = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash) % 10000;
  };

  // --- API ROUTE: Story Generator ---
  app.post('/api/stories/generate', async (req, res) => {
    try {
      const { heroType, heroName, setting, adventureTheme, artStyle } = req.body;

      if (!heroType || !heroName || !setting || !adventureTheme || !artStyle) {
        return res.status(400).json({ error: 'Missing required configuration fields.' });
      }

      if (!ai) {
        // Return a mock story if the Gemini Api key is missing or is the default placeholder
        console.log('Skipping Gemini API Story Generation: No API key configured. Generating fun local mock story.');
        const mockTitle = `The Adventures of ${heroName} the ${heroType}`;
        const mockResponse = {
          title: mockTitle,
          description: `A magical story about ${heroName} the ${heroType} on a quest in ${setting} to discover ${adventureTheme}!`,
          pages: [
            {
              pageNumber: 1,
              text: `Once upon a time, in ${setting}, there lived ${heroName}, a very curious ${heroType}. ${heroName} loved looking at the shiny stars and dreaming of big magic and wonderful friends.`,
              narrationText: `Once upon a time, in ${setting}, there lived ${heroName}, a very curious little ${heroType}! Oh, ${heroName} loved looking up at the shiny, sparkling stars, dreaming of big magic and great friends.`,
              illustrationPrompt: `A cute, baby ${heroType} named ${heroName} sitting happily in ${setting}, looking up at sparkling stars, styled in ${artStyle}, colorful, bright children's book illustration.`
            },
            {
              pageNumber: 2,
              text: `One sunny morning, ${heroName} found a mysterious, shimmering map key lying on a clover patch. It had tiny glowing carvings that pointed all the way to ${adventureTheme}!`,
              narrationText: `One beautiful, sunny morning, ${heroName} found a mysterious, shimmering gold key lying in a clover patch. Just look at that! It had tiny glowing carvings that pointed all the way to the path of ${adventureTheme}!`,
              illustrationPrompt: `A curious ${heroType} named ${heroName} discovering a glowing golden key in a green grass field in ${setting}, magical atmosphere, styled in ${artStyle}, high contrast.`
            },
            {
              pageNumber: 3,
              text: `With key in hand, ${heroName} set off! The path was filled with funny giant bubbles and friendly singing butterflies who pointed the way. "Keep going!" they sang happily.`,
              narrationText: `With the golden key held tight, ${heroName} set off on the adventure! The path was filled with funny giant floating bubbles and cute singing butterflies who pointed the way. "Keep going!" they sang out happily.`,
              illustrationPrompt: `A happy ${heroType} matching ${heroStylePrompt(heroType)} walking along a magical path with giant bubbles and colorful butterflies, styled as beautiful ${artStyle} children book sketch.`
            },
            {
              pageNumber: 4,
              text: `At the end of the road, ${heroName} found a giant, mossy chest covered in sparkly vines. The golden key fit perfectly! ${heroName} turned it with a loud CLICK!`,
              narrationText: `At the very end of the secret road, ${heroName} found a giant, mossy wooden chest completely covered in sparkly pink vines. The golden key fit perfectly! ${heroName} leaned in, pushed, and turned it with a loud, magical CLICK!`,
              illustrationPrompt: `Cute ${heroType} standing in front of a giant, glowing wooden treasure chest with sparkly vines, key inserted in lock, styled in ${artStyle}, vibrant tones.`
            },
            {
              pageNumber: 5,
              text: `Instead of gold, the chest opened to release swirling bubbles of pure happiness and warm light that filled the sky of ${setting}! ${heroName} had discovered ${adventureTheme}.`,
              narrationText: `Instead of gold, the chest flew open to release swirling bubbles of pure happiness and warm rainbow light that filled the sky of ${setting}! ${heroName} had discovered ${adventureTheme}, the ultimate treasure. "Hurrah!" cheered ${heroName}!`,
              illustrationPrompt: `A baby ${heroType} surrounded by floating glowing bubbles and rainbow light, celebrating happily in ${setting}, heartwarming ending, beautiful ${artStyle} children book art.`
            }
          ]
        };
        return res.json(mockResponse);
      }

      console.log(`Generating AI story for kids about: ${heroName} the ${heroType} in ${setting} with style ${artStyle}...`);

      const systemInstruction = 
        `You are a professional, world-class author of magical children's books.
        Your goal is to write a captivating, positive, and deeply heartwarming 5-page story tailored for kids aged 3-8 years old.
        Each page MUST be structured with:
        1. "text": 2-3 sentences of simple, clear story text for the child to read.
        2. "narrationText": A warm, expressive, spoken-word friendly narration of the page. It should be rich, cute, and include fun auditory sound effects wordings (like WHOOSH, POP, A-CHOO, GIGGLE, CLICK, SPLASH) where appropriate to make it fun when read aloud.
        3. "illustrationPrompt": An exceptionally detailed description for an image-generation model to paint a perfect, kid-friendly scene for this specific page. It MUST include details of the setting, target character colors/appearances, a joyful mood, and specifically request the style "${artStyle}". Avoid rendering any text, writing, or signatures in the picture.

        Provide exactly 5 pages that form a wholesome, complete narrative arc:
        - Page 1: Introduction of the adorable hero and the magical setting.
        - Page 2: The inciting action or discovery of a fun goal.
        - Page 3: An gentle obstacle, helper friend, or journey progression.
        - Page 4: The exciting core action, climax, or puzzle solution.
        - Page 5: A joyful, cozy, or heartwarming resolution that celebrates ${adventureTheme}.`;

      const prompt = `Write a magical, kid-friendly story.
        Hero details: A adorable ${heroType} named "${heroName}".
        Setting details: "${setting}".
        Core theme/Goal: "${adventureTheme}".
        Required Illustration Style: "${artStyle}".
        Make sure the returned JSON perfectly follows the schema provided.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.9,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'The title of this magical children\'s book.'
              },
              description: {
                type: Type.STRING,
                description: 'A 1-2 sentence description of the book\'s adventure.'
              },
              pages: {
                type: Type.ARRAY,
                description: 'The 5 book pages that make up the story.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    pageNumber: {
                      type: Type.INTEGER,
                      description: 'The page index from 1 to 5.'
                    },
                    text: {
                      type: Type.STRING,
                      description: 'Concise written story text (2-3 simple sentences).'
                    },
                    narrationText: {
                      type: Type.STRING,
                      description: 'Rich, spoken-word friendly narration text with fun audial indicators.'
                    },
                    illustrationPrompt: {
                      type: Type.STRING,
                      description: 'Extremely detailed art description for image generation, explicitly incorporating the style.'
                    }
                  },
                  required: ['pageNumber', 'text', 'narrationText', 'illustrationPrompt']
                }
              }
            },
            required: ['title', 'description', 'pages']
          }
        }
      });

      const storyText = response.text;
      if (!storyText) {
        throw new Error('Failed to retrieve text content from Gemini.');
      }

      const generatedStory = JSON.parse(storyText);
      res.json(generatedStory);

    } catch (error: any) {
      console.error('Error in /api/stories/generate:', error);
      res.status(500).json({ error: error.message || 'An error occurred during story generation.' });
    }
  });

  // --- API ROUTE: Illustration Generator ---
  app.post('/api/illustration', async (req, res) => {
    try {
      const { prompt, style } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Missing illustration description prompt.' });
      }

      // Add children-book enhancements to prompt to ensure pristine child friendliness
      const enhancedPrompt = `${prompt}. Beautiful, clean, very cute child-friendly colors, pastel tones, professional illustration, masterpiece, NO text, NO watermarks, NO signatures, safe for kids.`;

      if (!ai) {
        // Fall back to a randomized high-contrast aesthetic Picsum placeholder URL if no key
        const seedValue = getPromptSeed(prompt);
        console.log(`No Gemini API key. Falling back to Picsum generator for prompt: ${prompt.substring(0, 40)}...`);
        const fallbackUrl = `https://picsum.photos/seed/${seedValue}/600/400`;
        return res.json({ imageUrl: fallbackUrl, isPlaceholder: true });
      }

      console.log(`Generating professional AI illustration utilizing artist style: "${style || 'Watercolor'}"...`);

      // Try generating using gemini-2.5-flash-image or general image models
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: '4:3',
            },
          },
        });

        let base64Image: string | null = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              base64Image = part.inlineData.data;
              break;
            }
          }
        }

        if (base64Image) {
          const imageUrl = `data:image/png;base64,${base64Image}`;
          return res.json({ imageUrl });
        } else {
          throw new Error('No inline image data returned by the model.');
        }
      } catch (innerError: any) {
        console.error('Inner AI Image generation failed, trying Imagen fallback or standard placeholder:', innerError.message);
        
        // Let's try imagen-4.0-generate-001 as a backup model
        try {
          const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: enhancedPrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3',
            },
          });

          const base64EncodeString: string = response.generatedImages[0].image.imageBytes;
          const imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;
          return res.json({ imageUrl });
        } catch (imagenError: any) {
          console.error('Both Imagen and Gemini Image models failed. Falling back to Picsum.', imagenError.message);
          const seedValue = getPromptSeed(prompt);
          const fallbackUrl = `https://picsum.photos/seed/${seedValue}/600/400`;
          return res.json({ imageUrl: fallbackUrl, isPlaceholder: true, apiError: innerError.message });
        }
      }

    } catch (error: any) {
      console.error('Error in /api/illustration:', error);
      res.status(500).json({ error: error.message || 'An error occurred during illustration generation.' });
    }
  });

  // Helper helper to generate style tags based on hero name
  function heroStylePrompt(type: string): string {
    return `baby cartoon ${type} with big curious eyes, fluffy and extremely sparkly`;
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kids Story server running on http://localhost:${PORT}`);
  });
}

startServer();
