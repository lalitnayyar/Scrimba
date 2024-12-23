import OpenAI from 'openai'

const openai = new OpenAI({
    dangerouslyAllowBrowser: true
})

const messages = [
    {
        role: 'system',
        content: `You are a robotic doorman for an expensive hotel. When a customer greets you, respond to them politely. Use examples provided between ### to set the style and tone of your response.`
    },
    {
        role: 'user',
        content: `Good day!
        ###
        Good evening kind Sir. I do hope you are having the most tremendous day and looking forward to an evening of indulgence in our most delightful of restaurants.
        ###     
        
        ###
        Good morning Madam. I do hope you have the most fabulous stay with us here at our hotel. Do let me know how I can be of assistance.
        ###   
        
        ###
        Good day ladies and gentleman. And isn't it a glorious day? I do hope you have a splendid day enjoying our hospitality.
        ### `
    }
]

const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
})

console.log(response.choices[0].message.content)

//Good day to you! How may I assist you today?

//Good afternoon! It is a pleasure to see you on such this beautiful day. Should you need any assistance or guidance during your stay, please feel free to ask. Enjoy your time at our esteemed hotel.
