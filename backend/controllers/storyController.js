import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateStory = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { idea, settings } = req.body;
    
    if (!idea || !settings) {
      return res.status(400).json({ error: 'Missing required fields: idea or settings' });
    }

    console.log('Initializing Gemini 2.5 Flash model...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Create an enhanced prompt for Gemini 2.5 Flash with 5-scene structure
    const prompt = `You are a professional storyteller. Create an engaging, well-structured story divided into exactly 5 scenes based on the following parameters:

**Story Concept:** ${idea}
**Genre:** ${settings.genre || 'General Fiction'}
**Tone:** ${settings.tone || 'Balanced'}
**Target Audience:** ${settings.audience || 'General'}

**Requirements:**
- Write a complete story divided into exactly 5 distinct scenes
- Each scene should be 200-300 words
- Include vivid descriptions and compelling characters
- Maintain consistent ${settings.tone || 'balanced'} tone throughout
- Ensure the story fits the ${settings.genre || 'general fiction'} genre
- Include dialogue where appropriate
- Create immersive scenes with sensory details

**5-Scene Story Structure:**
1. **Scene 1 - Opening Hook**: Introduce the main character and initial situation
2. **Scene 2 - World Building**: Establish the setting and present the central conflict
3. **Scene 3 - Rising Action**: Develop the conflict with increasing tension
4. **Scene 4 - Climax**: The peak moment of tension and confrontation
5. **Scene 5 - Resolution**: Conclusion that resolves the conflict satisfactorily

**Output Format:**
Please format your response as follows, with each scene clearly separated:

---SCENE 1---
[Scene 1 content]

---SCENE 2---
[Scene 2 content]

---SCENE 3---
[Scene 3 content]

---SCENE 4---
[Scene 4 content]

---SCENE 5---
[Scene 5 content]

Please write the complete 5-scene story now:`;
    
    console.log('Sending prompt to Gemini:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    
    console.log('Received response from Gemini');
    
    if (!response) {
      throw new Error('Empty response from Gemini API');
    }

    // Parse the response to extract individual scenes
    const sceneDelimiter = /---SCENE \d+---/;
    const sceneParts = response.split(sceneDelimiter).filter(part => part.trim().length > 0);
    
    // If the response doesn't follow the expected format, try alternative parsing
    let scenes = [];
    if (sceneParts.length >= 5) {
      // Standard format worked
      scenes = sceneParts.slice(0, 5); // Take first 5 scenes
    } else {
      // Fallback: try to split by paragraphs and group into 5 scenes
      const paragraphs = response.split('\n\n').filter(p => p.trim().length > 0);
      const scenesPerPart = Math.ceil(paragraphs.length / 5);
      for (let i = 0; i < 5; i++) {
        const start = i * scenesPerPart;
        const end = Math.min(start + scenesPerPart, paragraphs.length);
        scenes.push(paragraphs.slice(start, end).join('\n\n'));
      }
    }
    
    // Ensure we have exactly 5 scenes
    while (scenes.length < 5) {
      scenes.push('This scene continues the story...');
    }
    scenes = scenes.slice(0, 5);
    
    // Generate specific image prompts for each scene using Gemini
    const generateSceneImagePrompt = async (sceneText, sceneNumber) => {
      try {
        // Create a prompt to analyze the scene and generate visual description
        const visualPrompt = `Analyze this story scene and create a detailed visual description for an AI image generator:

**Scene ${sceneNumber} Text:**
${sceneText}

**Story Context:**
- Genre: ${settings.genre || 'General Fiction'}
- Tone: ${settings.tone || 'Balanced'}
- Overall Story: ${idea}

Please create a detailed visual description (50-100 words) that captures:
1. The main visual elements (characters, setting, objects)
2. The mood and atmosphere
3. Key actions or moments happening
4. Visual style that matches the ${settings.genre} genre

Format your response as a single paragraph describing the scene visually, suitable for AI image generation.`;
        
        const visualResult = await model.generateContent(visualPrompt);
        const visualDescription = await visualResult.response.text();
        
        // Clean and format the visual description
        const cleanVisualDesc = visualDescription.replace(/[\n\r]+/g, ' ').trim();
        
        return `${cleanVisualDesc}. Professional digital artwork, ${settings.genre || 'general'} genre aesthetic, ${settings.tone || 'balanced'} mood, cinematic composition, rich colors, atmospheric lighting, detailed illustration`;
        
      } catch (error) {
        console.warn(`Failed to generate AI visual description for scene ${sceneNumber}, using fallback:`, error.message);
        
        // Fallback to basic description if Gemini fails
        const scenePreview = sceneText.substring(0, 150);
        let sceneContext = '';
        
        switch (sceneNumber) {
          case 1:
            sceneContext = 'opening scene showing character introduction and initial setting';
            break;
          case 2:
            sceneContext = 'world building scene establishing the environment and conflict';
            break;
          case 3:
            sceneContext = 'rising action scene with developing tension and conflict';
            break;
          case 4:
            sceneContext = 'climactic scene at peak tension with main confrontation';
            break;
          case 5:
            sceneContext = 'resolution scene concluding the story peacefully';
            break;
        }
        
        return `Scene ${sceneNumber} from ${settings.genre || 'fiction'} story: ${scenePreview}. ${sceneContext}. Style: ${settings.tone || 'balanced'} mood, detailed digital artwork, professional book illustration, cinematic composition, rich colors`;
      }
    };
    
    // Create scene objects with individual image prompts (async)
    console.log('Generating AI-powered image prompts for all scenes...');
    const storyScenes = await Promise.all(
      scenes.map(async (sceneText, index) => {
        const imagePrompt = await generateSceneImagePrompt(sceneText, index + 1);
        return {
          id: (index + 1).toString(),
          title: `Scene ${index + 1}`,
          text: sceneText.trim(),
          imagePrompt: imagePrompt
        };
      })
    );
    
    console.log('All AI-powered image prompts generated successfully!');
    
    // Create a story object that matches the frontend's expected structure
    const story = {
      id: Date.now().toString(),
      idea,
      settings,
      scenes: storyScenes,
      createdAt: new Date()
    };
    
    console.log('Sending response to frontend');
    res.json(story);
  } catch (error) {
    console.error('Error in generateStory:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to generate story',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const generateImage = async (req, res) => {
  try {
    console.log('Received image generation request:', req.body);
    const { imagePrompt, sceneId } = req.body;
    
    if (!imagePrompt) {
      return res.status(400).json({ error: 'Missing required field: imagePrompt' });
    }

    // Clean and enhance the prompt for image generation
    const cleanPrompt = imagePrompt.replace(/^Illustration for .* story: /, '').trim();
    const enhancedPrompt = `${cleanPrompt}. Digital art, high quality, detailed illustration, professional artwork, vibrant colors, cinematic lighting`;
    
    console.log('Generating image with Imagen-4:', enhancedPrompt);
    
    try {
      // Use Imagen-4 for image generation
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
      });
      
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          aspectRatio: '16:9',
          safetyFilterLevel: 'block_low_and_above',
          personGeneration: 'allow_adult'
        }
      });
      
      if (response.generatedImages && response.generatedImages.length > 0) {
        const generatedImage = response.generatedImages[0];
        const imageBytes = generatedImage.image.imageBytes;
        
        // Convert to base64 data URL for direct browser use
        const imageUrl = `data:image/png;base64,${imageBytes}`;
        
        console.log('Image generated successfully with Imagen-4');
        console.log('Image size (base64 length):', imageBytes.length);
        
        res.json({
          imageUrl,
          sceneId: sceneId || null,
          generated: true,
          service: 'Imagen-4',
          prompt: enhancedPrompt
        });
      } else {
        throw new Error('No images generated from Imagen-4');
      }
      
    } catch (imagenError) {
      console.warn('Imagen-4 generation failed:', imagenError.message);
      
      // Check if it's a billing issue and provide helpful message
      if (imagenError.message.includes('billed users')) {
        console.log('ℹ️  Note: Imagen-4 requires billing to be enabled on your Google Cloud account.');
        console.log('ℹ️  Falling back to alternative image generation methods.');
      }
      
      // Fallback to external services if Imagen-4 fails
      const fallbackServices = [
        {
          name: 'Pollinations',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt + ', digital art, high quality, detailed')}?width=1024&height=576&nologo=true`
        },
        {
          name: 'Pollinations Alt',
          url: `https://image.pollinations.ai/prompt/${encodeURIComponent('Professional illustration: ' + cleanPrompt)}?width=800&height=450&model=flux&nologo=true`
        },
        {
          name: 'Placeholder',
          url: `https://via.placeholder.com/1024x576/8b5cf6/ffffff?text=${encodeURIComponent('Story Image: ' + cleanPrompt.slice(0, 30))}`
        }
      ];
      
      for (const service of fallbackServices) {
        try {
          const testResponse = await fetch(service.url, { method: 'HEAD', timeout: 5000 });
          if (testResponse.ok) {
            console.log(`Using fallback: ${service.name}`);
            return res.json({
              imageUrl: service.url,
              sceneId: sceneId || null,
              generated: service.name !== 'Placeholder',
              service: service.name,
              fallback: true
            });
          }
        } catch (fallbackError) {
          console.warn(`Fallback ${service.name} failed:`, fallbackError.message);
        }
      }
      
      throw new Error('All image generation methods failed');
    }
  } catch (error) {
    console.error('Error in generateImage:', error);
    res.status(500).json({ 
      error: 'Failed to generate image',
      details: error.message 
    });
  }
};
