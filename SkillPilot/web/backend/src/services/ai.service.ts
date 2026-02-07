import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
        'X-Title': 'SkillPilot',
      },
    });
  }
  return _client;
}

const getModel = () => process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

export interface GeneratedProject {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: string[];
  tasks: { title: string; description: string }[];
  suggestedDeadline: string;
}

export interface PortfolioData {
  summary: string;
  skillsLearned: string[];
  resumeBullets: string[];
}

export interface SkillScoreData {
  score: number;
  breakdown: { category: string; score: number; feedback: string }[];
  summary: string;
}

export class AIService {
  static async generateProject(
    interests?: string,
    preferredStack?: string
  ): Promise<GeneratedProject> {
    const prompt = `Generate a realistic software engineering project for a student to build.
${interests ? `Student interests: ${interests}` : ''}
${preferredStack ? `Preferred tech stack: ${preferredStack}` : ''}

Return ONLY valid JSON with this exact structure:
{
  "title": "Project Title",
  "description": "2-3 sentence description of the project",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "techStack": ["tech1", "tech2", "tech3"],
  "tasks": [
    { "title": "Task title", "description": "Task description with clear deliverable" }
  ],
  "suggestedDeadline": "number of days (e.g., '14')"
}

Generate 5-8 tasks that are progressive and realistic.
Make the project practical, interesting, and portfolio-worthy.
Focus on real-world skills that recruiters value.`;

    const response = await getClient().chat.completions.create({
      model: getModel(),
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    // Strip markdown code fences if present
    const cleaned = content.replace(/```(?:json)?\n?/g, '').trim();
    return JSON.parse(cleaned) as GeneratedProject;
  }

  static async chatWithMentor(
    messages: { role: 'user' | 'assistant'; content: string }[],
    projectContext: { title: string; description: string; techStack: string[] }
  ): Promise<string> {
    const systemPrompt = `You are SkillPilot AI Mentor — a friendly, knowledgeable coding mentor.
You are helping a student work on their project: "${projectContext.title}".
Project description: ${projectContext.description}
Tech stack: ${projectContext.techStack.join(', ')}

Be concise, helpful, and encouraging. Provide code examples when relevant.
Guide the student rather than giving complete solutions.
Focus on teaching patterns, best practices, and problem-solving skills.`;

    const response = await getClient().chat.completions.create({
      model: getModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  }

  static async generatePortfolio(
    projectTitle: string,
    projectDescription: string,
    techStack: string[],
    tasksCompleted: number,
    totalTasks: number
  ): Promise<PortfolioData> {
    const prompt = `Generate portfolio content for a completed student project.

Project: ${projectTitle}
Description: ${projectDescription}
Tech Stack: ${techStack.join(', ')}
Tasks Completed: ${tasksCompleted}/${totalTasks}

Return ONLY valid JSON:
{
  "summary": "A compelling 3-4 sentence project summary suitable for a portfolio",
  "skillsLearned": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "resumeBullets": [
    "Action-oriented bullet point 1",
    "Action-oriented bullet point 2",
    "Action-oriented bullet point 3"
  ]
}

Make resume bullets quantifiable and action-oriented (start with strong verbs).
Skills should be specific and technical.`;

    const response = await getClient().chat.completions.create({
      model: getModel(),
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const cleaned = content.replace(/```(?:json)?\n?/g, '').trim();
    return JSON.parse(cleaned) as PortfolioData;
  }

  static async generateSkillScore(
    studentName: string,
    projects: { title: string; techStack: string[]; progress: number; difficulty: string }[]
  ): Promise<SkillScoreData> {
    const prompt = `Analyze this student's project portfolio and generate a skill score.

Student: ${studentName}
Projects:
${projects.map((p) => `- ${p.title} (${p.difficulty}, ${p.progress}% complete, Stack: ${p.techStack.join(', ')})`).join('\n')}

Return ONLY valid JSON:
{
  "score": 0-100,
  "breakdown": [
    { "category": "Technical Depth", "score": 0-100, "feedback": "brief feedback" },
    { "category": "Project Complexity", "score": 0-100, "feedback": "brief feedback" },
    { "category": "Completion Rate", "score": 0-100, "feedback": "brief feedback" },
    { "category": "Tech Diversity", "score": 0-100, "feedback": "brief feedback" }
  ],
  "summary": "2-3 sentence overall assessment"
}`;

    const response = await getClient().chat.completions.create({
      model: getModel(),
      messages: [
        { role: 'system', content: 'You are a helpful assistant. Always respond with valid JSON only, no markdown formatting.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI');

    const cleaned = content.replace(/```(?:json)?\n?/g, '').trim();
    return JSON.parse(cleaned) as SkillScoreData;
  }
}
