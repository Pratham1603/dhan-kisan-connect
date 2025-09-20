import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind,
  Eye,
  AlertTriangle,
  MapPin,
  Navigation,
  Loader2,
  CloudSnow,
  Zap
} from "lucide-react";

const Weather = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  
  const [location, setLocation] = useState<{name: string, lat: number, lon: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Auto-detect location on page load
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!session) {
      setLocationError("Please login to access weather data");
      return;
    }

    setIsLoadingLocation(true);
    setLocationError("");
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          console.log(`GPS coordinates: ${latitude}, ${longitude}`);
          
          try {
            await fetchWeatherData(latitude, longitude);
          } catch (error) {
            console.error("Failed to fetch weather data:", error);
            setLocationError("Failed to fetch weather data");
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = "Location access denied";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location permissions in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          
          setLocationError(errorMessage);
          setIsLoadingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
      setIsLoadingLocation(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoadingWeather(true);
    
    try {
      const authToken = session?.access_token;
      
      // Fetch current weather
      const currentResponse = await supabase.functions.invoke('current-weather', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: { lat, lon }
      });
      
      if (currentResponse.error) {
        throw new Error(currentResponse.error.message);
      }
      
      const currentData = currentResponse.data;
      setCurrentWeather(currentData.current);
      setLocation({
        name: currentData.location.name,
        lat: currentData.location.lat,
        lon: currentData.location.lon
      });
      
      // Fetch forecast
      const forecastResponse = await supabase.functions.invoke('forecast', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: { lat, lon }
      });
      
      if (forecastResponse.error) {
        throw new Error(forecastResponse.error.message);
      }
      
      setForecast(forecastResponse.data.forecast);
      
      // Fetch alerts
      const alertsResponse = await supabase.functions.invoke('alerts', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: { lat, lon }
      });
      
      if (alertsResponse.data?.alerts) {
        setAlerts(alertsResponse.data.alerts);
      }
      
      toast({
        title: "Weather Updated",
        description: `Weather data loaded for ${currentData.location.name}`,
      });
      
    } catch (error: any) {
      console.error("Weather fetch error:", error);
      setLocationError(error.message || "Failed to fetch weather data");
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingLocation(false);
      setIsLoadingWeather(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    // OpenWeatherMap icon codes mapping
    if (iconCode?.includes('01')) return <Sun className="h-8 w-8 text-yellow-500" />; // clear sky
    if (iconCode?.includes('02')) return <Cloud className="h-8 w-8 text-gray-400" />; // few clouds
    if (iconCode?.includes('03') || iconCode?.includes('04')) return <Cloud className="h-8 w-8 text-gray-500" />; // scattered/broken clouds
    if (iconCode?.includes('09') || iconCode?.includes('10')) return <CloudRain className="h-8 w-8 text-blue-500" />; // shower rain/rain
    if (iconCode?.includes('11')) return <Zap className="h-8 w-8 text-purple-500" />; // thunderstorm
    if (iconCode?.includes('13')) return <CloudSnow className="h-8 w-8 text-blue-300" />; // snow
    if (iconCode?.includes('50')) return <Cloud className="h-8 w-8 text-gray-300" />; // mist
    
    // Fallback based on condition text
    const condition = iconCode?.toLowerCase();
    if (condition?.includes('sun') || condition?.includes('clear')) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (condition?.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-400" />;
    if (condition?.includes('rain')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (condition?.includes('storm')) return <Zap className="h-8 w-8 text-purple-500" />;
    if (condition?.includes('snow')) return <CloudSnow className="h-8 w-8 text-blue-300" />;
    
    return <Sun className="h-8 w-8 text-yellow-500" />; // default
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Weather Insights
          </motion.h1>
          <motion.p 
            className="text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real-time weather updates and agricultural forecasts powered by GPS
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Location Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-6 w-6 text-primary" />
                <span>Location Detection</span>
              </CardTitle>
              <CardDescription>
                Automatically detect your location for accurate weather data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                  {isLoadingLocation || isLoadingWeather ? (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isLoadingLocation ? "Detecting your location..." : "Loading weather data..."}</span>
                    </div>
                  ) : location ? (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{location.name}</span>
                      <Badge variant="outline" className="text-green-600">
                        GPS Active
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        ({location.lat.toFixed(3)}, {location.lon.toFixed(3)})
                      </span>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      {locationError || "Location not detected"}
                    </div>
                  )}
                </div>
                <Button 
                  onClick={detectLocation}
                  disabled={isLoadingLocation || isLoadingWeather || !session}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoadingLocation || isLoadingWeather ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isLoadingLocation ? "Detecting..." : "Loading..."}
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4 mr-2" />
                      Detect Location
                    </>
                  )}
                </Button>
              </div>
              
              {locationError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{locationError}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Weather */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="card-hover">
          <CardHeader>
            <CardTitle>Current Weather</CardTitle>
            <CardDescription>Real-time conditions in your area</CardDescription>
          </CardHeader>
          <CardContent>
            {currentWeather ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  {getWeatherIcon(currentWeather.icon)}
                  <div>
                    <div className="text-3xl font-bold">{currentWeather.temperature}°C</div>
                    <div className="text-muted-foreground">{currentWeather.condition}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">{currentWeather.humidity}%</div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">{currentWeather.windSpeed} km/h</div>
                      <div className="text-sm text-muted-foreground">Wind Speed</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium">{currentWeather.visibility} km</div>
                      <div className="text-sm text-muted-foreground">Visibility</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium">Feels like {currentWeather.feelsLike}°C</div>
                      <div className="text-sm text-muted-foreground">Apparent Temp</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Detect your location to view current weather conditions</p>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* 5-Day Forecast */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-hover h-full">
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
              <CardDescription>Extended weather outlook</CardDescription>
            </CardHeader>
            <CardContent>
              {forecast.length > 0 ? (
                <div className="space-y-4">
                  {forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getWeatherIcon(day.icon)}
                        <div>
                          <div className="font-medium">{day.date}</div>
                          <div className="text-sm text-muted-foreground">{day.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{day.high}°/{day.low}°</div>
                        <div className="text-sm text-blue-500">{day.rainChance}% rain</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Detect your location to view 5-day forecast</p>
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>

          {/* Weather Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="card-hover h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-warning" />
                <span>Weather Alerts</span>
              </CardTitle>
              <CardDescription>Important weather warnings for farmers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <div key={index} className="p-4 border border-warning/30 bg-warning/10 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-warning">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No weather alerts for your area</p>
                  </div>
                )}
                
                {/* Farming Tips */}
                <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                  <h4 className="font-medium text-success mb-2">Farming Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor weather conditions regularly for optimal farming decisions. 
                    GPS-based weather data provides the most accurate local forecasts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Agricultural Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="card-hover">
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
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;