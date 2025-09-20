import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, DollarSign, MapPin, Calendar } from "lucide-react";

const MarketPrices = () => {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [priceData, setPriceData] = useState({
    minPrice: "",
    maxPrice: "",
    modalPrice: ""
  });

  // Mock data for cities based on crop selection
  const cropCities = {
    rice: ["Delhi", "Punjab", "Haryana", "West Bengal", "Uttar Pradesh"],
    wheat: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan"],
    maize: ["Andhra Pradesh", "Karnataka", "Rajasthan", "Maharashtra", "Bihar"],
    soybean: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana"],
    sugarcane: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Andhra Pradesh"],
    cotton: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Haryana"],
    onion: ["Maharashtra", "Karnataka", "Gujarat", "Rajasthan", "Madhya Pradesh"],
    tomato: ["Andhra Pradesh", "Karnataka", "West Bengal", "Odisha", "Maharashtra"]
  };

  // Mock available dates
  const availableDates = ["2024-03-15", "2024-03-14", "2024-03-13", "2024-03-12", "2024-03-11"];

  const marketData = {
    rice: {
      currentPrice: 2450,
      previousPrice: 2380,
      trend: "up",
      change: 2.94,
      unit: "per quintal",
      lastUpdated: "2 hours ago"
    },
    wheat: {
      currentPrice: 2150,
      previousPrice: 2200,
      trend: "down",
      change: -2.27,
      unit: "per quintal",
      lastUpdated: "1 hour ago"
    },
    sugarcane: {
      currentPrice: 380,
      previousPrice: 375,
      trend: "up",
      change: 1.33,
      unit: "per quintal",
      lastUpdated: "3 hours ago"
    }
  };

  // Effect to update prices when crop or city changes
  useEffect(() => {
    if (selectedCrop && selectedCity) {
      // Mock API call - in real implementation, call Agmarknet API
      const mockPrices = {
        minPrice: Math.floor(Math.random() * 1000 + 1500).toString(),
        maxPrice: Math.floor(Math.random() * 1000 + 2500).toString(),
        modalPrice: Math.floor(Math.random() * 500 + 2000).toString()
      };
      setPriceData(mockPrices);
    }
  }, [selectedCrop, selectedCity]);

  // Reset dependent fields when crop changes
  useEffect(() => {
    if (selectedCrop) {
      setSelectedCity("");
      setSelectedDate("");
      setPriceData({ minPrice: "", maxPrice: "", modalPrice: "" });
    }
  }, [selectedCrop]);

  const recentPrices = [
    { crop: "Rice", price: "₹2,450", change: "+2.94%", trend: "up", mandi: "Delhi" },
    { crop: "Wheat", price: "₹2,150", change: "-2.27%", trend: "down", mandi: "Punjab" },
    { crop: "Sugarcane", price: "₹380", change: "+1.33%", trend: "up", mandi: "UP" },
    { crop: "Cotton", price: "₹6,200", change: "+4.12%", trend: "up", mandi: "Gujarat" },
    { crop: "Onion", price: "₹1,800", change: "-5.67%", trend: "down", mandi: "Maharashtra" },
    { crop: "Tomato", price: "₹3,200", change: "+8.45%", trend: "up", mandi: "Karnataka" },
  ];

  const priceHistory = [
    { date: "Jan 2024", price: 2200 },
    { date: "Feb 2024", price: 2300 },
    { date: "Mar 2024", price: 2250 },
    { date: "Apr 2024", price: 2400 },
    { date: "May 2024", price: 2450 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Market Prices
          </h1>
          <p className="text-xl text-muted-foreground">
            Live market rates and price trends for informed selling decisions
          </p>
        </div>

        {/* Smart Crop Advisory Section */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <span>Smart Crop Advisory</span>
            </CardTitle>
            <CardDescription>
              Get real-time market data and pricing insights for informed decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Select Crop */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Crop</Label>
                <Select onValueChange={setSelectedCrop} value={selectedCrop}>
                  <SelectTrigger className="h-11 shadow-sm border-muted-foreground/20 hover:border-primary/50 transition-colors">
                    <SelectValue placeholder="Choose crop" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="soybean">Soybean</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="onion">Onion</SelectItem>
                    <SelectItem value="tomato">Tomato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Select City */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <Select 
                  onValueChange={setSelectedCity} 
                  value={selectedCity}
                  disabled={!selectedCrop}
                >
                  <SelectTrigger className="h-11 shadow-sm border-muted-foreground/20 hover:border-primary/50 transition-colors disabled:opacity-50">
                    <SelectValue placeholder={selectedCrop ? "Choose city" : "Select crop first"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {selectedCrop && cropCities[selectedCrop as keyof typeof cropCities]?.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Select Date */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Select 
                  onValueChange={setSelectedDate} 
                  value={selectedDate}
                  disabled={!selectedCrop}
                >
                  <SelectTrigger className="h-11 shadow-sm border-muted-foreground/20 hover:border-primary/50 transition-colors disabled:opacity-50">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={selectedCrop ? "Choose date" : "Select crop first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDates.map((date) => (
                      <SelectItem key={date} value={date}>{new Date(date).toLocaleDateString()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Fields */}
            {selectedCrop && selectedCity && (
              <div className="grid md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-muted">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-success">Min Price</Label>
                  <div className="relative">
                    <Input 
                      value={priceData.minPrice ? `₹${priceData.minPrice}` : ""} 
                      placeholder="Loading..." 
                      readOnly 
                      className="h-11 shadow-sm bg-success/5 border-success/20 text-success font-medium"
                    />
                    <TrendingDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-destructive">Max Price</Label>
                  <div className="relative">
                    <Input 
                      value={priceData.maxPrice ? `₹${priceData.maxPrice}` : ""} 
                      placeholder="Loading..." 
                      readOnly 
                      className="h-11 shadow-sm bg-destructive/5 border-destructive/20 text-destructive font-medium"
                    />
                    <TrendingUp className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-primary">Modal Price</Label>
                  <div className="relative">
                    <Input 
                      value={priceData.modalPrice ? `₹${priceData.modalPrice}` : ""} 
                      placeholder="Loading..." 
                      readOnly 
                      className="h-11 shadow-sm bg-primary/5 border-primary/20 text-primary font-medium"
                    />
                    <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            )}

            {/* Get Advisory Button */}
            {selectedCrop && selectedCity && (
              <div className="mt-6 pt-6 border-t border-muted">
                <Button className="w-full h-11 btn-hero text-base font-medium">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Get Smart Advisory
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Price Display */}
        {selectedCrop && marketData[selectedCrop as keyof typeof marketData] && (
          <Card className="mb-8 card-hover">
            <CardHeader>
              <CardTitle className="capitalize">{selectedCrop} - Current Market Price</CardTitle>
              <CardDescription>
                Last updated: {marketData[selectedCrop as keyof typeof marketData].lastUpdated}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold text-primary">
                    ₹{marketData[selectedCrop as keyof typeof marketData].currentPrice.toLocaleString()}
                  </div>
                  <div className="text-muted-foreground">
                    {marketData[selectedCrop as keyof typeof marketData].unit}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {marketData[selectedCrop as keyof typeof marketData].trend === "up" ? (
                    <TrendingUp className="h-6 w-6 text-success" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  )}
                  <div className={`text-lg font-medium ${
                    marketData[selectedCrop as keyof typeof marketData].trend === "up" 
                      ? "text-success" 
                      : "text-destructive"
                  }`}>
                    {marketData[selectedCrop as keyof typeof marketData].change > 0 ? "+" : ""}
                    {marketData[selectedCrop as keyof typeof marketData].change}%
                  </div>
                  <div className="text-muted-foreground">vs last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Market Prices */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Recent Market Prices</CardTitle>
              <CardDescription>Latest prices across major mandis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrices.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="font-medium">{item.crop}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.mandi}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.price}</div>
                      <div className={`text-sm flex items-center ${
                        item.trend === "up" ? "text-success" : "text-destructive"
                      }`}>
                        {item.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price History Chart */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span>Price History</span>
              </CardTitle>
              <CardDescription>Price trends over the last 5 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priceHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">{item.date}</div>
                    <div className="font-medium">₹{item.price.toLocaleString()}</div>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(item.price / 2500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Market Insight</h4>
                <p className="text-sm text-muted-foreground">
                  Prices have shown an upward trend over the last quarter due to seasonal demand. 
                  Consider selling in the next 2-3 weeks for optimal returns.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Tips */}
        <Card className="mt-8 card-hover">
          <CardHeader>
            <CardTitle>Market Tips & Insights</CardTitle>
            <CardDescription>Expert advice for better market decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-2" />
                <h4 className="font-medium">Best Selling Time</h4>
                <p className="text-sm text-muted-foreground">
                  Early morning hours typically see better prices in most mandis
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-medium">Quality Premium</h4>
                <p className="text-sm text-muted-foreground">
                  High-grade produce can fetch 10-15% premium over average rates
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Multiple Mandis</h4>
                <p className="text-sm text-muted-foreground">
                  Compare prices across nearby mandis for best deals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketPrices;