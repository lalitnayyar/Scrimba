import OpenAI from 'openai'

const openai = new OpenAI({
    dangerouslyAllowBrowser: true
})

const messages = [
    {
        role: 'system',
        content: 'You are a helpful assistant'
    },
    {
        role: 'user',
        content: 'What is my name?'
    }
] 

const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: messages
})
 
console.log(response)