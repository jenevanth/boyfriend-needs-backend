import ImageKit from 'imagekit';

export default async function handler(req, res) {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  let totalBytes = 0;
  let skip = 0;
  let limit = 1000;
  let more = true;

  try {
    while (more) {
      const result = await imagekit.listFiles({ skip, limit });
      for (const file of result) {
        totalBytes += file.size || 0;
      }
      if (result.length < limit) {
        more = false;
      } else {
        skip += limit;
      }
    }
    res.status(200).json({
      totalBytes,
      totalMB: totalBytes / (1024 * 1024),
      totalGB: totalBytes / (1024 * 1024 * 1024),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
