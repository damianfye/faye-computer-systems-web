import { useState, useEffect, useRef } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { switchLanguage } from "../i18n";

export default function Navigation() {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.approach"), href: "#approach" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLangSwitch = (lang: string) => {
    switchLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "glass border-black/5"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#"
              className="hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src="/logo/FCS-logo-final-transparent.png"
                alt="Faye Computer Systems"
                className="h-8"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative text-sm font-medium transition-colors group ${
                    isScrolled
                      ? "text-[#666666] hover:text-[#1a1a1a]"
                      : "text-[#1a1a1a] hover:text-black"
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#1a1a1a] transition-all duration-250 group-hover:w-full" />
                </button>
              ))}
            </div>

            {/* Right side: CTA + lang switcher (utility furthest right) */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scrollToSection("#contact")}
                className="px-5 py-2.5 text-sm font-medium bg-[#1a1a1a] text-white rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
              >
                {t("nav.cta")}
              </button>

              {/* Language Dropdown */}
              <div ref={langRef} className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isScrolled
                      ? "text-[#666666] hover:text-[#1a1a1a] hover:bg-black/5"
                      : "text-[#1a1a1a] hover:bg-white/20"
                  }`}
                  aria-label="Switch language"
                >
                  <Globe size={14} />
                  {i18n.language.toUpperCase()}
                </button>
                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden min-w-[100px]">
                    <button
                      onClick={() => handleLangSwitch("en")}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        i18n.language === "en"
                          ? "bg-[#f6f6f6] font-medium text-[#1a1a1a]"
                          : "text-[#666666] hover:bg-[#f6f6f6]"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLangSwitch("fr")}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        i18n.language === "fr"
                          ? "bg-[#f6f6f6] font-medium text-[#1a1a1a]"
                          : "text-[#666666] hover:bg-[#f6f6f6]"
                      }`}
                    >
                      Français
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile: lang + menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() =>
                  handleLangSwitch(i18n.language === "en" ? "fr" : "en")
                }
                className="p-2 text-[#1a1a1a]"
                aria-label="Switch language"
              >
                <Globe size={20} />
              </button>
              <button
                className="p-2 text-[#1a1a1a]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-16 left-0 right-0 bg-white border-b border-black/5 transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left text-lg font-medium text-[#1a1a1a] py-2"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("#contact")}
              className="w-full mt-4 px-5 py-3 text-sm font-medium bg-[#1a1a1a] text-white rounded-lg"
            >
              {t("nav.cta")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
