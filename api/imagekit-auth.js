const crypto = require('crypto');

// This is the function Vercel will run when a request comes in.
export default function handler(request, response) {
  // Allow requests from any origin (CORS)
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // Handle pre-flight requests for CORS
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!IMAGEKIT_PRIVATE_KEY) {
    return response
      .status(500)
      .json({ error: 'Server is not configured with a private key.' });
  }

  const token = crypto.randomBytes(16).toString('hex');
  const expire = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now
  const signature = crypto
    .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest('hex');

  // Send the response
  response.status(200).json({ token, expire, signature });
}
