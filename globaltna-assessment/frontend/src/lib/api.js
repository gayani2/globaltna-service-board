/**
 * api.js — Centralised API client
 *
 * All communication with the Express backend goes through these functions.
 * Protected routes automatically attach the JWT from localStorage.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** Read JWT from localStorage (client-side only) */
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

/** Build headers, adding Authorization if a token exists */
const authHeaders = (extra = {}) => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
};

// ── Public ──────────────────────────────────────────────────

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.status)   params.append("status",   filters.status);
  if (filters.search)   params.append("search",   filters.search);

  const query = params.toString() ? `?${params.toString()}` : "";
  const res   = await fetch(`${BASE_URL}/api/jobs${query}`, { cache: "no-store" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to fetch jobs"); }
  const data  = await res.json();
  return data.data;
}

export async function getJob(id) {
  const res  = await fetch(`${BASE_URL}/api/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Job not found"); }
  const data = await res.json();
  return data.data;
}

// ── Protected ───────────────────────────────────────────────

export async function createJob(jobData) {
  const res = await fetch(`${BASE_URL}/api/jobs`, {
    method:  "POST",
    headers: authHeaders(),
    body:    JSON.stringify(jobData),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to create job"); }
  const data = await res.json();
  return data.data;
}

export async function updateJobStatus(id, status) {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
    method:  "PATCH",
    headers: authHeaders(),
    body:    JSON.stringify({ status }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to update status"); }
  const data = await res.json();
  return data.data;
}

export async function deleteJob(id) {
  const res = await fetch(`${BASE_URL}/api/jobs/${id}`, {
    method:  "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error || "Failed to delete job"); }
  return true;
}
