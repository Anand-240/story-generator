// Simple connectivity test
async function testConnection() {
    console.log('🧪 Testing connectivity...');
    
    try {
        // Test backend health
        console.log('1. Testing backend health...');
        const healthResponse = await fetch('http://localhost:3000/api/stories/');
        const healthData = await healthResponse.json();
        console.log('✅ Backend health:', healthData.message);
        
        // Test CORS from localhost:5173
        console.log('2. Testing CORS headers...');
        const corsResponse = await fetch('http://localhost:3000/api/stories/', {
            method: 'GET',
            headers: {
                'Origin': 'http://localhost:5173'
            }
        });
        
        if (corsResponse.ok) {
            console.log('✅ CORS working correctly');
        } else {
            console.log('❌ CORS issue:', corsResponse.status);
        }
        
        console.log('🎉 All tests passed! Frontend should be able to connect to backend.');
        
    } catch (error) {
        console.log('❌ Connection test failed:', error.message);
    }
}

testConnection();
