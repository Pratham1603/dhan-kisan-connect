import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farming-hands.jpg";
import { processImageFromSrc } from "@/utils/backgroundRemoval";
import { 
  Bug, 
  Sprout, 
  Cloud, 
  TrendingUp, 
  MessageCircle, 
  Smartphone,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  CheckCircle,
  Play
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Home = () => {
  const { t } = useLanguage();
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  useEffect(() => {
    const processImage = async () => {
      try {
        const transparentImage = await processImageFromSrc(heroImage);
        setProcessedImage(transparentImage);
      } catch (error) {
        console.error('Failed to process image:', error);
        // Fallback to original image
        setProcessedImage(heroImage);
      }
    };

    processImage();
  }, []);

  const features = [
    {
      icon: Bug,
      title: "Pest & Disease Detection",
      description: "AI-powered image recognition to identify crop diseases and pests instantly",
      href: "/pest-detection",
    },
    {
      icon: Sprout,
      title: "Soil Health Analysis",
      description: "Get personalized fertilizer recommendations based on soil conditions",
      href: "/soil-health",
    },
    {
      icon: Cloud,
      title: "Weather Insights",
      description: "Real-time weather updates and predictive alerts for better planning",
      href: "/weather",
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Live market rates and price trends for informed selling decisions",
      href: "/market-prices",
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot Support",
      description: "24/7 multilingual support for all your farming queries",
      href: "#",
    },
    {
      icon: BarChart3,
      title: "Farm Analytics",
      description: "Track your farming progress with detailed insights and reports",
      href: "/farm-diary",
    },
  ];

  const stats = [
    { icon: Users, value: "25,000+", label: "Registered Users" },
    { icon: Smartphone, value: "99%", label: "Mobile Optimized" },
    { icon: Shield, value: "24/7", label: "Support Available" },
    { icon: BarChart3, value: "95%", label: "Accuracy Rate" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-screen flex items-center parallax-container">
        {/* Background with parallax effect */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src={processedImage || heroImage} 
            alt="Smart farming with technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-70"></div>
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Smart Farming
                <br />
                <span className="text-white/90">Made Simple</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Empowering small farmers with AI-powered insights for better crop management and higher yields
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Link to="/pest-detection">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" className="bg-primary text-white border border-primary hover:bg-primary/90 hover:shadow-lg transition-all duration-300 text-lg px-8 py-6 rounded-xl font-semibold">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Curved section divider */}
      <div className="section-divider bg-white h-24 -mt-20 relative z-10"></div>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Comprehensive Farming Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Everything you need to make informed farming decisions in one smart platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={feature.href}>
                    <Card className="card-professional h-full group cursor-pointer">
                      <CardHeader className="p-8">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-xl mb-4 text-foreground font-bold">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground leading-relaxed text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 pt-0">
                        <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of farmers who are already using smart technology to increase their yield and profits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/pest-detection">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-xl font-semibold">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" className="bg-primary text-white border border-primary hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-300 text-lg px-8 py-6 rounded-xl font-semibold">
                Watch Success Stories
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;