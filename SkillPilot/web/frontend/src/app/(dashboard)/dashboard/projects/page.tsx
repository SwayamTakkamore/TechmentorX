'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { projectAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Project {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  techStack: string[];
  progress: number;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await projectAPI.generate({});
      toast.success('Project generated!');
      setProjects((prev) => [res.project, ...prev]);
    } catch (err: any) {
      toast.error(err.message);
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

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-neutral-500">All your AI-generated projects</p>
        </div>
        <button onClick={handleGenerate} disabled={generating} className="btn-brand">
          {generating ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              New Project
            </>
          )}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card border-dashed py-16 text-center">
          <Plus className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
          <h3 className="mb-2 text-lg font-semibold">No projects yet</h3>
          <p className="mb-6 text-sm text-neutral-500">Generate your first AI project</p>
          <button onClick={handleGenerate} disabled={generating} className="btn-brand">
            <Sparkles className="h-4 w-4" />
            Generate Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/projects/${project._id}`}
              className="card-hover group"
            >
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={
                    project.difficulty === 'advanced'
                      ? 'badge bg-red-50 text-red-700'
                      : project.difficulty === 'intermediate'
                      ? 'badge-warning'
                      : 'badge-success'
                  }
                >
                  {project.difficulty}
                </span>
                <span
                  className={
                    project.status === 'completed'
                      ? 'badge-success'
                      : project.status === 'active'
                      ? 'badge-brand'
                      : 'badge'
                  }
                >
                  {project.status}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold group-hover:text-brand-600 transition-colors">
                {project.title}
              </h3>
              <p className="mb-4 text-sm text-neutral-500 line-clamp-2">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span key={tech} className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {tech}
                  </span>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-neutral-500">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-neutral-100">
                  <div
                    className="h-1.5 rounded-full bg-brand-500 transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
