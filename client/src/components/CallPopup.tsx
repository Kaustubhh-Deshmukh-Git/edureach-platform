import { useEffect } from "react";
import { X, PhoneCall, Bot, Sparkles } from "lucide-react";
import { siteConfig } from "../data/content.ts";

export interface CallPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function CallPopup({ open, onClose }: CallPopupProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-maroon/15 text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close call modal"
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar / Icon */}
        <div className="w-16 h-16 rounded-2xl bg-cream border border-maroon/20 text-maroon flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Bot className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream text-maroon text-xs font-semibold border border-maroon/15 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{siteConfig.counselorRole}</span>
        </div>

        <h3 id="call-popup-title" className="font-heading text-2xl font-bold text-gray-900 mb-2">
          Call with {siteConfig.counselorName}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          The interactive Vapi AI voice agent counseling session will be integrated in Chunk 17. You
          will be able to speak with {siteConfig.counselorName} directly through your browser
          microphone!
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-maroon hover:bg-maroon-dark text-white font-semibold rounded-xl shadow-md transition-all duration-150 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Got it, thank you!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
