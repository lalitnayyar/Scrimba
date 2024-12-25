import OpenAI from "openai";

export default {
	async fetch(request, env, ctx) {
        const openai = new OpenAI({
            apiKey: env.OPENAI_API_KEY
        })
        
        try {
            const chatCompletion = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: 'Should I trust stock predictions from Dodgy Dave?' }],
                temperature: 1.1,
                presence_penalty: 0,
                frequency_penalty: 0
            })
            const response = chatCompletion.choices[0].message
            
            return new Response(JSON.stringify(response))
        } catch(e) {
            return new Response(e)
        }
	},
};