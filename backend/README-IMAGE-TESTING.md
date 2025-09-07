# Gemini 2.5 Flash Integration Testing

This document explains how to test both the story generation and image generation functionality powered by Google's Gemini 2.5 Flash model in your story generator backend.

## Prerequisites

1. Make sure your backend server is running (`node server.js`)
2. Ensure you have a valid Gemini API key set in your environment variables
3. The `@google/genai` package should be installed

## Story Generation Testing

### Quick Story Test

Run a single test to verify the story generation endpoint:

```bash
node test-story-generation.js
```

This will test the `/api/stories/generate-text` endpoint and return:
- ✅ SUCCESS: If it generates a complete story with proper structure
- ❌ ERROR: If the request fails

### Multiple Story Tests

Test different genres and tones:

```bash
node test-story-generation.js --multiple
```

This runs tests with Fantasy, Mystery, Science Fiction, and Contemporary Fiction genres.

### Performance Test

Test story generation speed:

```bash
node test-story-generation.js --performance
```

### Manual Story Test

```bash
curl -X POST http://localhost:3000/api/stories/generate-text \
  -H "Content-Type: application/json" \
  -d '{
    "idea": "A detective solving mysteries in space",
    "settings": {
      "genre": "Science Fiction",
      "tone": "Thrilling",
      "audience": "Adult"
    }
  }'
```

## Image Generation Testing

### Quick Single Test

Run a single test to verify the image generation endpoint is working:

```bash
node test-image-generation.js
```

This will test the `/api/stories/generate-image` endpoint with a sample prompt and return:
- ✅ SUCCESS: If it receives a base64 image from Gemini
- ✅ SUCCESS: If it receives a fallback image URL
- ❌ ERROR: If the request fails

### Multiple Tests

Run multiple tests with different prompts to verify consistent behavior:

```bash
node test-image-generation.js --multiple
```

This will run 5 different test scenarios with various image prompts.

### Manual cURL Test

You can also test manually using cURL:

```bash
curl -X POST http://localhost:3000/api/stories/generate-image \
  -H "Content-Type: application/json" \
  -d '{"imagePrompt": "A brave knight saves a village", "sceneId": "test"}'
```

## Expected Response

The API should return a JSON response with an `imageUrl` field:

```json
{
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## Troubleshooting

### Common Issues

1. **"require is not defined"**: The project uses ES modules, make sure to use `import` statements
2. **API Key Issues**: Verify your Gemini API key is correctly set in environment variables
3. **Server Not Running**: Make sure the backend server is running on port 3000
4. **Timeout Errors**: Image generation can take 10-20 seconds, the tests have 30s timeouts

### Fallback Behavior

If Gemini image generation fails, the system will:
1. Try Pollinations API as backup
2. If that fails, return a placeholder image URL
3. Log errors for debugging

### Frontend Integration

The generated base64 image URLs can be used directly in HTML img tags:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Generated story image" />
```

## Performance Notes

### Story Generation
- Story generation typically takes 20-30 seconds for 1000+ word stories
- Gemini 2.5 Flash produces ~60 words per second
- Stories are typically 800-1500 words with rich detail and proper structure
- Enhanced prompts ensure genre adherence and tone consistency

### Image Generation
- Image generation typically takes 10-20 seconds
- The Gemini 2.5 Flash model is optimized for speed while maintaining quality
- Base64 images are immediately usable without additional hosting requirements
- Automatic fallback to Pollinations API if Gemini fails

## Expected Story Response Structure

```json
{
  "id": "1757231428018",
  "idea": "A young wizard discovers a mysterious book that can alter reality",
  "settings": {
    "genre": "Fantasy",
    "tone": "Adventurous",
    "audience": "Young Adult"
  },
  "scenes": [{
    "id": "1",
    "title": "Chapter 1",
    "text": "The complete generated story...",
    "imagePrompt": "Detailed image prompt for illustration..."
  }],
  "createdAt": "2024-01-07T07:46:47.048Z"
}
```
