import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import HeroSection from "../components/HeroSection.tsx";
import AboutSection from "../components/AboutSection.tsx";
import AchievementsSection from "../components/AchievementsSection.tsx";
import CoursesSection from "../components/CoursesSection.tsx";
import QuotesSection from "../components/QuotesSection.tsx";
import MentorsSection from "../components/MentorsSection.tsx";
import StudentLifeSection from "../components/StudentLifeSection.tsx";
import EventsGallery from "../components/EventsGallery.tsx";
import CounselorCTA from "../components/CounselorCTA.tsx";
import HiringStatsSection from "../components/HiringStatsSection.tsx";
import SignupPopup from "../components/SignupPopup.tsx";
import CallPopup from "../components/CallPopup.tsx";
import Footer from "../components/Footer.tsx";

export const SIGNUP_POPUP_STORAGE_KEY = "edureach_signup_popup_seen";

export default function HomePage() {
  const { user } = useAuth();
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  const handleReachMentors = useCallback(() => {
    // Popup never appears for logged-in users
    if (user) return;

    try {
      const hasSeen = sessionStorage.getItem(SIGNUP_POPUP_STORAGE_KEY);
      if (!hasSeen) {
        sessionStorage.setItem(SIGNUP_POPUP_STORAGE_KEY, "true");
        setShowSignupPopup(true);
      }
    } catch {
      // In case sessionStorage is blocked by browser privacy modes
      setShowSignupPopup(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-body antialiased">
      <main id="main-content" className="flex-grow">
        {/* Public Sections — Always Visible */}
        <HeroSection />
        <AboutSection />
        <AchievementsSection />
        <CoursesSection />
        <QuotesSection />
        <MentorsSection onReachMentors={handleReachMentors} />

        {/* Auth-Gated Sections */}
        {user ? (
          <>
            <StudentLifeSection />
            <EventsGallery />
            <CounselorCTA onOpenCall={() => setShowCallPopup(true)} />
            <HiringStatsSection />
          </>
        ) : (
          /* Visitor Teaser */
          <section
            id="teaser"
            className="py-16 sm:py-20 bg-gradient-to-b from-cream to-white border-y border-maroon/15 text-center font-body relative overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-maroon/20 text-xs font-bold text-maroon mb-4 shadow-xs">
                <Lock className="w-3.5 h-3.5 text-maroon" />
                <span>Restricted Campus Access</span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                Want to See More?
              </h3>

              <p className="text-gray-600 max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
                Join our student network to unlock campus life photos, annual hackathon galleries,
                department-wise placement statistics, and instant AI voice counseling with Ava.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 bg-maroon hover:bg-maroon-dark text-white font-heading font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Sign Up to Unlock</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-cream text-maroon font-semibold rounded-xl border border-maroon/20 transition-all duration-200 inline-flex items-center justify-center"
                >
                  Sign In to Account
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant verification · Free access for prospective students</span>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Popups */}
      <SignupPopup show={showSignupPopup} onClose={() => setShowSignupPopup(false)} />
      <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} />
    </div>
  );
}
