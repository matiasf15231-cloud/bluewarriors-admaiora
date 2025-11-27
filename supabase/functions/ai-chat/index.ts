import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// CORS headers for security
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Main function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Retrieve the secure API key from Supabase secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
        throw new Error('API key for Gemini not found. Please check the GEMINI_API_KEY secret in your Supabase project settings.');
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`

    // Call the Gemini API
    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      let errorMessage = `Gemini API error (${geminiResponse.status}): ${errorBody}`;
      try {
        const errorJson = JSON.parse(errorBody);
        if (errorJson.error && errorJson.error.message) {
          errorMessage = `Gemini API Error: ${errorJson.error.message}`;
        }
      } catch (e) {
        // Not a JSON error, use the raw text
      }
      throw new Error(errorMessage);
    }

    const geminiData = await geminiResponse.json()
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener una respuesta."

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in Edge Function:', error.message)
    // IMPORTANT: Always return 200 OK, but with an error payload for debugging
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})