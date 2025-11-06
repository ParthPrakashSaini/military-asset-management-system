// /server/server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const baseRoutes = require("./routes/baseRoutes");
const assetRoutes = require("./routes/assetRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const transferRoutes = require("./routes/transferRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Load env vars
dotenv.config();

// Initialize database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// --- 🔒 CORRECTED CORS Configuration ---
const whitelist = [
  "http://localhost:5173", // Your local dev
  "https://mams-system.vercel.app", // Your live Vercel app (NO trailing slash)
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// This ONE line handles all CORS requests (including preflight 'OPTIONS')
app.use(cors(corsOptions));
// --- End CORS ---

// --- Core Middleware ---
// Body Parsers (MUST come AFTER CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
// (MUST come AFTER CORS and body parsers)
app.use("/api/auth", authRoutes);
app.use("/api/bases", baseRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/dashboard", dashboardRoutes); // Main dashboard route

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the MAMS API" });
});

// --- Start Server ---
app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

  try {
    // This creates tables if they don't exist, without dropping data
    await sequelize.sync({ force: false });
    console.log("Database synced (tables created if not exist).");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
});
