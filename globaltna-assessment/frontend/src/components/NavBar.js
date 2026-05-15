"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

/**
 * NavBar
 * Shows different links depending on whether the user is logged in.
 * - Logged out: Login | Register
 * - Logged in:  "Hello, Name" | Post a Request | Logout
 */
export default function NavBar() {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
          GlobalTNA
        </Link>

        {/* Right side */}
        {!loading && (
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 hidden sm:block">
                  Hello, <span className="font-medium text-gray-700">{user.name}</span>
                </span>
                <Link
                  href="/new-job"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  + Post a Request
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 px-3 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
