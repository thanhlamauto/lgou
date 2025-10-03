# Collection Management - Supabase Integration ✅

## What Changed

The CMS Collections Management has been completely updated to use **Supabase** instead of localStorage. All collection operations (create, read, update, delete) now sync directly with your Supabase database.

## Features

### ✅ Real-time Sync
- Collections created in CMS instantly appear in customer website
- No more localStorage conflicts
- Data persists across browser sessions and devices

### ✅ Full CRUD Operations
- **Create**: Add new collections with unique IDs
- **Read**: Fetch all collections from Supabase
- **Update**: Edit collection details
- **Delete**: Remove collections from database
- **Toggle Status**: Activate/deactivate collections

### ✅ Better UX
- Loading states
- Error notifications
- Success confirmations
- Proper validation

## How to Use

### 1. View Collections
1. Open CMS
2. Go to **Collections** tab
3. All collections from Supabase will load automatically

### 2. Add New Collection
1. Click **"+ Thêm Collection Mới"**
2. Fill in the form:
   - **ID**: Unique identifier (e.g., `valentines-2024`)
   - **Name**: Display name (e.g., `Bộ Sưu Tập Valentine`)
   - **Description**: Collection description
   - **End Date**: When collection expires
   - **Discount**: Percentage discount (0-100)
   - **Icon**: Font Awesome class (e.g., `fas fa-heart`)
   - **Features**: Comma-separated list
3. Click **"Lưu Collection"**

### 3. Edit Collection
1. Find the collection in the list
2. Click **"Sửa"** button
3. Update any fields
4. Click **"Lưu Collection"**

### 4. Delete Collection
1. Find the collection in the list
2. Click **"Xóa"** button
3. Confirm deletion
4. Collection removed from Supabase

### 5. Toggle Status (Active/Expired)
1. Click **"Tắt"** to expire a collection
2. Click **"Bật"** to reactivate for 30 days
3. Status updates immediately in Supabase

## Testing

### Test Creating a Collection
```
1. Open CMS → Collections tab
2. Click "+ Thêm Collection Mới"
3. Fill in:
   ID: test-collection-123
   Name: Test Collection
   Description: This is a test
   End Date: (Select future date)
   Discount: 10
   Icon: fas fa-gift
   Features: Feature 1, Feature 2, Feature 3
4. Click "Lưu Collection"
5. Verify collection appears in list
```

### Test Editing
```
1. Click "Sửa" on the test collection
2. Change name to "Updated Test Collection"
3. Change discount to 15
4. Click "Lưu Collection"
5. Verify changes appear immediately
```

### Test Status Toggle
```
1. Click "Tắt" on an active collection
2. Verify status changes to "Expired" (red badge)
3. Click "Bật" again
4. Verify status changes to "Active" (green badge)
```

### Test Deletion
```
1. Click "Xóa" on the test collection
2. Confirm deletion
3. Verify collection disappears from list
```

### Test Customer Website Sync
```
1. Open index.html in another tab
2. Create/edit a collection in CMS
3. Refresh index.html
4. Click "Cập nhật Collections" button
5. Verify collection appears/updates
```

## Field Descriptions

### ID (Required)
- Unique identifier for the collection
- Use lowercase letters, numbers, and hyphens
- Examples: `womens-day-2024`, `christmas-2024`, `valentines-2024`
- Cannot be changed after creation

### Name (Required)
- Display name shown to customers
- Examples: `Bộ Sưu Tập 20/10`, `Giáng Sinh 2024`

### Description (Required)
- Brief description of the collection
- Shown to customers when selecting collection
- Keep it concise and appealing

### End Date (Required)
- When the collection expires
- Format: `YYYY-MM-DDTHH:MM`
- Collections with past end dates show as "Expired"

### Discount (Optional)
- Percentage discount for this collection
- Enter number between 0-100
- Default: 0 (no discount)

### Icon (Optional)
- Font Awesome icon class
- Examples:
  - `fas fa-heart` - Heart icon
  - `fas fa-snowflake` - Snowflake
  - `fas fa-gift` - Gift box
  - `fas fa-star` - Star
- Default: `fas fa-star`

### Features (Optional)
- Comma-separated list of features
- Example: `Thiết kế độc quyền, Màu sắc pastel, Giao hàng nhanh`
- Displayed as bullet points

## Data Flow

```
CMS Collections Tab
        ↓
    CollectionsAPI
        ↓
  /api/collections
        ↓
Supabase Database
        ↓
  /api/collections
        ↓
Customer Website (index.html)
```

## Troubleshooting

### Collections Not Loading
- Check browser console for errors
- Verify Supabase credentials in Vercel
- Check if `/api/collections` endpoint is accessible
- Try clearing browser cache

### Cannot Create Collection
- Check if ID is unique
- Verify all required fields are filled
- Check console for validation errors
- Ensure end_date is in future

### Cannot Edit Collection
- Verify collection exists in Supabase
- Check if you have proper permissions
- Try refreshing the page

### Changes Not Syncing
- Check if both CMS and website use same Supabase project
- Verify API endpoints are deployed on Vercel
- Check browser console for API errors

## Database Schema

Collections are stored in the `collections` table with these fields:

```sql
CREATE TABLE collections (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  end_date timestamp with time zone,
  discount numeric DEFAULT 0,
  icon text DEFAULT 'fas fa-star',
  features jsonb DEFAULT '[]'::jsonb,
  limited_products jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

## Next Steps

1. ✅ Run the SQL migration (`add-collection-to-products.sql`)
2. ✅ Test creating a new collection in CMS
3. ✅ Assign products to collections
4. ✅ Test collection selection in customer website
5. ✅ Deploy to production

All collection changes are now automatically synced to Supabase! 🎉

