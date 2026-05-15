"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "Other"];

/**
 * New Job Page — Screen 2
 * Only accessible to logged-in users.
 * Redirects to /login if not authenticated.
 */
export default function NewJobPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [form, setForm] = useState({
    title: "", description: "", category: "Plumbing",
    location: "", contactName: "", contactEmail: "",
  });
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState(null);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  // Pre-fill contact fields from logged-in user
  useEffect(() => {
    if (user) {
      setForm((p) => ({
        ...p,
        contactName:  user.name  || "",
        contactEmail: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim())       errs.title       = "Title is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail))
      errs.contactEmail = "Please enter a valid email address.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await createJob(form);
      router.push("/");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
      errors[field] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-blue-400"
    }`;

  if (loading || !user) return <div className="text-center py-16 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Post a Service Request</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in the details and tradespeople in your area will be able to find your request.
        </p>
      </div>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input type="text" name="title" value={form.title} onChange={handleChange}
            placeholder='e.g. "Need a plumber for a leaking tap"' className={inputClass("title")} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={4} placeholder="Describe the work needed in as much detail as possible..."
            className={inputClass("description")} />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Glasgow" className={inputClass("location")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input type="text" name="contactName" value={form.contactName} onChange={handleChange}
              placeholder="Jane Smith" className={inputClass("contactName")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange}
              placeholder="jane@example.com" className={inputClass("contactEmail")} />
            {errors.contactEmail && <p className="text-xs text-red-500 mt-1">{errors.contactEmail}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 rounded-lg transition-colors text-sm">
            {submitting ? "Posting..." : "Post Request"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
