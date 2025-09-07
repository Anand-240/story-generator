import axios from 'axios';

// Test complete 5-scene story and image generation flow
async function testFiveSceneStoryWithImages() {
    try {
        console.log('🎭 Testing complete 5-scene story with image generation...');
        
        const testData = {
            idea: 'A young astronaut discovers an ancient alien artifact on Mars',
            settings: {
                genre: 'Science Fiction',
                tone: 'Adventurous',
                audience: 'Young Adult'
            }
        };

        console.log('📝 Step 1: Generating 5-scene story...');
        console.log('Story idea:', testData.idea);
        
        const storyResponse = await axios.post('http://localhost:3000/api/stories/generate-text', testData, {
            timeout: 120000, // 2 minute timeout for story generation
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!storyResponse.data || !storyResponse.data.scenes) {
            throw new Error('Invalid story response structure');
        }

        const story = storyResponse.data;
        console.log('✅ Story generated successfully!');
        console.log(`📚 Story ID: ${story.id}`);
        console.log(`🎬 Number of scenes: ${story.scenes.length}`);

        // Validate 5-scene structure
        if (story.scenes.length !== 5) {
            console.log(`❌ ERROR: Expected 5 scenes, got ${story.scenes.length}`);
            return;
        }

        console.log('✅ Correct 5-scene structure validated');

        // Display each scene summary
        story.scenes.forEach((scene, index) => {
            console.log(`\n--- ${scene.title} ---`);
            console.log(`📝 Length: ${scene.text.length} characters`);
            console.log(`🖼️  Image prompt: "${scene.imagePrompt.substring(0, 60)}..."`);
            console.log(`📄 Preview: "${scene.text.substring(0, 120)}..."`);
        });

        console.log('\n🎨 Step 2: Generating images for all 5 scenes...');
        const imageResults = [];

        for (let i = 0; i < story.scenes.length; i++) {
            const scene = story.scenes[i];
            console.log(`\n🖼️  Generating image for ${scene.title}...`);
            
            try {
                const imageResponse = await axios.post('http://localhost:3000/api/stories/generate-image', {
                    imagePrompt: scene.imagePrompt,
                    sceneId: scene.id
                }, {
                    timeout: 60000 // 1 minute timeout for each image
                });

                if (imageResponse.data && imageResponse.data.imageUrl) {
                    console.log(`✅ Image generated for ${scene.title}`);
                    console.log(`🔗 Service used: ${imageResponse.data.service || 'Unknown'}`);
                    console.log(`📏 URL length: ${imageResponse.data.imageUrl.length} characters`);
                    
                    imageResults.push({
                        sceneId: scene.id,
                        sceneTitle: scene.title,
                        success: true,
                        service: imageResponse.data.service,
                        url: imageResponse.data.imageUrl
                    });
                } else {
                    throw new Error('Invalid image response structure');
                }
            } catch (imageError) {
                console.log(`❌ Failed to generate image for ${scene.title}:`, imageError.message);
                imageResults.push({
                    sceneId: scene.id,
                    sceneTitle: scene.title,
                    success: false,
                    error: imageError.message
                });
            }

            // Add delay between image requests to avoid rate limiting
            if (i < story.scenes.length - 1) {
                console.log('⏳ Waiting 2 seconds before next image...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log('\n📊 FINAL RESULTS:');
        console.log('===================');
        console.log(`✅ Story generation: SUCCESS`);
        console.log(`📚 Scenes generated: ${story.scenes.length}/5`);
        
        const successfulImages = imageResults.filter(result => result.success).length;
        const failedImages = imageResults.filter(result => !result.success).length;
        
        console.log(`🎨 Images generated successfully: ${successfulImages}/5`);
        console.log(`❌ Images failed: ${failedImages}/5`);
        
        if (successfulImages === 5) {
            console.log('🎉 COMPLETE SUCCESS: All 5 scenes generated with images!');
        } else if (successfulImages > 0) {
            console.log('⚠️  PARTIAL SUCCESS: Some images generated');
        } else {
            console.log('❌ IMAGE GENERATION FAILED: No images were generated');
        }

        console.log('\n📋 Image Generation Summary:');
        imageResults.forEach((result, index) => {
            const status = result.success ? '✅' : '❌';
            const service = result.success ? ` (${result.service})` : ` (${result.error})`;
            console.log(`  ${status} Scene ${index + 1}: ${result.sceneTitle}${service}`);
        });

        // Calculate total processing time
        const totalWords = story.scenes.reduce((sum, scene) => sum + scene.text.split(' ').length, 0);
        console.log(`\n📈 Statistics:`);
        console.log(`📝 Total words: ~${totalWords}`);
        console.log(`📝 Average words per scene: ~${Math.round(totalWords / 5)}`);
        console.log(`🎨 Image success rate: ${Math.round((successfulImages / 5) * 100)}%`);

    } catch (error) {
        console.log('❌ TEST FAILED:', error.message);
        
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Response:', error.response.data);
        }
    }
}

// Test with different story scenarios
async function testMultiple5SceneStories() {
    const testScenarios = [
        {
            idea: 'A detective cat solves mysteries in a magical bookstore',
            settings: { genre: 'Fantasy', tone: 'Whimsical', audience: 'Children' }
        },
        {
            idea: 'A time-traveling chef saves restaurants throughout history',
            settings: { genre: 'Science Fiction', tone: 'Humorous', audience: 'General' }
        },
        {
            idea: 'A ghost and a human become unlikely roommates',
            settings: { genre: 'Supernatural', tone: 'Heartwarming', audience: 'Adult' }
        }
    ];

    console.log(`🎭 Testing multiple 5-scene stories (${testScenarios.length} scenarios)...\n`);

    for (let i = 0; i < testScenarios.length; i++) {
        console.log(`\n=== Test ${i + 1}: ${testScenarios[i].settings.genre} Story ===`);
        console.log(`💡 Idea: "${testScenarios[i].idea}"`);
        
        try {
            const response = await axios.post('http://localhost:3000/api/stories/generate-text', testScenarios[i], {
                timeout: 120000
            });
            
            if (response.data && response.data.scenes && response.data.scenes.length === 5) {
                console.log(`✅ SUCCESS: ${testScenarios[i].settings.genre} story with 5 scenes`);
                
                const totalLength = response.data.scenes.reduce((sum, scene) => sum + scene.text.length, 0);
                console.log(`📏 Total length: ${totalLength} characters`);
                console.log(`📏 Average scene length: ${Math.round(totalLength / 5)} characters`);
                
                // Test generating images for first and last scene
                console.log('🎨 Testing image generation for Scene 1 and Scene 5...');
                
                const scenesToTest = [response.data.scenes[0], response.data.scenes[4]];
                let imageSuccesses = 0;
                
                for (const scene of scenesToTest) {
                    try {
                        const imageResponse = await axios.post('http://localhost:3000/api/stories/generate-image', {
                            imagePrompt: scene.imagePrompt,
                            sceneId: scene.id
                        }, { timeout: 30000 });
                        
                        if (imageResponse.data && imageResponse.data.imageUrl) {
                            imageSuccesses++;
                            console.log(`  ✅ ${scene.title} image generated`);
                        }
                    } catch (imageError) {
                        console.log(`  ❌ ${scene.title} image failed: ${imageError.message}`);
                    }
                }
                
                console.log(`🎨 Image test result: ${imageSuccesses}/2 successful`);
                
            } else {
                console.log(`❌ FAILED: Expected 5 scenes, got ${response.data.scenes?.length || 'none'}`);
            }
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
        }
        
        // Add delay between tests
        if (i < testScenarios.length - 1) {
            console.log('⏳ Waiting 3 seconds before next test...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    console.log('\n🏁 Multiple story tests completed!');
}

// Check which test to run
const testType = process.argv[2];

switch (testType) {
    case '--multiple':
        testMultiple5SceneStories();
        break;
    case '--full':
        testFiveSceneStoryWithImages();
        break;
    case '--all':
        console.log('Running all 5-scene tests...\n');
        await testFiveSceneStoryWithImages();
        console.log('\n--- Running Multiple 5-Scene Tests ---');
        await testMultiple5SceneStories();
        break;
    default:
        console.log('Available test options:');
        console.log('  --full     Test complete 5-scene story with all images');
        console.log('  --multiple Test multiple 5-scene stories with sample images');
        console.log('  --all      Run all tests');
        console.log('\nRunning full test by default...\n');
        testFiveSceneStoryWithImages();
}
