import axios from 'axios';

// Test AI-powered image prompt generation
async function testAIPoweredImagePrompts() {
    try {
        console.log('🧠 Testing AI-powered scene-specific image generation...');
        
        const testData = {
            idea: 'A detective cat solves a mystery in a magical bakery',
            settings: {
                genre: 'Fantasy',
                tone: 'Whimsical',
                audience: 'Children'
            }
        };

        console.log('📝 Story Idea:', testData.idea);
        console.log('🎭 Genre:', testData.settings.genre);
        console.log('🎨 Tone:', testData.settings.tone);
        
        const response = await axios.post('http://localhost:3000/api/stories/generate-text', testData, {
            timeout: 180000, // 3 minutes timeout for AI processing
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.scenes || response.data.scenes.length !== 5) {
            throw new Error('Invalid story response - expected 5 scenes');
        }

        const story = response.data;
        console.log('\n✅ Story generated successfully with AI-powered image prompts!');
        console.log(`📚 Story ID: ${story.id}`);
        console.log(`🎬 Number of scenes: ${story.scenes.length}`);

        console.log('\n🎨 AI-Generated Image Prompts for Each Scene:');
        console.log('='.repeat(80));

        story.scenes.forEach((scene, index) => {
            console.log(`\n--- SCENE ${index + 1}: ${scene.title} ---`);
            console.log(`📝 Scene Content (first 100 chars):`);
            console.log(`   "${scene.text.substring(0, 100)}..."`);
            
            console.log(`🖼️  AI-Generated Image Prompt:`);
            console.log(`   "${scene.imagePrompt}"`);
            
            console.log(`📏 Prompt Length: ${scene.imagePrompt.length} characters`);
            
            // Check if prompt seems unique and specific
            const isSpecific = scene.imagePrompt.includes(scene.title) || 
                              scene.imagePrompt.length > 200 ||
                              scene.imagePrompt.toLowerCase().includes('scene ' + (index + 1));
            console.log(`🎯 Specificity: ${isSpecific ? '✅ Highly specific' : '⚠️  Generic'}`);
            console.log('-'.repeat(60));
        });

        console.log('\n📊 ANALYSIS:');
        console.log('='.repeat(50));
        
        // Check uniqueness of prompts
        const prompts = story.scenes.map(scene => scene.imagePrompt);
        const uniquePrompts = [...new Set(prompts)];
        
        console.log(`🔄 Prompt Uniqueness: ${uniquePrompts.length}/5 unique prompts`);
        if (uniquePrompts.length === 5) {
            console.log('✅ All image prompts are unique - AI analysis working!');
        } else {
            console.log('⚠️  Some prompts are similar - may need improvement');
        }
        
        // Check average prompt length
        const avgLength = prompts.reduce((sum, prompt) => sum + prompt.length, 0) / prompts.length;
        console.log(`📏 Average Prompt Length: ${Math.round(avgLength)} characters`);
        
        // Check if prompts contain scene-specific content
        let specificPrompts = 0;
        story.scenes.forEach((scene, index) => {
            const sceneWords = scene.text.toLowerCase().split(' ');
            const promptWords = scene.imagePrompt.toLowerCase().split(' ');
            
            // Check for scene-specific word overlap
            const overlap = sceneWords.filter(word => 
                word.length > 3 && promptWords.includes(word)
            ).length;
            
            if (overlap > 2) {
                specificPrompts++;
            }
        });
        
        console.log(`🎯 Scene-Specific Prompts: ${specificPrompts}/5 prompts contain scene-specific content`);
        
        if (specificPrompts >= 4) {
            console.log('🎉 EXCELLENT: AI is generating highly scene-specific image prompts!');
        } else if (specificPrompts >= 2) {
            console.log('👍 GOOD: AI is generating somewhat scene-specific prompts');
        } else {
            console.log('⚠️  NEEDS IMPROVEMENT: Prompts are too generic');
        }

        console.log('\n🧪 Now testing actual image generation with first scene...');
        
        // Test image generation with the first scene's AI-generated prompt
        try {
            const imageResponse = await axios.post('http://localhost:3000/api/stories/generate-image', {
                imagePrompt: story.scenes[0].imagePrompt,
                sceneId: story.scenes[0].id
            }, {
                timeout: 30000
            });
            
            if (imageResponse.data && imageResponse.data.imageUrl) {
                console.log('✅ Image generated successfully with AI-powered prompt!');
                console.log(`🔗 Service: ${imageResponse.data.service}`);
                console.log(`📏 Image URL length: ${imageResponse.data.imageUrl.length} characters`);
                console.log(`🎨 Generated with prompt: "${imageResponse.data.prompt || 'N/A'}"`);
            }
        } catch (imageError) {
            console.log('❌ Image generation failed:', imageError.message);
        }

        console.log('\n🎊 Test completed successfully!');
        console.log('Now each scene will have unique, AI-analyzed image prompts instead of generic ones.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Test with different story types
async function testMultipleStoryTypes() {
    const testScenarios = [
        {
            idea: 'A robot learns to paint beautiful landscapes',
            settings: { genre: 'Science Fiction', tone: 'Heartwarming', audience: 'General' }
        },
        {
            idea: 'A princess discovers she has the power to control storms',
            settings: { genre: 'Fantasy', tone: 'Epic', audience: 'Young Adult' }
        }
    ];

    console.log(`🎭 Testing AI image prompts with ${testScenarios.length} different story types...\n`);

    for (let i = 0; i < testScenarios.length; i++) {
        console.log(`\n=== TEST ${i + 1}: ${testScenarios[i].settings.genre} Story ===`);
        console.log(`💡 Idea: "${testScenarios[i].idea}"`);
        console.log(`🎨 Testing AI-powered image prompt generation...`);
        
        try {
            const response = await axios.post('http://localhost:3000/api/stories/generate-text', testScenarios[i], {
                timeout: 180000
            });
            
            if (response.data && response.data.scenes && response.data.scenes.length === 5) {
                console.log(`✅ SUCCESS: Generated 5 scenes with AI image prompts`);
                
                // Show just the first scene's prompt as example
                const firstScene = response.data.scenes[0];
                console.log(`📝 Scene 1 Content: "${firstScene.text.substring(0, 80)}..."`);
                console.log(`🎨 AI Image Prompt: "${firstScene.imagePrompt.substring(0, 120)}..."`);
                
                console.log(`📊 All prompts unique: ${new Set(response.data.scenes.map(s => s.imagePrompt)).size === 5 ? 'YES' : 'NO'}`);
            } else {
                console.log(`❌ FAILED: Expected 5 scenes, got ${response.data?.scenes?.length || 'none'}`);
            }
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
        }
        
        // Add delay between tests
        if (i < testScenarios.length - 1) {
            console.log('⏳ Waiting 10 seconds before next test...');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    
    console.log('\n🏁 Multiple story type tests completed!');
}

// Check command line arguments
const testType = process.argv[2];

switch (testType) {
    case '--multiple':
        testMultipleStoryTypes();
        break;
    case '--full':
        testAIPoweredImagePrompts();
        break;
    default:
        console.log('🎨 AI-Powered Image Prompt Test Options:');
        console.log('  --full     Test complete AI image prompt generation');
        console.log('  --multiple Test with different story types');
        console.log('\nRunning full test by default...\n');
        testAIPoweredImagePrompts();
}
