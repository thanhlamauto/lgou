-- Update products table to support multiple collections
-- Change collection_id from text to text array

-- Step 1: Add new column for multiple collections
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS collection_ids text[] DEFAULT '{}';

-- Step 2: Migrate existing collection_id data to collection_ids array
-- This preserves existing single collection assignments
UPDATE public.products 
SET collection_ids = ARRAY[collection_id]::text[]
WHERE collection_id IS NOT NULL 
  AND collection_id != ''
  AND (collection_ids IS NULL OR collection_ids = '{}');

-- Step 3: Drop the old single collection_id column (optional - keep for backward compatibility)
-- Uncomment the line below if you want to completely remove the old column
-- ALTER TABLE public.products DROP COLUMN IF EXISTS collection_id;

-- Step 4: Create index for better query performance with arrays
CREATE INDEX IF NOT EXISTS products_collection_ids_idx ON public.products USING GIN(collection_ids);

-- Step 5: Update the comment
COMMENT ON COLUMN public.products.collection_ids IS 'Array of collection IDs this product belongs to';

-- Example queries after migration:

-- Find products that belong to a specific collection
-- SELECT * FROM products WHERE 'womens-day-2024' = ANY(collection_ids);

-- Find products that belong to multiple specific collections
-- SELECT * FROM products WHERE collection_ids && ARRAY['womens-day-2024', 'valentines-2024'];

-- Add a collection to a product
-- UPDATE products SET collection_ids = array_append(collection_ids, 'new-collection-id') WHERE id = 'product-id';

-- Remove a collection from a product
-- UPDATE products SET collection_ids = array_remove(collection_ids, 'collection-id-to-remove') WHERE id = 'product-id';

-- Find products in NO collection
-- SELECT * FROM products WHERE collection_ids IS NULL OR collection_ids = '{}';

-- Count products per collection
-- SELECT unnest(collection_ids) as collection_id, COUNT(*) as product_count
-- FROM products 
-- WHERE collection_ids IS NOT NULL AND collection_ids != '{}'
-- GROUP BY collection_id;

