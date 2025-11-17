import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "rw" | "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  rw: {
    "nav.symptomChecker": "Gusuzuma Ibimenyetso",
    "nav.dashboard": "Ikibaho",
    "hero.badge": "Umufasha w'Ubuzima ufite AI",
    "hero.title": "Umutuzo",
    "hero.subtitle": "mu buzima bwawe",
    "hero.description": "UMUTUZO ikuzanira gukurikirana ubuzima n'ubwenge, hamwe n'uburambe bwiza bwo mu Rwanda. Suzuma ibimenyetso, kurikirana ibipimo, kandi uhabwe amakuru.",
    "hero.getStarted": "Tangira",
    "hero.viewDashboard": "Reba Ikibaho",
    "features.title": "Ibyo ukeneye byose kugira ngo ugire ubuzima bwiza",
    "features.description": "Ibikorwa bikomeye byakozwe n'ubworoshye kandi biryohewe",
    "feature.aiAnalysis": "Isesengura rifite AI",
    "feature.aiDescription": "Gusuzuma ibimenyetso n'ubwenge bukora",
    "feature.monitoring": "Gukurikirana Ubuzima",
    "feature.monitoringDescription": "Kurikirana ibipimo by'ubuzima byose",
    "feature.dashboard": "Ikibaho Cyoroshye",
    "feature.dashboardDescription": "Imbonerahamwe nziza n'ubushishozi",
    "feature.privacy": "Ibanga Ribanza",
    "feature.privacyDescription": "Amakuru yawe y'ubuzima arafunze kandi arakingiye",
    "feature.mobile": "Byoroheye kuri Telefone",
    "feature.mobileDescription": "Uburambe bunyuranye ku bikoresho byose",
    "feature.realtime": "Kuvugurura mu gihe",
    "feature.realtimeDescription": "Komeza uhabwa amakuru y'ubuzima ako kanya",
    "cta.title": "Witeguye kugenzura ubuzima bwawe?",
    "cta.description": "Winjira mu bantu bihumbi bizera UMUTUZO mu gukurikirana ubuzima bwabo.",
    "cta.button": "Tangira Urugendo rw'Ubuzima",
  },
  en: {
    "nav.symptomChecker": "Symptom Checker",
    "nav.dashboard": "Dashboard",
    "hero.badge": "AI-Powered Health Assistant",
    "hero.title": "Peace of mind",
    "hero.subtitle": "in your health",
    "hero.description": "UMUTUZO brings you intelligent health monitoring with an elegant experience. Check symptoms, track vitals, and stay informed.",
    "hero.getStarted": "Get Started",
    "hero.viewDashboard": "View Dashboard",
    "features.title": "Everything you need for better health",
    "features.description": "Powerful features designed with simplicity and elegance",
    "feature.aiAnalysis": "AI-Powered Analysis",
    "feature.aiDescription": "Smart symptom checking with advanced machine learning",
    "feature.monitoring": "Health Monitoring",
    "feature.monitoringDescription": "Track vital signs and wellness metrics effortlessly",
    "feature.dashboard": "Intuitive Dashboard",
    "feature.dashboardDescription": "Beautiful charts and insights at your fingertips",
    "feature.privacy": "Privacy First",
    "feature.privacyDescription": "Your health data is encrypted and secure",
    "feature.mobile": "Mobile Optimized",
    "feature.mobileDescription": "Seamless experience across all devices",
    "feature.realtime": "Real-time Updates",
    "feature.realtimeDescription": "Stay informed with instant health notifications",
    "cta.title": "Ready to take control of your health?",
    "cta.description": "Join thousands of users who trust UMUTUZO for their health monitoring needs.",
    "cta.button": "Start Your Health Journey",
  },
  fr: {
    "nav.symptomChecker": "Vérificateur de Symptômes",
    "nav.dashboard": "Tableau de bord",
    "hero.badge": "Assistant Santé alimenté par l'IA",
    "hero.title": "La tranquillité d'esprit",
    "hero.subtitle": "pour votre santé",
    "hero.description": "UMUTUZO vous apporte une surveillance intelligente de la santé avec une expérience élégante. Vérifiez les symptômes, suivez les signes vitaux et restez informé.",
    "hero.getStarted": "Commencer",
    "hero.viewDashboard": "Voir le tableau de bord",
    "features.title": "Tout ce dont vous avez besoin pour une meilleure santé",
    "features.description": "Des fonctionnalités puissantes conçues avec simplicité et élégance",
    "feature.aiAnalysis": "Analyse alimentée par l'IA",
    "feature.aiDescription": "Vérification intelligente des symptômes avec apprentissage automatique avancé",
    "feature.monitoring": "Surveillance de la santé",
    "feature.monitoringDescription": "Suivez les signes vitaux et les indicateurs de bien-être sans effort",
    "feature.dashboard": "Tableau de bord intuitif",
    "feature.dashboardDescription": "De beaux graphiques et des informations à portée de main",
    "feature.privacy": "Confidentialité d'abord",
    "feature.privacyDescription": "Vos données de santé sont cryptées et sécurisées",
    "feature.mobile": "Optimisé pour mobile",
    "feature.mobileDescription": "Expérience transparente sur tous les appareils",
    "feature.realtime": "Mises à jour en temps réel",
    "feature.realtimeDescription": "Restez informé avec des notifications de santé instantanées",
    "cta.title": "Prêt à prendre le contrôle de votre santé?",
    "cta.description": "Rejoignez des milliers d'utilisateurs qui font confiance à UMUTUZO pour leurs besoins de surveillance de la santé.",
    "cta.button": "Commencez votre voyage santé",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("umutuzo-language");
    return (stored as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("umutuzo-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
