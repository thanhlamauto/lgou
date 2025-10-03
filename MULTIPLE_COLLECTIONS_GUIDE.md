# Multiple Collections Per Product - Implementation Guide

## Overview
Products can now belong to **multiple collections** simultaneously instead of just one. This allows for better flexibility in organizing and displaying products across different campaigns and categories.

## What Changed

### Before (Single Collection)
```
Product → 1 Collection
- Women's Day Flower Vase → "womens-day-2024"
```

### After (Multiple Collections)
```
Product → Multiple Collections
- Women's Day Flower Vase → ["womens-day-2024", "valentines-2024", "regular"]
```

## Database Migration

### Step 1: Run SQL Migration
Execute the SQL script in Supabase:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `update-products-multiple-collections.sql`
3. Paste and **Run**

This will:
- ✅ Add `collection_ids` array column
- ✅ Migrate existing `collection_id` data to `collection_ids`
- ✅ Create GIN index for efficient queries
- ✅ Keep `collection_id` for backward compatibility

### Migration Details

```sql
-- New column
ALTER TABLE products ADD COLUMN collection_ids text[] DEFAULT '{}';

-- Migrate data
UPDATE products 
SET collection_ids = ARRAY[collection_id]::text[]
WHERE collection_id IS NOT NULL;

-- Create index
CREATE INDEX products_collection_ids_idx ON products USING GIN(collection_ids);
```

## CMS Changes

### New Multi-Select Interface

**Before:** Dropdown with single selection
```html
<select id="product-collection">
  <option value="womens-day-2024">Bộ Sưu Tập 20/10</option>
</select>
```

**After:** Checkboxes with multiple selection
```html
<div id="product-collections-container">
  ☑ Bộ Sưu Tập 20/10 (womens-day-2024)
  ☐ Valentine Collection 2024 (valentines-2024)
  ☑ Regular (regular)
</div>
```

### How to Use in CMS

#### Adding a Product to Multiple Collections
1. Open CMS → **Kho hàng** tab
2. Click **"+ Thêm sản phẩm mới"**
3. Fill in product details
4. In **Collections** section:
   - ✅ Check all collections the product should belong to
   - You can select 0, 1, or many collections
5. Click **"Thêm sản phẩm"**

#### Editing Product Collections
1. Find the product in inventory
2. Click **Edit** (✏️ button)
3. Collections checkboxes show current assignments
4. Check/uncheck collections as needed
5. Click **"Cập nhật sản phẩm"**

### Examples

#### Example 1: Regular Product
```
Product: "Túi xách đen"
Collections: [regular]
→ Appears in: Regular collection only
```

#### Example 2: Multi-Collection Product
```
Product: "Hoa hồng đỏ"
Collections: [womens-day-2024, valentines-2024, regular]
→ Appears in: All three collections
```

#### Example 3: Exclusive Product
```
Product: "Thiệp 20/10 đặc biệt"
Collections: [womens-day-2024]
→ Appears in: Women's Day collection only
```

#### Example 4: No Collections
```
Product: "Sản phẩm test"
Collections: []
→ Appears in: None (hidden from customer website)
```

## API Changes

### Query Products by Collection

**Old Way:**
```javascript
// Single collection filter
GET /api/products?collection_id=womens-day-2024
```

**New Way (Backward Compatible):**
```javascript
// Still works! Now checks both collection_id and collection_ids
GET /api/products?collection_id=womens-day-2024

// Returns all products where:
// - collection_id = 'womens-day-2024' OR
// - 'womens-day-2024' is in collection_ids array
```

### API Response Format

```json
{
  "products": [
    {
      "id": "product-123",
      "name": "Hoa hồng đỏ",
      "category": "accessories",
      "collection_id": "womens-day-2024",      // Legacy field
      "collection_ids": [                       // New array field
        "womens-day-2024",
        "valentines-2024",
        "regular"
      ],
      "price": 50000,
      "stock": 10,
      "image": "https://..."
    }
  ]
}
```

## Customer Website Behavior

### Collection Selection (Step 1)
When customer selects a collection:

1. Customer clicks **"Bộ Sưu Tập 20/10"**
2. Website fetches: `GET /api/products?collection_id=womens-day-2024`
3. Returns all products where `'womens-day-2024'` is in `collection_ids`
4. Products appear in customization steps

### Product Visibility

```
Product with collection_ids = [womens-day-2024, valentines-2024]

Customer selects "Women's Day" → ✅ Product appears
Customer selects "Valentine's"  → ✅ Product appears  
Customer selects "Christmas"    → ❌ Product doesn't appear
```

## Database Queries

### Find Products in Specific Collection
```sql
SELECT * FROM products 
WHERE 'womens-day-2024' = ANY(collection_ids);
```

### Find Products in Multiple Collections
```sql
SELECT * FROM products 
WHERE collection_ids && ARRAY['womens-day-2024', 'valentines-2024'];
```

### Find Products with NO Collections
```sql
SELECT * FROM products 
WHERE collection_ids IS NULL OR collection_ids = '{}';
```

### Add Collection to Product
```sql
UPDATE products 
SET collection_ids = array_append(collection_ids, 'new-collection-id') 
WHERE id = 'product-id';
```

### Remove Collection from Product
```sql
UPDATE products 
SET collection_ids = array_remove(collection_ids, 'collection-to-remove') 
WHERE id = 'product-id';
```

### Count Products per Collection
```sql
SELECT 
  unnest(collection_ids) as collection_id, 
  COUNT(*) as product_count
FROM products 
WHERE collection_ids IS NOT NULL AND collection_ids != '{}'
GROUP BY collection_id;
```

## Testing

### Test 1: Create Product with Multiple Collections
1. Open CMS → Kho hàng
2. Click "+ Thêm sản phẩm mới"
3. Fill in:
   - ID: `test-multi-col`
   - Name: `Test Multiple Collections`
   - Category: Any
   - Collections: Check "Bộ Sưu Tập 20/10" AND "Regular"
4. Save
5. **Verify in Supabase:**
   ```sql
   SELECT id, name, collection_ids FROM products WHERE id = 'test-multi-col';
   ```
   Should show: `collection_ids: {womens-day-2024, regular}`

### Test 2: Product Appears in Multiple Collections
1. Open customer website (index.html)
2. Select "Bộ Sưu Tập 20/10" → Product should appear
3. Go back, select "Regular" → Same product should appear

### Test 3: Edit Product Collections
1. In CMS, edit the test product
2. Uncheck "Regular"
3. Check "Valentine Collection" (if exists)
4. Save
5. Verify product now appears in Valentine but not Regular

### Test 4: Remove All Collections
1. Edit product
2. Uncheck all collections
3. Save
4. Product should not appear in any collection on website

### Test 5: Backward Compatibility
1. Create product with old CMS (if you have backup)
2. Product should still work with new system
3. Old `collection_id` migrated to `collection_ids` array

## Troubleshooting

### Products Not Showing in Collection
**Problem:** Selected collection but products don't appear

**Solutions:**
1. Check if products have the collection in `collection_ids`
   ```sql
   SELECT id, name, collection_ids FROM products 
   WHERE 'collection-id' = ANY(collection_ids);
   ```
2. Verify collection exists and is active
3. Check browser console for API errors
4. Try force refresh in customer website

### Checkboxes Not Loading
**Problem:** CMS shows "Đang tải collections..." forever

**Solutions:**
1. Check if collections exist in Supabase
2. Verify CollectionsAPI is working
3. Check browser console for errors
4. Refresh CMS page

### Collection_ids is NULL
**Problem:** Database shows `collection_ids: null`

**Solutions:**
1. Run migration SQL again
2. Manually set default:
   ```sql
   UPDATE products SET collection_ids = '{}' WHERE collection_ids IS NULL;
   ```

### Old Products Not Migrated
**Problem:** Products with `collection_id` not in new array

**Solutions:**
```sql
-- Re-run migration for specific products
UPDATE products 
SET collection_ids = ARRAY[collection_id]::text[]
WHERE collection_id IS NOT NULL 
  AND collection_id != ''
  AND (collection_ids IS NULL OR collection_ids = '{}');
```

## Performance

### GIN Index Benefits
The GIN (Generalized Inverted Index) on `collection_ids` provides:
- ✅ Fast array containment queries (`@>`, `&&`, `<@`)
- ✅ Efficient filtering by collection
- ✅ Scales well with many products

### Query Performance
```sql
-- Fast with GIN index
EXPLAIN ANALYZE SELECT * FROM products 
WHERE collection_ids @> ARRAY['womens-day-2024'];

-- Also fast
EXPLAIN ANALYZE SELECT * FROM products 
WHERE 'womens-day-2024' = ANY(collection_ids);
```

## Best Practices

### Collection Assignment Strategy

1. **Always assign to at least one collection**
   - Products with no collections are hidden
   - Use "regular" as default

2. **Use multiple collections strategically**
   - Seasonal product → [season-collection, regular]
   - Limited edition → [limited-collection] only
   - Popular product → [multiple-campaigns, regular]

3. **Don't over-assign**
   - Too many collections makes management complex
   - 1-3 collections per product is ideal

### Naming Conventions

```
✅ Good collection IDs:
- womens-day-2024
- valentines-2024
- christmas-2024
- regular

❌ Bad collection IDs:
- WomensDay
- valentine's_2024
- Collection 1
```

## Migration Checklist

- [ ] Run SQL migration in Supabase
- [ ] Verify `collection_ids` column exists
- [ ] Check existing products migrated correctly
- [ ] Test creating product with multiple collections
- [ ] Test editing product collections
- [ ] Verify products appear in all assigned collections
- [ ] Test backward compatibility
- [ ] Deploy to production
- [ ] Monitor for any issues

## Summary

**What You Get:**
- ✅ Products in multiple collections
- ✅ Better flexibility
- ✅ Backward compatible
- ✅ Efficient queries
- ✅ Easy CMS management

**What's Required:**
1. Run SQL migration once
2. Use updated CMS to manage products
3. That's it!

Your products can now participate in multiple collections simultaneously! 🎉

