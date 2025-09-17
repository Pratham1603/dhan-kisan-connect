-- Create soil_reports table for storing soil analysis results
CREATE TABLE public.soil_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ocr_text TEXT,
  analysis JSONB,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.soil_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own soil reports" 
ON public.soil_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own soil reports" 
ON public.soil_reports 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own soil reports" 
ON public.soil_reports 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own soil reports" 
ON public.soil_reports 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_soil_reports_updated_at
BEFORE UPDATE ON public.soil_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();