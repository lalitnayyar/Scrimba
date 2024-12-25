import OpenAI from 'openai';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
	  baseURL:'https://gateway.ai.cloudflare.com/v1/550a30a1d6978be9ba1464cd84c11f43/stock-predictions/openai'
    });
    
    /* Challenge: 
        - Pass the chat completions endpoint the `messages`
          array sent from the client. 
    */

    try {
      const messages = await request.json()
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 1.1,
        presence_penalty: 0,
        frequency_penalty: 0
      });
      const response = chatCompletion.choices[0].message;
      
      return new Response(JSON.stringify(response), { headers: corsHeaders });
    } catch(e) {
      return new Response(e, { headers: corsHeaders });
    }
  },
};