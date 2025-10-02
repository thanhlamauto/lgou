# 🔌 Integrate Website & CMS with Supabase

## Quick Integration Guide

Now that you've set up Supabase, let's connect your website and CMS to use it!

---

## Part 1: Update CMS to Use Supabase (5 minutes)

### Step 1: Add API Integration Script

Open `cms.html` and find this line (around line 796):
```html
<script src="inventory-data.js"></script>
```

**Add this line BEFORE it:**
```html
<script src="cms-supabase-integration.js"></script>
```

So it looks like:
```html
<script src="cms-supabase-integration.js"></script>
<script src="inventory-data.js"></script>
<script src="accessories-pets-data.js"></script>
```

### Step 2: Update loadDashboard Function

Find the `loadDashboard()` function (around line 927) and replace it with:

```javascript
// Dashboard
async function loadDashboard() {
    try {
        // Get stats from API
        const stats = await StatsAPI.get();
        
        // Update stats display
        document.getElementById('orders-today').textContent = stats.ordersToday || 0;
        document.getElementById('orders-today').nextElementSibling.textContent = stats.ordersChange + ' so với hôm qua';
        
        document.getElementById('revenue-month').textContent = (stats.revenueMonth || 0).toLocaleString() + '₫';
        document.getElementById('revenue-month').nextElementSibling.textContent = stats.revenueChange + ' so với tháng trước';
        
        document.getElementById('out-of-stock').textContent = stats.outOfStock || 0;
        document.getElementById('new-customers').textContent = stats.newCustomers || 0;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
    
    // Load default tabs
    await loadOrders();
    await loadInventory();
}
```

### Step 3: Update loadOrders Function

Find `loadOrders()` function (around line 938) and replace with:

```javascript
// Orders Management
async function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Đang tải...</td></tr>';

    try {
        const orders = await OrdersAPI.getAll();

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Chưa có đơn hàng nào</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        orders.forEach(order => {
            const row = `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.customer_name || 'N/A'}</td>
                    <td>${order.items ? order.items.length + ' sản phẩm' : 'N/A'}</td>
                    <td>${(order.total || 0).toLocaleString()}₫</td>
                    <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                    <td>${new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="viewOrder('${order.id}')">Xem</button>
                        <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${order.id}', 'completed')">Hoàn thành</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Lỗi tải đơn hàng</td></tr>';
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await OrdersAPI.update(orderId, { status: newStatus });
        showNotification('Cập nhật trạng thái thành công!', 'success');
        await loadOrders();
    } catch (error) {
        console.error('Error updating order:', error);
    }
}
```

### Step 4: Update loadInventory Function

Find `loadInventory()` function (around line 977) and replace with:

```javascript
// Inventory Management
async function loadInventory() {
    const container = document.getElementById('inventory-list');
    container.innerHTML = '<p style="text-align: center;">Đang tải...</p>';

    try {
        const products = await ProductsAPI.getAll();

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center;">Chưa có sản phẩm nào. Hãy thêm sản phẩm từ inventory-data.js vào database!</p>';
            return;
        }

        container.innerHTML = '';

        // Group by category
        const categories = {};
        products.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });

        // Sort and display
        Object.keys(categories).sort().forEach(categoryName => {
            const categoryHeader = document.createElement('div');
            categoryHeader.style.cssText = `
                background: var(--primary-blue, #4a90a4);
                color: white;
                padding: 12px 20px;
                margin: 20px 0 10px 0;
                border-radius: 8px;
                font-weight: bold;
                font-size: 1.1rem;
            `;
            categoryHeader.innerHTML = `
                <i class="fas fa-${getCategoryIcon(categoryName)}"></i> 
                ${categoryName} (${categories[categoryName].length} sản phẩm)
            `;
            container.appendChild(categoryHeader);

            categories[categoryName].forEach(item => {
                const div = document.createElement('div');
                div.className = 'inventory-item';
                div.style.marginLeft = '20px';
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"60\\" height=\\"60\\"><rect width=\\"60\\" height=\\"60\\" fill=\\"%23ddd\\"/><text x=\\"50%\\" y=\\"50%\\" text-anchor=\\"middle\\" dy=\\".3em\\" fill=\\"%23999\\">No Image</text></svg>'">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${(item.price || 0).toLocaleString()}₫ - ID: ${item.id}</div>
                    </div>
                    <div class="quantity-control">
                        <span>Tồn kho:</span>
                        <input type="number" class="quantity-input" value="${item.stock || 0}" 
                               onchange="updateStock('${item.id}', this.value)" min="0">
                        ${(item.stock || 0) === 0 ? '<span style="color: var(--danger, #f44336)">Hết hàng</span>' : ''}
                    </div>
                    <div style="display: flex; gap: 5px; margin-left: 10px;">
                        <button class="btn btn-sm btn-primary" onclick="editProduct('${item.id}')" title="Sửa sản phẩm">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct('${item.id}')" title="Xóa sản phẩm">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                container.appendChild(div);
            });
        });
    } catch (error) {
        container.innerHTML = '<p style="text-align: center; color: red;">Lỗi tải inventory</p>';
        console.error('Error loading inventory:', error);
    }
}

async function updateStock(itemId, newStock) {
    try {
        await ProductsAPI.updateStock(itemId, newStock);
        showNotification('Cập nhật tồn kho thành công!', 'success');
        await loadInventory();
        await loadDashboard();
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}
```

### Step 5: Update loadCustomers Function

Find `loadCustomers()` function and replace with:

```javascript
// Customers Management
async function loadCustomers() {
    const tbody = document.getElementById('customers-table-body');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Đang tải...</td></tr>';

    try {
        const customers = await CustomersAPI.getAll();

        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chưa có khách hàng nào</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        customers.forEach(customer => {
            const row = `
                <tr>
                    <td>${customer.name || 'N/A'}</td>
                    <td>${customer.phone || 'N/A'}</td>
                    <td>${customer.email || 'Không có'}</td>
                    <td>${customer.address || 'N/A'}</td>
                    <td>${customer.total_orders || 0}</td>
                    <td>${customer.last_order ? new Date(customer.last_order).toLocaleDateString('vi-VN') : 'Chưa có'}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Lỗi tải khách hàng</td></tr>';
        console.error('Error loading customers:', error);
    }
}
```

---

## Part 2: Update Website to Submit to Supabase (5 minutes)

Open `index.html` and find the `sendOrder` function (around line 3800).

**Add this code RIGHT AFTER the existing Google Sheets submission** (after line 3904):

```javascript
// Also save to Supabase database
saveToSupabase(customerInfo, orderSummary).catch(err => {
    console.error('Supabase save error:', err);
    // Don't show error to user - order already sent to Google Sheets
});
```

**Then add this new function BEFORE the `sendOrder` function:**

```javascript
// Save order to Supabase
async function saveToSupabase(customerInfo, orderSummary) {
    try {
        const orderData = {
            customerInfo: {
                name: customerInfo.name,
                phone: customerInfo.phone,
                email: customerInfo.email || '',
                address: customerInfo.address
            },
            items: prepareOrderItems(),
            total: parseInt(orderSummary.total.replace(/[^\d]/g, '')),
            notes: customerInfo.note + ' | Ngày nhận: ' + customerInfo.deliveryDate
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            throw new Error('Failed to save to database');
        }

        const result = await response.json();
        console.log('✅ Order saved to Supabase:', result.order.id);
        return result;
    } catch (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
    }
}

// Prepare order items for database
function prepareOrderItems() {
    const items = [];
    
    // Add background
    const selectedBg = document.querySelector('#background-grid .option-item.selected');
    if (selectedBg) {
        items.push({
            id: selectedBg.dataset.id || 'custom',
            name: selectedBg.querySelector('.option-name').textContent,
            type: 'background',
            price: 0
        });
    }
    
    // Add hairs
    document.querySelectorAll('#hair-options-container .option-item.selected').forEach(item => {
        items.push({
            id: item.dataset.id || 'hair',
            name: item.querySelector('.option-name').textContent,
            type: 'hair',
            price: parseInt(item.dataset.price || 25000)
        });
    });
    
    // Add hats
    document.querySelectorAll('#hat-grid .option-item.selected').forEach(item => {
        const quantity = parseInt(item.dataset.quantity || 1);
        items.push({
            id: item.dataset.id || 'hat',
            name: item.querySelector('.option-name').textContent,
            type: 'hat',
            price: parseInt(item.dataset.price || 10000),
            quantity
        });
    });
    
    // Add accessories
    document.querySelectorAll('#accessory-grid .option-item.selected').forEach(item => {
        const quantity = parseInt(item.dataset.quantity || 1);
        items.push({
            id: item.dataset.id || 'accessory',
            name: item.querySelector('.option-name').textContent,
            type: 'accessory',
            price: parseInt(item.dataset.price || 10000),
            quantity
        });
    });
    
    // Add pets
    document.querySelectorAll('#pet-grid .option-item.selected').forEach(item => {
        const quantity = parseInt(item.dataset.quantity || 1);
        items.push({
            id: item.dataset.id || 'pet',
            name: item.querySelector('.option-name').textContent,
            type: 'pet',
            price: parseInt(item.dataset.price || 15000),
            quantity
        });
    });
    
    return items;
}
```

---

## Part 3: Test Everything! (5 minutes)

### Test CMS:

1. **Deploy your changes:**
```bash
cd "/Users/nguyenthanhlam/Downloads/DEV/new web"
git add .
git commit -m "Integrate CMS and website with Supabase"
git push
```

2. **Wait for deployment** (2 minutes)

3. **Test CMS:**
   - Go to `your-domain.vercel.app/cms`
   - Login
   - Check Dashboard - should load stats
   - Check Inventory - should show products
   - Try updating stock - should save to Supabase

### Test Website:

1. **Go to** `your-domain.vercel.app`
2. **Create a test order:**
   - Select products
   - Fill customer info
   - Submit order
3. **Verify order saved:**
   - Check Supabase Table Editor → orders table
   - Check CMS → Orders tab
   - Both should show the new order!

---

## 🎯 What Happens Now

### When Customer Orders:
1. ✅ Order saves to Google Sheets (existing)
2. ✅ Order saves to Supabase (new!)
3. ✅ Customer gets confirmation
4. ✅ You see it in CMS immediately

### When You Update Inventory:
1. ✅ Changes save to Supabase
2. ✅ Website shows updated stock
3. ✅ Out-of-stock alerts trigger

---

## 🆘 Troubleshooting

### CMS shows "Lỗi tải"
- Check browser console for errors
- Verify API endpoints work: `/api/products`, `/api/orders`
- Check Supabase has data

### Orders not showing
- Add test data in Supabase Table Editor
- Check API: `your-domain.vercel.app/api/orders`
- Verify environment variables in Vercel

### Stock not updating
- Check browser console
- Test API: POST to `/api/products` with updated stock
- Verify Supabase credentials

---

## 📊 Next Steps

1. **Add Products to Supabase:**
   - Option A: Manually in Table Editor
   - Option B: Bulk insert via SQL
   - Option C: Use CMS "Add Product" button

2. **Test with Real Orders:**
   - Make test orders
   - Verify they appear in both places
   - Test status updates

3. **Monitor:**
   - Check Supabase Dashboard daily
   - Review CMS stats
   - Track inventory levels

---

## 🎉 You're Done!

Your system now:
- ✅ Saves to Supabase (primary database)
- ✅ Saves to Google Sheets (backup)
- ✅ Shows real-time data in CMS
- ✅ Tracks everything automatically

**Enjoy your professional order management system!** 🚀

