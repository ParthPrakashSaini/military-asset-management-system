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

// --- CORS Configuration ---
const whitelist = [
  "http://localhost:5173", // Your local dev
  "https://mams-system.vercel.app", // Your live Vercel app
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

// --- Core Middleware ---

// Enable Cross-Origin Resource Sharing (CORS)
// This allows your React frontend to make requests to this backend
app.use(cors(corsOptions));

// Body Parsers
// Allow the server to accept JSON data in request bodies
app.use(express.json());
// Allow the server to accept URL-encoded data
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
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
