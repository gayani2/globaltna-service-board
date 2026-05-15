"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

/**
 * Register Page
 * Creates a new account via POST /api/auth/register.
 * On success the JWT is stored and the user is redirected home.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name = "Name is required.";
    if (!form.email)        errs.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (!form.password)     errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
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

  return (
    <div className="max-w-sm mx-auto mt-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="text-gray-500 text-sm mt-1">Register to post and manage service requests.</p>
      </div>

      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          ⚠️ {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="Jane Smith" className={inputClass("name")} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" className={inputClass("email")} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="Min. 6 characters" className={inputClass("password")} />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
            placeholder="••••••••" className={inputClass("confirm")} />
          {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 rounded-lg transition-colors text-sm">
          {submitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
}
