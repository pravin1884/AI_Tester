import { Router } from 'express';
import { generateTestCase, testConnection } from '../controllers/llmController';

const router = Router();

router.post('/generate', generateTestCase);
router.post('/test-connection', testConnection);

export default router;
