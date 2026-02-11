import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
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
                  key={link.label}
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

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => scrollToSection("#contact")}
                className="px-5 py-2.5 text-sm font-medium bg-[#1a1a1a] text-white rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
              >
                Get in touch
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#1a1a1a]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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
                key={link.label}
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
              Get in touch
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
