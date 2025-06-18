// Config/sizeConfig.js
const sizeMappings = {
    // ===== CATEGORIES THAT NEED SIZES =====
    
    // Cricket Protective Gear (Adult sizes)
    'Pads': [],
    'Thigh Pads': [],
    'Batting Gloves': ['Left Hand', 'Right Hand'],
    'Keeping Gloves': [],
    'Helmet': [],
    'Guard': [],
    
    // Footwear (US sizes)
    'Boots': ['7', '8', '9', '10', '11', '12'],
    
    // Apparel (Clothing sizes)
    'SportsWear Shirts': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Custom Shirts': ['S', 'M', 'L', 'XL', 'XXL'],
    'Trousers': ['S', 'M', 'L', 'XL', 'XXL'],
    'Hoodies': ['S', 'M', 'L', 'XL', 'XXL'],
    'Zippers': ['S', 'M', 'L', 'XL', 'XXL'],
    'TrackSuits': ['S', 'M', 'L', 'XL', 'XXL'],
    'Shorts': ['S', 'M', 'L', 'XL', 'XXL'],
    'PSL Jerseys' : ['XS', 'S', 'M', 'L', 'XL', 'XXL'], 
    'IPL Jerseys' : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    'Big Bash League Jerseys' : ['XS', 'S', 'M', 'L', 'XL', 'XXL'], 
    'Football Jerseys' : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    
    // Accessories with sizes
    'Caps': [],
    
    // ===== CATEGORIES THAT DON'T NEED SIZES (return empty array) =====
    
    // Cricket Equipment (no sizes needed)
    'Hard Ball Bat': [],
    'Tape Ball Bat': [],
    'Tape Ball': [],
    'Hard Ball': [],
    'Kit Bags': [],
    'Football': ['4', '5'], // Football sizes
    'Gym Accessories': [],
    'Indoor Games': [],
    'All': [], // Special category for filtering
    
    // Default fallback for unknown categories
    'default': ['S', 'M', 'L', 'XL'] // This is what's being returned as fallback
};

// Function to get sizes based on category - FIXED VERSION
const getSizesByCategory = (category) => {
    console.log('🔍 Looking for sizes for category:', category);
    
    if (!category) {
        console.log('❌ No category provided, returning default');
        return [];
    }
    
    // First, try exact match (case-sensitive)
    if (sizeMappings[category]) {
        console.log('✅ Found exact match:', sizeMappings[category]);
        return sizeMappings[category];
    }
    
    // Then try case-insensitive search
    const categoryKeys = Object.keys(sizeMappings);
    const matchedKey = categoryKeys.find(key => 
        key.toLowerCase() === category.toLowerCase()
    );
    
    if (matchedKey) {
        console.log('✅ Found case-insensitive match:', matchedKey, '→', sizeMappings[matchedKey]);
        return sizeMappings[matchedKey];
    }
    
    // If no match found, return empty array instead of default sizes
    console.log('❌ No match found for category:', category, 'returning empty array');
    return [];
};

// Function to validate if a size exists for a category
const isValidSizeForCategory = (category, size) => {
    const availableSizes = getSizesByCategory(category);
    return availableSizes.includes(size);
};

// Debug function to list all available categories
const listAllCategories = () => {
    console.log('📋 All available categories:');
    Object.keys(sizeMappings).forEach(category => {
        console.log(`- ${category}: [${sizeMappings[category].join(', ')}]`);
    });
};

module.exports = {
    sizeMappings,
    getSizesByCategory,
    isValidSizeForCategory,
    listAllCategories
};