const fs = require('fs');
const path = require('path');

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
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Read the success.html file
    const successHtmlPath = path.join(process.cwd(), 'success.html');
    
    if (!fs.existsSync(successHtmlPath)) {
      return res.status(404).json({ error: 'Success page not found' });
    }

    const successHtml = fs.readFileSync(successHtmlPath, 'utf8');
    
    // Set content type to HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    
    // Return the HTML content
    return res.status(200).send(successHtml);

  } catch (error) {
    console.error('Success page error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
