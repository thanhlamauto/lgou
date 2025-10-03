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
        return await getProducts(req, res);
      case 'POST':
        return await createProduct(req, res);
      case 'PUT':
        return await updateProduct(req, res);
      case 'DELETE':
        return await deleteProduct(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// GET /api/products
async function getProducts(req, res) {
  const { id, category, collection_id } = req.query;

  if (id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(data);
  }

  let query = supabase.from('products').select('*');
  
  if (category) {
    query = query.eq('category', category);
  }

  if (collection_id) {
    // Support both old single collection_id and new collection_ids array
    query = query.or(`collection_id.eq.${collection_id},collection_ids.cs.{${collection_id}}`);
  }

  const { data, error } = await query.order('category').order('name');

  if (error) throw error;

  return res.status(200).json({ products: data, total: data.length });
}

// POST /api/products
async function createProduct(req, res) {
  const productData = req.body;

  if (!productData.id || !productData.name) {
    return res.status(400).json({ error: 'Product ID and name are required' });
  }

  const product = {
    ...productData,
    stock: productData.stock ?? 5,
    price: productData.price ?? 0
  };

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Product ID already exists' });
    }
    throw error;
  }

  return res.status(201).json({ 
    success: true, 
    product: data,
    message: 'Product created successfully' 
  });
}

// PUT /api/products
async function updateProduct(req, res) {
  const { id, ...updates } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Product not found' });
    }
    throw error;
  }

  return res.status(200).json({ 
    success: true, 
    product: data,
    message: 'Product updated successfully' 
  });
}

// DELETE /api/products
async function deleteProduct(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return res.status(200).json({ 
    success: true,
    message: 'Product deleted successfully' 
  });
}
