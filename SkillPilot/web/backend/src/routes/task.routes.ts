import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('student'));

router.patch('/:projectId/:taskId/status', TaskController.updateStatus);
router.put('/:projectId/reorder', TaskController.reorder);

export default router;
