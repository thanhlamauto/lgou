// Test upload functionality
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        console.log('🧪 Testing upload endpoint...');
        
        // Create a simple test image (1x1 pixel PNG)
        const testImageBuffer = Buffer.from([
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
            0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
            0x01, 0x00, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB4, 0x00, 0x00, 0x00, 0x00,
            0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]);
        
        const formData = new FormData();
        const blob = new Blob([testImageBuffer], { type: 'image/png' });
        formData.append('file', blob, 'test.png');
        
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: formData
        });
        
        console.log('📡 Response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Upload failed:', errorText);
            return;
        }
        
        const result = await response.json();
        console.log('✅ Upload successful:', result);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Check environment variables
console.log('🔍 Checking environment variables...');
console.log('BLOB_READ_WRITE_TOKEN:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Missing');

if (require.main === module) {
    testUpload();
}

module.exports = { testUpload };
