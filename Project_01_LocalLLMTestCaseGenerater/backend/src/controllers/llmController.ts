import { Request, Response } from 'express';
import { generateWithLLM, testLLMConnection } from '../services/llmService';

export const generateTestCase = async (req: Request, res: Response) => {
  try {
    const { provider, config, requirement } = req.body;
    if (!provider || !config || !requirement) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const testCase = await generateWithLLM(provider, config, requirement);
    res.json({ result: testCase });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate test case' });
  }
};

export const testConnection = async (req: Request, res: Response) => {
  try {
    const { provider, config } = req.body;
    if (!provider || !config) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isConnected = await testLLMConnection(provider, config);
    res.json({ success: isConnected });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Connection failed' });
  }
};
