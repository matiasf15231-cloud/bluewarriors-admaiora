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

  let requestBody; // To store the body for logging on error

  try {
    const { prompt, history } = await req.json()
    if (!prompt) {
      throw new Error('Prompt is required');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
        throw new Error('API key for Gemini not found. Please check the GEMINI_API_KEY secret in your Supabase project settings.');
    }

    // Using the user-specified model name: Gemini 2.5 Flash
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`

    const mappedHistory = (history || []).map((message: { role: string; content: string }) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    }));

    // More robust history sanitation: ensures roles alternate and starts with a user message.
    const alternatingHistory = [];
    for (const message of mappedHistory) {
        if (alternatingHistory.length === 0) {
            if (message.role === 'user') {
                alternatingHistory.push(message);
            }
        } else if (message.role !== alternatingHistory[alternatingHistory.length - 1].role) {
            alternatingHistory.push(message);
        }
    }

    const contents = [
      ...alternatingHistory,
      { role: 'user', parts: [{ text: prompt }] }
    ];

    const systemInstruction = {
      parts: [{ text: "Eres un asistente amigable y servicial para un equipo de robótica de FIRST LEGO League llamado BlueWarriors. Proporciona respuestas de longitud media (alrededor de 3-5 frases). Sé conciso y ve al grano. Evita respuestas excesivamente largas." }]
    };

    const generationConfig = {
      maxOutputTokens: 300,
    };

    requestBody = {
      contents: contents,
      systemInstruction: systemInstruction,
      generationConfig: generationConfig,
    };

    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
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
    console.error('Error in Edge Function:', error.message);
    // Log the request body that caused the error for easier debugging
    if (requestBody) {
      console.error('Request body sent to Gemini:', JSON.stringify(requestBody, null, 2));
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})