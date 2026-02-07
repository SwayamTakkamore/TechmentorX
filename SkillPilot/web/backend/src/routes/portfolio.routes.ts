import { Router } from 'express';
import { PortfolioController } from '../controllers/portfolio.controller';

const router = Router();

// Public route — no auth needed
router.get('/:username', PortfolioController.getPublicPortfolio);

export default router;
