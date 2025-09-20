import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WeatherAlert {
  id: string;
  type: 'weather' | 'farming';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

interface AlertsResponse {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  alerts: WeatherAlert[];
  farmingTips: {
    irrigation: string;
    sprayConditions: string;
    fieldWork: string;
  };
  timestamp: string;
}

function generateFarmingAlerts(weatherData: any, rainProb: number): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  // Heavy rain alert
  if (rainProb > 70) {
    alerts.push({
      id: 'heavy-rain',
      type: 'weather',
      title: 'Heavy Rain Expected',
      message: `High probability of rain (${rainProb}%). Postpone spraying and field work.`,
      severity: 'high',
      timestamp: new Date().toISOString(),
    });
  }

  // High temperature alert
  if (temp > 35) {
    alerts.push({
      id: 'high-temp',
      type: 'weather',
      title: 'High Temperature Alert',
      message: `Temperature ${Math.round(temp)}°C. Increase irrigation frequency and avoid midday field work.`,
      severity: 'medium',
      timestamp: new Date().toISOString(),
    });
  }

  // Low humidity alert
  if (humidity < 30) {
    alerts.push({
      id: 'low-humidity',
      type: 'farming',
      title: 'Low Humidity Warning',
      message: `Humidity at ${humidity}%. Monitor crops for water stress and consider additional irrigation.`,
      severity: 'medium',
      timestamp: new Date().toISOString(),
    });
  }

  // High wind alert
  if (windSpeed > 10) {
    alerts.push({
      id: 'high-wind',
      type: 'farming',
      title: 'Windy Conditions',
      message: `Wind speed ${Math.round(windSpeed * 3.6)} km/h. Avoid pesticide spraying to prevent drift.`,
      severity: 'medium',
      timestamp: new Date().toISOString(),
    });
  }

  // Frost warning (low temperature)
  if (temp < 2) {
    alerts.push({
      id: 'frost-warning',
      type: 'weather',
      title: 'Frost Warning',
      message: `Temperature dropping to ${Math.round(temp)}°C. Protect sensitive crops from frost damage.`,
      severity: 'high',
      timestamp: new Date().toISOString(),
    });
  }

  return alerts;
}

function generateFarmingTips(weatherData: any, rainProb: number): { irrigation: string; sprayConditions: string; fieldWork: string } {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  let irrigation = 'Normal irrigation schedule';
  let sprayConditions = 'Good conditions for spraying';
  let fieldWork = 'Suitable for field activities';

  // Irrigation recommendations
  if (temp > 30 && humidity < 50) {
    irrigation = 'Increase irrigation frequency due to high temperature and low humidity';
  } else if (rainProb > 50) {
    irrigation = 'Reduce irrigation as rain is expected';
  } else if (temp < 10) {
    irrigation = 'Reduce irrigation frequency in cool weather';
  }

  // Spray conditions
  if (windSpeed > 7) {
    sprayConditions = 'Avoid spraying - wind speed too high, risk of drift';
  } else if (rainProb > 30) {
    sprayConditions = 'Avoid spraying - rain expected within 6 hours';
  } else if (temp > 35) {
    sprayConditions = 'Spray early morning or evening - temperature too high';
  } else if (windSpeed < 3 && temp < 25) {
    sprayConditions = 'Excellent conditions for spraying';
  }

  // Field work recommendations
  if (rainProb > 60) {
    fieldWork = 'Postpone heavy machinery work - rain expected';
  } else if (temp > 40) {
    fieldWork = 'Work during early morning or late evening to avoid heat stress';
  } else if (windSpeed > 15) {
    fieldWork = 'Avoid operations with loose materials due to high winds';
  } else if (temp > 15 && temp < 30 && windSpeed < 10) {
    fieldWork = 'Ideal conditions for all field activities';
  }

  return { irrigation, sprayConditions, fieldWork };
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

  // Parse request body
  const requestBody = await req.json();
  const lat = parseFloat(requestBody.lat);
  const lon = parseFloat(requestBody.lon);

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error('Valid latitude and longitude are required');
    }

    const locationKey = `${lat}_${lon}`;

    // Fetch current weather and forecast for generating alerts
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
    
    console.log('Fetching weather data for alerts generation');
    const [weatherResponse, forecastResponse] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);
    
    if (!weatherResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const weatherData = await weatherResponse.json();
    const forecastData = await forecastResponse.json();

    // Calculate rain probability from forecast
    const rainProb = forecastData.list[0]?.pop ? Math.round(forecastData.list[0].pop * 100) : 0;

    // Generate alerts and tips
    const generatedAlerts = generateFarmingAlerts(weatherData, rainProb);
    const farmingTips = generateFarmingTips(weatherData, rainProb);

    // Store alerts in database
    for (const alert of generatedAlerts) {
      await supabase
        .from('weather_alerts')
        .upsert({
          location_key: locationKey,
          alert_type: alert.type,
          title: alert.title,
          message: alert.message,
          severity: alert.severity,
          expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
        }, {
          onConflict: 'location_key,title'
        });
    }

    // Fetch active alerts from database
    const { data: activeAlerts } = await supabase
      .from('weather_alerts')
      .select('*')
      .eq('location_key', locationKey)
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false });

    // Transform database alerts to response format
    const alerts: WeatherAlert[] = (activeAlerts || []).map(alert => ({
      id: alert.id,
      type: alert.alert_type,
      title: alert.title,
      message: alert.message,
      severity: alert.severity,
      timestamp: alert.created_at,
    }));

    // Create response
    const response: AlertsResponse = {
      location: {
        name: weatherData.name,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
      },
      alerts,
      farmingTips,
      timestamp: new Date().toISOString(),
    };

    console.log('Weather alerts generated successfully');
    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in alerts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});