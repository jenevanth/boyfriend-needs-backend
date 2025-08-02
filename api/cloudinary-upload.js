import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    console.log('Received body:', req.body); // Log the incoming body
    const { fileBase64 } = req.body;
    if (!fileBase64) {
      console.error('No fileBase64 found in request body');
      return res
        .status(400)
        .json({ error: 'No fileBase64 found in request body' });
    }
    const result = await cloudinary.v2.uploader.upload(fileBase64, {
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
