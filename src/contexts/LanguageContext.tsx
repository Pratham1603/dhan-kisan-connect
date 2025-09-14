import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "mr" | "pa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    "app.title": "KrishiMarg",
    "nav.home": "Home",
    "nav.pestDetection": "Pest Detection",
    "nav.soilHealth": "Soil Health",
    "nav.weather": "Weather",
    "nav.marketPrices": "Market Prices",
    "nav.farmDiary": "Farm Diary",
    "nav.feedback": "Feedback",
    "nav.admin": "Admin",
    "hero.title": "Smart Farming Solutions for Every Farmer",
    "hero.subtitle": "Empower your farming with AI-driven insights, real-time weather updates, and expert guidance.",
    "hero.cta": "Get Started",
    "chatbot.title": "Kisan Sahayak",
    "chatbot.placeholder": "Ask me anything about farming...",
  },
  hi: {
    "app.title": "कृषिमार्ग",
    "nav.home": "होम",
    "nav.pestDetection": "कीट पहचान",
    "nav.soilHealth": "मिट्टी का स्वास्थ्य",
    "nav.weather": "मौसम",
    "nav.marketPrices": "बाजार भाव",
    "nav.farmDiary": "खेती डायरी",
    "nav.feedback": "फीडबैक",
    "nav.admin": "एडमिन",
    "hero.title": "हर किसान के लिए स्मार्ट खेती समाधान",
    "hero.subtitle": "AI संचालित अंतर्दृष्टि, वास्तविक समय मौसम अपडेट और विशेषज्ञ मार्गदर्शन के साथ अपनी खेती को सशक्त बनाएं।",
    "hero.cta": "शुरू करें",
    "chatbot.title": "किसान सहायक",
    "chatbot.placeholder": "खेती के बारे में कुछ भी पूछें...",
  },
  mr: {
    "app.title": "कृषिमार्ग",
    "nav.home": "होम",
    "nav.pestDetection": "कीड ओळख",
    "nav.soilHealth": "मातीचे आरोग्य",
    "nav.weather": "हवामान",
    "nav.marketPrices": "बाजार भाव",
    "nav.farmDiary": "शेती डायरी",
    "nav.feedback": "अभिप्राय",
    "nav.admin": "प्रशासक",
    "hero.title": "प्रत्येक शेतकऱ्यासाठी स्मार्ट शेती उपाय",
    "hero.subtitle": "AI चालित अंतर्दृष्टी, रिअल-टाइम हवामान अपडेट आणि तज्ञ मार्गदर्शनासह आपली शेती सशक्त करा।",
    "hero.cta": "सुरू करा",
    "chatbot.title": "किसान सहायक",
    "chatbot.placeholder": "शेतीबद्दल काहीही विचारा...",
  },
  pa: {
    "app.title": "ਕ੍ਰਿਸ਼ੀਮਾਰਗ",
    "nav.home": "ਹੋਮ",
    "nav.pestDetection": "ਕੀੜੇ ਦੀ ਪਛਾਣ",
    "nav.soilHealth": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
    "nav.weather": "ਮੌਸਮ",
    "nav.marketPrices": "ਮਾਰਕਿਟ ਰੇਟ",
    "nav.farmDiary": "ਖੇਤੀ ਡਾਇਰੀ",
    "nav.feedback": "ਸੁਝਾਅ",
    "nav.admin": "ਐਡਮਿਨ",
    "hero.title": "ਹਰ ਕਿਸਾਨ ਲਈ ਸਮਾਰਟ ਖੇਤੀ ਹੱਲ",
    "hero.subtitle": "AI ਸੰਚਾਲਿਤ ਸਮਝ, ਰੀਅਲ-ਟਾਈਮ ਮੌਸਮ ਅੱਪਡੇਟ ਅਤੇ ਮਾਹਿਰ ਮਾਰਗਦਰਸ਼ਨ ਨਾਲ ਆਪਣੀ ਖੇਤੀ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਓ।",
    "hero.cta": "ਸ਼ੁਰੂ ਕਰੋ",
    "chatbot.title": "ਕਿਸਾਨ ਸਹਾਇਕ",
    "chatbot.placeholder": "ਖੇਤੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    if (import.meta.env?.MODE === "development") {
      // eslint-disable-next-line no-console
      console.warn("LanguageProvider is missing. Falling back to defaults.");
    }
    return {
      language: "en",
      setLanguage: () => {
        if (import.meta.env?.MODE === "development") {
          // eslint-disable-next-line no-console
          console.warn("setLanguage called without LanguageProvider. Ignored.");
        }
      },
      t: (key: string) => translations["en"][key] || key,
    };
  }
  return context;
};