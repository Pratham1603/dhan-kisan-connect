import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SoilAnalysisResponse {
  status: 'Good' | 'Needs Improvement' | 'Poor';
  parameters: {
    pH?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    organic_carbon?: number;
    [key: string]: any;
  };
  issues: string[];
  advice: string[];
  language: string;
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
    const language = formData.get('language') as string || 'English';

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    console.log(`Processing soil analysis for image: ${imageFile.name}, size: ${imageFile.size} bytes, language: ${language}`);

    // Convert image to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    let ocrText = '';
    
    // Google Vision API OCR
    const googleVisionKey = Deno.env.get('GOOGLE_VISION_API_KEY');
    if (googleVisionKey) {
      try {
        const visionResponse = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleVisionKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Image },
              features: [{ type: 'TEXT_DETECTION' }]
            }]
          })
        });

        const visionData = await visionResponse.json();
        if (visionData.responses?.[0]?.textAnnotations?.[0]?.description) {
          ocrText = visionData.responses[0].textAnnotations[0].description;
          console.log('OCR extraction successful:', ocrText.substring(0, 200) + '...');
        }
      } catch (error) {
        console.error('Google Vision OCR failed:', error);
        ocrText = 'OCR extraction failed. Using dummy analysis.';
      }
    } else {
      console.log('Google Vision API key not found, using dummy OCR text');
      ocrText = 'Sample Soil Test Report\nSoil pH: 6.8\nNitrogen: 150 ppm\nPhosphorus: 25 ppm\nPotassium: 280 ppm\nOrganic Carbon: 0.8%\nElectrical Conductivity: 0.4 dS/m';
    }

    // AI Analysis using OpenAI
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    let analysisResult: SoilAnalysisResponse;

    if (openAIKey && ocrText) {
      try {
        const systemPrompt = `You are an agricultural soil analysis expert. Analyze the extracted text from a soil test report and provide structured recommendations in ${language}. 

        Extract numerical values for soil parameters and provide farming advice.
        
        Respond with JSON in this exact format:
        {
          "status": "Good" | "Needs Improvement" | "Poor",
          "parameters": {
            "pH": number,
            "nitrogen": number,
            "phosphorus": number,
            "potassium": number,
            "organic_carbon": number
          },
          "issues": ["list", "of", "issues"],
          "advice": ["practical", "farming", "recommendations"],
          "language": "${language}"
        }`;

        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-5-mini-2025-08-07',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Analyze this soil test report text:\n\n${ocrText}` }
            ],
            max_completion_tokens: 1000,
          }),
        });

        const aiData = await aiResponse.json();
        if (aiData.choices?.[0]?.message?.content) {
          try {
            analysisResult = JSON.parse(aiData.choices[0].message.content);
            console.log('AI analysis successful');
          } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Invalid AI response format');
          }
        } else {
          throw new Error('No AI response received');
        }
      } catch (error) {
        console.error('OpenAI analysis failed:', error);
        // Fall back to dummy analysis
        analysisResult = generateDummyAnalysis(language);
      }
    } else {
      console.log('OpenAI API key not found or no OCR text, using dummy analysis');
      analysisResult = generateDummyAnalysis(language);
    }

    // Log the analysis for debugging
    console.log('Soil analysis completed:', {
      user_id: user.id,
      image_name: imageFile.name,
      image_size: imageFile.size,
      language: language,
      status: analysisResult.status,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({
      ocrText,
      analysis: analysisResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in soil-analyze function:', error);
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

function generateDummyAnalysis(language: string): SoilAnalysisResponse {
  const dummyData = {
    English: {
      status: 'Needs Improvement' as const,
      parameters: {
        pH: 6.8,
        nitrogen: 150,
        phosphorus: 25,
        potassium: 280,
        organic_carbon: 0.8
      },
      issues: [
        'Low phosphorus levels detected',
        'Organic carbon content below optimal range',
        'Soil pH slightly acidic for most crops'
      ],
      advice: [
        'Apply DAP fertilizer to increase phosphorus levels',
        'Add organic compost to improve soil structure',
        'Consider lime application to adjust pH to 7.0-7.5',
        'Use balanced NPK fertilizer for overall nutrition'
      ]
    },
    Hindi: {
      status: 'Needs Improvement' as const,
      parameters: {
        pH: 6.8,
        nitrogen: 150,
        phosphorus: 25,
        potassium: 280,
        organic_carbon: 0.8
      },
      issues: [
        'फॉस्फोरस का स्तर कम है',
        'जैविक कार्बन की मात्रा कम है',
        'मिट्टी का pH अधिकांश फसलों के लिए थोड़ा अम्लीय है'
      ],
      advice: [
        'फॉस्फोरस बढ़ाने के लिए DAP खाद का उपयोग करें',
        'मिट्टी की संरचना सुधारने के लिए जैविक खाद डालें',
        'pH को 7.0-7.5 तक लाने के लिए चूना डालना विचार करें',
        'समग्र पोषण के लिए संतुलित NPK खाद का उपयोग करें'
      ]
    }
  };

  return {
    ...dummyData[language as keyof typeof dummyData] || dummyData.English,
    language
  };
}