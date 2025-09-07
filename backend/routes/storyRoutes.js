import express from "express";
import { generateStory, generateImage } from "../controllers/storyController.js";

const router = express.Router();

router.post("/generate-text", generateStory);
router.post("/generate-image", generateImage);

// Image proxy endpoint to handle CORS issues
router.get("/image-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log('Proxying image:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image as buffer
    const buffer = await response.arrayBuffer();
    
    // Set proper headers
    res.set({
      'Content-Type': response.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Content-Length': buffer.byteLength
    });

    // Send the image data
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

router.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

export default router;
