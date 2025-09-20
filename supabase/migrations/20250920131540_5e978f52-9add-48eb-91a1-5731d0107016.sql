-- Create table for caching geocoding results
CREATE TABLE public.location_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  location_key VARCHAR(50) NOT NULL UNIQUE,
  country VARCHAR(100),
  state VARCHAR(100), 
  district VARCHAR(100),
  city VARCHAR(100),
  locality VARCHAR(100),
  village VARCHAR(100),
  formatted_name VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Enable Row Level Security
ALTER TABLE public.location_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (location data is generally public)
CREATE POLICY "Location cache is publicly readable" 
ON public.location_cache 
FOR SELECT 
USING (true);

-- Create policy for service role to insert/update
CREATE POLICY "Service role can manage location cache" 
ON public.location_cache 
FOR ALL 
USING (true);

-- Create index for efficient lookups
CREATE INDEX idx_location_cache_key ON public.location_cache(location_key);
CREATE INDEX idx_location_cache_expires ON public.location_cache(expires_at);

-- Update weather_cache table to include detailed location info
ALTER TABLE public.weather_cache 
ADD COLUMN location_details JSONB;

-- Function to clean expired location data
CREATE OR REPLACE FUNCTION public.clean_expired_location_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  DELETE FROM public.location_cache WHERE expires_at < now();
END;
$function$;