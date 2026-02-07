import { Response, NextFunction } from 'express';
import { Project } from '../models/Project';
import { AuthRequest } from '../middleware/auth';
import { NotFoundError } from '../utils/errors';

export class TaskController {
  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId, taskId } = req.params;
      const { status } = req.body;

      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      const task = project.tasks.find((t) => t._id?.toString() === taskId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }

      task.status = status;

      // Recalculate progress
      const doneTasks = project.tasks.filter((t) => t.status === 'done').length;
      project.progress = Math.round((doneTasks / project.tasks.length) * 100);

      // Auto-complete project if all tasks done
      if (project.progress === 100 && project.status === 'active') {
        project.status = 'completed';
        project.completedAt = new Date();
      }

      await project.save();

      res.json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const { tasks } = req.body; // Array of { taskId, status, order }

      const project = await Project.findOne({ _id: projectId, userId: req.userId });
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      for (const update of tasks) {
        const task = project.tasks.find((t) => t._id?.toString() === update.taskId);
        if (task) {
          task.status = update.status;
          task.order = update.order;
        }
      }

      // Recalculate progress
      const doneTasks = project.tasks.filter((t) => t.status === 'done').length;
      project.progress = Math.round((doneTasks / project.tasks.length) * 100);

      if (project.progress === 100 && project.status === 'active') {
        project.status = 'completed';
        project.completedAt = new Date();
      }

      await project.save();

      res.json({ success: true, project });
    } catch (error) {
      next(error);
    }
  }
}
