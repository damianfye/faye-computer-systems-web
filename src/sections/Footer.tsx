const footerLinks = [
  { label: "Services", href: "#services" },
  { label: "Approach", href: "#approach" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="py-8 bg-[#ededed]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-3">
            <img
              src="/logo/FCS-logo-final-transparent.png"
              alt="Faye Computer Systems"
              className="h-6"
            />
            <p className="text-sm text-[#999999]">
              &copy; 2026 Faye Computer Systems
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="text-sm text-[#999999] hover:text-[#1a1a1a] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
