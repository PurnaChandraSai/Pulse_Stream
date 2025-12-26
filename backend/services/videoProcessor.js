
const Video = require("../models/Video");

function addJob(job) {
  
  const { videoId, tenantId, io } = job;
  
  Video.findByIdAndUpdate(videoId, {
    status: "safe",
    progress: 100,
  }).then(() => {
    if (io) {
      io.to(tenantId).emit("processing:update", {
        videoId,
        progress: 100,
        status: "safe",
      });
    }
    console.log(`✅ Video ${videoId} ready (Cloudinary)`);
  }).catch(err => {
    console.error("Job error:", err);
  });
}

module.exports = { addJob };
