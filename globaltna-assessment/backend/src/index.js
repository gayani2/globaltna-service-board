require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const mongoose = require("mongoose");

const jobRoutes  = require("./routes/jobs");
const authRoutes = require("./routes/auth");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);   // register, login, me
app.use("/api/jobs", jobRoutes);    // CRUD for job requests

// Health check
app.get("/", (req, res) => res.json({ message: "GlobalTNA API is running 🚀" }));

// ── Error Handling ──────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Database + Server ───────────────────────────────────────
const startServer = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");
  const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
  return server;
};

// Only start the server when this file is run directly (not when imported by tests)
if (require.main === module) {
  startServer().catch((err) => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  });
}

// Export app and startServer so Jest can import them without auto-starting
module.exports = { app, startServer };
