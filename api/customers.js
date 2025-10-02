const { supabase } = require('../lib/supabase.js');

module.exports = async function handler(req, res) {
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
        return await getCustomers(req, res);
      case 'POST':
        return await createCustomer(req, res);
      case 'PUT':
        return await updateCustomer(req, res);
      case 'DELETE':
        return await deleteCustomer(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Customers API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getCustomers(req, res) {
  const { id } = req.query;

  if (id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    return res.status(200).json(data);
  }

  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('last_order', { ascending: false, nullsFirst: false });

  if (error) throw error;

  return res.status(200).json({ customers: data, total: data.length });
}

async function createCustomer(req, res) {
  const customerData = req.body;

  if (!customerData.phone && !customerData.email) {
    return res.status(400).json({ error: 'Phone or email is required' });
  }

  const customerId = customerData.phone || customerData.email;

  const customer = {
    id: customerId,
    ...customerData,
    orders: [],
    total_orders: 0
  };

  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Customer already exists' });
    }
    throw error;
  }

  return res.status(201).json({ 
    success: true, 
    customer: data,
    message: 'Customer created successfully' 
  });
}

async function updateCustomer(req, res) {
  const { id, ...updates } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  const { data, error } = await supabase
    .from('customers')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Customer not found' });
    }
    throw error;
  }

  return res.status(200).json({ 
    success: true, 
    customer: data,
    message: 'Customer updated successfully' 
  });
}

async function deleteCustomer(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Customer ID is required' });
  }

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return res.status(200).json({ 
    success: true,
    message: 'Customer deleted successfully' 
  });
}
