const { getFreeProxies } = require('free-proxies');
const axios = require('axios');

async function testAllProxies() {
    console.log('🚀 Starting Proxy Tester...');
    
    try {
        // Get proxies from library
        const proxies = await getFreeProxies();
        console.log(`📊 Found ${proxies.length} proxies`);
        
        // Test first 20 proxies
        const testProxies = proxies.slice(0, 20);
        const workingProxies = [];
        
        for (const proxy of testProxies) {
            try {
                const response = await axios.get('https://httpbin.org/ip', {
                    proxy: {
                        host: proxy.ip,
                        port: proxy.port
                    },
                    timeout: 5000
                });
                
                if (response.status === 200) {
                    workingProxies.push(proxy);
                    console.log(`✅ WORKING: ${proxy.ip}:${proxy.port}`);
                }
            } catch (error) {
                console.log(`❌ FAILED: ${proxy.ip}:${proxy.port}`);
            }
        }
        
        console.log(`\n🎯 RESULTS: ${workingProxies.length}/${testProxies.length} proxies working`);
        console.log('📝 Working proxies:');
        workingProxies.forEach(proxy => {
            console.log(`   ${proxy.ip}:${proxy.port}`);
        });
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testAllProxies();
