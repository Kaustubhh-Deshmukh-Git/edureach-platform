import { Calendar, Sparkles } from "lucide-react";
import { eventsGallery } from "../data/content.ts";

export default function EventsGallery() {
  return (
    <section id="events" className="py-20 lg:py-28 bg-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-cream px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3">
            Happenings & Culture
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Events & Annual Highlights
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            From 48-hour continuous hackathons to international cultural festivals and milestone
            convocations, life at EduReach is vibrant and inspiring.
          </p>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eventsGallery.map((event) => (
            <div
              key={event.title}
              className="rounded-2xl border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Event Image */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                  src={event.image}
                  alt={event.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-maroon shadow-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{event.date}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-maroon transition-colors">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-semibold text-maroon">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Annual College Calendar</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
