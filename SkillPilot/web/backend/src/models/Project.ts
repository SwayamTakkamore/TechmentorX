import mongoose, { Document, Schema } from 'mongoose';

export interface ITask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  order: number;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: string[];
  tasks: ITask[];
  suggestedDeadline: Date;
  progress: number;
  status: 'active' | 'completed' | 'archived';
  completedAt?: Date;
  portfolioGenerated: boolean;
  portfolioSummary?: string;
  skillsLearned?: string[];
  resumeBullets?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  order: { type: Number, required: true },
});

const projectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    techStack: [{ type: String }],
    tasks: [taskSchema],
    suggestedDeadline: { type: Date },
    progress: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
    completedAt: { type: Date },
    portfolioGenerated: { type: Boolean, default: false },
    portfolioSummary: { type: String },
    skillsLearned: [{ type: String }],
    resumeBullets: [{ type: String }],
  },
  { timestamps: true }
);

projectSchema.methods.calculateProgress = function (): number {
  if (this.tasks.length === 0) return 0;
  const doneTasks = this.tasks.filter((t: ITask) => t.status === 'done').length;
  return Math.round((doneTasks / this.tasks.length) * 100);
};

export const Project = mongoose.model<IProject>('Project', projectSchema);
