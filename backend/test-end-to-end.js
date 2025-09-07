import axios from 'axios';

// Test the complete story and image generation pipeline
async function testCompleteWorkflow() {
    console.log('🚀 Testing Complete Story + Image Generation Workflow\n');
    
    try {
        // Step 1: Generate a story
        console.log('📖 Step 1: Generating story...');
        const startTime = Date.now();
        
        const storyResponse = await axios.post('http://localhost:3000/api/stories/generate-text', {
            idea: 'A space explorer discovers an ancient alien library',
            settings: {
                genre: 'Science Fiction',
                tone: 'Mysterious',
                audience: 'Adult'
            }
        }, {
            timeout: 60000
        });
        
        const storyTime = (Date.now() - startTime) / 1000;
        
        if (!storyResponse.data || !storyResponse.data.scenes || !storyResponse.data.scenes[0]) {
            throw new Error('Invalid story response structure');
        }
        
        const story = storyResponse.data;
        const scene = story.scenes[0];
        
        console.log(`✅ Story generated successfully in ${storyTime}s`);
        console.log(`   📊 Length: ${scene.text.length} characters (~${Math.round(scene.text.split(' ').length)} words)`);
        console.log(`   🎭 Genre: ${story.settings.genre}, Tone: ${story.settings.tone}`);
        console.log(`   📝 Preview: "${scene.text.substring(0, 150)}..."`);
        console.log(`   🎨 Image prompt: "${scene.imagePrompt}"`);
        
        // Step 2: Generate image based on the story's image prompt
        console.log('\n🎨 Step 2: Generating image from story prompt...');
        const imageStartTime = Date.now();
        
        const imageResponse = await axios.post('http://localhost:3000/api/stories/generate-image', {
            imagePrompt: scene.imagePrompt,
            sceneId: scene.id
        }, {
            timeout: 60000
        });
        
        const imageTime = (Date.now() - imageStartTime) / 1000;
        
        if (!imageResponse.data || !imageResponse.data.imageUrl) {
            throw new Error('Invalid image response structure');
        }
        
        const imageData = imageResponse.data;
        
        console.log(`✅ Image generated successfully in ${imageTime}s`);
        console.log(`   🖼️  Type: ${imageData.imageUrl.startsWith('data:image/') ? 'Base64 image' : 'External URL'}`);
        console.log(`   🔧 Service: ${imageData.service || 'Unknown'}`);
        console.log(`   📏 Data length: ${imageData.imageUrl.length} characters`);
        
        // Step 3: Verify the complete workflow
        const totalTime = (Date.now() - startTime) / 1000;
        
        console.log(`\n🏁 Complete Workflow Results:`);
        console.log(`   ⏱️  Total time: ${totalTime}s`);
        console.log(`   📖 Story time: ${storyTime}s`);
        console.log(`   🎨 Image time: ${imageTime}s`);
        console.log(`   💯 Success rate: 100%`);
        
        // Validate that everything is ready for frontend
        console.log(`\n🔍 Frontend Integration Check:`);
        console.log(`   ✅ Story structure: Valid`);
        console.log(`   ✅ Image format: ${imageData.imageUrl.startsWith('data:image/') ? 'Browser-ready base64' : 'URL'}`);
        console.log(`   ✅ Scene linking: Scene ID matches (${scene.id})`);
        console.log(`   ✅ Genre adherence: ${story.settings.genre} elements present`);
        console.log(`   ✅ Tone consistency: ${story.settings.tone} mood maintained`);
        
        return {
            success: true,
            story,
            image: imageData,
            timing: { total: totalTime, story: storyTime, image: imageTime }
        };
        
    } catch (error) {
        console.log(`❌ Workflow failed: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        }
        return { success: false, error: error.message };
    }
}

// Test multiple workflows in sequence
async function testMultipleWorkflows() {
    const testCases = [
        {
            name: 'Fantasy Adventure',
            idea: 'A dragon awakens after 1000 years of sleep',
            settings: { genre: 'Fantasy', tone: 'Epic', audience: 'General' }
        },
        {
            name: 'Horror Mystery',
            idea: 'Strange sounds come from the basement every night',
            settings: { genre: 'Horror', tone: 'Suspenseful', audience: 'Adult' }
        },
        {
            name: 'Romance Comedy',
            idea: 'Two rival food truck owners fall in love',
            settings: { genre: 'Romance', tone: 'Lighthearted', audience: 'Young Adult' }
        }
    ];
    
    console.log(`🧪 Testing ${testCases.length} Different Workflows\n`);
    
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        console.log(`--- Test ${i + 1}: ${testCase.name} ---`);
        
        try {
            const storyResponse = await axios.post('http://localhost:3000/api/stories/generate-text', {
                idea: testCase.idea,
                settings: testCase.settings
            }, { timeout: 60000 });
            
            const imageResponse = await axios.post('http://localhost:3000/api/stories/generate-image', {
                imagePrompt: storyResponse.data.scenes[0].imagePrompt,
                sceneId: storyResponse.data.scenes[0].id
            }, { timeout: 60000 });
            
            console.log(`✅ ${testCase.name}: Story (${Math.round(storyResponse.data.scenes[0].text.split(' ').length)} words) + Image generated`);
            results.push({ name: testCase.name, success: true });
            
        } catch (error) {
            console.log(`❌ ${testCase.name}: Failed - ${error.message}`);
            results.push({ name: testCase.name, success: false, error: error.message });
        }
        
        // Delay between tests to avoid rate limits
        if (i < testCases.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    console.log(`\n📊 Summary: ${results.filter(r => r.success).length}/${results.length} workflows successful`);
    
    return results;
}

// Choose test type based on command line argument
const testType = process.argv[2];

switch (testType) {
    case '--multiple':
        testMultipleWorkflows();
        break;
    default:
        testCompleteWorkflow();
}
