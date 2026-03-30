import { callLLM } from './src/lib/ai/llm'

async function test() {
  console.log('Testing callLLM retry logic...')
  try {
    // This will likely fail with a real API key if we don't have one, 
    // but we can check the logs to see if it retries.
    // To properly test, we should mock the OpenAI client.
    const result = await callLLM('You are a tester.', 'Say hello.', {
      debugLog: (stage, payload) => {
        console.log(`[DEBUG] ${stage}:`, JSON.stringify(payload))
      }
    })
    console.log('Result:', result)
  } catch (e) {
    console.error('Final error:', e)
  }
}

test()
