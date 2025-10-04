-- Update existing hair products to male_hair and female_hair categories
-- This script will help migrate existing hair products to the new category structure

-- First, let's see what hair products we currently have
SELECT id, name, category, created_at 
FROM products 
WHERE category = 'hair' 
ORDER BY created_at;

-- Update hair products to male_hair based on name patterns
UPDATE products 
SET category = 'male_hair' 
WHERE category = 'hair' 
AND (
    LOWER(name) LIKE '%nam%' 
    OR LOWER(name) LIKE '%male%'
    OR LOWER(name) LIKE '%tóc nam%'
    OR LOWER(name) LIKE '%tóc đầu nấm%'
    OR LOWER(name) LIKE '%tóc short quiff%'
    OR LOWER(name) LIKE '%tóc sidepart%'
    OR LOWER(name) LIKE '%tóc màu nâu%'
);

-- Update hair products to female_hair based on name patterns
UPDATE products 
SET category = 'female_hair' 
WHERE category = 'hair' 
AND (
    LOWER(name) LIKE '%nữ%' 
    OR LOWER(name) LIKE '%female%'
    OR LOWER(name) LIKE '%tóc nữ%'
    OR LOWER(name) LIKE '%tóc đuôi ngựa%'
    OR LOWER(name) LIKE '%búi củ tỏi%'
    OR LOWER(name) LIKE '%hime công chúa%'
    OR LOWER(name) LIKE '%xoăn thập niên 90%'
);

-- For any remaining hair products that don't match patterns, 
-- let's set them as male_hair by default (you can manually adjust these later)
UPDATE products 
SET category = 'male_hair' 
WHERE category = 'hair';

-- Verify the updates
SELECT category, COUNT(*) as count
FROM products 
WHERE category IN ('male_hair', 'female_hair')
GROUP BY category;

-- Show all updated products
SELECT id, name, category, created_at 
FROM products 
WHERE category IN ('male_hair', 'female_hair')
ORDER BY category, name;
