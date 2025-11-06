// /server/middleware/roleMiddleware.js

// '...roles' will be an array of allowed roles, e.g., ['Admin', 'Base Commander']
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role (from req.user) is included in the roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next(); // Role is authorized, proceed
  };
};
