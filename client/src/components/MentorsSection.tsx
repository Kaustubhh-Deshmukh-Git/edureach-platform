import { useEffect, useRef } from "react";
import { GraduationCap, Award, BookOpen, MessageSquare } from "lucide-react";
import { mentorsContent } from "../data/content.ts";

export interface MentorsSectionProps {
  onReachMentors?: () => void;
}

export default function MentorsSection({ onReachMentors }: MentorsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!onReachMentors) return;
    if (typeof IntersectionObserver === "undefined") return;

    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          onReachMentors();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [onReachMentors]);

  return (
    <section id="mentors" ref={sectionRef} className="py-20 lg:py-28 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            Academic Leadership
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Meet Our Distinguished Mentors
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Learn from esteemed professors, researchers from IITs and IISc, and industry leaders
            committed to your academic growth.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {mentorsContent.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-2xl border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Mentor Photo Container */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={mentor.image}
                  alt={`${mentor.name} - ${mentor.designation}`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider bg-maroon/90 px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {mentor.experience}
                  </span>
                </div>
              </div>

              {/* Mentor Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-maroon transition-colors">
                    {mentor.name}
                  </h3>
                  <p className="text-xs font-semibold text-maroon mt-0.5">{mentor.designation}</p>
                  <p className="text-xs text-gray-500">{mentor.department}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-4 h-4 text-maroon shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{mentor.qualification}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-maroon shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong className="text-gray-700">Specialization:</strong>{" "}
                        {mentor.specialization}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Award className="w-3 h-3" /> PhD Faculty
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-maroon via-maroon to-maroon-dark text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Connect Directly with Department Mentors
            </h3>
            <p className="text-cream/80 text-sm sm:text-base max-w-2xl">
              Have questions about research facilities, laboratory infrastructure, or curriculum
              depth? Speak with our academic mentors today.
            </p>
          </div>

          <button
            type="button"
            onClick={onReachMentors}
            className="shrink-0 px-8 py-3.5 bg-cream hover:bg-white text-maroon font-bold rounded-xl shadow-lg transition-all duration-200 cursor-pointer inline-flex items-center gap-2 hover:scale-102"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect with Mentors</span>
          </button>
        </div>
      </div>
    </section>
  );
}
