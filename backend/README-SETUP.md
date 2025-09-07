# Complete Setup Guide - Story Generator with Google AI

## Current Implementation Status

### ✅ **Working Features:**
- **Story Generation**: Gemini 2.5 Flash (Excellent quality, ~60 words/sec)
- **Image Generation**: Fallback system using Pollinations API (Good quality, free)
- **Complete Workflow**: Story + Image generation pipeline

### 🔄 **Available with Billing Setup:**
- **Premium Image Generation**: Imagen-4 (Highest quality, requires Google Cloud billing)

## Prerequisites

1. **Google AI API Key** (Gemini API)
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Generate an API key
   - Add to your `.env` file as `GEMINI_API_KEY=your_key_here`

2. **Node.js Dependencies**
   ```bash
   npm install @google/generative-ai @google/genai axios express dotenv
   ```

## Current Configuration (Working Out of the Box)

### Story Generation
- **Model**: Gemini 2.5 Flash
- **Performance**: 20-30 seconds, ~1500 words
- **Quality**: Professional-level stories with proper structure
- **Cost**: Free tier available

### Image Generation
- **Primary**: Imagen-4 (requires billing)
- **Fallback**: Pollinations API (free)
- **Format**: Base64 data URLs for direct use
- **Quality**: High-quality illustrations

## Enabling Imagen-4 (Premium Images)

If you want to use Google's Imagen-4 for the highest quality image generation:

### Step 1: Enable Google Cloud Billing

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing for your project:
   - Go to Billing → Link a billing account
   - Add payment method (credit card required)

### Step 2: Enable Required APIs

In Google Cloud Console:
1. Go to APIs & Services → Library
2. Search and enable:
   - **Vertex AI API**
   - **Cloud Resource Manager API**

### Step 3: Update Authentication

Replace the simple API key with proper service account credentials:

```javascript
// For Imagen-4, you'll need service account authentication
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFile: 'path/to/service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});
```

### Step 4: Test Imagen-4

Once billing is enabled, Imagen-4 will work automatically. You'll see:
```
✅ Image generated successfully with Imagen-4
```

Instead of:
```
ℹ️ Note: Imagen-4 requires billing to be enabled
ℹ️ Falling back to alternative image generation methods
```

## Testing Your Setup

### Quick Test (Current Setup)
```bash
# Test story generation (should work immediately)
node test-story-generation.js

# Test image generation (will use fallback)
node test-image-generation.js

# Test complete workflow
node test-end-to-end.js
```

### Verify Imagen-4 (After Billing Setup)
```bash
# This should show "Imagen-4" instead of "Pollinations"
node test-image-generation.js
```

## API Endpoints

### 1. Generate Story
```http
POST /api/stories/generate-text
Content-Type: application/json

{
  "idea": "A wizard discovers a magic book",
  "settings": {
    "genre": "Fantasy",
    "tone": "Adventurous", 
    "audience": "Young Adult"
  }
}
```

**Response:**
```json
{
  "id": "1757231428018",
  "idea": "A wizard discovers a magic book",
  "settings": { "genre": "Fantasy", "tone": "Adventurous", "audience": "Young Adult" },
  "scenes": [{
    "id": "1",
    "title": "Chapter 1", 
    "text": "Complete story text...",
    "imagePrompt": "Enhanced prompt for image generation..."
  }],
  "createdAt": "2024-01-07T07:59:06.048Z"
}
```

### 2. Generate Image
```http
POST /api/stories/generate-image
Content-Type: application/json

{
  "imagePrompt": "A wizard in a magical library with glowing books",
  "sceneId": "1"
}
```

**Response:**
```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgo...",
  "sceneId": "1",
  "generated": true,
  "service": "Imagen-4",
  "prompt": "Enhanced prompt used for generation"
}
```

## Performance Benchmarks

| Feature | Current Setup | With Imagen-4 |
|---------|---------------|---------------|
| **Story Generation** | 20-30s, ~60 words/sec | Same |
| **Image Generation** | 3-5s (Pollinations) | 8-15s (Imagen-4) |
| **Image Quality** | Good | Exceptional |
| **Total Workflow** | 25-35s | 30-45s |
| **Cost** | Free | Pay per use |

## Troubleshooting

### Common Issues

1. **"Imagen API is only accessible to billed users"**
   - Solution: Enable billing in Google Cloud Console
   - Workaround: Use current fallback system (works great!)

2. **Story generation fails**
   - Check your `GEMINI_API_KEY` in `.env`
   - Verify API key has proper permissions

3. **All image generation fails**
   - Check internet connection
   - Verify Pollinations.ai is accessible

### Environment Variables

Create `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
PORT=3000
```

## Cost Considerations

### Current Setup (Free)
- Gemini 2.5 Flash: Free tier available
- Pollinations: Completely free
- **Total cost: $0/month** for reasonable usage

### With Imagen-4 (Premium)
- Gemini 2.5 Flash: Same as above
- Imagen-4: ~$0.040 per image
- **Example**: 100 images/month = ~$4

## Next Steps

1. **Immediate**: Use current setup - it's fully functional!
2. **Optional**: Enable Imagen-4 for premium image quality
3. **Future**: Consider other Google AI models as they become available

Your story generator is ready to use with high-quality story generation and good image fallbacks! 🚀
