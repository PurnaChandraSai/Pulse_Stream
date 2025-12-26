const { spawn } = require("child_process");

// Use double backslashes or forward slashes
const ffmpegPath = "C:/Users/purna/Downloads/ffmpeg-8.0.1-essentials_build/ffmpeg-8.0.1-essentials_build/bin/ffmpeg.exe";

const ff = spawn(ffmpegPath, ["-version"]);

ff.stdout.on("data", (data) => console.log(data.toString()));
ff.stderr.on("data", (data) => console.log(data.toString()));
ff.on("close", (code) => console.log("Process closed with code", code));
ff.on("error", (err) => console.error("Failed to start FFmpeg:", err));
