import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { NotFoundError } from '../utils/errors';

export class PortfolioController {
  static async getPublicPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;

      // Find user by name (slug-like)
      const user = await User.findOne({
        name: { $regex: new RegExp(`^${username.replace(/-/g, ' ')}$`, 'i') },
        role: 'student',
      });

      if (!user) {
        throw new NotFoundError('Student not found');
      }

      const projects = await Project.find({
        userId: user._id,
        portfolioGenerated: true,
      }).select('title description techStack difficulty progress portfolioSummary skillsLearned resumeBullets completedAt');

      res.json({
        success: true,
        portfolio: {
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          skills: user.skills,
          university: user.university,
          github: user.github,
          linkedin: user.linkedin,
          skillScore: user.skillScore,
          projects,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
