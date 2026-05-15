import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "GlobalTNA – Service Request Board",
  description: "Post and manage home service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        {/* AuthProvider wraps everything so useAuth() works anywhere */}
        <AuthProvider>
          <NavBar />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
