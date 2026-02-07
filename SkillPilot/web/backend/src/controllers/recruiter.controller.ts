import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { AIService } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

export class RecruiterController {
  static async browseStudents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { search, page = 1, limit = 20 } = req.query;

      const query: any = { role: 'student' };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search as string, 'i')] } },
          { university: { $regex: search, $options: 'i' } },
        ];
      }

      const students = await User.find(query)
        .select('name email avatar bio skills university github linkedin skillScore createdAt')
        .sort({ skillScore: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        students,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;

      const student = await User.findOne({ _id: studentId, role: 'student' });
      if (!student) {
        throw new NotFoundError('Student not found');
      }

      const projects = await Project.find({ userId: studentId })
        .select('title description techStack difficulty progress status completedAt portfolioSummary skillsLearned resumeBullets')
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        student: student.toJSON(),
        projects,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSkillScore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;

      const student = await User.findOne({ _id: studentId, role: 'student' });
      if (!student) {
        throw new NotFoundError('Student not found');
      }

      const projects = await Project.find({ userId: studentId });

      const scoreData = await AIService.generateSkillScore(
        student.name,
        projects.map((p) => ({
          title: p.title,
          techStack: p.techStack,
          progress: p.progress,
          difficulty: p.difficulty,
        }))
      );

      // Update user skill score
      student.skillScore = scoreData.score;
      await student.save();

      res.json({ success: true, skillScore: scoreData });
    } catch (error) {
      next(error);
    }
  }
}
