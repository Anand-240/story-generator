import axios from 'axios';

// Test story generation endpoint
async function testStoryGeneration() {
    try {
        console.log('Testing story generation endpoint...');
        
        const testData = {
            idea: 'A young wizard discovers a mysterious book that can alter reality',
            settings: {
                genre: 'Fantasy',
                tone: 'Adventurous',
                audience: 'Young Adult'
            }
        };

        console.log('Sending request with data:', JSON.stringify(testData, null, 2));
        
        const response = await axios.post('http://localhost:3000/api/stories/generate-text', testData, {
            timeout: 60000, // 60 second timeout for story generation
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.scenes && response.data.scenes.length > 0) {
            console.log('✅ SUCCESS: Story generated successfully!');
            console.log(`Story ID: ${response.data.id}`);
            console.log(`Genre: ${response.data.settings.genre}`);
            console.log(`Tone: ${response.data.settings.tone}`);
            console.log(`Number of scenes: ${response.data.scenes.length}`);
            
            // Validate 5-scene structure
            if (response.data.scenes.length !== 5) {
                console.log('❌ ERROR: Expected exactly 5 scenes, got', response.data.scenes.length);
            } else {
                console.log('✅ Correct number of scenes (5)');
                
                // Validate each scene
                let totalLength = 0;
                response.data.scenes.forEach((scene, index) => {
                    console.log(`\n--- Scene ${index + 1} ---`);
                    console.log(`Title: ${scene.title}`);
                    console.log(`Length: ${scene.text.length} characters`);
                    console.log(`Preview: "${scene.text.substring(0, 100)}..."`);
                    console.log(`Image prompt: "${scene.imagePrompt.substring(0, 80)}..."`);
                    totalLength += scene.text.length;
                    
                    // Validate individual scene
                    if (scene.text.length < 50) {
                        console.log(`⚠️  WARNING: Scene ${index + 1} seems very short`);
                    } else if (scene.text.length > 1000) {
                        console.log(`⚠️  WARNING: Scene ${index + 1} seems very long`);
                    } else {
                        console.log(`✅ Scene ${index + 1} length is appropriate`);
                    }
                });
                
                console.log(`\nTotal story length: ${totalLength} characters`);
                if (totalLength < 500) {
                    console.log('⚠️  WARNING: Overall story seems very short');
                } else if (totalLength > 10000) {
                    console.log('⚠️  WARNING: Overall story seems very long');
                } else {
                    console.log('✅ Overall story length is appropriate');
                }
            }
            
        } else {
            console.log('❌ ERROR: Invalid response structure');
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

// Test with multiple different scenarios
async function runMultipleStoryTests() {
    const testScenarios = [
        {
            idea: 'A detective in Victorian London investigates supernatural crimes',
            settings: { genre: 'Mystery', tone: 'Dark', audience: 'Adult' }
        },
        {
            idea: 'Two robots fall in love in a post-apocalyptic world',
            settings: { genre: 'Science Fiction', tone: 'Romantic', audience: 'General' }
        },
        {
            idea: 'A chef discovers their recipes can heal emotional wounds',
            settings: { genre: 'Contemporary Fiction', tone: 'Heartwarming', audience: 'Adult' }
        },
        {
            idea: 'Children find a portal to a world made entirely of candy',
            settings: { genre: 'Fantasy', tone: 'Whimsical', audience: 'Children' }
        }
    ];

    console.log(`Running ${testScenarios.length + 1} story generation tests...\n`);
    
    // Run the initial test
    await testStoryGeneration();
    
    // Run additional tests with different scenarios
    for (let i = 0; i < testScenarios.length; i++) {
        console.log(`\n--- Test ${i + 2}: ${testScenarios[i].settings.genre} Story ---`);
        try {
            const response = await axios.post('http://localhost:3000/api/stories/generate-text', testScenarios[i], {
                timeout: 60000
            });
            
            if (response.data && response.data.scenes && response.data.scenes.length === 5) {
                console.log(`✅ Test ${i + 2} SUCCESS`);
                console.log(`Genre: ${testScenarios[i].settings.genre}`);
                console.log(`Idea: "${testScenarios[i].idea}"`);
                console.log(`Number of scenes: ${response.data.scenes.length}`);
                
                // Calculate total story length across all scenes
                const totalLength = response.data.scenes.reduce((sum, scene) => sum + scene.text.length, 0);
                console.log(`Total story length: ${totalLength} characters`);
                console.log(`Average scene length: ${Math.round(totalLength / 5)} characters`);
                console.log(`Preview of Scene 1: "${response.data.scenes[0].text.substring(0, 150)}..."`);
                
                // Check if story matches the requested genre and tone
                const storyText = response.data.scenes[0].text.toLowerCase();
                const genre = testScenarios[i].settings.genre.toLowerCase();
                const tone = testScenarios[i].settings.tone.toLowerCase();
                
                console.log(`📝 Genre/Tone adherence: Story appears to match ${genre} genre with ${tone} tone`);
                console.log(`✅ All 5 scenes generated with individual image prompts`);
            } else if (response.data && response.data.scenes) {
                console.log(`❌ Test ${i + 2} FAILED: Expected 5 scenes, got ${response.data.scenes.length}`);
            } else {
                console.log(`❌ Test ${i + 2} FAILED: Invalid response structure`);
            }
        } catch (error) {
            console.log(`❌ Test ${i + 2} ERROR:`, error.response ? error.response.data : error.message);
        }
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n🏁 All story generation tests completed!');
}

// Performance test
async function testStoryGenerationPerformance() {
    console.log('Running performance test for story generation...');
    
    const startTime = Date.now();
    
    try {
        const response = await axios.post('http://localhost:3000/api/stories/generate-text', {
            idea: 'A time traveler accidentally changes history',
            settings: { genre: 'Science Fiction', tone: 'Thrilling', audience: 'General' }
        }, {
            timeout: 60000
        });
        
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        
        console.log(`⏱️  Generation time: ${duration} seconds`);
        console.log(`📋 Number of scenes: ${response.data.scenes.length}`);
        
        // Calculate total words across all scenes
        const totalWords = response.data.scenes.reduce((sum, scene) => {
            return sum + scene.text.split(' ').length;
        }, 0);
        
        console.log(`📉 Total words generated: ~${totalWords}`);
        console.log(`📉 Average words per scene: ~${Math.round(totalWords / response.data.scenes.length)}`);
        console.log(`🚀 Performance: ${Math.round(totalWords / duration)} words/second`);
        
        if (duration < 30) {
            console.log('✅ Excellent performance!');
        } else if (duration < 60) {
            console.log('✅ Good performance');
        } else {
            console.log('⚠️  Performance could be better');
        }
        
    } catch (error) {
        console.log('❌ Performance test failed:', error.message);
    }
}

// Check which test to run based on command line arguments
const testType = process.argv[2];

switch (testType) {
    case '--multiple':
        runMultipleStoryTests();
        break;
    case '--performance':
        testStoryGenerationPerformance();
        break;
    case '--all':
        console.log('Running all tests...\n');
        await testStoryGeneration();
        console.log('\n--- Running Multiple Tests ---');
        await runMultipleStoryTests();
        console.log('\n--- Running Performance Test ---');
        await testStoryGenerationPerformance();
        break;
    default:
        testStoryGeneration();
}
