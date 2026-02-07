import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('student'));

router.post('/:projectId', ChatController.sendMessage);
router.get('/:projectId', ChatController.getMessages);

export default router;
