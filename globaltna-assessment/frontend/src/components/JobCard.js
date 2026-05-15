import Link from "next/link";
import StatusBadge from "./StatusBadge";

/**
 * JobCard
 * Displays a summary of a single job request.
 * Clicking the card navigates to the job detail page.
 */
export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h2 className="font-semibold text-gray-900 text-base leading-snug">{job.title}</h2>
          <StatusBadge status={job.status} />
        </div>

        {/* Description preview */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job.description}</p>

        {/* Metadata row */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          {job.category && (
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
              {job.category}
            </span>
          )}
          {job.location && <span>📍 {job.location}</span>}
          <span>🕐 {new Date(job.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      </div>
    </Link>
  );
}
