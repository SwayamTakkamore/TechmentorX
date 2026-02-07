import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'recruiter';
  avatar?: string;
  bio?: string;
  skills: string[];
  university?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  skillScore?: number;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['student', 'recruiter'], required: true },
    avatar: { type: String },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    university: { type: String },
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },
    skillScore: { type: Number, default: 0 },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
