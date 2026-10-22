import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote as QuoteIcon } from "lucide-react";
import { quotesContent } from "../data/content.ts";

export default function QuotesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalQuotes = quotesContent.length;

  const handleNext = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalQuotes);
      setFade(true);
    }, 150);
  }, [totalQuotes]);

  const handlePrev = useCallback(() => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalQuotes) % totalQuotes);
      setFade(true);
    }, 150);
  }, [totalQuotes]);

  const handleSelect = (idx: number) => {
    if (idx === currentIndex) return;
    setFade(false);
    setTimeout(() => {
      setCurrentIndex(idx);
      setFade(true);
    }, 150);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, handleNext]);

  const activeQuote = quotesContent[currentIndex];

  return (
    <section
      id="quotes"
      role="region"
      aria-label="Student & Alumni Testimonials"
      className="py-20 lg:py-28 bg-gradient-to-br from-cream via-white to-cream font-body relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-maroon bg-white px-3 py-1 rounded-full border border-maroon/15 inline-block mb-3 shadow-xs">
            Voices of EduReach
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Alumni & Student Stories
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Hear from our students, alumni, and campus recruitment partners about their
            transformative journey.
          </p>
        </div>

        {/* Carousel Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-maroon/10">
          <QuoteIcon className="w-12 h-12 text-maroon/15 mb-6" />

          {/* Quote Body with Fade */}
          <div
            className={`transition-opacity duration-300 min-h-[140px] sm:min-h-[110px] flex items-center ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <blockquote className="text-lg sm:text-2xl text-gray-800 font-medium italic leading-relaxed">
              "{activeQuote.quote}"
            </blockquote>
          </div>

          {/* Author Details */}
          <div
            className={`mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <img
                src={activeQuote.avatar}
                alt={activeQuote.author}
                loading="lazy"
                className="w-14 h-14 rounded-full object-cover border-2 border-maroon/20 shadow-xs"
              />
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  {activeQuote.author}
                </h3>
                <p className="text-sm font-medium text-maroon">{activeQuote.role}</p>
                <p className="text-xs text-gray-500">{activeQuote.batchOrDept}</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-cream hover:border-maroon/30 text-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-cream hover:border-maroon/30 text-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {quotesContent.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={currentIndex === idx ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? "w-8 bg-maroon" : "w-2.5 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
