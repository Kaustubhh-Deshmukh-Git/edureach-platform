import { useState, useEffect, useRef, type FormEvent } from "react";
import axios from "axios";
import {
  X,
  PhoneCall,
  Bot,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { siteConfig, vapiFormContent } from "../data/content.ts";
import { initiateCall } from "../services/vapi.service.ts";

export interface CallPopupProps {
  open: boolean;
  onClose: () => void;
}

export type CallStep = "form" | "calling" | "done" | "error";

export default function CallPopup({ open, onClose }: CallPopupProps) {
  const { user } = useAuth();

  const [step, setStep] = useState<CallStep>("form");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setPhone(user?.phone ? user.phone.replace(/\D/g, "").slice(-10) : "");
      setCourse("");
      setTopic("");
      setConsent(false);
      setFormError("");
      setServerMessage("");
      setStep("form");
    }
  }

  // Focus trap, keyboard navigation and focus restoration
  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;

      const timer = setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }

        // Trap focus inside modal
        if (e.key === "Tab" && modalRef.current) {
          const focusable = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) return;

          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              last.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [open, user, onClose]);

  if (!open) return null;

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
    if (formError) setFormError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate 10-digit Indian mobile number starting with 6-9
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormError(
        "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.",
      );
      return;
    }

    // Validate required consent
    if (!consent) {
      setFormError("Consent is required to receive an AI counselor phone call.");
      return;
    }

    setStep("calling");

    try {
      const response = await initiateCall({
        phone,
        course: course || undefined,
        topic: topic || undefined,
      });

      setServerMessage(
        response.data?.message || "Call initiated successfully. You will receive a call shortly.",
      );
      setStep("done");
    } catch (err: unknown) {
      let msg = "Failed to initiate call. Please try again later.";

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          msg =
            err.response.data?.message ||
            "Call limit reached. Maximum 3 calls per hour allowed. Please try again later.";
        } else if (err.response?.data?.message) {
          msg = String(err.response.data.message);
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }

      setServerMessage(msg);
      setStep("error");
    }
  };

  const handleTryAgain = () => {
    setFormError("");
    setStep("form");
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 50);
  };

  const handleClose = () => {
    setStep("form");
    setFormError("");
    setServerMessage("");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-maroon/15 text-left overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close call modal"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Aria-live announcement for screen readers */}
        <div className="sr-only" aria-live="polite">
          {step === "calling" && "Connecting call to AI counselor Ava..."}
          {step === "done" && `Call initiated. ${serverMessage}`}
          {step === "error" && `Error connecting call. ${serverMessage}`}
        </div>

        {/* Header Icon & Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cream border border-maroon/20 text-maroon flex items-center justify-center shadow-xs shrink-0">
            {step === "calling" ? (
              <Loader2 className="w-6 h-6 animate-spin text-maroon" />
            ) : step === "done" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : step === "error" ? (
              <AlertCircle className="w-6 h-6 text-rose-600" />
            ) : (
              <Bot className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cream text-maroon text-[11px] font-semibold border border-maroon/15">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{siteConfig.counselorRole}</span>
            </div>
            <h3
              id="call-popup-title"
              className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mt-0.5"
            >
              {step === "calling"
                ? "Connecting Call…"
                : step === "done"
                  ? "Call Initiated!"
                  : step === "error"
                    ? "Connection Failed"
                    : `Speak with ${siteConfig.counselorName}`}
            </h3>
          </div>
        </div>

        {/* STATE 1: FORM */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Request an instant outbound phone call from Ava. She will discuss admissions,
              eligibility criteria, and fee structures with you.
            </p>

            {/* Read-Only Name */}
            <div>
              <label
                htmlFor="student-name-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Student Name
              </label>
              <input
                id="student-name-input"
                type="text"
                readOnly
                value={user?.name || "Student"}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 cursor-not-allowed font-medium select-none focus:outline-none"
              />
            </div>

            {/* Phone Number with +91 Visual Prefix */}
            <div>
              <label
                htmlFor="phone-number-input"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl shadow-xs border border-gray-300 focus-within:border-maroon focus-within:ring-2 focus-within:ring-maroon/20 overflow-hidden bg-white">
                <span className="inline-flex items-center px-3.5 bg-gray-50 text-gray-700 font-semibold text-sm border-r border-gray-200 select-none">
                  +91
                </span>
                <input
                  ref={phoneInputRef}
                  id="phone-number-input"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9876543210"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                  aria-required="true"
                  aria-invalid={!!formError}
                  aria-describedby={formError ? "phone-error" : undefined}
                />
              </div>
              <p className="text-[11px] text-gray-600 mt-1">
                Enter your 10-digit Indian mobile number without leading 0 or +91.
              </p>
            </div>

            {/* Course Select (Optional) */}
            <div>
              <label
                htmlFor="course-select"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Preferred Program (Optional)
              </label>
              <select
                id="course-select"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/20 cursor-pointer"
              >
                <option value="">Select a Program (Optional)</option>
                {vapiFormContent.courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Select (Optional) */}
            <div>
              <label
                htmlFor="topic-select"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Topic of Interest (Optional)
              </label>
              <select
                id="topic-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/20 cursor-pointer"
              >
                <option value="">Select Discussion Topic (Optional)</option>
                {vapiFormContent.topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Consent Checkbox */}
            <div className="pt-1">
              <label
                htmlFor="consent-checkbox"
                className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-gray-700 leading-normal"
              >
                <input
                  id="consent-checkbox"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (formError) setFormError("");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-maroon focus:ring-maroon/30 cursor-pointer accent-maroon"
                  aria-required="true"
                />
                <span>I agree to receive one phone call from EduReach's AI counselor.</span>
              </label>
            </div>

            {/* Inline Error Message */}
            {formError && (
              <div
                id="phone-error"
                role="alert"
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Me Now</span>
              </button>
            </div>
          </form>
        )}

        {/* STATE 2: CALLING */}
        {step === "calling" && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream border-2 border-maroon/20 flex items-center justify-center mx-auto shadow-inner">
              <Loader2 className="w-8 h-8 animate-spin text-maroon" />
            </div>

            <div className="space-y-1.5">
              <p className="font-heading font-bold text-lg text-gray-900">Connecting…</p>
              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                Requesting Ava to place an outbound call to{" "}
                <span className="font-semibold text-gray-900">+91 {phone || user?.phone}</span>.
                Please keep your phone nearby.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled
                className="px-6 py-2.5 bg-gray-100 text-gray-400 font-semibold text-sm rounded-xl cursor-not-allowed inline-flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initiating Voice Agent…</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: DONE */}
        {step === "done" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-lg text-gray-900">Call Dispatched!</h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                {serverMessage}
              </p>
              <p className="text-xs text-gray-500 bg-cream/70 rounded-lg p-2 max-w-xs mx-auto border border-maroon/10">
                Incoming call from Ava on{" "}
                <span className="font-semibold text-gray-800">+91 {phone}</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 bg-maroon hover:bg-maroon-dark text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 4: ERROR */}
        {step === "error" && (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto text-rose-600 shadow-xs">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-heading font-bold text-lg text-gray-900">
                Unable to Connect Call
              </h4>
              <p className="text-xs sm:text-sm text-rose-700 bg-rose-50/80 border border-rose-200 rounded-xl p-3 max-w-sm mx-auto leading-relaxed">
                {serverMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl transition-colors cursor-pointer text-center"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleTryAgain}
                className="w-full sm:flex-1 py-2.5 bg-maroon hover:bg-maroon-dark text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
