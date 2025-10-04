# 🧑‍💻 Hair Category Migration Guide

## 📋 Overview
This guide will help you complete the migration from `hair` category to `male_hair` and `female_hair` categories, and verify the two-column display in the frontend.

## 🗄️ Step 1: Update Database

### 1.1 Run SQL Migration
Execute the SQL script in your Supabase SQL Editor:

```sql
-- File: update-hair-categories.sql
-- This will update existing hair products to male_hair/female_hair
```

**Steps:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the content from `update-hair-categories.sql`
4. Run the script
5. Verify the results

### 1.2 Verify Database Changes
Check that products are properly categorized:
```sql
SELECT category, COUNT(*) as count
FROM products 
WHERE category IN ('male_hair', 'female_hair', 'hair')
GROUP BY category;
```

Expected result:
- `male_hair`: X products
- `female_hair`: Y products  
- `hair`: 0 products (all migrated)

## 🧪 Step 2: Test Upload

### 2.1 Use Test Upload Page
1. Open `test-hair-upload.html` in your browser
2. Fill in the test form:
   - **Product ID**: `test-male-hair-001`
   - **Name**: `Tóc Nam Test`
   - **Category**: `Tóc Nam (male_hair)`
   - **Price**: `25000`
   - **Stock**: `10`
   - **Image**: Use placeholder URL
3. Click "Test Upload"
4. Verify success message

### 2.2 Test Female Hair Upload
1. Change category to `Tóc Nữ (female_hair)`
2. Update name to `Tóc Nữ Test`
3. Upload and verify

### 2.3 Use Browser Console Tests
1. Open browser console on your site
2. Load `check-hair-api.js` script
3. Run: `window.hairAPITests.runAll()`
4. Check results in console

## 🔍 Step 3: Verify Frontend Display

### 3.1 Check Two-Column Layout
1. Open `index.html`
2. Navigate to the hair section
3. Verify you see:
   - **Left Column**: "Tóc nhân vật nam"
   - **Right Column**: "Tóc nhân vật nữ"

### 3.2 Use Verification Script
1. Open browser console on `index.html`
2. Load `verify-hair-display.js` script
3. Check console output for:
   - ✅ Hair container found
   - ✅ Male hair grid found
   - ✅ Female hair grid found
   - 📊 Item counts for each category

### 3.3 Manual Verification Checklist
- [ ] Male hair products appear in left column
- [ ] Female hair products appear in right column
- [ ] Stock quantities display correctly
- [ ] Products are clickable and selectable
- [ ] No products appear in wrong column
- [ ] CSS styling looks correct

## 🐛 Troubleshooting

### Common Issues:

#### 1. "No hair products displayed"
**Solution:**
- Check if products exist in database with correct categories
- Verify API is returning products
- Check browser console for errors

#### 2. "Products in wrong column"
**Solution:**
- Verify product categories in database
- Check `updateProductOptions` function
- Ensure products are properly filtered

#### 3. "API errors"
**Solution:**
- Check Supabase connection
- Verify environment variables
- Check API endpoint responses

#### 4. "CSS layout issues"
**Solution:**
- Check `.hair-options-container` CSS
- Verify grid layout is working
- Check responsive design

## 📊 Expected Results

### Database:
- All `hair` products migrated to `male_hair` or `female_hair`
- No products with `category = 'hair'`
- Proper categorization based on product names

### Frontend:
- Two-column hair display
- Male hair in left column
- Female hair in right column
- Stock quantities displayed
- Functional selection

### CMS:
- Dropdown shows "Tóc Nam" and "Tóc Nữ" options
- Products display with correct category icons
- Inventory management works for both categories

## 🎯 Success Criteria

✅ **Database Migration Complete**
- All hair products categorized correctly
- No orphaned `hair` category products

✅ **Upload Functionality Working**
- Can upload male hair products
- Can upload female hair products
- Products appear in correct categories

✅ **Frontend Display Correct**
- Two-column layout visible
- Products in correct columns
- Stock quantities showing
- Selection functionality working

✅ **CMS Management Working**
- Category dropdown updated
- Icons display correctly
- Inventory management functional

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify database changes
3. Test API endpoints manually
4. Check CSS styling
5. Review migration script results

## 🔄 Rollback Plan

If migration fails:
1. Revert database changes
2. Restore original `hair` category
3. Update frontend to use single category
4. Test functionality

---

**Note:** This migration maintains backward compatibility while improving the user experience with better hair category organization.
