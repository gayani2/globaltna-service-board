"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getJob, updateJobStatus, deleteJob } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import StatusBadge from "../../../components/StatusBadge";
import Link from "next/link";

const STATUSES = ["Open", "In Progress", "Closed"];

/**
 * Job Detail Page — Screen 3
 * Full details of a single job.
 * Status update and delete are shown only to logged-in users.
 */
export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  const [job,       setJob]       = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [status,    setStatus]    = useState("");
  const [updating,  setUpdating]  = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJob(id);
        setJob(data);
        setStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    setStatusMsg(null);
    try {
      const updated = await updateJobStatus(id, status);
      setJob(updated);
      setStatusMsg("Status updated successfully.");
    } catch (err) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    setDeleting(true);
    try {
      await deleteJob(id);
      router.push("/");
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-400">Loading...</div>;
  if (error)   return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
      ⚠️ {error}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => router.push("/")}
        className="text-sm text-blue-600 hover:underline mb-5 flex items-center gap-1">
        ← Back to all requests
      </button>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{job.title}</h1>
          <StatusBadge status={job.status} />
        </div>

        <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-500">
          {job.category && (
            <span className="bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded font-medium text-xs">{job.category}</span>
          )}
          {job.location && <span>📍 {job.location}</span>}
          <span>🕐 Posted {new Date(job.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {(job.contactName || job.contactEmail) && (
          <div className="mb-6 border-t border-gray-100 pt-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Contact</h2>
            <div className="text-sm text-gray-600 space-y-1">
              {job.contactName  && <p>👤 {job.contactName}</p>}
              {job.contactEmail && (
                <p>✉️ <a href={`mailto:${job.contactEmail}`} className="text-blue-600 hover:underline">{job.contactEmail}</a></p>
              )}
            </div>
          </div>
        )}

        {/* ── Only show management controls to logged-in users ── */}
        {user ? (
          <>
            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Update Status</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <button onClick={handleStatusUpdate} disabled={updating || status === job.status}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  {updating ? "Saving..." : "Save Status"}
                </button>
                {statusMsg && (
                  <span className={`text-xs ${statusMsg.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
                    {statusMsg}
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100 mt-5 pt-5">
              <button onClick={handleDelete} disabled={deleting}
                className="bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 border border-red-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {deleting ? "Deleting..." : "🗑 Delete Request"}
              </button>
              <p className="text-xs text-gray-400 mt-1">This action is permanent and cannot be undone.</p>
            </div>
          </>
        ) : (
          <div className="border-t border-gray-100 pt-5 text-sm text-gray-500">
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link> to update or delete this request.
          </div>
        )}
      </div>
    </div>
  );
}
