# SkillPilot — API Reference

Base URL: `http://localhost:5000/api`

All responses follow the format:

```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Authentication

All protected routes require a valid JWT access token sent via:
- **Cookie**: `accessToken` (httpOnly, set automatically on login)
- **Header**: `Authorization: Bearer <token>`

---

### `POST /api/auth/signup`

Create a new user account.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Full name |
| email | string | Yes | Email address |
| password | string | Yes | Min 6 characters |
| role | string | Yes | `student` or `recruiter` |

**Response:** `201`

```json
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "student" },
  "accessToken": "eyJ..."
}
```

---

### `POST /api/auth/login`

Log in with email and password.

**Body:**

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

**Response:** `200` — Sets `accessToken` and `refreshToken` cookies.

```json
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "student" },
  "accessToken": "eyJ..."
}
```

---

### `POST /api/auth/logout`

🔒 **Requires Auth**

Clears authentication cookies and invalidates refresh token.

**Response:** `200`

```json
{ "message": "Logged out successfully" }
```

---

### `POST /api/auth/refresh`

Refresh the access token using the refresh token cookie.

**Response:** `200`

```json
{ "accessToken": "eyJ..." }
```

---

### `GET /api/auth/me`

🔒 **Requires Auth**

Get the currently authenticated user.

**Response:** `200`

```json
{
  "user": { "id": "...", "name": "...", "email": "...", "role": "...", "skills": [...] }
}
```

---

## Projects

### `POST /api/projects/generate`

🔒 **Requires Auth** (Student only)

Generate a new AI-powered project.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| interests | string | Yes | Student's interests/topics |
| difficulty | string | No | `beginner`, `intermediate`, `advanced` |

**Response:** `201`

```json
{
  "project": {
    "id": "...",
    "title": "Real-time Chat Application",
    "description": "...",
    "difficulty": "intermediate",
    "techStack": ["React", "Node.js", "Socket.io", "MongoDB"],
    "tasks": [
      { "id": "...", "title": "Set up project", "status": "todo", "order": 0 }
    ],
    "suggestedDeadline": "2 weeks",
    "progress": 0
  }
}
```

---

### `GET /api/projects`

🔒 **Requires Auth**

Get all projects for the authenticated user.

**Response:** `200`

```json
{
  "projects": [{ ... }, { ... }]
}
```

---

### `GET /api/projects/active`

🔒 **Requires Auth**

Get the user's active (in-progress) project.

**Response:** `200`

```json
{
  "project": { ... }
}
```

---

### `GET /api/projects/:id`

🔒 **Requires Auth**

Get a specific project by ID.

**Response:** `200`

---

### `PATCH /api/projects/:id/status`

🔒 **Requires Auth**

Update project status.

**Body:**

| Field | Type | Values |
|-------|------|--------|
| status | string | `active`, `completed`, `archived` |

**Response:** `200`

---

### `POST /api/projects/:id/portfolio`

🔒 **Requires Auth** (Student only)

Generate AI portfolio summary for a completed project.

**Response:** `200`

```json
{
  "project": {
    "portfolioGenerated": true,
    "portfolioSummary": "...",
    "skillsLearned": ["React", "API Design", "..."],
    "resumeBullets": ["Built a real-time...", "..."]
  }
}
```

---

### `GET /api/projects/public/:userId`

Public route — get completed projects for a user.

**Response:** `200`

---

## Tasks

### `PATCH /api/tasks/:projectId/:taskId/status`

🔒 **Requires Auth**

Update a task's status. Automatically recalculates project progress.

**Body:**

| Field | Type | Values |
|-------|------|--------|
| status | string | `todo`, `in-progress`, `done` |

**Response:** `200`

```json
{
  "task": { "id": "...", "title": "...", "status": "done" },
  "progress": 50
}
```

---

### `PUT /api/tasks/:projectId/reorder`

🔒 **Requires Auth**

Reorder tasks within a project.

**Body:**

| Field | Type | Description |
|-------|------|-------------|
| tasks | array | `[{ id: "...", order: 0 }, { id: "...", order: 1 }]` |

**Response:** `200`

---

## Chat (AI Mentor)

### `POST /api/chat/:projectId`

🔒 **Requires Auth**

Send a message to the AI mentor for a specific project.

**Body:**

| Field | Type | Required |
|-------|------|----------|
| message | string | Yes |

**Response:** `200`

```json
{
  "message": {
    "role": "assistant",
    "content": "Great question! Here's how you can approach..."
  }
}
```

---

### `GET /api/chat/:projectId`

🔒 **Requires Auth**

Get chat message history for a project.

**Response:** `200`

```json
{
  "messages": [
    { "role": "user", "content": "How do I...", "timestamp": "..." },
    { "role": "assistant", "content": "You can...", "timestamp": "..." }
  ]
}
```

---

## Portfolio (Public)

### `GET /api/portfolio/:username`

Public route — get a student's portfolio by username slug.

**Response:** `200`

```json
{
  "user": { "name": "...", "bio": "...", "skills": [...] },
  "projects": [
    {
      "title": "...",
      "portfolioSummary": "...",
      "skillsLearned": [...],
      "resumeBullets": [...]
    }
  ]
}
```

---

## Recruiter

### `GET /api/recruiter/students`

🔒 **Requires Auth** (Recruiter only)

Browse student profiles with search and pagination.

**Query Params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | — | Search by name, skills, university |
| page | number | 1 | Page number |
| limit | number | 20 | Results per page |

**Response:** `200`

```json
{
  "students": [{ ... }],
  "total": 42,
  "page": 1,
  "pages": 3
}
```

---

### `GET /api/recruiter/students/:studentId`

🔒 **Requires Auth** (Recruiter only)

Get detailed student profile with projects.

**Response:** `200`

```json
{
  "student": { ... },
  "projects": [{ ... }]
}
```

---

### `POST /api/recruiter/students/:studentId/skill-score`

🔒 **Requires Auth** (Recruiter only)

Trigger AI skill scoring analysis for a student.

**Response:** `200`

```json
{
  "skillScore": {
    "overall": 85,
    "categories": {
      "frontend": 90,
      "backend": 80,
      "database": 75,
      "devops": 60
    }
  }
}
```

---

## User Profile

### `GET /api/users/profile`

🔒 **Requires Auth**

Get the authenticated user's profile.

**Response:** `200`

---

### `PATCH /api/users/profile`

🔒 **Requires Auth**

Update profile fields.

**Body (all optional):**

| Field | Type |
|-------|------|
| name | string |
| bio | string |
| skills | string[] |
| university | string |
| avatar | string |
| github | string |
| linkedin | string |

**Response:** `200`

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Not Found |
| 500 | Internal Server Error |
