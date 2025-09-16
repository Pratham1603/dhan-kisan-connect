import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertRequest {
  phone: string;
  message: string;
  type: 'sms' | 'whatsapp';
  priority?: 'low' | 'medium' | 'high';
}

interface AlertResponse {
  success: boolean;
  message_id?: string;
  delivery_status: string;
  cost?: number;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');

    if (!twilioAccountSid || !twilioAuthToken) {
      throw new Error('Twilio credentials not configured');
    }

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

    const { phone, message, type = 'sms', priority = 'medium' }: AlertRequest = await req.json();

    if (!phone || !message) {
      throw new Error('Phone number and message are required');
    }

    // Format phone number (ensure it starts with +)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    console.log(`Sending ${type} alert to ${formattedPhone} with priority: ${priority}`);

    // Prepare Twilio API request
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
    
    let fromNumber: string;
    let messageBody: string;

    if (type === 'whatsapp') {
      fromNumber = 'whatsapp:+14155238886'; // Twilio WhatsApp Sandbox number
      messageBody = `🌾 *KrishiMarg Alert*\n\n${message}\n\n_Sent via KrishiMarg farming advisory system_`;
    } else {
      fromNumber = '+1234567890'; // Replace with your Twilio phone number
      messageBody = `KrishiMarg Alert: ${message}`;
    }

    const formData = new URLSearchParams();
    formData.append('To', type === 'whatsapp' ? `whatsapp:${formattedPhone}` : formattedPhone);
    formData.append('From', fromNumber);
    formData.append('Body', messageBody);

    // Add priority-based features
    if (priority === 'high') {
      formData.append('StatusCallback', `${supabaseUrl}/functions/v1/sms-status-callback`);
      formData.append('ValidityPeriod', '14400'); // 4 hours for high priority
    }

    const authString = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!twilioResponse.ok) {
      const errorData = await twilioResponse.json();
      throw new Error(`Twilio API error: ${errorData.message || twilioResponse.status}`);
    }

    const twilioData = await twilioResponse.json();

    const response: AlertResponse = {
      success: true,
      message_id: twilioData.sid,
      delivery_status: twilioData.status,
      cost: parseFloat(twilioData.price || '0'),
    };

    // Log the alert for tracking and analytics
    console.log('Alert sent successfully:', {
      user_id: user.id,
      phone: formattedPhone,
      type,
      priority,
      message_id: twilioData.sid,
      status: twilioData.status,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-alert function:', error);
    
    const errorResponse: AlertResponse = {
      success: false,
      delivery_status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});