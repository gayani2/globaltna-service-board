const express = require("express");
const router  = express.Router();
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");
const { authenticate } = require("../middleware/authenticate");

/**
 * Public routes — anyone can browse jobs
 *   GET  /api/jobs       list all (with optional filters)
 *   GET  /api/jobs/:id   single job
 *
 * Protected routes — must be logged in
 *   POST   /api/jobs       create (authenticate required)
 *   PATCH  /api/jobs/:id   update status (authenticate required)
 *   DELETE /api/jobs/:id   delete (authenticate required)
 */
router.route("/")
  .get(getAllJobs)
  .post(authenticate, createJob);

router.route("/:id")
  .get(getJobById)
  .patch(authenticate, updateJobStatus)
  .delete(authenticate, deleteJob);

module.exports = router;
