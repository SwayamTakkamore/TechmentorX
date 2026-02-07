import { Response, NextFunction } from 'express';
import { Chat } from '../models/Chat';
import { Project } from '../models/Project';
import { AIService } from '../services/ai.service';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

export class ChatController {
  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const { message } = req.body;

      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      let chat = await Chat.findOne({ userId: req.userId, projectId });
      if (!chat) {
        chat = await Chat.create({
          userId: req.userId,
          projectId,
          messages: [],
        });
      }

      chat.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });

      // Get last 10 messages for context
      const recentMessages = chat.messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const aiResponse = await AIService.chatWithMentor(recentMessages, {
        title: project.title,
        description: project.description,
        techStack: project.techStack,
      });

      chat.messages.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      });

      await chat.save();

      res.json({
        success: true,
        message: aiResponse,
        chat: {
          _id: chat._id,
          messages: chat.messages.slice(-20),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;

      const chat = await Chat.findOne({ userId: req.userId, projectId });

      res.json({
        success: true,
        messages: chat?.messages || [],
      });
    } catch (error) {
      next(error);
    }
  }
}
