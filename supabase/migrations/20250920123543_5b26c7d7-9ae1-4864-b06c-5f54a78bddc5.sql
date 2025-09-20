-- Fix security warning: Set search_path for function
CREATE OR REPLACE FUNCTION public.clean_expired_weather_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.weather_cache WHERE expires_at < now();
  DELETE FROM public.weather_alerts WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$$;