import { Router } from 'express';
import { RecruiterController } from '../controllers/recruiter.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate, authorize('recruiter'));

router.get('/students', RecruiterController.browseStudents);
router.get('/students/:studentId', RecruiterController.getStudentProfile);
router.get('/students/:studentId/skill-score', RecruiterController.getSkillScore);

export default router;
