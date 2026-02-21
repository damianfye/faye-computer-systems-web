import { useEffect, useRef, useState } from "react";
import { Lock, Users, TrendingUp } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

export default function Philosophy() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#f6f6f6]"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Quote - Left Column */}
          <div className="lg:col-span-2 relative">
            {/* Vertical line separator */}
            <div className="hidden lg:block absolute -right-8 top-0 bottom-0 w-px bg-black/[0.06]" />

            <h2
              className={`text-2xl lg:text-3xl font-normal leading-snug tracking-[-0.01em] text-[#1a1a1a] transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <Trans
                i18nKey="philosophy.heading"
                components={{ accent: <span className="text-[#7c9a92]" /> }}
              />
            </h2>
          </div>

          {/* Supporting Text - Right Column */}
          <div className="lg:col-span-3 space-y-6">
            <p
              className={`text-base lg:text-lg text-[#666666] leading-relaxed transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "150ms" }}
            >
              {t("philosophy.body")}
            </p>

            {/* Principles — bento cards */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "450ms" }}
            >
              <div className="bg-white rounded-xl border border-black/[0.06] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="w-8 h-8 rounded-lg bg-[#7c9a92]/10 flex items-center justify-center mb-3">
                  <Lock size={16} className="text-[#7c9a92]" />
                </div>
                <div className="text-sm font-medium text-[#1a1a1a] mb-1">
                  {t("philosophy.secure.title")}
                </div>
                <div className="text-sm text-[#666666]">
                  {t("philosophy.secure.description")}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-black/[0.06] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="w-8 h-8 rounded-lg bg-[#7c9a92]/10 flex items-center justify-center mb-3">
                  <Users size={16} className="text-[#7c9a92]" />
                </div>
                <div className="text-sm font-medium text-[#1a1a1a] mb-1">
                  {t("philosophy.control.title")}
                </div>
                <div className="text-sm text-[#666666]">
                  {t("philosophy.control.description")}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-black/[0.06] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="w-8 h-8 rounded-lg bg-[#7c9a92]/10 flex items-center justify-center mb-3">
                  <TrendingUp size={16} className="text-[#7c9a92]" />
                </div>
                <div className="text-sm font-medium text-[#1a1a1a] mb-1">
                  {t("philosophy.compound.title")}
                </div>
                <div className="text-sm text-[#666666]">
                  {t("philosophy.compound.description")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
