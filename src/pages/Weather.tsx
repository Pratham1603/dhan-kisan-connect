import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind,
  Eye,
  AlertTriangle,
  MapPin
} from "lucide-react";

const Weather = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState({
    current: {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      condition: "Partly Cloudy",
      icon: "partly-cloudy"
    },
    forecast: [
      { day: "Today", high: 32, low: 24, condition: "Sunny", icon: "sunny", rain: 0 },
      { day: "Tomorrow", high: 30, low: 22, condition: "Partly Cloudy", icon: "partly-cloudy", rain: 20 },
      { day: "Wed", high: 28, low: 20, condition: "Rainy", icon: "rainy", rain: 80 },
      { day: "Thu", high: 29, low: 21, condition: "Cloudy", icon: "cloudy", rain: 40 },
      { day: "Fri", high: 31, low: 23, condition: "Sunny", icon: "sunny", rain: 0 },
    ],
    alerts: [
      {
        type: "warning",
        title: "Heavy Rain Alert",
        message: "Heavy rainfall expected in your area on Wednesday. Consider postponing outdoor farming activities.",
        time: "2 hours ago"
      }
    ]
  });

  const getWeatherIcon = (iconType: string) => {
    switch (iconType) {
      case "sunny": return <Sun className="h-8 w-8 text-yellow-500" />;
      case "partly-cloudy": return <Cloud className="h-8 w-8 text-gray-400" />;
      case "cloudy": return <Cloud className="h-8 w-8 text-gray-500" />;
      case "rainy": return <CloudRain className="h-8 w-8 text-blue-500" />;
      default: return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            Weather Insights
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time weather updates and agricultural forecasts
          </p>
        </div>

        {/* Location Input */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span>Location</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="location">Enter your location</Label>
                <Input
                  id="location"
                  placeholder="City, District, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button className="btn-hero">Get Weather</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Weather */}
        <Card className="mb-8 card-hover">
          <CardHeader>
            <CardTitle>Current Weather</CardTitle>
            <CardDescription>Real-time conditions in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                {getWeatherIcon(weatherData.current.icon)}
                <div>
                  <div className="text-3xl font-bold">{weatherData.current.temperature}°C</div>
                  <div className="text-muted-foreground">{weatherData.current.condition}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-medium">{weatherData.current.humidity}%</div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Wind className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium">{weatherData.current.windSpeed} km/h</div>
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="font-medium">{weatherData.current.visibility} km</div>
                    <div className="text-sm text-muted-foreground">Visibility</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">Feels like 30°C</div>
                    <div className="text-sm text-muted-foreground">Apparent Temp</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 5-Day Forecast */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
              <CardDescription>Extended weather outlook</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getWeatherIcon(day.icon)}
                      <div>
                        <div className="font-medium">{day.day}</div>
                        <div className="text-sm text-muted-foreground">{day.condition}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{day.high}°/{day.low}°</div>
                      <div className="text-sm text-blue-500">{day.rain}% rain</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weather Alerts */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span>Weather Alerts</span>
              </CardTitle>
              <CardDescription>Important weather warnings for farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.alerts.map((alert, index) => (
                  <div key={index} className="p-4 border border-warning/30 bg-warning/10 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-warning">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Farming Tips */}
                <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                  <h4 className="font-medium text-success mb-2">Farming Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    With expected rainfall, it's a good time to prepare for pest management. 
                    Check drainage systems and ensure proper field preparation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agricultural Insights */}
        <Card className="mt-8 card-hover">
          <CardHeader>
            <CardTitle>Agricultural Weather Insights</CardTitle>
            <CardDescription>Weather-based farming recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Irrigation Status</h4>
                <p className="text-sm text-muted-foreground">
                  Reduce irrigation for next 3 days due to expected rainfall
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <Wind className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Spray Conditions</h4>
                <p className="text-sm text-muted-foreground">
                  Good conditions for pesticide application today
                </p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg">
                <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-medium">Field Work</h4>
                <p className="text-sm text-muted-foreground">
                  Optimal conditions for harvesting operations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Weather;