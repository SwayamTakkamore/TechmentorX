'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket,
  CheckCircle2,
  Clock,
  ArrowRight,
  FolderKanban,
  Plus,
  Sparkles,
} from 'lucide-react';
import { projectAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  techStack: string[];
  progress: number;
  status: string;
  tasks: { _id: string; title: string; status: string }[];
  createdAt: string;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activeRes, allRes] = await Promise.all([
        projectAPI.getActive(),
        projectAPI.getAll(),
      ]);
      setActiveProject(activeRes.project);
      setProjects(allRes.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProject = async () => {
    setGenerating(true);
    try {
      const res = await projectAPI.generate({});
      toast.success('New project generated!');
      setActiveProject(res.project);
      setProjects((prev) => [res.project, ...prev]);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate project');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  const completedTasks = activeProject?.tasks.filter((t) => t.status === 'done').length || 0;
  const totalTasks = activeProject?.tasks.length || 0;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-neutral-500">Here&apos;s your learning progress</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
              <FolderKanban className="h-5 w-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-sm text-neutral-500">Total Projects</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {projects.filter((p) => p.status === 'completed').length}
              </p>
              <p className="text-sm text-neutral-500">Completed</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {projects.filter((p) => p.status === 'active').length}
              </p>
              <p className="text-sm text-neutral-500">In Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Project */}
      {activeProject ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-brand-600 mb-1">
                Active Project
              </p>
              <h2 className="text-xl font-bold">{activeProject.title}</h2>
            </div>
            <Link
              href={`/dashboard/projects/${activeProject._id}`}
              className="btn-primary"
            >
              Open Workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mb-4 text-sm text-neutral-600">{activeProject.description}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {activeProject.techStack.map((tech) => (
              <span key={tech} className="badge-brand">{tech}</span>
            ))}
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-neutral-600">
                {completedTasks} of {totalTasks} tasks completed
              </span>
              <span className="font-medium">{activeProject.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeProject.progress}%` }}
                className="h-2 rounded-full bg-brand-500"
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="card mb-8 border-dashed text-center py-12">
          <Rocket className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
          <h3 className="mb-2 text-lg font-semibold">No active project</h3>
          <p className="mb-6 text-sm text-neutral-500">
            Generate an AI-powered project to start building
          </p>
          <button
            onClick={handleGenerateProject}
            disabled={generating}
            className="btn-brand"
          >
            {generating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate New Project
              </>
            )}
          </button>
        </div>
      )}

      {/* Generate New Button */}
      {activeProject && (
        <div className="mb-8">
          <button
            onClick={handleGenerateProject}
            disabled={generating}
            className="btn-secondary"
          >
            {generating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Start New Project
              </>
            )}
          </button>
        </div>
      )}

      {/* Recent Projects */}
      {projects.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold">All Projects</h3>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/dashboard/projects/${project._id}`}
                className="card-hover flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium">{project.title}</h4>
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
                  <p className="text-sm text-neutral-500 line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.progress}%</p>
                    <p className="text-xs text-neutral-400">progress</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
