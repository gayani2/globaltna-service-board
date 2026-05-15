"use client";

import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import { getJobs } from "../lib/api";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "Other"];
const STATUSES   = ["All", "Open", "In Progress", "Closed"];

/**
 * Home Page — Screen 1
 * Shows all job requests as cards.
 * Users can filter by category, status, and search by keyword.
 */
export default function HomePage() {
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [category, setCategory]   = useState("All");
  const [status, setStatus]       = useState("All");
  const [search, setSearch]       = useState("");
  const [searchInput, setSearchInput] = useState(""); // controlled input

  // Fetch whenever filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const filters = {};
        if (category !== "All") filters.category = category;
        if (status   !== "All") filters.status   = status;
        if (search)              filters.search   = search;
        const data = await getJobs(filters);
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [category, status, search]);

  // Debounce search input so we don't fire on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div>
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Request Board</h1>
        <p className="text-gray-500 text-sm mt-1">Browse open trade requests from homeowners across the UK.</p>
      </div>

      {/* ── Filters Row ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Keyword search */}
        <input
          type="text"
          placeholder="Search requests..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-52"
        />

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
          ))}
        </select>

        {/* Result count */}
        {!loading && (
          <span className="text-sm text-gray-400 self-center ml-auto">
            {jobs.length} result{jobs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── States ───────────────────────────────────────── */}
      {loading && (
        <div className="text-center py-16 text-gray-400">Loading requests...</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No requests found</p>
          <p className="text-sm mt-1">Try adjusting your filters.</p>
        </div>
      )}

      {/* ── Job Cards Grid ────────────────────────────────── */}
      {!loading && !error && jobs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
