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

    // Simple approach: accept base64 data instead of multipart
    console.log('📤 Parsing request body...');
    
    const body = await req.text();
    const data = JSON.parse(body);
    
    if (!data.file || !data.filename || !data.type) {
      console.error('❌ Missing file data');
      return res.status(400).json({ error: 'Missing file data' });
    }

    console.log('📁 File details:', {
      name: data.filename,
      size: data.file.length,
      type: data.type
    });

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(data.file, 'base64');
    const filename = `products/${Date.now()}-${data.filename}`;
    
    console.log('📤 Uploading to Vercel Blob:', filename);

    // Upload file to Vercel Blob
    const blob = await put(filename, fileBuffer, {
      access: 'public',
      contentType: data.type,
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
