import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft, Home } from "lucide-react";
import { siteConfig } from "../data/content.ts";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream text-gray-900 font-body">
      {/* Header Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-maroon flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-heading text-xl font-bold text-maroon">{siteConfig.name}</span>
        </Link>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-maroon/15 space-y-6">
          <div className="space-y-2">
            <p className="font-heading text-7xl font-extrabold text-maroon">404</p>
            <h1 className="font-heading text-2xl font-bold text-gray-900">Page Not Found</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/"
              className="flex-1 py-3 px-4 bg-maroon hover:bg-maroon-dark text-white font-semibold rounded-xl transition-all duration-150 inline-flex items-center justify-center gap-2 text-sm shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-semibold rounded-xl transition-all duration-150 inline-flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="p-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {siteConfig.fullName}. All rights reserved.
      </footer>
    </div>
  );
}
