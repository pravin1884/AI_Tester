import axios from 'axios';

const SYSTEM_PROMPT = `You are a strict QA Test Case Generator.
Given a requirement, generate a comprehensive Jira-formatted test case (or multiple test cases if needed) covering both functional and non-functional aspects.
Output MUST strictly follow this Jira format:

**Summary**: [Brief description]
**Description**: [Detailed description]
**Pre-conditions**: [Setup needed]
**Test Steps**:
1. [Step 1]
2. [Step 2]
**Expected Results**: [What should happen]`;

export const generateWithLLM = async (provider: string, config: any, requirement: string): Promise<string> => {
  const prompt = `Requirement: ${requirement}\n\nGenerate the test case now.`;
  
  if (provider === 'ollama') {
    const response = await axios.post(`${config.url || 'http://localhost:11434'}/api/generate`, {
      model: config.model || 'llama3',
      system: SYSTEM_PROMPT,
      prompt: prompt,
      stream: false
    });
    return response.data.response;
  }
  
  if (provider === 'openai' || provider === 'lmstudio' || provider === 'grok') {
    const baseURL = provider === 'lmstudio' ? config.url : 
                    provider === 'grok' ? 'https://api.groq.com/openai/v1' : 
                    'https://api.openai.com/v1';
    
    const response = await axios.post(`${baseURL}/chat/completions`, {
      model: config.model || (provider === 'grok' ? 'mixtral-8x7b-32768' : 'gpt-3.5-turbo'),
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].message.content;
  }
  
  if (provider === 'gemini') {
    // Requires @google/genai or standard fetch, using simple stub for now
    return `[Gemini] Mocked response for: ${requirement}\n\n**Summary**: Mocked test case`;
  }
  if (provider === 'claude') {
    // Requires @anthropic-ai/sdk, using simple stub
    return `[Claude] Mocked response for: ${requirement}\n\n**Summary**: Mocked test case`;
  }

  throw new Error(`Unsupported provider: ${provider}`);
};

export const testLLMConnection = async (provider: string, config: any): Promise<boolean> => {
  try {
    if (provider === 'ollama') {
      const response = await axios.get(`${config.url || 'http://localhost:11434'}/api/tags`);
      return response.status === 200;
    }
    
    if (provider === 'openai' || provider === 'lmstudio' || provider === 'grok') {
      const baseURL = provider === 'lmstudio' ? config.url : 
                      provider === 'grok' ? 'https://api.groq.com/openai/v1' : 
                      'https://api.openai.com/v1';
      const response = await axios.get(`${baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`
        }
      });
      return response.status === 200;
    }
    
    if (provider === 'gemini' || provider === 'claude') return true; // Stub

    return false;
  } catch (error) {
    console.error(`Connection test failed for ${provider}:`, error?.toString());
    throw new Error('Connection refused or invalid API key');
  }
};
