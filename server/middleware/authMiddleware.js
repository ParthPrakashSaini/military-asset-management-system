// /server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for the authorization header and if it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID (payload)
      // We select '-password_hash' to exclude the password from the req.user object
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password_hash"] },
      });

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Move to the next middleware or controller
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
