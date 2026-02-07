'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Briefcase, Rocket, Code2, GraduationCap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">SkillPilot</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white" />
        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Learning Platform
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
              From Classroom
              <br />
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                to Career
              </span>
            </h1>
            <p className="mb-10 text-lg text-neutral-600 leading-relaxed">
              SkillPilot generates real-world projects tailored to your interests,
              guides you with an AI mentor, and builds your portfolio —
              so recruiters discover you through your work, not your resume.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/signup" className="btn-primary px-6 py-3 text-base">
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signup?role=recruiter" className="btn-secondary px-6 py-3 text-base">
                <Briefcase className="h-4 w-4" />
                I&apos;m a Recruiter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-neutral-50/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">How it works</h2>
            <p className="text-neutral-600">Three steps to launch your career</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Rocket className="h-5 w-5" />,
                title: 'AI Generates Projects',
                description:
                  'Tell us your interests and stack preferences. Our AI creates a real-world project with tasks, deadlines, and structure.',
              },
              {
                icon: <Code2 className="h-5 w-5" />,
                title: 'Build with AI Mentor',
                description:
                  'Work through tasks on a Kanban board. Get stuck? Chat with your AI mentor who understands your project context.',
              },
              {
                icon: <GraduationCap className="h-5 w-5" />,
                title: 'Portfolio & Discovery',
                description:
                  'Auto-generate portfolio pages with resume bullets. Recruiters browse and discover talent through real work.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card-hover"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 text-white">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                <Users className="h-3.5 w-3.5" />
                For Recruiters
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                Discover talent through
                <br />
                real work, not resumes
              </h2>
              <p className="mb-6 text-neutral-600 leading-relaxed">
                Browse student profiles, view completed projects, and see AI-generated
                skill scores. Find candidates who can actually build.
              </p>
              <Link href="/signup?role=recruiter" className="btn-primary">
                Get Started as Recruiter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="card bg-neutral-50">
              <div className="space-y-4">
                {['Technical Depth', 'Project Complexity', 'Completion Rate', 'Tech Diversity'].map(
                  (skill, i) => (
                    <div key={i}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-neutral-700">{skill}</span>
                        <span className="text-neutral-500">{70 + i * 7}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-neutral-200">
                        <div
                          className="h-2 rounded-full bg-brand-500 transition-all"
                          style={{ width: `${70 + i * 7}%` }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Sparkles className="h-4 w-4" />
            <span>SkillPilot © 2026</span>
          </div>
          <p className="text-sm text-neutral-400">From Classroom to Career</p>
        </div>
      </footer>
    </div>
  );
}
