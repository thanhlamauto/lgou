# Colors Migration Guide

## Overview
Colors have been migrated from a separate `colors` table to the `products` table. This simplifies database management and provides a unified interface for all product types.

## Changes Made

### 1. Database Schema (`colors-schema-migration.sql`)
- Added `color_hex` (TEXT) and `color_type` (TEXT) columns to `products` table
- Created index for color products: `idx_products_category_color`
- Migration script to move existing colors to products table
- Color products use category: `clothing_color`

### 2. Index.html Updates
✅ **Updated color loading to use Products API**
- Changed from `/api/colors` to `/api/products?category=clothing_color`
- Colors are now fetched as products and converted to color format
- Maintains backward compatibility with existing color display logic

### 3. CMS.html Updates
✅ **Unified product management**
- Colors tab now uses product management interface
- Added color-specific fields in product form:
  - `color_hex`: HEX color code with visual picker
  - `color_type`: Shirt or Trouser
- Auto-generates placeholder images for colors
- Colors automatically set price to 0
- Removed old color modal and related functions

### 4. Products API
✅ **Already supports category filtering**
- Use `?category=clothing_color` to fetch colors
- Existing API handles all color operations (CRUD)

## Migration Steps

### Step 1: Update Database Schema
Run the migration SQL in your Supabase SQL editor:

```sql
-- Add color columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS color_hex TEXT,
ADD COLUMN IF NOT EXISTS color_type TEXT CHECK (color_type IN ('shirt', 'trouser'));

-- Create index
CREATE INDEX IF NOT EXISTS idx_products_category_color ON products(category) WHERE category = 'clothing_color';
```

### Step 2: Migrate Existing Colors (if you have data)
```sql
-- Migrate colors to products
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
```

### Step 3: Verify Migration
```sql
-- Check migrated colors
SELECT id, name, category, color_hex, color_type, stock 
FROM products 
WHERE category = 'clothing_color'
ORDER BY color_type, name;
```

### Step 4: Drop Old Colors Table (AFTER VERIFICATION!)
```sql
-- CAUTION: Only run after confirming migration worked!
DROP TABLE IF EXISTS colors;
```

### Step 5: Deploy Updated Files
1. Deploy updated `index.html`
2. Deploy updated `cms.html`
3. No API changes needed (already supports category filtering)

## Usage in CMS

### Adding a New Color
1. Go to "Màu quần áo" tab
2. Click "Thêm màu mới"
3. Fill in:
   - ID: `shirt_013` or `trouser_012` (unique)
   - Name: Color name (e.g., "Xanh Lá")
   - Category: Select "Màu Quần Áo"
   - Mã màu HEX: Enter hex code or use color picker
   - Loại màu: Select "Áo" or "Quần"
   - Stock: Enter quantity
   - Price will be automatically set to 0
4. Click "Thêm sản phẩm"

### Editing Colors
- Click "Sửa" button on any color
- Update fields as needed
- Color-specific fields automatically show when category is "clothing_color"

## Benefits

✅ **Simplified Architecture**
- One table for all products (including colors)
- Unified CRUD operations
- Single API endpoint

✅ **Better Management**
- Colors managed through standard product interface
- Consistent inventory tracking
- Support for collections

✅ **Easier Maintenance**
- Less code to maintain
- Fewer API endpoints
- Single source of truth

✅ **Backward Compatible**
- Frontend code adapted to work with new structure
- Existing functionality preserved
- No breaking changes for users

## API Usage

### Get All Colors
```javascript
fetch('/api/products?category=clothing_color')
  .then(res => res.json())
  .then(data => {
    const colors = data.products.map(product => ({
      id: product.id,
      name: product.name,
      hex_code: product.color_hex,
      category: product.color_type, // 'shirt' or 'trouser'
      quantity: product.stock
    }));
  });
```

### Get Shirt Colors Only
```javascript
const response = await fetch('/api/products?category=clothing_color');
const data = await response.json();
const shirtColors = data.products.filter(p => p.color_type === 'shirt');
```

### Create New Color
```javascript
const colorData = {
  id: 'shirt_013',
  name: 'Xanh Lá',
  category: 'clothing_color',
  color_hex: '#4CAF50',
  color_type: 'shirt',
  price: 0,
  stock: 50,
  collection_ids: ['regular'],
  image: 'https://via.placeholder.com/60x60/4CAF50/4CAF50?text=X'
};

fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(colorData)
});
```

## Testing Checklist

- [ ] Run database migration
- [ ] Verify colors migrated correctly
- [ ] Test adding new color in CMS
- [ ] Test editing existing color
- [ ] Test deleting color
- [ ] Test color display in frontend (index.html)
- [ ] Test filtering colors by type (shirt/trouser)
- [ ] Verify color selection works in character customization
- [ ] Check color stock updates correctly

## Rollback Plan

If issues occur, you can rollback by:
1. Keep old `colors` table backup
2. Restore from backup if needed
3. Revert HTML files to previous version

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify database schema matches migration script
3. Ensure all color products have `color_hex` and `color_type` fields
4. Check API responses for proper data format

