const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

/**
 * User Schema
 * Stores registered users. Passwords are hashed before saving —
 * the plain-text password never touches the database.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:     String,
      required: [true, "Email is required"],
      unique:   true,          // one account per email
      lowercase: true,
      trim:     true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select:    false,        // never return password in queries by default
    },
  },
  { timestamps: true }
);

// ── Pre-save hook: hash password before storing ─────────────
userSchema.pre("save", async function (next) {
  // Only re-hash if the password field was actually changed
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare a candidate password ──────────
userSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
