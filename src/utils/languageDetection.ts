import type { Language } from "@/contexts/LanguageContext";

// Simple language detection based on script/character patterns
export const detectLanguage = (text: string): Language => {
  if (!text.trim()) return "en";
  
  // Remove spaces and punctuation for better detection
  const cleanText = text.replace(/[^\u0900-\u097F\u0A00-\u0A7F\w]/g, '');
  
  // Devanagari script (Hindi/Marathi)
  const devanagariRegex = /[\u0900-\u097F]/;
  // Gurmukhi script (Punjabi)
  const gurmukhiRegex = /[\u0A00-\u0A7F]/;
  
  if (gurmukhiRegex.test(cleanText)) {
    return "pa";
  }
  
  if (devanagariRegex.test(cleanText)) {
    // Simple heuristic to distinguish Hindi from Marathi
    // Marathi commonly uses certain characters/words
    const marathiWords = ['आहे', 'मला', 'तुला', 'काय', 'कसे', 'कुठे', 'कधी'];
    const hindiWords = ['है', 'मुझे', 'तुम्हें', 'क्या', 'कैसे', 'कहां', 'कब'];
    
    const lowerText = text.toLowerCase();
    const marathiScore = marathiWords.reduce((score, word) => 
      score + (lowerText.includes(word) ? 1 : 0), 0);
    const hindiScore = hindiWords.reduce((score, word) => 
      score + (lowerText.includes(word) ? 1 : 0), 0);
    
    if (marathiScore > hindiScore) {
      return "mr";
    }
    return "hi";
  }
  
  // Default to English for Latin script or unknown
  return "en";
};

// Generate context-aware responses based on language and topic
export const generateResponse = (language: Language, topic: string, t: (key: string) => string): string => {
  const topicKey = topic.toLowerCase().replace(/[^a-z]/g, '');
  
  switch (topicKey) {
    case 'soilhealthtips':
    case 'soilhealth':
      return t("chatbot.response.soilHealth");
    case 'weatherupdate':
    case 'weather':
      return t("chatbot.response.weather");
    case 'pestcontrol':
      return t("chatbot.response.pestControl");
    case 'marketprices':
      return t("chatbot.response.marketPrices");
    default:
      return t("chatbot.response.thankYou");
  }
};