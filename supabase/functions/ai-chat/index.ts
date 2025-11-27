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
    const { prompt, history } = await req.json() // Expect history
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Retrieve the secure API key from Supabase secrets
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
        throw new Error('API key for Gemini not found. Please check the GEMINI_API_KEY secret in your Supabase project settings.');
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`

    // Map roles from 'assistant' to 'model' for the Gemini API
    const mappedHistory = (history || []).map((message: { role: string; content: string }) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    }));

    // System instruction to guide the AI's response length
    const systemInstruction = {
      role: 'user',
      parts: [{ text: "Por favor, proporciona respuestas de longitud media (alrededor de 3-5 frases). Sé conciso y ve al grano. Evita respuestas excesivamente largas." }]
    };
    const systemResponse = {
      role: 'model',
      parts: [{ text: "Entendido. Seré conciso y mis respuestas serán de longitud media." }]
    };

    const contents = [
      systemInstruction,
      systemResponse,
      ...mappedHistory,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    // Configuration to set a hard limit on the response size
    const generationConfig = {
      maxOutputTokens: 300,
    };

    // Call the Gemini API
    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        generationConfig: generationConfig, // Add generation config here
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
    // Return a proper server error status
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})