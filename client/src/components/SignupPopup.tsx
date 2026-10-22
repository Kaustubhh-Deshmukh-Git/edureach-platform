import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, Lock, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { siteConfig } from "../data/content.ts";

export interface SignupPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function SignupPopup({ show, onClose }: SignupPopupProps) {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const primaryButtonRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (show) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;

      // Focus primary button when modal opens
      const timer = setTimeout(() => {
        primaryButtonRef.current?.focus();
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
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-maroon/20 overflow-hidden text-center sm:text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-maroon via-amber-500 to-rose-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Icon */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cream border border-maroon/20 text-maroon flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Full Access Unlocked on Sign Up</span>
            </div>
            <h3 id="signup-popup-title" className="font-heading text-2xl font-bold text-gray-900">
              Unlock Full Campus Insights
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          You are viewing the preview tier of {siteConfig.name}. Create a free student account to
          unlock gated campus experiences, live counseling, and comprehensive analytics.
        </p>

        {/* Benefits Checklist */}
        <div className="bg-cream/50 rounded-2xl p-4 mb-6 border border-maroon/10 space-y-2.5 text-xs text-gray-700 text-left">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Voice Admissions Helpline:</strong> Speak directly with AI Counselor Ava.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Campus Life & Infrastructure:</strong> Sports complex, research labs &
              hostels.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Detailed Placement Analytics:</strong> Department-wise recruiting partners &
              offers.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            ref={primaryButtonRef}
            to="/signup"
            onClick={onClose}
            className="w-full py-3.5 px-6 bg-maroon hover:bg-maroon-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-150 inline-flex items-center justify-center gap-2 group text-sm"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="text-center">
            <Link
              to="/login"
              onClick={onClose}
              className="text-xs font-semibold text-gray-600 hover:text-maroon underline underline-offset-4 transition-colors"
            >
              Already registered? Sign In instead
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
          <span>No credit card required · Instant access</span>
        </div>
      </div>
    </div>
  );
}
