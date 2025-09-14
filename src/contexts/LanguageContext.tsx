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
    "chatbot.quickQuestions.soilHealth": "Soil Health Tips",
    "chatbot.quickQuestions.weather": "Weather Update",
    "chatbot.quickQuestions.pestControl": "Pest Control",
    "chatbot.quickQuestions.marketPrices": "Market Prices",
    "chatbot.welcome": "Welcome! How can I help you today?",
    "chatbot.language.auto": "Auto-detect",
    "chatbot.language.english": "English",
    "chatbot.language.hindi": "हिन्दी",
    "chatbot.language.marathi": "मराठी",
    "chatbot.language.punjabi": "ਪੰਜਾਬੀ",
    "chatbot.response.thankYou": "Thank you for your question! I'm here to help with your farming needs.",
    "chatbot.response.soilHealth": "Here are some soil health tips: Test pH regularly, use organic matter, rotate crops.",
    "chatbot.response.weather": "Today's weather: Clear skies, 25°C. Good conditions for farming activities.",
    "chatbot.response.pestControl": "For pest control: Use neem oil, maintain field hygiene, implement IPM practices.",
    "chatbot.response.marketPrices": "Current market prices: Wheat ₹2,200/quintal, Rice ₹2,800/quintal.",
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
    "chatbot.quickQuestions.soilHealth": "मिट्टी की सेहत",
    "chatbot.quickQuestions.weather": "मौसम अपडेट",
    "chatbot.quickQuestions.pestControl": "कीट नियंत्रण",
    "chatbot.quickQuestions.marketPrices": "बाजार भाव",
    "chatbot.welcome": "स्वागत है! आज मैं आपकी कैसे मदद कर सकता हूं?",
    "chatbot.language.auto": "स्वतः पहचान",
    "chatbot.language.english": "English",
    "chatbot.language.hindi": "हिन्दी",
    "chatbot.language.marathi": "मराठी",
    "chatbot.language.punjabi": "ਪੰਜਾਬੀ",
    "chatbot.response.thankYou": "आपके प्रश्न के लिए धन्यवाद! मैं आपकी खेती की जरूरतों में मदद के लिए यहां हूं।",
    "chatbot.response.soilHealth": "मिट्टी की सेहत के टिप्स: नियमित pH टेस्ट करें, जैविक खाद डालें, फसल चक्र अपनाएं।",
    "chatbot.response.weather": "आज का मौसम: साफ आसमान, 25°C। खेती के काम के लिए अच्छी स्थिति।",
    "chatbot.response.pestControl": "कीट नियंत्रण के लिए: नीम का तेल उपयोग करें, खेत की सफाई रखें, IPM अपनाएं।",
    "chatbot.response.marketPrices": "वर्तमान बाजार भाव: गेहूं ₹2,200/क्विंटल, चावल ₹2,800/क्विंटल।",
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
    "chatbot.quickQuestions.soilHealth": "मातीचे आरोग्य",
    "chatbot.quickQuestions.weather": "हवामान अपडेट",
    "chatbot.quickQuestions.pestControl": "कीड नियंत्रण",
    "chatbot.quickQuestions.marketPrices": "बाजार भाव",
    "chatbot.welcome": "स्वागत आहे! आज मी तुमची कशी मदत करू शकतो?",
    "chatbot.language.auto": "स्वयं-शोध",
    "chatbot.language.english": "English",
    "chatbot.language.hindi": "हिन्दी",
    "chatbot.language.marathi": "मराठी",
    "chatbot.language.punjabi": "ਪੰਜਾਬੀ",
    "chatbot.response.thankYou": "तुमच्या प्रश्नासाठी धन्यवाद! मी तुमच्या शेतीच्या गरजांमध्ये मदत करण्यासाठी येथे आहे।",
    "chatbot.response.soilHealth": "मातीच्या आरोग्यासाठी टिप्स: नियमित pH तपासा, सेंद्रिय खत वापरा, पीक चक्र करा।",
    "chatbot.response.weather": "आजचे हवामान: स्वच्छ आकाश, 25°C। शेतीच्या कामासाठी चांगली परिस्थिती।",
    "chatbot.response.pestControl": "कीड नियंत्रणासाठी: कडुनिंबाचे तेल वापरा, शेताची स्वच्छता राखा, IPM अवलंबा।",
    "chatbot.response.marketPrices": "सद्य बाजार भाव: गहू ₹2,200/क्विंटल, तांदूळ ₹2,800/क्विंटल।",
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
    "chatbot.quickQuestions.soilHealth": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ",
    "chatbot.quickQuestions.weather": "ਮੌਸਮ ਅੱਪਡੇਟ",
    "chatbot.quickQuestions.pestControl": "ਕੀੜੇ ਕੰਟਰੋਲ",
    "chatbot.quickQuestions.marketPrices": "ਮਾਰਕਿਟ ਰੇਟ",
    "chatbot.welcome": "ਜੀ ਆਇਆਂ ਨੂੰ! ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?",
    "chatbot.language.auto": "ਸਵੈ-ਖੋਜ",
    "chatbot.language.english": "English",
    "chatbot.language.hindi": "हिन्दी",
    "chatbot.language.marathi": "मराठी",
    "chatbot.language.punjabi": "ਪੰਜਾਬੀ",
    "chatbot.response.thankYou": "ਤੁਹਾਡੇ ਸਵਾਲ ਲਈ ਧੰਨਵਾਦ! ਮੈਂ ਤੁਹਾਡੀ ਖੇਤੀ ਦੀਆਂ ਲੋੜਾਂ ਵਿੱਚ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ।",
    "chatbot.response.soilHealth": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਦੇ ਟਿਪਸ: ਨਿਯਮਿਤ pH ਟੈਸਟ ਕਰੋ, ਜੈਵਿਕ ਖਾਦ ਵਰਤੋ, ਫਸਲੀ ਚੱਕਰ ਅਪਣਾਓ।",
    "chatbot.response.weather": "ਅੱਜ ਦਾ ਮੌਸਮ: ਸਾਫ਼ ਅਸਮਾਨ, 25°C। ਖੇਤੀ ਦੇ ਕੰਮਾਂ ਲਈ ਚੰਗੀ ਸਥਿਤੀ।",
    "chatbot.response.pestControl": "ਕੀੜੇ ਕੰਟਰੋਲ ਲਈ: ਨਿੰਮ ਦਾ ਤੇਲ ਵਰਤੋ, ਖੇਤ ਦੀ ਸਫਾਈ ਰੱਖੋ, IPM ਅਪਣਾਓ।",
    "chatbot.response.marketPrices": "ਮੌਜੂਦਾ ਮਾਰਕਿਟ ਰੇਟ: ਕਣਕ ₹2,200/ਕਿਵੰਟਲ, ਚਾਵਲ ₹2,800/ਕਿਵੰਟਲ।",
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