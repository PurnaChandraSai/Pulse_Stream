const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'videohub',
      resource_type: 'video',
      public_id: `video-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      original_filename: file.originalname,
    };
  },
});

const upload = require('multer')({
  storage,
  limits: { 
    fileSize: 200 * 1024 * 1024,
    fieldSize: 200 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files allowed"), false);
    }
    cb(null, true);
  },
});

module.exports = { upload, cloudinary };
