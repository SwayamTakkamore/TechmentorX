'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Star, ExternalLink } from 'lucide-react';
import { portfolioAPI } from '@/lib/api';

interface PortfolioData {
  name: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  university?: string;
  github?: string;
  linkedin?: string;
  skillScore?: number;
  projects: {
    _id: string;
    title: string;
    description: string;
    techStack: string[];
    difficulty: string;
    progress: number;
    portfolioSummary?: string;
    skillsLearned?: string[];
    resumeBullets?: string[];
  }[];
}

export default function PublicPortfolioPage() {
  const { username } = useParams<{ username: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, [username]);

  const loadPortfolio = async () => {
    try {
      const res = await portfolioAPI.getPublic(username);
      setPortfolio(res.portfolio);
    } catch (err: any) {
      setError(err.message || 'Portfolio not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-2 text-2xl font-bold">Portfolio not found</h1>
        <p className="mb-6 text-neutral-500">{error}</p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
            <Sparkles className="h-4 w-4" />
            SkillPilot
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-3xl font-bold">
            {portfolio.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold">{portfolio.name}</h1>
          {portfolio.university && (
            <p className="mt-1 text-neutral-500">{portfolio.university}</p>
          )}
          {portfolio.bio && (
            <p className="mx-auto mt-3 max-w-lg text-neutral-600">{portfolio.bio}</p>
          )}

          <div className="mt-4 flex items-center justify-center gap-3">
            {portfolio.github && (
              <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
            {portfolio.linkedin && (
              <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>

          {portfolio.skills.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="badge-brand">{skill}</span>
              ))}
            </div>
          )}

          {portfolio.skillScore !== undefined && portfolio.skillScore > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-amber-700">Skill Score: {portfolio.skillScore}/100</span>
            </div>
          )}
        </motion.div>

        {/* Projects */}
        <div className="space-y-8">
          {portfolio.projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-bold">{project.title}</h2>
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
              </div>

              {project.portfolioSummary && (
                <p className="text-neutral-600 mb-4">{project.portfolioSummary}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech) => (
                  <span key={tech} className="badge-brand">{tech}</span>
                ))}
              </div>

              {project.skillsLearned && project.skillsLearned.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-neutral-500 mb-2">SKILLS LEARNED</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skillsLearned.map((skill) => (
                      <span key={skill} className="badge-success">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {project.resumeBullets && project.resumeBullets.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-500 mb-2">KEY ACHIEVEMENTS</h4>
                  <ul className="space-y-2">
                    {project.resumeBullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-2 text-neutral-700">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-sm text-neutral-400">
            Portfolio powered by{' '}
            <Link href="/" className="text-neutral-500 hover:text-neutral-700">
              SkillPilot
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
