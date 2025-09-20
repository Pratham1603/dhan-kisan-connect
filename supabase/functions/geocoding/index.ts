import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LocationDetails {
  country: string;
  state: string;
  district: string;
  city: string;
  locality: string;
  village: string;
  formatted_name: string;
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

    const locationKey = `${lat.toFixed(4)}_${lon.toFixed(4)}`;

    // Check cache first
    const { data: cachedLocation } = await supabase
      .from('location_cache')
      .select('*')
      .eq('location_key', locationKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (cachedLocation) {
      console.log('Returning cached location data');
      return new Response(JSON.stringify({
        country: cachedLocation.country,
        state: cachedLocation.state,
        district: cachedLocation.district,
        city: cachedLocation.city,
        locality: cachedLocation.locality,
        village: cachedLocation.village,
        formatted_name: cachedLocation.formatted_name,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch reverse geocoding from OpenWeatherMap
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherApiKey}`;
    
    console.log('Fetching location data from OpenWeatherMap');
    const geocodingResponse = await fetch(geocodingUrl);
    
    if (!geocodingResponse.ok) {
      throw new Error(`OpenWeatherMap Geocoding API error: ${geocodingResponse.status}`);
    }

    const geocodingData = await geocodingResponse.json();

    if (!geocodingData || geocodingData.length === 0) {
      throw new Error('No location data found for the provided coordinates');
    }

    const locationData = geocodingData[0];

    // Extract location details with fallbacks
    const locationDetails: LocationDetails = {
      country: locationData.country || '',
      state: locationData.state || '',
      district: locationData.state || '', // OpenWeather doesn't provide district separately, use state as fallback
      city: locationData.name || '',
      locality: locationData.local_names?.en || locationData.name || '',
      village: '', // OpenWeather API doesn't provide village level detail
      formatted_name: ''
    };

    // Create a formatted name with available details
    const nameParts = [
      locationDetails.city,
      locationDetails.district !== locationDetails.city ? locationDetails.district : null,
      locationDetails.state,
      locationDetails.country
    ].filter(part => part && part.trim() !== '');

    locationDetails.formatted_name = nameParts.join(', ');

    // Cache the response for 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await supabase
      .from('location_cache')
      .upsert({
        lat: lat,
        lon: lon,
        location_key: locationKey,
        country: locationDetails.country,
        state: locationDetails.state,
        district: locationDetails.district,
        city: locationDetails.city,
        locality: locationDetails.locality,
        village: locationDetails.village,
        formatted_name: locationDetails.formatted_name,
        expires_at: expiresAt.toISOString(),
      });

    console.log('Location data fetched and cached successfully');
    return new Response(JSON.stringify(locationDetails), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in geocoding function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});