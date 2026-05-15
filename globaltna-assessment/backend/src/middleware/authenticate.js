const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/**
 * authenticate middleware
 *
 * Extracts the JWT from the Authorization header, verifies it,
 * looks up the user, and attaches them to req.user.
 *
 * Expected header format:
 *   Authorization: Bearer <token>
 *
 * Apply this middleware to any route that requires a logged-in user.
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Pull the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("Not authorised — no token provided");
      err.statusCode = 401;
      return next(err);
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify the signature and expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      const err = new Error(
        jwtErr.name === "TokenExpiredError"
          ? "Session expired — please log in again"
          : "Invalid token — please log in again"
      );
      err.statusCode = 401;
      return next(err);
    }

    // 3. Check the user still exists in the DB
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error("User belonging to this token no longer exists");
      err.statusCode = 401;
      return next(err);
    }

    // 4. Attach user to the request so downstream handlers can use it
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };
