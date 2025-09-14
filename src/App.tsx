import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import FarmDiary from "./pages/FarmDiary";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import PestDetection from "./pages/PestDetection";
import SoilHealth from "./pages/SoilHealth";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Layout from "./components/Layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Routes with Layout */}
            <Route path="/" element={<Layout />}>
              {/* Public Home Page */}
              <Route index element={<Home />} />
              
              {/* Protected Routes */}
              <Route path="features" element={
                <ProtectedRoute>
                  <Features />
                </ProtectedRoute>
              } />
              <Route path="weather" element={
                <ProtectedRoute>
                  <Weather />
                </ProtectedRoute>
              } />
              <Route path="market-prices" element={
                <ProtectedRoute>
                  <MarketPrices />
                </ProtectedRoute>
              } />
              <Route path="farm-diary" element={
                <ProtectedRoute>
                  <FarmDiary />
                </ProtectedRoute>
              } />
              <Route path="pest-detection" element={
                <ProtectedRoute>
                  <PestDetection />
                </ProtectedRoute>
              } />
              <Route path="soil-health" element={
                <ProtectedRoute>
                  <SoilHealth />
                </ProtectedRoute>
              } />
              <Route path="contact" element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
