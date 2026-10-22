import { Award, TrendingUp, CheckCircle2, Building, BarChart3 } from "lucide-react";
import { achievementsContent, topRecruiters, deptPlacements } from "../data/content.ts";

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-20 lg:py-28 bg-gray-50/70 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            Proven Track Record
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {achievementsContent.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            {achievementsContent.subtitle}
          </p>
        </div>

        {/* 4 Key Milestone Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievementsContent.highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon to-amber-500 opacity-80" />
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cream text-maroon flex items-center justify-center font-bold">
                  {index === 0 && <TrendingUp className="w-5 h-5" />}
                  {index === 1 && <Award className="w-5 h-5" />}
                  {index === 2 && <CheckCircle2 className="w-5 h-5" />}
                  {index === 3 && <BarChart3 className="w-5 h-5" />}
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cream text-maroon border border-maroon/10">
                  {highlight.metric}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-gray-900 mb-2">
                {highlight.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
            </div>
          ))}
        </div>

        {/* Department Placement Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-16">
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-heading text-xl font-bold text-gray-900">
                Department-wise Placement Highlights
              </h3>
              <p className="text-sm text-gray-500">
                Placement statistics for the outgoing batch across major streams
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-maroon bg-cream px-3 py-1.5 rounded-lg border border-maroon/15 self-start sm:self-auto">
              <span>Overall: 92% Placement Rate</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Placement Rate
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Average Package
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Highest Package
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deptPlacements.map((dept) => (
                  <tr key={dept.department} className="hover:bg-cream/40 transition-colors">
                    <th scope="row" className="px-6 py-4 font-semibold text-gray-900">
                      {dept.department}
                    </th>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                        {dept.placementRate}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-800">
                      ₹{dept.averagePackage}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-maroon">
                      ₹{dept.highestPackage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Recruiters Showcase */}
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-gray-500">
              <Building className="w-4 h-4 text-maroon" />
              <span>Trusted by Industry Leaders</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-gray-900 mt-1">
              Top Corporate Recruiters
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {topRecruiters.map((recruiter) => (
              <div
                key={recruiter.name}
                className="p-4 rounded-xl bg-white border border-gray-200/80 shadow-xs hover:border-maroon/40 hover:shadow-md transition-all duration-200 text-center flex flex-col justify-center items-center"
              >
                <span className="font-heading font-bold text-gray-900 text-base">
                  {recruiter.name}
                </span>
                <span className="text-[11px] text-gray-500 mt-1">{recruiter.category}</span>
                {recruiter.highestOffer && (
                  <span className="mt-2 text-[10px] font-semibold text-maroon bg-cream px-2 py-0.5 rounded-full border border-maroon/10">
                    Up to ₹{recruiter.highestOffer}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
