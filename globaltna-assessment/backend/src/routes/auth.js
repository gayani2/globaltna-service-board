const express = require("express");
const router  = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const { authenticate } = require("../middleware/authenticate");

// POST /api/auth/register  → create account + return token
router.post("/register", register);

// POST /api/auth/login     → verify credentials + return token
router.post("/login", login);

// GET  /api/auth/me        → get current user (protected)
router.get("/me", authenticate, getMe);

module.exports = router;
