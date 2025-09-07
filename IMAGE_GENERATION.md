# Image Generation Feature

## Overview
The Story Generator now includes AI-powered image generation that creates visual illustrations for your stories using the Pollinations API.

## How It Works

### Backend API
- **Endpoint**: `POST /api/stories/generate-image`
- **Request Body**: 
  ```json
  {
    "imagePrompt": "Description of the image to generate",
    "sceneId": "optional-scene-id"
  }
  ```
- **Response**:
  ```json
  {
    "imageUrl": "https://...",
    "sceneId": "scene-id",
    "generated": true
  }
  ```

### Frontend Integration
- Each story scene displays an image generation section
- Click "Generate Image" to create an AI illustration
- Loading states and error handling are included
- Images are displayed immediately once generated

## Image Enhancement
- Story prompts are automatically enhanced with artistic descriptors
- Format: `[original idea], [genre] style, [tone] mood, detailed illustration, high quality art`
- Additional artistic terms are added: "digital art, fantasy illustration, vibrant colors, detailed, high quality"

## API Service
The Pollinations API provides:
- Free AI image generation
- High-quality results (800x600 resolution)
- Various art styles and models
- No authentication required

## Features
- ✅ Real-time image generation
- ✅ Loading states and error handling
- ✅ Fallback to placeholder images
- ✅ Regenerate images option
- ✅ Enhanced prompts for better results
- ✅ Responsive image display

## Usage
1. Generate a story using the Story Generator
2. Scroll to the scene you want to visualize
3. Click "Generate Image" 
4. Wait for the AI to create your illustration
5. Use "Regenerate Image" to create variations

## Technical Details
- **Image Service**: Pollinations AI (https://image.pollinations.ai/)
- **Model**: Flux
- **Resolution**: 800x600 pixels
- **Format**: Web-optimized images
- **Fallback**: Styled placeholder images if generation fails
