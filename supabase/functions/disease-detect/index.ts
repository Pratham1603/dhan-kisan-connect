import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DiseaseDetectionResponse {
  disease: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  affected_area: number; // percentage
  treatment: {
    immediate_actions: string[];
    preventive_measures: string[];
    recommended_products: string[];
  };
  follow_up: {
    monitoring_frequency: string;
    expected_recovery_time: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    if (req.method !== 'POST') {
      throw new Error('Only POST method allowed');
    }

    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    console.log(`Processing disease detection for image: ${imageFile.name}, size: ${imageFile.size} bytes`);

    // TODO: Integrate with Roboflow/YOLOv8 API for actual disease detection
    // For now, returning realistic dummy data as requested

    const generateDummyDetection = (): DiseaseDetectionResponse => {
      const diseases = [
        {
          name: "Leaf Blight",
          confidence: 0.92,
          severity: "medium" as const,
          area: 25,
          immediate: ["Remove affected leaves immediately", "Apply copper-based fungicide", "Improve air circulation"],
          preventive: ["Avoid overhead watering", "Space plants adequately", "Apply preventive fungicide spray"],
          products: ["Copper Hydroxide 53.8% DF", "Mancozeb 75% WP", "Propiconazole 25% EC"],
          monitoring: "Daily for first week, then every 3 days",
          recovery: "2-3 weeks with proper treatment"
        },
        {
          name: "Powdery Mildew",
          confidence: 0.87,
          severity: "low" as const,
          area: 15,
          immediate: ["Spray neem oil solution", "Remove severely affected parts", "Increase sunlight exposure"],
          preventive: ["Maintain proper plant spacing", "Avoid high nitrogen fertilizers", "Regular monitoring"],
          products: ["Neem Oil 1500 PPM", "Sulfur 80% WDG", "Potassium Bicarbonate"],
          monitoring: "Every 2-3 days initially",
          recovery: "1-2 weeks"
        },
        {
          name: "Bacterial Spot",
          confidence: 0.78,
          severity: "high" as const,
          area: 40,
          immediate: ["Apply copper bactericide", "Remove infected plant debris", "Disinfect tools"],
          preventive: ["Use drip irrigation", "Rotate crops", "Plant resistant varieties"],
          products: ["Copper Sulfate Pentahydrate", "Streptomycin 90% + Tetracycline 10%", "Kasugamycin 3% SL"],
          monitoring: "Daily monitoring required",
          recovery: "3-4 weeks"
        }
      ];

      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];

      return {
        disease: randomDisease.name,
        confidence: randomDisease.confidence,
        severity: randomDisease.severity,
        affected_area: randomDisease.area,
        treatment: {
          immediate_actions: randomDisease.immediate,
          preventive_measures: randomDisease.preventive,
          recommended_products: randomDisease.products,
        },
        follow_up: {
          monitoring_frequency: randomDisease.monitoring,
          expected_recovery_time: randomDisease.recovery,
        },
      };
    };

    const response = generateDummyDetection();

    // Log the detection for future ML model training
    console.log('Disease detection completed:', {
      user_id: user.id,
      image_name: imageFile.name,
      image_size: imageFile.size,
      detected_disease: response.disease,
      confidence: response.confidence,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in disease-detect function:', error);
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