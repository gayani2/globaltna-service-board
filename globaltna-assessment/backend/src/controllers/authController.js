const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Generate a signed JWT for a given user id.
 * The secret and expiry come from environment variables.
 */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

/**
 * POST /api/auth/register
 * Create a new user account and return a JWT immediately
 * so the user is logged in straight after registering.
 *
 * Body: { name, email, password }
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error("An account with that email already exists");
      err.statusCode = 409; // Conflict
      return next(err);
    }

    // Create user — password is hashed by the pre-save hook on the model
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      const error = new Error(messages.join(", "));
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Verify credentials and return a JWT.
 *
 * Body: { email, password }
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    // Explicitly select password because the schema sets select: false
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      // Return the same message for both cases — avoids leaking
      // whether an email exists in the system (security best practice)
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      return next(err);
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Return the currently logged-in user's profile.
 * Protected — requires the authenticate middleware.
 */
const getMe = async (req, res) => {
  // req.user is set by the authenticate middleware
  res.status(200).json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};

module.exports = { register, login, getMe };
