import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, DollarSign, MapPin, Calendar } from "lucide-react";

const MarketPrices = () => {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedMandi, setSelectedMandi] = useState("");

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

        {/* Search Section */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <span>Find Market Prices</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Select Crop</Label>
                <Select onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="maize">Maize 🌽</SelectItem>
                    <SelectItem value="soybean">Soybean 🌱</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="onion">Onion</SelectItem>
                    <SelectItem value="tomato">Tomato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Select Mandi</Label>
                <Select onValueChange={setSelectedMandi}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose mandi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="up">Uttar Pradesh</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full btn-hero">
                  Get Prices
                </Button>
              </div>
            </div>
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