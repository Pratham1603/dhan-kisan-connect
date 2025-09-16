import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherRequest {
  lat: number;
  lon: number;
  city?: string;
}

interface WeatherResponse {
  location: {
    city: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    description: string;
    humidity: number;
    wind_speed: number;
  };
  forecast: {
    rain_probability: number;
    advisory: string;
    alerts: string[];
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!openWeatherApiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Get user from JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get('lat') || '0');
    const lon = parseFloat(url.searchParams.get('lon') || '0');

    if (!lat || !lon) {
      throw new Error('Latitude and longitude are required');
    }

    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      throw new Error(`OpenWeather API error: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();

    // Fetch forecast data
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeather Forecast API error: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();

    // Calculate rain probability from forecast
    const rainProbability = forecastData.list
      .slice(0, 8) // Next 24 hours (3-hour intervals)
      .reduce((sum: number, item: any) => sum + (item.pop || 0), 0) / 8;

    // Generate farming advisory based on weather conditions
    const generateAdvisory = (weather: any, rainProb: number): { advisory: string; alerts: string[] } => {
      const temp = weather.main.temp;
      const humidity = weather.main.humidity;
      const windSpeed = weather.wind.speed;
      const description = weather.weather[0].main.toLowerCase();
      
      let advisory = "";
      let alerts: string[] = [];

      // Temperature-based advice
      if (temp > 35) {
        advisory += "High temperature detected. Increase irrigation frequency and provide shade for sensitive crops. ";
        alerts.push("HEAT_WAVE");
      } else if (temp < 10) {
        advisory += "Low temperature alert. Protect crops from frost and consider covering young plants. ";
        alerts.push("FROST_WARNING");
      }

      // Rain-based advice
      if (rainProb > 0.7) {
        advisory += "Heavy rain expected. Ensure proper drainage and postpone pesticide application. ";
        alerts.push("HEAVY_RAIN");
      } else if (rainProb < 0.1 && humidity < 30) {
        advisory += "Dry conditions expected. Increase irrigation and monitor soil moisture levels. ";
        alerts.push("DROUGHT_RISK");
      }

      // Wind-based advice
      if (windSpeed > 10) {
        advisory += "Strong winds forecasted. Secure greenhouse structures and avoid aerial spraying. ";
        alerts.push("STRONG_WIND");
      }

      // Default advice if no specific conditions
      if (!advisory) {
        advisory = "Weather conditions are favorable for normal farming activities. Monitor crops regularly and maintain irrigation schedules.";
      }

      return { advisory: advisory.trim(), alerts };
    };

    const { advisory, alerts } = generateAdvisory(currentData, rainProbability);

    const response: WeatherResponse = {
      location: {
        city: currentData.name,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
      current: {
        temperature: Math.round(currentData.main.temp),
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      },
      forecast: {
        rain_probability: Math.round(rainProbability * 100),
        advisory,
        alerts,
      },
    };

    console.log('Weather advisory generated:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in weather-alerts function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});