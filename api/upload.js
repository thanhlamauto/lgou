const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Chỉ cho phép POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔄 Upload request received');
    
    // Check if BLOB_READ_WRITE_TOKEN is available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('❌ BLOB_READ_WRITE_TOKEN not found');
      return res.status(500).json({ 
        error: 'Blob storage not configured',
        details: 'BLOB_READ_WRITE_TOKEN environment variable is missing'
      });
    }

    // Parse multipart form data
    console.log('📤 Parsing form data...');
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.error('❌ No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }

    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const filename = `products/${Date.now()}-${file.name}`;
    
    console.log('📤 Uploading to Vercel Blob:', filename);

    // Upload file to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type,
    });

    console.log('✅ Upload successful:', blob.url);

    return res.status(200).json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error.message,
      stack: error.stack
    });
  }
}
