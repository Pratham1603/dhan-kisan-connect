import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "./pages/Home";
import PestDetection from "./pages/PestDetection";
import SoilHealth from "./pages/SoilHealth";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import FarmDiary from "./pages/FarmDiary";
import Feedback from "./pages/Feedback";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout/Layout";
import ChatBot from "./components/ChatBot/ChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="pest-detection" element={<PestDetection />} />
              <Route path="soil-health" element={<SoilHealth />} />
              <Route path="weather" element={<Weather />} />
              <Route path="market-prices" element={<MarketPrices />} />
              <Route path="farm-diary" element={<FarmDiary />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
