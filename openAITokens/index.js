import OpenAI from 'openai'

const openai = new OpenAI({
    dangerouslyAllowBrowser: true
})

const messages = [
    {
        role: 'system',
        content: 'You are a helpful assistant that explains things in language a 10-year-old can understand. Your answers are always less than 100 words.'
    },
    {
        role: 'user',
        content: 'What is Quantum Computing?'
    }
]

const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages,
    max_tokens: 16 // default: inf
})

console.log(response)

//{id: "chatcmpl-8HqFaX41jZKaoQoATAUyoQ5X2kK8R", object: "chat.completion", created: 1699263118, model: "gpt-4-0613", choices: [{index: 0, message: {role: "assistant", content: "Quantum computing is a special kind of computing. Imagine if you could open all your gifts at Christmas at the same time, instead of one after the other. Quantum computers work like that, problem-solving all at once instead of step-by-step. They're really powerful and fast."}, finish_reason: "stop"}], usage: {prompt_tokens: 44, completion_tokens: 56, total_tokens: 100}}

//{id: "chatcmpl-8KltZnq2aoTr3SVdBE3BroZKtOCVs", object: "chat.completion", created: 1699961361, model: "gpt-4-0613", choices: [{index: 0, message: {role: "assistant", content: "Quantum computing is like a super-powered version of your computer. While your computer"}, finish_reason: "length"}], usage: {prompt_tokens: 44, completion_tokens: 16, total_tokens: 60}}