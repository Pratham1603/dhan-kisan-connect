import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farming.jpg";
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
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Bug,
      title: "Pest & Disease Detection",
      description: "AI-powered image recognition to identify crop diseases and pests instantly",
      href: "/pest-detection",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: Sprout,
      title: "Soil Health Analysis",
      description: "Get personalized fertilizer recommendations based on soil conditions",
      href: "/soil-health",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: Cloud,
      title: "Weather Insights",
      description: "Real-time weather updates and predictive alerts for better planning",
      href: "/weather",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Market Prices",
      description: "Live market rates and price trends for informed selling decisions",
      href: "/market-prices",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MessageCircle,
      title: "AI Chatbot Support",
      description: "24/7 multilingual support for all your farming queries",
      href: "#",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: BarChart3,
      title: "Farm Analytics",
      description: "Track your farming progress with detailed insights and reports",
      href: "/farm-diary",
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  const stats = [
    { icon: Users, value: "50,000+", label: "Active Farmers" },
    { icon: Smartphone, value: "99%", label: "Mobile Optimized" },
    { icon: Shield, value: "24/7", label: "Support Available" },
    { icon: BarChart3, value: "95%", label: "Accuracy Rate" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Smart farming with technology"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
                {t("hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                {t("hero.subtitle")}
              </p>
              <Link to="/pest-detection">
                <Button size="lg" className="btn-hero text-lg px-8 py-6 rounded-xl">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-hero flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Farming Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to make informed farming decisions in one smart platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.href}>
                  <Card 
                    className="card-hover h-full transition-all duration-300 hover:shadow-medium"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-primary font-medium group-hover:text-primary-glow transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of farmers who are already using smart technology to increase their yield and profits.
          </p>
          <Link to="/pest-detection">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;