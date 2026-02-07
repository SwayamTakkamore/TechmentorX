# SkillPilot Architecture

## System Overview

SkillPilot is an AI-powered experiential learning platform built as a monorepo with three main components:

```
SkillPilot/
├── web/
│   ├── frontend/    → Next.js 14 (App Router, TypeScript, TailwindCSS)
│   └── backend/     → Node.js + Express + TypeScript + MongoDB
├── mobile/          → Flutter (Dart)
└── docs/            → Documentation
```

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                        Clients                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Next.js App  │  │  Flutter App │  │  Public API  │   │
│  │  (Students +  │  │  (Students)  │  │  Consumers   │   │
│  │   Recruiters) │  │              │  │              │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌──────────────────────────────────────────────────────────┐
│                    REST API (Express)                     │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  Auth   │ │ Projects │ │  Tasks   │ │   Chat       │ │
│  │ Routes  │ │  Routes  │ │  Routes  │ │   Routes     │ │
│  └────┬────┘ └────┬─────┘ └────┬─────┘ └──────┬───────┘ │
│       │           │            │               │         │
│  ┌────▼───────────▼────────────▼───────────────▼───────┐ │
│  │              Controllers Layer                      │ │
│  └────────────────────┬────────────────────────────────┘ │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────────┐ │
│  │              Services Layer                         │ │
│  │  ┌──────────────┐  ┌───────────────┐                │ │
│  │  │  AI Service   │  │  Auth Service │                │ │
│  │  │  (OpenAI)     │  │  (JWT/bcrypt) │                │ │
│  │  └──────────────┘  └───────────────┘                │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  ┌──────────────────────────────────────────────────┐    │
│  │               MongoDB Atlas                       │    │
│  │  ┌────────┐  ┌──────────┐  ┌─────────┐          │    │
│  │  │ Users  │  │ Projects │  │  Chats  │          │    │
│  │  └────────┘  └──────────┘  └─────────┘          │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web Frontend | Next.js 14, TypeScript, TailwindCSS, Zustand, Framer Motion |
| Mobile | Flutter 3, Dart, Provider, Material 3 |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| AI/LLM | OpenAI GPT-4o-mini |
| Auth | JWT (access + refresh tokens), bcrypt, httpOnly cookies |

## Design Patterns

- **Layered Architecture**: Controllers → Services → Models
- **Repository Pattern**: Mongoose models abstract data access
- **State Management**: Zustand (web), Provider (mobile)
- **Component-based UI**: React (web), Widget tree (Flutter)
- **API-first Design**: RESTful JSON API consumed by both clients

## Authentication Flow

1. User signs up/logs in with email + password
2. Server validates credentials, hashes password with bcrypt
3. Server generates JWT access token (15min) + refresh token (7d)
4. Tokens set as httpOnly cookies (web) or stored in SharedPreferences (mobile)
5. Access token sent in Authorization header or cookie
6. Middleware validates token on protected routes
7. Refresh token used to get new access token when expired

## AI Integration

The AI Service abstracts OpenAI API calls for:
- **Project Generation**: Creates structured project with tasks, tech stack, difficulty
- **AI Mentor Chat**: Context-aware conversation about the student's project
- **Portfolio Generation**: Creates summaries, skills learned, resume bullets
- **Skill Scoring**: Analyzes student's project portfolio for recruiters

## Data Models

### User
- name, email, password, role (student/recruiter)
- bio, skills, university, github, linkedin
- skillScore (AI-generated)

### Project
- title, description, difficulty, techStack
- tasks (embedded subdocuments with status)
- progress (auto-calculated)
- portfolio data (summary, skills, bullets)

### Chat
- userId, projectId
- messages array (role, content, timestamp)
