const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

/* ---------------- IMPORTS ---------------- */
const connectDB = require("./db");
const authRoutes = require("./routes/auth.routes");
const videoRoutes = require("./routes/video.routes");
const { addJob } = require("./services/videoprocessor");

/* ---------------- APP SETUP ---------------- */
const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

const server = http.createServer(app);

/* ---------------- SOCKET.IO SETUP ---------------- */
const io = new Server(server, {
  cors: { origin: "*" },
});

app.locals.io = io;
app.locals.addJob = addJob;

/* ---------------- SOCKET EVENTS ---------------- */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinTenant", (userId) => {
    socket.join(userId);
    console.log("User joined room:", userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* ---------------- ROUTES ---------------- */
app.get("/", (req, res) => {
  res.json({ message: "Backend running ✅ CORS OPEN" });
});

app.use("/auth", authRoutes);
app.use("/videos", videoRoutes);

/* ---------------- START SERVER ---------------- */
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
})();
