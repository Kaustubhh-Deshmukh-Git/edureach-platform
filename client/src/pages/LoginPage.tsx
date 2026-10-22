import { useState, type FormEvent } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { loginUser, getErrorMessage } from "../services/auth.service.ts";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });
      await login(data.token);
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream font-body">
      {/* Brand Panel */}
      <div className="lg:w-1/2 bg-gradient-to-br from-maroon-dark via-maroon to-maroon-light text-cream p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-cream/80 hover:text-white transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-cream/10 rounded-xl backdrop-blur-sm border border-cream/20">
              <GraduationCap className="w-8 h-8 text-cream" />
            </div>
            <div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold tracking-tight text-white">
                EduReach College
              </h2>
              <p className="text-xs lg:text-sm text-cream/70">Est. 2005 · Hyderabad</p>
            </div>
          </div>

          <h1 className="font-heading text-3xl lg:text-5xl font-bold leading-tight mb-4 text-white">
            Your Gateway to Smarter Education Decisions
          </h1>
          <p className="text-cream/80 text-base lg:text-lg mb-8 max-w-lg">
            Access your personalized student portal, course resources, and AI academic advisor.
          </p>

          <div className="space-y-4 max-w-md">
            <div className="flex items-center space-x-3 text-sm text-cream/90">
              <CheckCircle2 className="w-5 h-5 text-cream/80 flex-shrink-0" />
              <span>Personalized counseling and admissions guidance</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-cream/90">
              <CheckCircle2 className="w-5 h-5 text-cream/80 flex-shrink-0" />
              <span>92% placement track record with top global recruiters</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-cream/90">
              <CheckCircle2 className="w-5 h-5 text-cream/80 flex-shrink-0" />
              <span>State-of-the-art campus & 10,000+ alumni network</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-cream/15 text-xs text-cream/60">
          © {new Date().getFullYear()} EduReach College. All rights reserved.
        </div>
      </div>

      {/* Form Panel */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-maroon/10 p-8 lg:p-10">
          <div className="mb-8">
            <h2 className="font-heading text-3xl font-bold text-maroon mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">
              Please enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="student@edureach.edu"
                  disabled={submitting}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-maroon focus:ring-maroon/20"
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  placeholder="At least 8 characters"
                  disabled={submitting}
                  className={`w-full pl-10 pr-11 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-maroon focus:ring-maroon/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-maroon hover:bg-maroon-dark text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="font-medium text-maroon hover:text-maroon-dark transition-colors underline-offset-4 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
