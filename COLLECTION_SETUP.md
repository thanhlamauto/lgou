# Collection-Based Product Filtering Setup Guide

## Overview
This guide will help you set up collection-based product filtering in your L'Gôu system. Customers will now select a collection first, and only see products available in that collection.

## Database Setup

### Step 1: Run SQL Migration
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `add-collection-to-products.sql`
4. Copy and paste all the SQL code into the SQL Editor
5. Click **Run** to execute the migration

This will:
- Add `collection_id` column to products table
- Create index for better performance
- Insert "Women's Day (20/10)" collection
- Insert "Regular" collection (default)

### Step 2: Verify Collections
After running the SQL, verify the collections were created:

```sql
SELECT * FROM collections;
```

You should see:
- `womens-day-2024`: Bộ Sưu Tập 20/10
- `regular`: Bộ Sưu Tập Thường Xuyên

## Assigning Products to Collections

### Via CMS (Recommended)
1. Open CMS (cms.html)
2. Go to **Kho hàng** (Inventory) tab
3. Click **Edit** (✏️) on any product
4. Select a collection from the **Collection** dropdown:
   - Leave blank for no collection
   - Select "Regular (Thường xuyên)" for always-available products
   - Select "Bộ Sưu Tập 20/10" for Women's Day products
5. Save the product

### Via SQL (Bulk Assignment)
To assign all existing products to "Regular" collection:

```sql
UPDATE products 
SET collection_id = 'regular' 
WHERE collection_id IS NULL;
```

To assign specific products to Women's Day collection:

```sql
UPDATE products 
SET collection_id = 'womens-day-2024' 
WHERE id IN ('product-id-1', 'product-id-2', 'product-id-3');
```

## How It Works

### Customer Flow
1. **Step 1: Select Collection**
   - Customer sees all active collections
   - Must select one to proceed
   - Collections automatically fetch from Supabase

2. **Step 2-5: Customize Product**
   - Only products from selected collection are displayed
   - Products are cached per collection
   - Switching collections refreshes product list

### Admin (CMS) Features
- **Add Product**: Select which collection the product belongs to
- **Edit Product**: Change product's collection assignment
- **Collection Dropdown**: Shows:
  - "Không thuộc collection nào" (No collection)
  - "Regular (Thường xuyên)" (Always available)
  - "Bộ Sưu Tập 20/10" (Women's Day collection)

## Creating New Collections

### Method 1: Via Supabase Dashboard
1. Go to Supabase Dashboard → **Table Editor**
2. Open the `collections` table
3. Click **Insert → Insert row**
4. Fill in:
   - `id`: Unique ID (e.g., `christmas-2024`)
   - `name`: Display name (e.g., `Giáng Sinh 2024`)
   - `description`: Collection description
   - `end_date`: When collection expires (ISO 8601 format)
   - `icon`: Font Awesome icon class (e.g., `fas fa-snowflake`)
   - `features`: JSON array of features: `["Feature 1", "Feature 2"]`
   - `status`: `active` or `inactive`

### Method 2: Via SQL
```sql
INSERT INTO collections (id, name, description, end_date, icon, features, status)
VALUES (
  'christmas-2024',
  'Bộ Sưu Tập Giáng Sinh',
  'Những món quà đặc biệt cho mùa lễ hội',
  '2024-12-31T23:59:59Z',
  'fas fa-snowflake',
  '["Thiết kế Giáng Sinh", "Màu đỏ trắng", "Tặng kèm thiệp"]'::jsonb,
  'active'
);
```

### Method 3: Via API (For Developers)
```javascript
const response = await fetch('/api/collections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'christmas-2024',
    name: 'Bộ Sưu Tập Giáng Sinh',
    description: 'Những món quà đặc biệt cho mùa lễ hội',
    endDate: '2024-12-31T23:59:59Z',
    icon: 'fas fa-snowflake',
    features: ['Thiết kế Giáng Sinh', 'Màu đỏ trắng', 'Tặng kèm thiệp'],
    status: 'active'
  })
});
```

## Adding Collections to CMS Dropdown

After creating a new collection, update the dropdown in `cms.html`:

Find this section (around line 774-779):
```html
<select id="product-collection">
    <option value="">Không thuộc collection nào</option>
    <option value="regular">Regular (Thường xuyên)</option>
    <option value="womens-day-2024">Bộ Sưu Tập 20/10</option>
    <!-- Add your new collection here -->
    <option value="christmas-2024">Bộ Sưu Tập Giáng Sinh</option>
</select>
```

## Testing

### Test Collection Selection
1. Open index.html
2. You should see collection options in Step 1
3. Click on a collection
4. Proceed to next steps
5. Verify only products from that collection are shown

### Test Product Filtering
1. Create test products with different collections
2. Select "Women's Day" collection → only Women's Day products should appear
3. Select "Regular" collection → regular products should appear
4. Switch collections → products should update

### Test CMS Integration
1. Open CMS
2. Add/Edit a product
3. Select a collection
4. Save and verify collection_id in database

## Troubleshooting

### Products not showing up
- Check if products have the correct `collection_id` in database
- Verify collection is `active` in collections table
- Check browser console for errors
- Clear cache and refresh page

### Collection not appearing
- Verify `end_date` is in the future
- Check `status` is `active`
- Run: `SELECT * FROM collections WHERE status = 'active';`

### SQL Error when running migration
- Make sure you're using the correct Supabase project
- Check if column already exists: `\d products` (in SQL editor)
- If column exists, skip the ALTER TABLE command

## Women's Day Collection Details

**ID**: `womens-day-2024`
**Name**: Bộ Sưu Tập 20/10
**Description**: Special collection for Vietnamese Women's Day (October 20th)
**End Date**: October 31, 2024
**Icon**: ❤️ (fas fa-heart)

**Features**:
- Thiết kế độc quyền (Exclusive design)
- Màu sắc pastel nhẹ nhàng (Soft pastel colors)
- Quà tặng ý nghĩa (Meaningful gifts)
- Giao hàng đúng ngày 20/10 (Delivery on Oct 20th)

## Next Steps

1. ✅ Run the SQL migration
2. ✅ Verify collections in Supabase
3. ✅ Assign products to collections
4. ✅ Test collection selection flow
5. ✅ Deploy to production

Your collection-based filtering system is now ready! 🎉

