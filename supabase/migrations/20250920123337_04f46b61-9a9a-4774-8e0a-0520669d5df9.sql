-- Create user_locations table for storing user location preferences
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather_cache table for caching weather data
CREATE TABLE public.weather_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_key TEXT NOT NULL, -- lat_lon format like "40.7128_-74.0060"
  data_type TEXT NOT NULL, -- 'current' or 'forecast'
  weather_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather_alerts table for storing alerts and farming tips
CREATE TABLE public.weather_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_key TEXT NOT NULL,
  alert_type TEXT NOT NULL, -- 'weather' or 'farming'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'low', 'medium', 'high'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_locations
CREATE POLICY "Users can view their own locations" 
ON public.user_locations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own locations" 
ON public.user_locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations" 
ON public.user_locations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locations" 
ON public.user_locations 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for weather_cache (public read access for performance)
CREATE POLICY "Weather cache is readable by authenticated users" 
ON public.weather_cache 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- RLS policies for weather_alerts (public read access)
CREATE POLICY "Weather alerts are readable by authenticated users" 
ON public.weather_alerts 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX idx_user_locations_default ON public.user_locations(user_id, is_default);
CREATE INDEX idx_weather_cache_location_type ON public.weather_cache(location_key, data_type);
CREATE INDEX idx_weather_cache_expires ON public.weather_cache(expires_at);
CREATE INDEX idx_weather_alerts_location ON public.weather_alerts(location_key, is_active);
CREATE INDEX idx_weather_alerts_expires ON public.weather_alerts(expires_at);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to clean expired cache entries
CREATE OR REPLACE FUNCTION public.clean_expired_weather_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.weather_cache WHERE expires_at < now();
  DELETE FROM public.weather_alerts WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$$;