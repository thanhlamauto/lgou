const { createClient } = require('../lib/supabase');

// Get all colors
async function getColors(req, res) {
    try {
        const { category } = req.query;
        const supabase = createClient();
        
        let query = supabase
            .from('colors')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });
            
        if (category) {
            query = query.eq('category', category);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching colors:', error);
            return res.status(500).json({ error: 'Failed to fetch colors' });
        }
        
        res.json(data || []);
    } catch (error) {
        console.error('Error in getColors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Create new color
async function createColor(req, res) {
    try {
        const { name, hex_code, category, quantity = 0 } = req.body;
        
        if (!name || !hex_code || !category) {
            return res.status(400).json({ error: 'Name, hex_code, and category are required' });
        }
        
        if (!['shirt', 'trouser'].includes(category)) {
            return res.status(400).json({ error: 'Category must be either "shirt" or "trouser"' });
        }
        
        const supabase = createClient();
        
        // Generate unique ID
        const id = `${category}_${Date.now()}`;
        
        const { data, error } = await supabase
            .from('colors')
            .insert({
                id,
                name,
                hex_code,
                category,
                quantity: parseInt(quantity) || 0,
                is_active: true
            })
            .select()
            .single();
            
        if (error) {
            console.error('Error creating color:', error);
            return res.status(500).json({ error: 'Failed to create color' });
        }
        
        res.json(data);
    } catch (error) {
        console.error('Error in createColor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Update color
async function updateColor(req, res) {
    try {
        const { id } = req.params;
        const { name, hex_code, category, quantity, is_active } = req.body;
        
        const supabase = createClient();
        
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (hex_code !== undefined) updateData.hex_code = hex_code;
        if (category !== undefined) updateData.category = category;
        if (quantity !== undefined) updateData.quantity = parseInt(quantity) || 0;
        if (is_active !== undefined) updateData.is_active = is_active;
        
        const { data, error } = await supabase
            .from('colors')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
            
        if (error) {
            console.error('Error updating color:', error);
            return res.status(500).json({ error: 'Failed to update color' });
        }
        
        if (!data) {
            return res.status(404).json({ error: 'Color not found' });
        }
        
        res.json(data);
    } catch (error) {
        console.error('Error in updateColor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete color
async function deleteColor(req, res) {
    try {
        const { id } = req.params;
        const supabase = createClient();
        
        const { error } = await supabase
            .from('colors')
            .delete()
            .eq('id', id);
            
        if (error) {
            console.error('Error deleting color:', error);
            return res.status(500).json({ error: 'Failed to delete color' });
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error in deleteColor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Parse URL to get ID for PUT/DELETE operations
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathParts = url.pathname.split('/');
        const id = pathParts[pathParts.length - 1];
        
        if (id && id !== 'colors') {
            req.params = { id };
        }

        switch (req.method) {
            case 'GET':
                await getColors(req, res);
                break;
            case 'POST':
                await createColor(req, res);
                break;
            case 'PUT':
                if (!id || id === 'colors') {
                    return res.status(400).json({ error: 'Color ID is required for update' });
                }
                await updateColor(req, res);
                break;
            case 'DELETE':
                if (!id || id === 'colors') {
                    return res.status(400).json({ error: 'Color ID is required for deletion' });
                }
                await deleteColor(req, res);
                break;
            default:
                res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};