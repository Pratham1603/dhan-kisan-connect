import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, X, Send, Mic, Globe } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { detectLanguage, generateResponse } from "@/utils/languageDetection";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatLanguage, setChatLanguage] = useState<Language | "auto">("auto");
  const { t, language, setLanguage } = useLanguage();

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Detect language if auto-detect is enabled
      let detectedLang = language;
      if (chatLanguage === "auto") {
        detectedLang = detectLanguage(inputText);
        if (detectedLang !== language) {
          setLanguage(detectedLang);
        }
      } else {
        detectedLang = chatLanguage;
        if (detectedLang !== language) {
          setLanguage(detectedLang);
        }
      }

      setMessages(prev => [...prev, { text: inputText, isUser: true }]);
      
      // Generate contextual response
      setTimeout(() => {
        const response = generateResponse(detectedLang, inputText, t);
        setMessages(prev => [...prev, { 
          text: response, 
          isUser: false 
        }]);
      }, 1000);
      setInputText("");
    }
  };

  const handleQuickQuestion = (questionKey: string) => {
    const questionText = t(`chatbot.quickQuestions.${questionKey}`);
    setMessages(prev => [...prev, { text: questionText, isUser: true }]);
    
    setTimeout(() => {
      const response = generateResponse(language, questionKey, t);
      setMessages(prev => [...prev, { 
        text: response, 
        isUser: false 
      }]);
    }, 1000);
  };

  const handleLanguageChange = (newLang: Language | "auto") => {
    setChatLanguage(newLang);
    if (newLang !== "auto") {
      setLanguage(newLang);
    }
  };

  const quickQuestions = [
    { key: "soilHealth", label: t("chatbot.quickQuestions.soilHealth") },
    { key: "weather", label: t("chatbot.quickQuestions.weather") },
    { key: "pestControl", label: t("chatbot.quickQuestions.pestControl") },
    { key: "marketPrices", label: t("chatbot.quickQuestions.marketPrices") }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-large float"
          size="sm"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]">
          <Card className="shadow-large">
            <CardHeader className="bg-gradient-hero text-white rounded-t-lg pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{t("chatbot.title")}</span>
                </CardTitle>
                
                {/* Language Selector */}
                <Select
                  value={chatLanguage}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger className="w-24 h-8 bg-white/10 border-white/20 text-white text-xs">
                    <Globe className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto" className="text-xs">
                      {t("chatbot.language.auto")}
                    </SelectItem>
                    <SelectItem value="en" className="text-xs">
                      {t("chatbot.language.english")}
                    </SelectItem>
                    <SelectItem value="hi" className="text-xs">
                      {t("chatbot.language.hindi")}
                    </SelectItem>
                    <SelectItem value="mr" className="text-xs">
                      {t("chatbot.language.marathi")}
                    </SelectItem>
                    <SelectItem value="pa" className="text-xs">
                      {t("chatbot.language.punjabi")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm">
                    {t("chatbot.welcome")}
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        message.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Questions */}
              <div className="p-4 border-t">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {quickQuestions.map((question) => (
                    <Button
                      key={question.key}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleQuickQuestion(question.key)}
                    >
                      {question.label}
                    </Button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t("chatbot.placeholder")}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatBot;