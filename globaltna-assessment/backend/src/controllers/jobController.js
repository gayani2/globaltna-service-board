const JobRequest = require("../models/JobRequest");

/**
 * GET /api/jobs
 * List all jobs. Supports optional query filters:
 *   ?category=Plumbing
 *   ?status=Open
 *   ?search=leaking  (bonus: keyword search in title + description)
 */
const getAllJobs = async (req, res, next) => {
  try {
    const filter = {};

    // Optional category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Optional status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Bonus: keyword search across title and description
    if (req.query.search) {
      const keyword = req.query.search.trim();
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/jobs/:id
 * Fetch a single job by its MongoDB ObjectId.
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      // Use a custom error with status so our global handler catches it
      const error = new Error(`Job not found with id: ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    // Handle invalid ObjectId format (CastError)
    if (err.name === "CastError") {
      const error = new Error(`Invalid job id: ${req.params.id}`);
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

/**
 * POST /api/jobs
 * Create a new job request.
 * Validates required fields via Mongoose schema.
 */
const createJob = async (req, res, next) => {
  try {
    const job = await JobRequest.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    // Mongoose validation errors → 400 Bad Request
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
 * PATCH /api/jobs/:id
 * Update the status of a job only.
 * Accepted values: "Open" | "In Progress" | "Closed"
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      const error = new Error('Request body must include a "status" field');
      error.statusCode = 400;
      return next(error);
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,          // return the updated document
        runValidators: true, // run schema validators on update
      }
    );

    if (!job) {
      const error = new Error(`Job not found with id: ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, data: job });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      const error = new Error(messages.join(", "));
      error.statusCode = 400;
      return next(error);
    }
    if (err.name === "CastError") {
      const error = new Error(`Invalid job id: ${req.params.id}`);
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

/**
 * DELETE /api/jobs/:id
 * Permanently delete a job request.
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      const error = new Error(`Job not found with id: ${req.params.id}`);
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (err) {
    if (err.name === "CastError") {
      const error = new Error(`Invalid job id: ${req.params.id}`);
      error.statusCode = 400;
      return next(error);
    }
    next(err);
  }
};

module.exports = { getAllJobs, getJobById, createJob, updateJobStatus, deleteJob };
