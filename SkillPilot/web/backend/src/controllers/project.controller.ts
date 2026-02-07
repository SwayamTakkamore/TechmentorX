import { Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { AIService } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class ProjectController {
  static async generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { interests, preferredStack } = req.body;

      const generated = await AIService.generateProject(interests, preferredStack);

      const deadlineDays = parseInt(generated.suggestedDeadline) || 14;
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + deadlineDays);

      const project = await Project.create({
        userId: req.userId,
        title: generated.title,
        description: generated.description,
        difficulty: generated.difficulty,
        techStack: generated.techStack,
        tasks: generated.tasks.map((t, i) => ({
          title: t.title,
          description: t.description,
          status: 'todo',
          order: i,
        })),
        suggestedDeadline: deadline,
      });

      res.status(201).json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
      res.json({ success: true, projects });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      res.json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  static async getActive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await Project.findOne({
        userId: req.userId,
        status: 'active',
      }).sort({ createdAt: -1 });

      res.json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        {
          status,
          ...(status === 'completed' ? { completedAt: new Date() } : {}),
        },
        { new: true }
      );

      if (!project) {
        throw new NotFoundError('Project not found');
      }

      res.json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  static async generatePortfolio(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      const doneTasks = project.tasks.filter((t) => t.status === 'done').length;

      const portfolioData = await AIService.generatePortfolio(
        project.title,
        project.description,
        project.techStack,
        doneTasks,
        project.tasks.length
      );

      project.portfolioGenerated = true;
      project.portfolioSummary = portfolioData.summary;
      project.skillsLearned = portfolioData.skillsLearned;
      project.resumeBullets = portfolioData.resumeBullets;
      await project.save();

      res.json({ success: true, portfolio: portfolioData, project });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicProjects(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const projects = await Project.find({
        userId,
        portfolioGenerated: true,
      }).select('-userId');

      res.json({ success: true, projects });
    } catch (error) {
      next(error);
    }
  }
}
