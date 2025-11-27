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

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
        throw new Error('API key for Gemini not found. Please check the GEMINI_API_KEY secret in your Supabase project settings.');
    }

    // Use the streaming endpoint for Gemini
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${geminiApiKey}`

    const geminiResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!geminiResponse.ok || !geminiResponse.body) {
      const errorBody = await geminiResponse.text();
      throw new Error(`Gemini API error (${geminiResponse.status}): ${errorBody}`);
    }

    // Create a TransformStream to process the Gemini stream
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = geminiResponse.body.getReader();
    const decoder = new TextDecoder();

    // Function to pump data from Gemini to our response stream
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          writer.close();
          return;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        // Gemini streaming response often comes in chunks of JSON-like data
        // We need to extract the text content from each part.
        try {
          // Each chunk might contain multiple JSON objects, so we split by a common delimiter
          const parts = chunk.split('data: ');
          for (const part of parts) {
            if (part.trim()) {
              const json = JSON.parse(part);
              const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                await writer.write(new TextEncoder().encode(text));
              }
            }
          }
        } catch (e) {
          // Ignore parsing errors for incomplete chunks
        }
      }
    };

    pump();

    return new Response(readable, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in Edge Function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})