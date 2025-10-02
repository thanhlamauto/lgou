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
        return await getCollections(req, res);
      case 'POST':
        return await createCollection(req, res);
      case 'PUT':
        return await updateCollection(req, res);
      case 'DELETE':
        return await deleteCollection(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Collections API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function getCollections(req, res) {
  const { id, status } = req.query;

  if (id) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Update status based on end date
    const isActive = new Date() < new Date(data.end_date);
    data.status = isActive ? 'active' : 'expired';
    
    return res.status(200).json(data);
  }

  let query = supabase.from('collections').select('*');
  
  if (status) {
    // Filter by date for status
    if (status === 'active') {
      query = query.gte('end_date', new Date().toISOString());
    } else if (status === 'expired') {
      query = query.lt('end_date', new Date().toISOString());
    }
  }

  const { data, error } = await query.order('end_date', { ascending: false });

  if (error) throw error;

  // Update status for each collection
  const collections = data.map(col => ({
    ...col,
    status: new Date() < new Date(col.end_date) ? 'active' : 'expired'
  }));

  return res.status(200).json({ collections, total: collections.length });
}

async function createCollection(req, res) {
  const collectionData = req.body;

  if (!collectionData.name) {
    return res.status(400).json({ error: 'Collection name is required' });
  }

  const collectionId = collectionData.id || `collection_${Date.now()}`;

  const collection = {
    id: collectionId,
    name: collectionData.name,
    description: collectionData.description || '',
    end_date: collectionData.endDate || collectionData.end_date,
    discount: collectionData.discount || 0,
    icon: collectionData.icon || 'fas fa-star',
    features: collectionData.features || [],
    limited_products: collectionData.limitedProducts || collectionData.limited_products || [],
    status: collectionData.status || 'active'
  };

  const { data, error } = await supabase
    .from('collections')
    .insert([collection])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Collection ID already exists' });
    }
    throw error;
  }

  return res.status(201).json({ 
    success: true, 
    collection: data,
    message: 'Collection created successfully' 
  });
}

async function updateCollection(req, res) {
  const { id, ...updates } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Collection ID is required' });
  }

  const { data, error } = await supabase
    .from('collections')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Collection not found' });
    }
    throw error;
  }

  return res.status(200).json({ 
    success: true, 
    collection: data,
    message: 'Collection updated successfully' 
  });
}

async function deleteCollection(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Collection ID is required' });
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) throw error;

  return res.status(200).json({ 
    success: true,
    message: 'Collection deleted successfully' 
  });
}
