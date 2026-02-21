import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import fr from "./fr.json";

// Detect language from URL path: /fr/* → French, everything else → English
function detectLangFromPath(): string {
  const path = window.location.pathname;
  if (path.startsWith("/fr")) return "fr";
  return "en";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: detectLangFromPath(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Helper to get the base path for the current language
export function langPrefix(): string {
  return i18n.language === "fr" ? "/fr" : "";
}

// Switch language and update URL
export function switchLanguage(lang: string) {
  const currentPath = window.location.pathname;
  let newPath: string;

  if (lang === "fr") {
    // Add /fr prefix if not already there
    if (!currentPath.startsWith("/fr")) {
      newPath = "/fr" + (currentPath === "/" ? "" : currentPath);
    } else {
      newPath = currentPath;
    }
  } else {
    // Remove /fr prefix
    if (currentPath.startsWith("/fr")) {
      newPath = currentPath.replace(/^\/fr/, "") || "/";
    } else {
      newPath = currentPath;
    }
  }

  i18n.changeLanguage(lang);
  window.history.pushState({}, "", newPath + window.location.hash);
}

export default i18n;
