import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherResponse {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  current: {
    temperature: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    feelsLike: number;
    pressure: number;
    uvIndex: number;
  };
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API keys and credentials
    const openWeatherApiKey = Deno.env.get('OPENWEATHER_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openWeatherApiKey) {
      throw new Error('OpenWeather API key not configured');
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Get JWT from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Verify JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: user, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    // Parse query parameters
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('Valid latitude and longitude are required');
    }

    const locationKey = `${lat}_${lon}`;

    // Check cache first
    const { data: cachedData } = await supabase
      .from('weather_cache')
      .select('weather_data, expires_at')
      .eq('location_key', locationKey)
      .eq('data_type', 'current')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedData) {
      console.log('Returning cached weather data');
      return new Response(JSON.stringify(cachedData.weather_data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch current weather from OpenWeatherMap
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    
    console.log('Fetching weather data from OpenWeatherMap');
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      throw new Error(`OpenWeatherMap API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Transform the data to match our frontend structure
    const response: WeatherResponse = {
      location: {
        name: weatherData.name,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      current: {
        temperature: Math.round(weatherData.main.temp),
        condition: weatherData.weather[0].main,
        icon: weatherData.weather[0].icon,
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round(weatherData.visibility / 1000), // Convert meters to km
        feelsLike: Math.round(weatherData.main.feels_like),
        pressure: weatherData.main.pressure,
        uvIndex: 0, // UV index not available in current weather API
      },
      timestamp: new Date().toISOString(),
    };

    // Cache the response for 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await supabase
      .from('weather_cache')
      .upsert({
        location_key: locationKey,
        data_type: 'current',
        weather_data: response,
        expires_at: expiresAt.toISOString(),
      });

    console.log('Weather data fetched and cached successfully');
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in current-weather function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});