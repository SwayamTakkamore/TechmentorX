import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/generate', authorize('student'), ProjectController.generate);
router.get('/', authorize('student'), ProjectController.getAll);
router.get('/active', authorize('student'), ProjectController.getActive);
router.get('/:id', authorize('student'), ProjectController.getById);
router.patch('/:id/status', authorize('student'), ProjectController.updateStatus);
router.post('/:id/portfolio', authorize('student'), ProjectController.generatePortfolio);
router.get('/public/:userId', ProjectController.getPublicProjects);

export default router;
