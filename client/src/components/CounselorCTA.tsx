import { useNavigate } from "react-router-dom";
import { PhoneCall, Bot, Sparkles, CheckCircle2 } from "lucide-react";
import { siteConfig } from "../data/content.ts";
import { useAuth } from "../context/AuthContext.tsx";

export interface CounselorCTAProps {
  onOpenCall?: () => void;
}

export default function CounselorCTA({ onOpenCall }: CounselorCTAProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCallClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      onOpenCall?.();
    }
  };

  return (
    <section
      id="counselor-cta"
      className="py-20 lg:py-28 bg-gradient-to-br from-maroon-dark via-maroon to-[#54121B] text-white font-body relative overflow-hidden"
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Details */}
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-amber-200">
              <Bot className="w-4 h-4 text-amber-300" />
              <span>{siteConfig.counselorRole}</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Have Admissions Questions? Talk Directly to{" "}
              <span className="text-amber-300 underline decoration-amber-400/50 decoration-wavy underline-offset-4">
                {siteConfig.counselorName}
              </span>
            </h2>

            <p className="text-cream/90 text-sm sm:text-base leading-relaxed">
              Experience our AI-powered voice counselor. Get instant answers about eligibility, fee
              structures, scholarships, hostel life, and placement statistics in real time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-cream/80">
              <span className="flex items-center justify-center md:justify-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                24/7 Voice Admissions Helpline
              </span>
              <span className="flex items-center justify-center md:justify-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                Accredited Curriculum Guidance
              </span>
            </div>
          </div>

          {/* Right Action */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 animate-pulse">
                <div className="w-14 h-14 rounded-full bg-white text-maroon flex items-center justify-center shadow-lg">
                  <PhoneCall className="w-7 h-7" />
                </div>
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>

            <button
              type="button"
              onClick={handleCallClick}
              className="px-8 py-3.5 bg-cream hover:bg-white text-maroon font-heading font-bold text-base rounded-xl shadow-xl hover:scale-103 transition-all duration-200 cursor-pointer inline-flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Start Voice Session</span>
            </button>

            <p className="text-[11px] text-cream/70 mt-2">Free Instant Voice Call</p>
          </div>
        </div>
      </div>
    </section>
  );
}
