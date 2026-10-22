import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { siteConfig, navLinks } from "../data/content.ts";
import { useAuth } from "../context/AuthContext.tsx";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-maroon rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-maroon flex items-center justify-center text-white shadow-md shadow-maroon/20 group-hover:bg-maroon-dark transition-colors duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-heading text-2xl font-bold tracking-tight text-maroon block leading-none">
                {siteConfig.name}
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 block mt-1">
                {siteConfig.established} · Hyderabad
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-maroon hover:bg-cream transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cream border border-maroon/15">
                  <UserIcon className="w-4 h-4 text-maroon" />
                  <span className="text-sm font-semibold text-maroon truncate max-w-[150px]">
                    {user.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-maroon rounded-md hover:bg-red-50 transition-colors duration-150"
                  aria-label="Log out of account"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-maroon hover:text-maroon-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-maroon hover:bg-maroon-dark rounded-lg shadow-sm hover:shadow transition-all duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-maroon hover:bg-cream focus:outline-none focus:ring-2 focus:ring-maroon"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:text-maroon hover:bg-cream transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-cream">
                  <UserIcon className="w-5 h-5 text-maroon" />
                  <div className="truncate">
                    <p className="text-sm font-bold text-maroon">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-maroon border border-maroon rounded-lg hover:bg-cream transition-colors text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-maroon rounded-lg hover:bg-maroon-dark transition-colors text-center shadow-xs"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
