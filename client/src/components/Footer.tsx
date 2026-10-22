import { GraduationCap, Phone, Mail, MapPin, Clock, ArrowUp, Award } from "lucide-react";
import { siteConfig, contactInfo, navLinks, coursesContent } from "../data/content.ts";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const featuredCourses = coursesContent.slice(0, 5);

  return (
    <footer className="bg-gradient-to-b from-maroon-dark via-[#420E16] to-[#2E080F] text-cream pt-16 pb-8 border-t-4 border-maroon-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cream/10 border border-cream/20 flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold tracking-tight text-white">
                  {siteConfig.name}
                </h3>
                <p className="text-xs text-cream/70 font-semibold">{siteConfig.established}</p>
              </div>
            </div>

            <p className="text-sm text-cream/80 leading-relaxed">
              Empowering next-generation engineers, technologists, and business leaders through
              rigorous academics, cutting-edge research, and industry-ready skills.
            </p>

            <div className="flex items-center space-x-2 text-xs text-cream/90 bg-cream/5 p-3 rounded-lg border border-cream/10">
              <Award className="w-4 h-4 text-cream/90 flex-shrink-0" />
              <span>{siteConfig.accreditation}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 border-b border-cream/15 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream/80 hover:text-white transition-colors duration-150 inline-flex items-center"
                  >
                    <span className="text-cream/40 mr-2">›</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Academic Programs */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 border-b border-cream/15 pb-2">
              Academic Programs
            </h4>
            <ul className="space-y-2.5 text-sm">
              {featuredCourses.map((course) => (
                <li key={course.id}>
                  <a
                    href="#courses"
                    className="text-cream/80 hover:text-white transition-colors duration-150 inline-flex items-center"
                  >
                    <span className="text-cream/40 mr-2">›</span>
                    {course.degree} {course.code}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#courses"
                  className="text-xs font-semibold text-cream/90 underline-offset-4 hover:underline mt-1 inline-block"
                >
                  View All Programs →
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Admissions */}
          <div>
            <h4 className="font-heading text-lg font-bold text-white mb-4 border-b border-cream/15 pb-2">
              Admissions Office
            </h4>
            <ul className="space-y-3.5 text-sm text-cream/85">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-cream/70 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{contactInfo.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-cream/70 flex-shrink-0" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-white transition-colors">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-cream/70 flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-cream/70 flex-shrink-0" />
                <span className="text-xs">{contactInfo.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/60 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} EduReach College. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <span className="hover:text-cream cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-cream cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="hover:text-cream cursor-pointer transition-colors">
              Anti-Ragging Cell
            </span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-cream/10 hover:bg-cream/20 text-cream transition-colors flex items-center space-x-1"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
