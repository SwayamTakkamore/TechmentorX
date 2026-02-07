'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Github, Linkedin, BarChart3, Sparkles } from 'lucide-react';
import { recruiterAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Student {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  skills: string[];
  university?: string;
  github?: string;
  linkedin?: string;
  skillScore?: number;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
  progress: number;
  status: string;
  portfolioSummary?: string;
  skillsLearned?: string[];
  resumeBullets?: string[];
}

interface SkillScoreData {
  score: number;
  breakdown: { category: string; score: number; feedback: string }[];
  summary: string;
}

export default function StudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillScore, setSkillScore] = useState<SkillScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoreLoading, setScoreLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [studentId]);

  const loadProfile = async () => {
    try {
      const res = await recruiterAPI.getStudentProfile(studentId);
      setStudent(res.student);
      setProjects(res.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateSkillScore = async () => {
    setScoreLoading(true);
    try {
      const res = await recruiterAPI.getSkillScore(studentId);
      setSkillScore(res.skillScore);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setScoreLoading(false);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/recruiter"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to browse
      </Link>

      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-2xl font-bold">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{student.name}</h1>
              {student.university && (
                <p className="text-neutral-500">{student.university}</p>
              )}
              <div className="mt-2 flex gap-2">
                {student.github && (
                  <a
                    href={student.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost px-2 py-1"
                    aria-label="GitHub profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {student.linkedin && (
                  <a
                    href={student.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost px-2 py-1"
                    aria-label="LinkedIn profile"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={generateSkillScore}
            disabled={scoreLoading}
            className="btn-brand"
          >
            {scoreLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
            Analyze Skills
          </button>
        </div>

        {student.bio && (
          <p className="mt-4 text-sm text-neutral-600">{student.bio}</p>
        )}

        {student.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {student.skills.map((skill) => (
              <span key={skill} className="badge-brand">{skill}</span>
            ))}
          </div>
        )}
      </div>

      {/* Skill Score */}
      {skillScore && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Skill Score</h2>
              <p className="text-3xl font-bold text-brand-600">{skillScore.score}/100</p>
            </div>
          </div>

          <p className="mb-4 text-sm text-neutral-600">{skillScore.summary}</p>

          <div className="space-y-3">
            {skillScore.breakdown.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-neutral-500">{item.score}/100</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div
                    className="h-2 rounded-full bg-brand-500 transition-all"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">{item.feedback}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Projects */}
      <h2 className="text-lg font-bold mb-4">Projects ({projects.length})</h2>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project._id} className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{project.title}</h3>
              <span
                className={
                  project.status === 'completed'
                    ? 'badge-success'
                    : project.status === 'active'
                    ? 'badge-brand'
                    : 'badge-warning'
                }
              >
                {project.status}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {project.techStack.map((tech) => (
                <span key={tech} className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                  {tech}
                </span>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-neutral-100">
              <div
                className="h-1.5 rounded-full bg-brand-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {project.resumeBullets && project.resumeBullets.length > 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 mb-1.5">KEY ACHIEVEMENTS</p>
                <ul className="space-y-1">
                  {project.resumeBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
