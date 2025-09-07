import axios from "axios";
const GEMINI_KEY = process.env.GEMINI_API_KEY;

export const generateStoryAndImages = async (storyIdea) => {
  const scenesWithImages = [];

  // 1. Generate story text (4-scene outline)
  const textResponse = await axios.post(
    "https://api.generativeai.googleapis.com/v1beta2/models/gemini-2.0-flash:generate",
    { prompt: `Write a 4-scene story based on: ${storyIdea}`, modalities: ["TEXT"] },
    { headers: { Authorization: `Bearer ${GEMINI_KEY}` } }
  );

  const storyText = textResponse.data.candidates[0].content;
  const scenes = storyText.split("\n").filter(Boolean).slice(0, 4);

  // 2. Generate images for each scene
  for (let scene of scenes) {
    const imgResponse = await axios.post(
      "https://api.generativeai.googleapis.com/v1beta2/models/gemini-2.0-image:generate",
      { prompt: scene, size: "512x512" },
      { headers: { Authorization: `Bearer ${GEMINI_KEY}` } }
    );
    const imageUrl = imgResponse.data.candidates[0].imageUri;
    scenesWithImages.push({ text: scene, imageUrl });
  }

  return scenesWithImages;
};