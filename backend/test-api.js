const axios = require('axios');

async function testAPI() {
    const baseURL = 'http://localhost:3001';
    
    console.log('🧪 Testing API endpoints...\n');
    
    try {
        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const health = await axios.get(`${baseURL}/health`);
        console.log('✅ Health:', health.data.status);
        
        // Test 2: Price endpoint
        console.log('\n2. Testing price endpoint...');
        const price = await axios.get(`${baseURL}/api/price`, {
            params: {
                token: '0xA0b86991c31C4F66045C0C0aAbC277318495E1d',
                network: 'ethereum',
                timestamp: 1678901234
            }
        });
        console.log('✅ Price:', price.data);
        
        // Test 3: Schedule endpoint
        console.log('\n3. Testing schedule endpoint...');
        const schedule = await axios.post(`${baseURL}/api/schedule`, {
            token: '0xA0b86991c31C4F66045C0C0aAbC277318495E1d',
            network: 'ethereum'
        });
        console.log('✅ Schedule:', schedule.data);
        
        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testAPI();
