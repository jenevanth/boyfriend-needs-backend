const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());

const IMAGEKIT_PRIVATE_KEY = 'private_G5D4aSwr3Y48Yhn6c/p7bFBNkNY=';

app.get('/imagekit-auth', (req, res) => {
  const token = crypto.randomBytes(16).toString('hex');
  const expire = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now
  const signature = crypto
    .createHmac('sha1', IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest('hex');
  res.json({ token, expire, signature });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`ImageKit auth server running on port ${PORT}`);
});
