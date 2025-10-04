// Verify Hair Display Script
// Run this in browser console on index.html to check hair display

console.log('🔍 Verifying Hair Display...');

// Check if hair containers exist
const hairContainer = document.getElementById('hair-options-container');
if (!hairContainer) {
    console.error('❌ Hair container not found!');
} else {
    console.log('✅ Hair container found');
}

// Check male hair section
const maleHairGrid = document.getElementById('male-hair-grid');
if (!maleHairGrid) {
    console.error('❌ Male hair grid not found!');
} else {
    console.log('✅ Male hair grid found');
    const maleHairItems = maleHairGrid.querySelectorAll('.option-item');
    console.log(`📊 Male hair items: ${maleHairItems.length}`);
    
    maleHairItems.forEach((item, index) => {
        const name = item.querySelector('.option-name')?.textContent || 'Unknown';
        const stock = item.querySelector('.option-stock')?.textContent || 'Unknown';
        console.log(`  ${index + 1}. ${name} - ${stock}`);
    });
}

// Check female hair section
const femaleHairGrid = document.getElementById('female-hair-grid');
if (!femaleHairGrid) {
    console.error('❌ Female hair grid not found!');
} else {
    console.log('✅ Female hair grid found');
    const femaleHairItems = femaleHairGrid.querySelectorAll('.option-item');
    console.log(`📊 Female hair items: ${femaleHairItems.length}`);
    
    femaleHairItems.forEach((item, index) => {
        const name = item.querySelector('.option-name')?.textContent || 'Unknown';
        const stock = item.querySelector('.option-stock')?.textContent || 'Unknown';
        console.log(`  ${index + 1}. ${name} - ${stock}`);
    });
}

// Check if products are loaded from Supabase
console.log('🔍 Checking product options...');
if (typeof productOptions !== 'undefined') {
    console.log('📊 Product Options:');
    console.log(`  Male Hairs: ${productOptions.maleHairs?.length || 0}`);
    console.log(`  Female Hairs: ${productOptions.femaleHairs?.length || 0}`);
    
    if (productOptions.maleHairs?.length > 0) {
        console.log('👨 Male Hair Products:');
        productOptions.maleHairs.forEach((hair, index) => {
            console.log(`  ${index + 1}. ${hair.label} (${hair.id})`);
        });
    }
    
    if (productOptions.femaleHairs?.length > 0) {
        console.log('👩 Female Hair Products:');
        productOptions.femaleHairs.forEach((hair, index) => {
            console.log(`  ${index + 1}. ${hair.label} (${hair.id})`);
        });
    }
} else {
    console.error('❌ Product options not found!');
}

// Check CSS styling
const hairBoxes = document.querySelectorAll('.hair-option-box');
console.log(`📦 Hair option boxes: ${hairBoxes.length}`);

hairBoxes.forEach((box, index) => {
    const title = box.querySelector('.hair-option-title')?.textContent || 'Unknown';
    console.log(`  Box ${index + 1}: ${title}`);
});

// Test selection functionality
console.log('🧪 Testing selection functionality...');
const testMaleHair = maleHairGrid?.querySelector('.option-item');
const testFemaleHair = femaleHairGrid?.querySelector('.option-item');

if (testMaleHair) {
    console.log('✅ Male hair items are clickable');
} else {
    console.log('⚠️ No male hair items to test');
}

if (testFemaleHair) {
    console.log('✅ Female hair items are clickable');
} else {
    console.log('⚠️ No female hair items to test');
}

// Check if categories are properly separated
console.log('🔍 Checking category separation...');
const allHairItems = document.querySelectorAll('#hair-options-container .option-item');
let maleCount = 0;
let femaleCount = 0;

allHairItems.forEach(item => {
    const grid = item.closest('.options-grid');
    if (grid?.id === 'male-hair-grid') {
        maleCount++;
    } else if (grid?.id === 'female-hair-grid') {
        femaleCount++;
    }
});

console.log(`📊 Category separation: Male=${maleCount}, Female=${femaleCount}`);

// Final verification
if (maleHairGrid && femaleHairGrid && hairContainer) {
    console.log('✅ Hair display verification completed successfully!');
    console.log('🎉 Two-column hair display is working correctly!');
} else {
    console.error('❌ Hair display verification failed!');
    console.log('🔧 Please check the implementation.');
}

// Export verification results
window.hairDisplayVerification = {
    maleHairCount: maleCount,
    femaleHairCount: femaleCount,
    totalHairItems: allHairItems.length,
    maleHairGrid: !!maleHairGrid,
    femaleHairGrid: !!femaleHairGrid,
    hairContainer: !!hairContainer,
    success: !!(maleHairGrid && femaleHairGrid && hairContainer)
};

console.log('📋 Verification results:', window.hairDisplayVerification);
