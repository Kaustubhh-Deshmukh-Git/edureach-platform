import { Wifi, Cpu, BookOpen, Home, Trophy, Rocket } from "lucide-react";
import { campusFeatures, images } from "../data/content.ts";

const iconMap = {
  Wifi,
  Cpu,
  BookOpen,
  Home,
  Trophy,
  Rocket,
};

export default function StudentLifeSection() {
  const galleryImages = [
    {
      src: images.studentLife,
      title: "Collaborative Student Commons",
      span: "col-span-1 md:col-span-2",
    },
    { src: images.digitalLibrary, title: "Central High-Tech Digital Library", span: "col-span-1" },
    { src: images.techLab, title: "Advanced Innovation & AI Lab", span: "col-span-1" },
    {
      src: images.sportsComplex,
      title: "Olympic-Standard Sports Complex",
      span: "col-span-1 md:col-span-2",
    },
  ];

  return (
    <section id="student-life" className="py-20 lg:py-28 bg-gray-50/70 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            Campus Experience
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Vibrant Student Life & Infrastructure
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Beyond academic rigor, discover a collaborative environment equipped with world-class
            research labs, sports amenities, and high-energy community hubs.
          </p>
        </div>

        {/* Campus Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {campusFeatures.map((feature) => {
            const Icon = iconMap[feature.iconName as keyof typeof iconMap] || BookOpen;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-cream text-maroon flex items-center justify-center shrink-0 border border-maroon/10">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Life on Campus Photo Showcase */}
        <div>
          <div className="text-center mb-8">
            <h3 className="font-heading text-2xl font-bold text-gray-900">Moments Around Campus</h3>
            <p className="text-sm text-gray-500 mt-1">
              Explore spaces where learning meets creativity and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((img) => (
              <div
                key={img.title}
                className={`relative rounded-2xl overflow-hidden shadow-md group ${img.span} h-64 sm:h-72`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-heading text-lg font-bold">{img.title}</p>
                  <p className="text-xs text-white/80">EduReach Campus, Hyderabad</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
