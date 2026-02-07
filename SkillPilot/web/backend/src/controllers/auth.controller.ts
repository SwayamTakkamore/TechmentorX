import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError('Email already registered');
      }

      const user = await User.create({ name, email, password, role });

      const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        user: user.toJSON(),
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

      res.json({
        success: true,
        user: user.toJSON(),
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.userId) {
        await User.findByIdAndUpdate(req.userId, { refreshToken: null });
      }

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        throw new UnauthorizedError('Refresh token required');
      }

      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const accessToken = generateAccessToken({ userId: user._id.toString(), role: user.role });
      const refreshToken = generateRefreshToken({ userId: user._id.toString(), role: user.role });

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('accessToken', accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

      res.json({ success: true, accessToken });
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      res.json({ success: true, user: user.toJSON() });
    } catch (error) {
      next(error);
    }
  }
}
