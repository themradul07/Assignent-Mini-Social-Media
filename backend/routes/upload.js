// Uploads image to Cloudinary using multer and cloudinary SDK
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

          
cloudinary.config({ 
    cloud_name:"ddyjj570n",
    api_key: "955836172498119",
    api_secret: process.env.CLOUD_API_SECRET,
});

const upload = multer(); // memory storage

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if(!req.file) return res.status(400).json({ msg:'No file' });
    const buffer = req.file.buffer;
    const uploadStream = cloudinary.uploader.upload_stream({ folder: '3w-mini-social' }, (error, result) => {
      if(error) return res.status(500).json({ msg: error.message });
      res.json({ url: result.secure_url, public_id: result.public_id });
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  } catch(err){ res.status(500).json({ msg: err.message }); }
});

module.exports = router;
