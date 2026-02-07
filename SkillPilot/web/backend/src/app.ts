import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import chatRoutes from './routes/chat.routes';
import portfolioRoutes from './routes/portfolio.routes';
import recruiterRoutes from './routes/recruiter.routes';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`⚡ SkillPilot API running on port ${PORT}`);
  });
};

start();

export default app;
