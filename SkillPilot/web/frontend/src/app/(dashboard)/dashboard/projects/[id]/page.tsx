'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MessageSquare,
  Briefcase,
  Send,
  X,
  GripVertical,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { projectAPI, taskAPI, chatAPI } from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  order: number;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  techStack: string[];
  progress: number;
  status: string;
  tasks: Task[];
  suggestedDeadline: string;
  portfolioGenerated: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const COLUMNS = [
  { key: 'todo' as const, label: 'To Do', color: 'bg-neutral-100' },
  { key: 'in-progress' as const, label: 'In Progress', color: 'bg-blue-50' },
  { key: 'done' as const, label: 'Done', color: 'bg-emerald-50' },
];

export default function ProjectWorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProject();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadProject = async () => {
    try {
      const res = await projectAPI.getById(id);
      setProject(res.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    if (!project) return;
    try {
      const res = await taskAPI.updateStatus(project._id, taskId, newStatus);
      setProject(res.project);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const openChat = async () => {
    setChatOpen(true);
    if (messages.length === 0 && project) {
      try {
        const res = await chatAPI.getMessages(project._id);
        setMessages(res.messages || []);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || !project || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg, timestamp: new Date().toISOString() }]);
    setChatLoading(true);
    try {
      const res = await chatAPI.sendMessage(project._id, msg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.message, timestamp: new Date().toISOString() },
      ]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleGeneratePortfolio = async () => {
    if (!project) return;
    setPortfolioLoading(true);
    try {
      const res = await projectAPI.generatePortfolio(project._id);
      setProject(res.project);
      toast.success('Portfolio generated!');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPortfolioLoading(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link
            href="/dashboard/projects"
            className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to projects
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="badge-brand">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!project.portfolioGenerated && (
            <button
              onClick={handleGeneratePortfolio}
              disabled={portfolioLoading}
              className="btn-secondary"
            >
              {portfolioLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
              ) : (
                <Briefcase className="h-4 w-4" />
              )}
              Generate Portfolio
            </button>
          )}
          <button onClick={openChat} className="btn-brand">
            <MessageSquare className="h-4 w-4" />
            AI Mentor
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-bold text-brand-600">{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-neutral-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            className="h-2 rounded-full bg-brand-500"
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const columnTasks = project.tasks
            .filter((t) => t.status === column.key)
            .sort((a, b) => a.order - b.order);

          return (
            <div key={column.key} className="rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div className={cn('rounded-t-xl px-4 py-3', column.color)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-neutral-700">{column.label}</h3>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {columnTasks.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2 p-3 min-h-[200px]">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-300" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-800">{task.title}</p>
                          <p className="mt-1 text-xs text-neutral-500 line-clamp-2">
                            {task.description}
                          </p>
                          <div className="mt-2 flex gap-1">
                            {COLUMNS.filter((c) => c.key !== task.status).map((c) => (
                              <button
                                key={c.key}
                                onClick={() => handleStatusChange(task._id, c.key)}
                                className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-200 transition-colors"
                              >
                                → {c.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 flex h-screen w-[400px] flex-col border-l border-neutral-200 bg-white shadow-xl"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Mentor</p>
                  <p className="text-xs text-neutral-500">Context: {project.title}</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-neutral-300" />
                  <p className="text-sm text-neutral-500">
                    Ask your AI mentor anything about this project!
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                      msg.role === 'user'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    )}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm prose-neutral">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-neutral-100 px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:0.1s]" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t border-neutral-100 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask your AI mentor..."
                  className="input"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || chatLoading}
                  className="btn-primary px-3"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
