const express = require("express");
const Video = require("../models/Video");
const { upload } = require("../middleware/cloudinary");
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { cloudinary } = require("../middleware/cloudinary");

const router = express.Router();

router.post(
  "/upload",
  auth,
  role(["editor", "admin"]),
  upload.single("video"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const playableUrl = cloudinary.url(req.file.filename, {
        resource_type: "video",
        transformation: [
          { quality: "auto:good" },
          { fetch_format: "auto" },
          { dpr: "auto" }
        ],
        secure: true
      });

      const video = await Video.create({
        owner: req.user.userId,
        filename: req.file.originalname,
        cloudinaryUrl: playableUrl,
        cloudinaryPublicId: req.file.filename,
        status: "safe",
        progress: 100
      });

      const io = req.app.locals.io;
      req.app.locals.addJob({
        videoId: video._id.toString(),
        tenantId: req.user.userId,
        io
      });

      res.json({ videoId: video._id });
    } catch (err) {
      res.status(500).json({ message: err.message || "Upload failed" });
    }
  }
);

router.get("/", auth, async (req, res) => {
  try {
    const videos = await Video.find({ owner: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-originalPath");

    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

router.get("/:id/url", auth, async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ url: video.cloudinaryUrl });
  } catch (err) {
    res.status(500).json({ message: "Failed to get video URL" });
  }
});

module.exports = router;
