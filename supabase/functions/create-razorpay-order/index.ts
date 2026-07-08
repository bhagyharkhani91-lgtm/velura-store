import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { amount, receipt } = await req.json();

    // Get keys from environment variables (fallback to the provided test key for development)
    const keyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_test_TAzZYC15Rkxqdh';
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'SBpkVPM74j64SmISy8BHQeMw';

    const basicAuth = btoa(`${keyId}:${keySecret}`);

    // Call Razorpay API to create an order
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Razorpay expects amount in paise (cents)
        currency: "INR",
        receipt: receipt || `receipt_${Date.now()}`
      })
    });

    const orderData = await razorpayRes.json();

    if (!razorpayRes.ok) {
      throw new Error(`Razorpay Error: ${orderData.error?.description || 'Unknown error'}`);
    }

    return new Response(
      JSON.stringify(orderData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
    );
  }
});
