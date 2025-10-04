// Check Hair API and Database
// Run this to verify hair categories are working correctly

console.log('🔍 Checking Hair API and Database...');

// Test API endpoints
async function checkHairAPI() {
    try {
        console.log('📡 Testing /api/products endpoint...');
        const response = await fetch('/api/products');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Products API working');
        console.log(`📊 Total products: ${data.length || data.products?.length || 0}`);
        
        // Check for hair categories
        const products = data.products || data || [];
        const maleHairs = products.filter(p => p.category === 'male_hair');
        const femaleHairs = products.filter(p => p.category === 'female_hair');
        const oldHairs = products.filter(p => p.category === 'hair');
        
        console.log('📊 Hair Categories:');
        console.log(`  Male Hair (male_hair): ${maleHairs.length}`);
        console.log(`  Female Hair (female_hair): ${femaleHairs.length}`);
        console.log(`  Old Hair (hair): ${oldHairs.length}`);
        
        if (maleHairs.length > 0) {
            console.log('👨 Male Hair Products:');
            maleHairs.forEach((hair, index) => {
                console.log(`  ${index + 1}. ${hair.name} (${hair.id}) - Stock: ${hair.stock || 0}`);
            });
        }
        
        if (femaleHairs.length > 0) {
            console.log('👩 Female Hair Products:');
            femaleHairs.forEach((hair, index) => {
                console.log(`  ${index + 1}. ${hair.name} (${hair.id}) - Stock: ${hair.stock || 0}`);
            });
        }
        
        if (oldHairs.length > 0) {
            console.log('⚠️ Old Hair Products (need migration):');
            oldHairs.forEach((hair, index) => {
                console.log(`  ${index + 1}. ${hair.name} (${hair.id}) - Category: ${hair.category}`);
            });
        }
        
        return {
            success: true,
            maleHairs: maleHairs.length,
            femaleHairs: femaleHairs.length,
            oldHairs: oldHairs.length,
            total: products.length
        };
        
    } catch (error) {
        console.error('❌ API Error:', error);
        return { success: false, error: error.message };
    }
}

// Test creating a new hair product
async function testCreateHairProduct() {
    try {
        console.log('🧪 Testing hair product creation...');
        
        const testProduct = {
            id: `test-hair-${Date.now()}`,
            name: 'Test Hair Product',
            category: 'male_hair',
            price: 25000,
            stock: 10,
            image: 'https://via.placeholder.com/200x200/4a90e2/ffffff?text=Test+Hair',
            collection_ids: ['regular']
        };
        
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testProduct)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Hair product creation successful:', result);
            return { success: true, product: result };
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Creation failed');
        }
        
    } catch (error) {
        console.error('❌ Creation Error:', error);
        return { success: false, error: error.message };
    }
}

// Test updating existing hair product
async function testUpdateHairProduct(productId) {
    try {
        console.log(`🔄 Testing hair product update: ${productId}`);
        
        const updateData = {
            category: 'female_hair',
            name: 'Updated Hair Product',
            stock: 15
        };
        
        const response = await fetch(`/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Hair product update successful:', result);
            return { success: true, product: result };
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Update failed');
        }
        
    } catch (error) {
        console.error('❌ Update Error:', error);
        return { success: false, error: error.message };
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting Hair API Tests...');
    
    // Test 1: Check API
    const apiResult = await checkHairAPI();
    
    // Test 2: Create test product
    const createResult = await testCreateHairProduct();
    
    // Test 3: Update test product (if creation was successful)
    let updateResult = null;
    if (createResult.success && createResult.product?.id) {
        updateResult = await testUpdateHairProduct(createResult.product.id);
    }
    
    // Summary
    console.log('📋 Test Summary:');
    console.log(`  API Check: ${apiResult.success ? '✅' : '❌'}`);
    console.log(`  Product Creation: ${createResult.success ? '✅' : '❌'}`);
    console.log(`  Product Update: ${updateResult?.success ? '✅' : '❌'}`);
    
    if (apiResult.success) {
        console.log(`  Male Hairs: ${apiResult.maleHairs}`);
        console.log(`  Female Hairs: ${apiResult.femaleHairs}`);
        console.log(`  Old Hairs: ${apiResult.oldHairs}`);
    }
    
    return {
        api: apiResult,
        create: createResult,
        update: updateResult
    };
}

// Auto-run tests
runAllTests().then(results => {
    console.log('🎉 Hair API tests completed!');
    console.log('📊 Results:', results);
    
    // Store results globally for inspection
    window.hairAPITestResults = results;
});

// Export functions for manual testing
window.hairAPITests = {
    checkAPI: checkHairAPI,
    createProduct: testCreateHairProduct,
    updateProduct: testUpdateHairProduct,
    runAll: runAllTests
};
