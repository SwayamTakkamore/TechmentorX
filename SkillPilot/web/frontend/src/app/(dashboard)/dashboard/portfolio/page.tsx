'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, FileText, Globe } from 'lucide-react';
import { projectAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  progress: number;
  portfolioGenerated: boolean;
  portfolioSummary?: string;
  skillsLearned?: string[];
  resumeBullets?: string[];
  completedAt?: string;
}

export default function PortfolioPage() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await projectAPI.getAll();
      setProjects(res.projects.filter((p: Project) => p.portfolioGenerated));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const portfolioUrl = user
    ? `/portfolio/${user.name.toLowerCase().replace(/\s+/g, '-')}`
    : '';

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
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="mt-1 text-neutral-500">Your AI-generated project portfolio</p>
        </div>
        {projects.length > 0 && (
          <Link href={portfolioUrl} target="_blank" className="btn-secondary">
            <Globe className="h-4 w-4" />
            Public Portfolio
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card border-dashed py-16 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
          <h3 className="mb-2 text-lg font-semibold">No portfolio items yet</h3>
          <p className="text-sm text-neutral-500">
            Complete projects and generate portfolio entries from the project workspace
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project._id} className="card">
              <h3 className="text-lg font-bold mb-2">{project.title}</h3>
              {project.portfolioSummary && (
                <p className="text-sm text-neutral-600 mb-4">{project.portfolioSummary}</p>
              )}
              <div className="mb-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="badge-brand">{tech}</span>
                ))}
              </div>
              {project.skillsLearned && project.skillsLearned.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-neutral-700">Skills Learned</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsLearned.map((skill) => (
                      <span key={skill} className="badge-success">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {project.resumeBullets && project.resumeBullets.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-neutral-700">Resume Bullets</h4>
                  <ul className="space-y-1.5">
                    {project.resumeBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
