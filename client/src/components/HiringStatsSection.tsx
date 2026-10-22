import { TrendingUp, Briefcase, Award, CheckCircle, Building2 } from "lucide-react";
import { deptPlacements, topRecruiters } from "../data/content.ts";

export default function HiringStatsSection() {
  const hiringPerks = [
    "Pre-placement training modules starting from semester 5",
    "Dedicated Corporate Relations Cell with 150+ campus hiring partners",
    "Mock technical rounds and system design interviews with alumni",
    "100% paid internship assistance across tier-1 product & consulting firms",
  ];

  return (
    <section id="hiring-stats" className="py-20 lg:py-28 bg-gray-50/70 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            Career Excellence
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Comprehensive Placement Insights
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Detailed breakdown of outgoing placements, highest CTC packages, and corporate
            recruitment pipelines across all departments.
          </p>
        </div>

        {/* Highlight Banner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0 border border-green-200">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-gray-900">92% Overall</p>
              <p className="text-xs text-gray-500 font-medium">Campus Placement Record</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-gray-900">₹42.0 LPA</p>
              <p className="text-xs text-gray-500 font-medium">Highest CTC Secured</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading text-2xl font-bold text-gray-900">₹8.9 LPA</p>
              <p className="text-xs text-gray-500 font-medium">Average Median Package</p>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Department Analysis + Prep Program */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Department Breakdown Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-heading text-xl font-bold text-gray-900">
                Departmental Placement Distribution
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Detailed metrics covering technical streams and management studies
              </p>
            </div>

            <div className="p-6 space-y-5">
              {deptPlacements.map((dept) => {
                const rateNumber = parseInt(dept.placementRate, 10) || 90;
                return (
                  <div key={dept.department} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-gray-800">{dept.department}</span>
                      <span className="font-bold text-maroon">
                        {dept.placementRate} · Avg ₹{dept.averagePackage}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-maroon h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${rateNumber}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training & Corporate Relations */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 sm:p-8 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-maroon mb-1">
                <Building2 className="w-4 h-4" />
                <span>Career Development Cell</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                Structured Career Pathways
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Our active industry partnership ensures every student is prepared with deep problem
                solving, soft skills, and production-level development capabilities.
              </p>
            </div>

            <div className="space-y-3">
              {hiringPerks.map((perk) => (
                <div key={perk} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{perk}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Premier Tech Recruiters
              </p>
              <div className="flex flex-wrap gap-2">
                {topRecruiters.map((r) => (
                  <span
                    key={r.name}
                    className="px-2.5 py-1 rounded-lg bg-cream text-maroon font-semibold text-xs border border-maroon/10"
                  >
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
