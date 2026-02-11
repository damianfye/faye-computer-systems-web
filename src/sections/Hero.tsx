import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import FlowingMesh from "../components/FlowingMesh";

export default function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Trigger load animation
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.min(
          Math.max(-rect.top / (rect.height * 0.5), 0),
          1,
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToServices = () => {
    const element = document.querySelector("#services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col bg-grid overflow-hidden"
    >
      {/* WebGL Animation Container */}
      <div className="absolute inset-0 w-full h-full">
        <FlowingMesh scrollProgress={scrollProgress} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-20 pt-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-lg bg-white/[0.18] backdrop-blur-[4px] rounded-3xl border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
            {/* Headline */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[1.1] tracking-[-0.02em] text-black mb-6 transition-all duration-700 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              We automate what slows you down
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg text-[#444444] leading-relaxed mb-8 max-w-md transition-all duration-700 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "550ms" }}
            >
              We find your bottlenecks and automate them.
            </p>

            {/* CTA Button */}
            <div
              className={`transition-all duration-700 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "700ms" }}
            >
              <button
                onClick={scrollToServices}
                className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium bg-[#1a1a1a] text-white rounded-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                See how we work
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#ededed] to-transparent pointer-events-none" />
    </section>
  );
}
