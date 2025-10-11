-- Migration script to merge colors into products table
-- Run this in your Supabase SQL editor

-- Step 1: Add color-related columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_hex TEXT,
ADD COLUMN IF NOT EXISTS color_type TEXT CHECK (color_type IN ('shirt', 'trouser'));

-- Step 2: Create an index for color products
CREATE INDEX IF NOT EXISTS idx_products_category_color ON products(category) WHERE category = 'clothing_color';

-- Step 3: Migrate existing colors to products table
-- (If you have existing colors, run this. Otherwise skip to Step 4)
INSERT INTO products (id, name, category, collection_ids, price, stock, image, color_hex, color_type)
SELECT 
    id,
    name,
    'clothing_color' as category,
    ARRAY['regular'] as collection_ids,
    0 as price,
    quantity as stock,
    'https://via.placeholder.com/60x60/' || SUBSTRING(hex_code FROM 2) || '/' || SUBSTRING(hex_code FROM 2) || '?text=' || SUBSTRING(name FROM 1 FOR 1) as image,
    hex_code as color_hex,
    category as color_type
FROM colors
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    color_hex = EXCLUDED.color_hex,
    color_type = EXCLUDED.color_type,
    stock = EXCLUDED.stock;

-- Step 4: Drop the colors table (only after confirming migration worked!)
-- CAUTION: This will permanently delete the colors table
-- DROP TABLE IF EXISTS colors;

-- Step 5: Update RLS policies for color products (they use same policies as products)
-- No additional policies needed since colors are now products

-- Verification query - run this to check migration
SELECT 
    id, 
    name, 
    category, 
    color_hex, 
    color_type, 
    stock 
FROM products 
WHERE category = 'clothing_color'
ORDER BY color_type, name;

