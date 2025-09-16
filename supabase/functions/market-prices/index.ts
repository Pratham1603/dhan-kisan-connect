import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MarketPriceRequest {
  crop: string;
  state?: string;
  market?: string;
}

interface MarketPriceResponse {
  crop: string;
  market: string;
  state: string;
  prices: {
    min_price: number;
    max_price: number;
    modal_price: number;
    date: string;
  };
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  advisory: string;
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

    const url = new URL(req.url);
    const crop = url.searchParams.get('crop');
    const state = url.searchParams.get('state') || 'Punjab';
    const market = url.searchParams.get('market') || 'Ludhiana';

    if (!crop) {
      throw new Error('Crop parameter is required');
    }

    console.log(`Fetching market prices for crop: ${crop}, state: ${state}, market: ${market}`);

    // Note: This is a placeholder implementation since Agmarknet API integration 
    // requires specific authentication and endpoint details
    // In production, you would integrate with the actual Agmarknet API:
    // https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070

    // Generate realistic market data based on crop type
    const generateMarketData = (cropName: string): MarketPriceResponse => {
      const basePrice = getCropBasePrice(cropName.toLowerCase());
      const variation = 0.1; // 10% price variation
      
      const minPrice = Math.round(basePrice * (1 - variation));
      const maxPrice = Math.round(basePrice * (1 + variation));
      const modalPrice = Math.round(basePrice);

      // Generate trend data
      const trendDirection = Math.random() > 0.5 ? 'up' : Math.random() > 0.25 ? 'down' : 'stable';
      const trendPercentage = Math.round(Math.random() * 10 * 100) / 100;

      // Generate advisory based on price trend
      let advisory = "";
      if (trendDirection === 'up') {
        advisory = `${cropName} prices are trending upward (+${trendPercentage}%). Good time to consider selling if you have stock. Monitor market closely for optimal selling opportunity.`;
      } else if (trendDirection === 'down') {
        advisory = `${cropName} prices are declining (-${trendPercentage}%). Consider holding if possible or explore value-added processing options. Check for government procurement schemes.`;
      } else {
        advisory = `${cropName} prices are stable. Current rates are fair for trading. Consider market timing and transportation costs before selling.`;
      }

      return {
        crop: cropName,
        market: market,
        state: state,
        prices: {
          min_price: minPrice,
          max_price: maxPrice,
          modal_price: modalPrice,
          date: new Date().toISOString().split('T')[0],
        },
        trend: {
          direction: trendDirection as 'up' | 'down' | 'stable',
          percentage: trendPercentage,
        },
        advisory,
      };
    };

    const getCropBasePrice = (crop: string): number => {
      const cropPrices: { [key: string]: number } = {
        // Prices in INR per quintal
        'wheat': 2200,
        'rice': 2800,
        'cotton': 5500,
        'sugarcane': 350,
        'maize': 1800,
        'bajra': 2100,
        'gram': 5200,
        'mustard': 5800,
        'groundnut': 5500,
        'soybean': 4200,
        'jowar': 2900,
        'barley': 1750,
        'lentil': 6200,
        'chickpea': 5200,
        'onion': 1200,
        'potato': 1800,
        'tomato': 2500,
        'cabbage': 1500,
        'cauliflower': 2000,
      };

      return cropPrices[crop] || 2500; // Default price if crop not found
    };

    const response = generateMarketData(crop);

    console.log('Market price data generated:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in market-prices function:', error);
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