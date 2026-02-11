import { useEffect, useRef, useState } from "react";
import { Copy, Check, Mail } from "lucide-react";

const EMAIL = "damianfaye1@gmail.com";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-[#f6f6f6]"
    >
      <div className="max-w-[600px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl font-normal tracking-[-0.01em] text-[#1a1a1a]">
            Let's talk
          </h2>
        </div>

        {/* Email button */}
        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <button
            onClick={copyEmail}
            className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-xl border transition-all duration-300 cursor-pointer w-full max-w-lg ${
              copied
                ? "bg-[#1a1a1a] border-[#1a1a1a]"
                : "bg-white border-black/[0.08] hover:border-black/[0.15] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            }`}
          >
            {copied ? (
              <>
                <Check size={18} className="text-[#7c9a92]" />
                <span className="text-lg font-medium text-white tracking-[-0.01em]">
                  Copied
                </span>
              </>
            ) : (
              <>
                <span className="text-lg sm:text-xl font-medium text-[#1a1a1a] tracking-[-0.01em]">
                  {EMAIL}
                </span>
                <Copy
                  size={16}
                  className="text-[#999999] group-hover:text-[#7c9a92] transition-colors shrink-0"
                />
              </>
            )}
          </button>

          <a
            href={`mailto:${EMAIL}`}
            className="inline-flex items-center gap-1.5 text-sm text-[#666666] hover:text-[#1a1a1a] transition-colors"
          >
            <Mail size={13} />
            Open in mail app
          </a>
        </div>
      </div>
    </section>
  );
}
