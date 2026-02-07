import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

export class UserController {
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const allowedFields = ['name', 'bio', 'skills', 'university', 'github', 'linkedin', 'avatar'];
      const updates: any = {};

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
      if (!user) {
        throw new NotFoundError('User not found');
      }

      res.json({ success: true, user: user.toJSON() });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.json({ success: true, user: user.toJSON() });
    } catch (error) {
      next(error);
    }
  }
}
