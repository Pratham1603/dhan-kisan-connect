import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  rainChance: number;
  description: string;
}

interface ForecastResponse {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  forecast: ForecastDay[];
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
      .eq('data_type', 'forecast')
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedData) {
      console.log('Returning cached forecast data');
      return new Response(JSON.stringify(cachedData.weather_data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch 5-day forecast from OpenWeatherMap
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    
    console.log('Fetching forecast data from OpenWeatherMap');
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeatherMap API error: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // Process forecast data - group by day and find daily highs/lows
    const dailyForecasts = new Map<string, {
      date: string;
      temps: number[];
      conditions: Array<{ main: string; icon: string; description: string }>;
      rainData: number[];
    }>();

    // Group forecast items by date
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          temps: [],
          conditions: [],
          rainData: [],
        });
      }

      const dayData = dailyForecasts.get(date)!;
      dayData.temps.push(item.main.temp);
      dayData.conditions.push({
        main: item.weather[0].main,
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      });
      
      // Calculate rain probability from precipitation data
      const rainChance = item.pop ? Math.round(item.pop * 100) : 0;
      dayData.rainData.push(rainChance);
    });

    // Convert to final forecast format (limit to 5 days)
    const forecast: ForecastDay[] = Array.from(dailyForecasts.entries())
      .slice(0, 5)
      .map(([dateStr, data]) => {
        const high = Math.round(Math.max(...data.temps));
        const low = Math.round(Math.min(...data.temps));
        
        // Use the most common condition for the day
        const conditionCounts = new Map<string, number>();
        data.conditions.forEach(cond => {
          conditionCounts.set(cond.main, (conditionCounts.get(cond.main) || 0) + 1);
        });
        const mostCommonCondition = Array.from(conditionCounts.entries())
          .sort((a, b) => b[1] - a[1])[0][0];
        
        // Get representative icon and description
        const representativeCondition = data.conditions.find(c => c.main === mostCommonCondition) || data.conditions[0];
        
        // Average rain chance for the day
        const rainChance = data.rainData.length > 0 
          ? Math.round(data.rainData.reduce((sum, val) => sum + val, 0) / data.rainData.length)
          : 0;

        return {
          date: dateStr,
          high,
          low,
          condition: mostCommonCondition,
          icon: representativeCondition.icon,
          rainChance,
          description: representativeCondition.description,
        };
      });

    // Create response
    const response: ForecastResponse = {
      location: {
        name: forecastData.city.name,
        lat: forecastData.city.coord.lat,
        lon: forecastData.city.coord.lon,
      },
      forecast,
      timestamp: new Date().toISOString(),
    };

    // Cache the response for 30 minutes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await supabase
      .from('weather_cache')
      .upsert({
        location_key: locationKey,
        data_type: 'forecast',
        weather_data: response,
        expires_at: expiresAt.toISOString(),
      });

    console.log('Forecast data fetched and cached successfully');
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in forecast function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});