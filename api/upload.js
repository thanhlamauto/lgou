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

    // Parse multipart form data using busboy
    console.log('📤 Parsing form data...');
    
    // Use busboy for multipart parsing in Vercel
    const Busboy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    
    const busboy = new Busboy({ headers: req.headers });
    let fileBuffer = null;
    let fileName = null;
    let fileType = null;
    
    return new Promise((resolve, reject) => {
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        console.log('📁 File received:', { fieldname, filename, mimetype });
        
        const chunks = [];
        file.on('data', (data) => {
          chunks.push(data);
        });
        
        file.on('end', () => {
          fileBuffer = Buffer.concat(chunks);
          fileName = filename;
          fileType = mimetype;
        });
      });
      
      busboy.on('finish', async () => {
        try {
          if (!fileBuffer) {
            console.error('❌ No file provided');
            return res.status(400).json({ error: 'No file provided' });
          }

          console.log('📁 File details:', {
            name: fileName,
            size: fileBuffer.length,
            type: fileType
          });

          // Convert file to buffer
          const filename = `products/${Date.now()}-${fileName}`;
          
          console.log('📤 Uploading to Vercel Blob:', filename);

          // Upload file to Vercel Blob
          const blob = await put(filename, fileBuffer, {
            access: 'public',
            contentType: fileType,
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
      });
      
      req.pipe(busboy);
    });
}
