import { ArrowRight, Sparkles, Award, ShieldCheck, MapPin } from "lucide-react";
import { siteConfig, images } from "../data/content.ts";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-br from-maroon-dark via-maroon to-maroon-light text-cream overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cream blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cream blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-cream shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{siteConfig.accreditation}</span>
            </div>

            {/* Main Title */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              EduReach College — Shaping Tomorrow’s{" "}
              <span className="text-amber-200 underline decoration-amber-300/40 decoration-wavy underline-offset-8">
                Leaders & Engineers
              </span>
            </h1>

            {/* Subtitle / Tagline */}
            <p className="font-body text-lg sm:text-xl text-cream/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {siteConfig.tagline}. A modern 25-acre technology campus delivering transformative
              B.Tech, M.Tech, and MBA programs with an exceptional 92% placement record.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm text-cream/80">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-300" /> 42 LPA Highest CTC
              </span>
              <span className="text-cream/40">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" /> 150+ Faculty (15:1 Ratio)
              </span>
              <span className="text-cream/40">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300" /> Hyderabad, TS
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#courses"
                className="w-full sm:w-auto px-8 py-3.5 bg-cream text-maroon font-bold rounded-xl shadow-lg hover:bg-white hover:scale-102 transition-all duration-200 inline-flex items-center justify-center gap-2 group"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/25 transition-all duration-200 inline-flex items-center justify-center backdrop-blur-xs"
              >
                <span>Discover Campus</span>
              </a>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Decorative Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 to-rose-400 rounded-3xl blur-md opacity-40 animate-pulse" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-maroon-dark">
                <img
                  src={images.campusHero}
                  alt="EduReach College Campus"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />

                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-maroon/10 text-gray-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-maroon">
                        Admissions Open 2026-27
                      </p>
                      <p className="font-heading text-lg font-bold text-gray-900">
                        B.Tech · M.Tech · MBA
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                        EAMCET / Management
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
