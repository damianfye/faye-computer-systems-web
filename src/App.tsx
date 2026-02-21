import { useTranslation } from "react-i18next";
import Navigation from "./components/Navigation";
import Hero from "./sections/Hero";
import BentoFeatures from "./sections/BentoFeatures";
import Philosophy from "./sections/Philosophy";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import MeshExport from "./pages/MeshExport";
import { useEffect } from "react";

// Strip /fr prefix for route matching
const rawPath = window.location.pathname.replace(/^\/fr/, "") || "/";
const isMesh = rawPath.endsWith("/mesh") || rawPath.endsWith("/mesh/");

function App() {
  const { i18n } = useTranslation();

  // Update <html lang> attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  if (isMesh) return <MeshExport />;

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Navigation />
      <main>
        <Hero />
        <BentoFeatures />
        <Philosophy />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
