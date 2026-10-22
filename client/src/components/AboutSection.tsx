import { Building2, Users, BookOpen, Award, Compass, Target } from "lucide-react";
import { aboutContent, images } from "../data/content.ts";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            About Our Institution
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {aboutContent.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            {aboutContent.subtitle}
          </p>
        </div>

        {/* Overview & Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {aboutContent.overview}
            </p>

            {/* Vision and Mission Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-cream border border-maroon/10 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-maroon text-white flex items-center justify-center mb-4">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-maroon mb-2">Our Vision</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{aboutContent.vision}</p>
              </div>

              <div className="p-6 rounded-2xl bg-cream border border-maroon/10 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-maroon text-white flex items-center justify-center mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold text-maroon mb-2">Our Mission</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{aboutContent.mission}</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-150">
              <img
                src={images.campusAerial}
                alt="EduReach 25-Acre Campus in Hyderabad"
                loading="lazy"
                className="w-full h-80 sm:h-[420px] object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-heading text-xl font-bold">25-Acre Smart Campus</p>
                <p className="text-xs text-white/80">Knowledge City, Gachibowli, Hyderabad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 pt-8 border-t border-gray-100">
          {aboutContent.stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="p-5 rounded-xl bg-cream/60 border border-maroon/10 text-center hover:bg-cream transition-colors"
            >
              <div className="text-maroon mb-2 flex justify-center">
                {idx === 0 && <Building2 className="w-6 h-6" />}
                {idx === 1 && <Compass className="w-6 h-6" />}
                {idx === 2 && <Users className="w-6 h-6" />}
                {idx === 3 && <BookOpen className="w-6 h-6" />}
                {idx === 4 && <Award className="w-6 h-6" />}
              </div>
              <p className="font-heading text-2xl sm:text-3xl font-extrabold text-maroon">
                {stat.value}
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{stat.label}</p>
              {stat.description && (
                <p className="text-xs text-gray-500 mt-0.5">{stat.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
