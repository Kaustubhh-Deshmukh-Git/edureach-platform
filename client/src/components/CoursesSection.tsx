import { useState } from "react";
import { GraduationCap, Clock, Users, IndianRupee, Sparkles, CheckCircle } from "lucide-react";
import { coursesContent, type Course } from "../data/content.ts";

type DegreeFilter = "All" | "B.Tech" | "M.Tech" | "MBA";

const degreeTabs: readonly DegreeFilter[] = ["All", "B.Tech", "M.Tech", "MBA"] as const;

export default function CoursesSection() {
  const [activeTab, setActiveTab] = useState<DegreeFilter>("All");

  const filteredCourses =
    activeTab === "All"
      ? coursesContent
      : coursesContent.filter((course: Course) => course.degree === activeTab);

  return (
    <section id="courses" className="py-20 lg:py-28 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            Academics & Degrees
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Comprehensive Degree Programs
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Curated by industry leaders and accredited academicians to bridge theoretical depth with
            industry excellence.
          </p>

          {/* Degree Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
            {degreeTabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-maroon text-white shadow-md shadow-maroon/20"
                      : "bg-cream text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-maroon/10"
                  }`}
                  aria-pressed={isActive}
                >
                  {tab === "All" ? "All Programs" : tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-gray-200/90 bg-white shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header & Badge */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cream text-maroon border border-maroon/15">
                    {course.degree} · {course.code}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                    <Users className="w-3.5 h-3.5 text-maroon" />
                    <span>{course.seats} Seats</span>
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-maroon transition-colors">
                  {course.name}
                </h3>

                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* Key Meta (Duration, Fee) */}
                <div className="grid grid-cols-2 gap-3 my-4 py-3 border-y border-gray-100 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock className="w-4 h-4 text-maroon" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 justify-end">
                    <IndianRupee className="w-4 h-4 text-maroon" />
                    <span className="font-semibold text-gray-800">{course.annualFee} / yr</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Key Highlights
                  </p>
                  {course.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer / Eligibility */}
              <div className="p-6 pt-3 bg-gray-50/60 border-t border-gray-100 text-xs text-gray-500">
                <p className="line-clamp-2">
                  <span className="font-semibold text-gray-700">Eligibility:</span>{" "}
                  {course.eligibility}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-cream via-white to-cream border border-maroon/15 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Personalized Academic Guidance</span>
            </div>
            <h4 className="font-heading text-xl font-bold text-gray-900">
              Need assistance deciding the right specialization?
            </h4>
            <p className="text-sm text-gray-600">
              Talk directly with EduReach AI counselor Ava or connect with department mentors.
            </p>
          </div>
          <a
            href="#mentors"
            className="shrink-0 px-6 py-3 bg-maroon text-white font-semibold rounded-xl shadow-md hover:bg-maroon-dark transition-all duration-200 inline-flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Meet Faculty Mentors</span>
          </a>
        </div>
      </div>
    </section>
  );
}
