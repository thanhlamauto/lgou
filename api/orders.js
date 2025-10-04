const { supabase } = require('../lib/supabase.js');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getOrders(req, res);
      case 'POST':
        return await createOrder(req, res);
      case 'PUT':
        return await updateOrder(req, res);
      case 'DELETE':
        return await deleteOrder(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/orders - Get all orders or a specific order
async function getOrders(req, res) {
  const { id } = req.query;

  if (id) {
    // Get specific order
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json(data);
  }

  // Get all orders, sorted by newest first
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return res.status(200).json({ orders: data, total: data.length });
}

// POST /api/orders - Create new order
async function createOrder(req, res) {
  const orderData = req.body;

  // Validate stock availability before creating order
  const stockValidation = await validateStockAvailability(orderData.items);
  if (!stockValidation.valid) {
    return res.status(400).json({ 
      error: 'Insufficient stock', 
      details: stockValidation.errors 
    });
  }

  // Generate unique order ID
  const orderId = `LG${Date.now()}`;
  
  const order = {
    id: orderId,
    customer_name: orderData.customerInfo?.name,
    customer_phone: orderData.customerInfo?.phone,
    customer_email: orderData.customerInfo?.email,
    customer_address: orderData.customerInfo?.address,
    items: orderData.items,
    total: orderData.total,
    status: orderData.status || 'new',
    notes: orderData.notes || ''
  };

  // Insert order
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Update stock levels (decrease stock)
  await updateStockLevels(orderData.items, 'decrease');

  // Update customer info
  if (orderData.customerInfo) {
    await updateCustomerData(orderData.customerInfo, orderId);
  }

  // Update statistics
  await updateOrderStats(order);

  return res.status(201).json({ 
    success: true, 
    order: data,
    message: 'Order created successfully' 
  });
}

// PUT /api/orders - Update order
async function updateOrder(req, res) {
  const { id, ...updates } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  // Get current order to check status changes
  const { data: currentOrder } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (!currentOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Handle status changes for stock management
  if (updates.status && updates.status !== currentOrder.status) {
    await handleOrderStatusChange(currentOrder, updates.status);
  }

  const { data, error } = await supabase
    .from('orders')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Order not found' });
    }
    throw error;
  }

  return res.status(200).json({ 
    success: true, 
    order: data,
    message: 'Order updated successfully' 
  });
}

// DELETE /api/orders - Delete order
async function deleteOrder(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return res.status(200).json({ 
    success: true,
    message: 'Order deleted successfully' 
  });
}

// Helper function to update customer data
async function updateCustomerData(customerInfo, orderId) {
  const customerId = customerInfo.phone || customerInfo.email;
  
  // Check if customer exists
  const { data: existing } = await supabase
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .single();

  if (existing) {
    // Update existing customer
    const orders = existing.orders || [];
    orders.push(orderId);
    
    await supabase
      .from('customers')
      .update({
        orders,
        total_orders: orders.length,
        last_order: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId);
  } else {
    // Create new customer
    await supabase
      .from('customers')
      .insert([{
        id: customerId,
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address,
        orders: [orderId],
        total_orders: 1,
        first_order: new Date().toISOString(),
        last_order: new Date().toISOString()
      }]);
  }
}

// Helper function to validate stock availability
async function validateStockAvailability(items) {
  const errors = [];
  
  for (const item of items) {
    if (item.type === 'clothing') continue; // Clothing doesn't have stock
    
    const { data: product } = await supabase
      .from('products')
      .select('stock, name')
      .eq('id', item.id)
      .single();
    
    if (!product) {
      errors.push(`Product ${item.id} not found`);
      continue;
    }
    
    const requestedQuantity = item.quantity || 1;
    if (product.stock < requestedQuantity) {
      errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${requestedQuantity}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Helper function to update stock levels
async function updateStockLevels(items, action) {
  for (const item of items) {
    if (item.type === 'clothing') continue; // Clothing doesn't have stock
    
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.id)
      .single();
    
    if (!product) continue;
    
    const quantity = item.quantity || 1;
    const newStock = action === 'decrease' 
      ? product.stock - quantity 
      : product.stock + quantity;
    
    // Ensure stock doesn't go below 0
    const finalStock = Math.max(0, newStock);
    
    await supabase
      .from('products')
      .update({ 
        stock: finalStock,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id);
  }
}

// Helper function to handle order status changes
async function handleOrderStatusChange(currentOrder, newStatus) {
  // If order is being cancelled or refunded, restore stock
  if (newStatus === 'cancelled' || newStatus === 'refunded') {
    await updateStockLevels(currentOrder.items, 'increase');
  }
  
  // If order was cancelled/refunded and is now being reactivated, decrease stock again
  if ((currentOrder.status === 'cancelled' || currentOrder.status === 'refunded') && 
      (newStatus === 'new' || newStatus === 'processing' || newStatus === 'completed')) {
    await updateStockLevels(currentOrder.items, 'decrease');
  }
}

// Helper function to update order statistics
async function updateOrderStats(order) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get or create today's stats
  const { data: existing } = await supabase
    .from('daily_stats')
    .select('*')
    .eq('date', today)
    .single();

  if (existing) {
    await supabase
      .from('daily_stats')
      .update({
        orders: existing.orders + 1,
        revenue: existing.revenue + (order.total || 0)
      })
      .eq('date', today);
  } else {
    await supabase
      .from('daily_stats')
      .insert([{
        date: today,
        orders: 1,
        revenue: order.total || 0
      }]);
  }
}
