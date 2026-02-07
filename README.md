<p align="center">
  <img src="https://img.shields.io/badge/SkillPilot-AI%20Learning%20Platform-6366f1?style=for-the-badge&logo=rocket&logoColor=white" alt="SkillPilot" />
</p>

<h1 align="center">SkillPilot</h1>
<p align="center">
  <strong>AI-Powered Experiential Learning Platform</strong><br/>
  Simulates real industry workflows for students · Helps recruiters discover talent
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Flutter-3-02569B?logo=flutter&logoColor=white" alt="Flutter" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?logo=openai&logoColor=white" alt="OpenAI" />
</p>

---

## What is SkillPilot?

SkillPilot bridges the gap between academic learning and industry readiness. Students get AI-generated projects that simulate real-world workflows, complete with task management, an AI mentor, and auto-generated portfolios. Recruiters can discover and evaluate emerging talent through AI-powered skill scoring.

### For Students
- **AI Project Generator** — Get personalized projects based on your interests and skill level
- **Kanban Task Board** — Manage tasks across To Do → In Progress → Done columns
- **AI Mentor Chat** — Get contextual help from an AI assistant that understands your project
- **Auto Portfolio** — Generate professional portfolio entries and resume bullets from completed projects

### For Recruiters
- **Talent Discovery** — Browse student profiles with search and filtering
- **AI Skill Scoring** — Analyze student capabilities with AI-powered scoring across categories
- **Project Insights** — View student projects, technologies used, and portfolio entries

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Web Frontend** | Next.js 14 · TypeScript · TailwindCSS · Zustand · Framer Motion |
| **Backend API** | Node.js · Express · TypeScript · Mongoose |
| **Mobile App** | Flutter · Dart · Provider · Material 3 |
| **Database** | MongoDB Atlas |
| **AI Engine** | OpenAI GPT-4o-mini |
| **Auth** | JWT (access + refresh tokens) · bcrypt · httpOnly cookies |

---

## Project Structure

```
SkillPilot/
├── web/
│   ├── frontend/                    # Next.js 14 App
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (dashboard)/     # Authenticated routes
│   │   │   │   │   ├── dashboard/   # Student pages
│   │   │   │   │   └── recruiter/   # Recruiter pages
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   ├── portfolio/[username]/ # Public portfolio
│   │   │   │   └── page.tsx         # Landing page
│   │   │   ├── lib/                 # API client, utilities
│   │   │   └── stores/              # Zustand state
│   │   └── package.json
│   │
│   └── backend/                     # Express API
│       ├── src/
│       │   ├── controllers/         # Request handlers
│       │   ├── routes/              # Route definitions
│       │   ├── models/              # Mongoose schemas
│       │   ├── middleware/          # Auth, validation, errors
│       │   ├── services/            # AI service
│       │   └── utils/               # JWT, DB, errors
│       └── package.json
│
├── mobile/                          # Flutter App
│   ├── lib/
│   │   ├── config/                  # API configuration
│   │   ├── services/                # HTTP client
│   │   ├── providers/               # State management
│   │   └── screens/                 # UI screens
│   └── pubspec.yaml
│
└── docs/                            # Documentation
    ├── architecture.md
    ├── setup.md
    └── api.md
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- Flutter SDK ≥ 3.2
- MongoDB Atlas account
- OpenAI API key

### 1. Backend

```bash
cd web/backend
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # → http://localhost:5000
```

### 2. Frontend

```bash
cd web/frontend
cp .env.example .env.local
npm install
npm run dev             # → http://localhost:3000
```

### 3. Mobile

```bash
cd mobile
flutter pub get
flutter run             # Launch on emulator/device
```

> 📖 See [docs/setup.md](docs/setup.md) for detailed setup instructions.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/projects/generate` | AI-generate a project |
| PATCH | `/api/tasks/:projectId/:taskId/status` | Update task status |
| POST | `/api/chat/:projectId` | Chat with AI mentor |
| POST | `/api/projects/:id/portfolio` | Generate portfolio |
| GET | `/api/recruiter/students` | Browse student talent |
| POST | `/api/recruiter/students/:id/skill-score` | AI skill analysis |

> 📖 See [docs/api.md](docs/api.md) for the complete API reference.

---

## Key Features

### AI Project Generation
Students describe their interests, and the AI generates a structured project with:
- Title, description, and difficulty level
- Technology stack recommendations
- 5-8 actionable tasks
- Suggested deadline

### Kanban Task Management
Visual task board with three columns (To Do, In Progress, Done). Progress is automatically tracked as tasks move through the pipeline.

### AI Mentor
Context-aware AI assistant that understands the student's current project. Ask questions, get code explanations, debug issues, and receive guidance — all within the project workspace.

### Portfolio Generation
When a project is completed, AI analyzes the work and generates:
- Professional project summary
- Skills learned
- Resume-ready bullet points

### Recruiter Dashboard
Recruiters can search and filter student profiles, view their project portfolios, and trigger AI-powered skill scoring that breaks down capabilities across categories.

---

## Architecture

> 📖 See [docs/architecture.md](docs/architecture.md) for the full architecture documentation.

---

## License

MIT

---

<p align="center">
  Built with ❤️ for <strong>TechmentorX Hackathon</strong>
</p>
