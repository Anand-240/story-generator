import axios from 'axios';

// Test the image generation endpoint
async function testImageGeneration() {
    try {
        console.log('Testing image generation endpoint...');
        
        const response = await axios.post('http://localhost:3000/api/stories/generate-image', {
            imagePrompt: 'A brave knight on horseback saving a village from a dragon, medieval fantasy style',
            sceneId: 'test-scene-001'
        }, {
            timeout: 30000, // 30 second timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.imageUrl) {
            if (response.data.imageUrl.startsWith('data:image/')) {
                console.log('✅ SUCCESS: Received base64 image data');
                console.log(`Image URL prefix: ${response.data.imageUrl.substring(0, 50)}...`);
                console.log(`Image data length: ${response.data.imageUrl.length} characters`);
            } else {
                console.log('✅ SUCCESS: Received fallback image URL');
                console.log(`Image URL: ${response.data.imageUrl}`);
            }
        } else {
            console.log('❌ ERROR: No image URL in response');
            console.log('Response:', JSON.stringify(response.data, null, 2));
        }
    } catch (error) {
        console.log('❌ ERROR:', error.response ? error.response.data : error.message);
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);
        }
    }
}

// Test with different prompts
async function runMultipleTests() {
    const testPrompts = [
        'A magical forest with glowing flowers and friendly woodland creatures',
        'A futuristic city with flying cars and neon lights',
        'A peaceful beach at sunset with palm trees swaying in the wind',
        'A cozy library filled with ancient books and magical artifacts'
    ];

    console.log(`Running ${testPrompts.length + 1} tests...\n`);
    
    // Run the initial test
    await testImageGeneration();
    
    // Run additional tests with different prompts
    for (let i = 0; i < testPrompts.length; i++) {
        console.log(`\n--- Test ${i + 2} ---`);
        try {
            const response = await axios.post('http://localhost:3000/api/stories/generate-image', {
                imagePrompt: testPrompts[i],
                sceneId: `test-scene-${i + 2}`
            }, {
                timeout: 30000
            });
            
            if (response.data && response.data.imageUrl) {
                console.log(`✅ Test ${i + 2} SUCCESS`);
                console.log(`Prompt: "${testPrompts[i]}"`);
                console.log(`Result type: ${response.data.imageUrl.startsWith('data:image/') ? 'Base64 image' : 'Fallback URL'}`);
            } else {
                console.log(`❌ Test ${i + 2} FAILED: No image URL`);
            }
        } catch (error) {
            console.log(`❌ Test ${i + 2} ERROR:`, error.response ? error.response.data : error.message);
        }
        
        // Add a small delay between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🏁 All tests completed!');
}

// Check if we should run multiple tests
const runMultiple = process.argv.includes('--multiple');

if (runMultiple) {
    runMultipleTests();
} else {
    testImageGeneration();
}
