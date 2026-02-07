# SkillPilot — Setup Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | Included with Node.js |
| Flutter SDK | ≥ 3.2 | [flutter.dev](https://flutter.dev/docs/get-started/install) |
| MongoDB Atlas | — | [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) |
| OpenAI API Key | — | [platform.openai.com](https://platform.openai.com/api-keys) |

---

## 1. Clone & Navigate

```bash
git clone <your-repo-url>
cd SkillPilot
```

---

## 2. MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user (username + password)
3. Whitelist your IP (or use `0.0.0.0/0` for development)
4. Get the connection string (click **Connect** → **Drivers** → copy URI)
5. Replace `<password>` in the URI with your database user password

---

## 3. Backend Setup

```bash
cd web/backend
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/skillpilot
JWT_SECRET=your-secure-random-secret-here
JWT_REFRESH_SECRET=your-secure-random-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
OPENAI_API_KEY=sk-your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The backend will start at `http://localhost:5000`. You should see:

```
🚀 Server running on port 5000
📦 Connected to MongoDB
```

---

## 4. Frontend Setup

Open a **new terminal**:

```bash
cd web/frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`.

---

## 5. Flutter Mobile App Setup

Open a **new terminal**:

```bash
cd mobile
flutter pub get
```

### Configure API URL

Edit `lib/config/api_config.dart`:

```dart
class ApiConfig {
  // For Android emulator → 10.0.2.2
  // For iOS simulator  → localhost
  // For physical device → your machine's LAN IP
  static const String baseUrl = 'http://10.0.2.2:5000/api';
}
```

Run on emulator/device:

```bash
flutter run
```

---

## 6. Running All Services

For a full development setup, run three terminals simultaneously:

| Terminal | Directory | Command |
|----------|-----------|---------|
| 1 | `web/backend` | `npm run dev` |
| 2 | `web/frontend` | `npm run dev` |
| 3 | `mobile` | `flutter run` |

---

## 7. Environment Variables Reference

### Backend (`web/backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for signing access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens | Yes |
| `JWT_EXPIRES_IN` | Access token expiry (e.g., `15m`) | Yes |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry (e.g., `7d`) | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

### Frontend (`web/frontend/.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection failed | Check your Atlas IP whitelist and URI credentials |
| CORS errors | Ensure `FRONTEND_URL` matches your frontend origin |
| OpenAI API errors | Verify your API key has credits and is valid |
| Flutter `connection refused` | Use `10.0.2.2` (Android) or your LAN IP (physical device) |
| Port already in use | Kill existing process: `lsof -ti :5000 \| xargs kill` |
