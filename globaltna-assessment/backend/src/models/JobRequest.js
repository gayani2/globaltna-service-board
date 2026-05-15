const mongoose = require("mongoose");

/**
 * JobRequest Schema
 * Represents a homeowner's service request on the board.
 */
const jobRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ["Plumbing", "Electrical", "Painting", "Joinery", "Other"],
        message: "{VALUE} is not a valid category",
      },
      default: "Other",
    },
    location: {
      type: String,
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      // Simple email format validation via regex
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    status: {
      type: String,
      enum: {
        values: ["Open", "In Progress", "Closed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Open",
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

module.exports = mongoose.model("JobRequest", jobRequestSchema);
