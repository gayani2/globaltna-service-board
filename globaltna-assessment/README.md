# GlobalTNA – Mini Service Request Board

A full-stack web application where homeowners can post trade service requests and tradespeople can browse, view, and manage them.

Built for the **GlobalTNA Full-Stack Developer Intern Technical Assessment**.

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Next.js 14 (App Router), Tailwind CSS        |
| Backend    | Node.js + Express                           |
| Database   | MongoDB (Mongoose ODM)                      |
| Auth       | JWT (jsonwebtoken) + bcryptjs               |
| Tests      | Jest + Supertest                            |
| Deployment | Frontend → Vercel · Backend → Render        |

---

## Project Structure

```
globaltna-assessment/
├── backend/
│   ├── src/
│   │   ├── index.js                  # Entry point (exports app for tests)
│   │   ├── models/
│   │   │   ├── JobRequest.js         # Job schema
│   │   │   └── User.js              # User schema (bcrypt pre-save hook)
│   │   ├── controllers/
│   │   │   ├── jobController.js      # Job CRUD logic
│   │   │   └── authController.js     # Register / login / me
│   │   ├── routes/
│   │   │   ├── jobs.js              # Public GET, protected POST/PATCH/DELETE
│   │   │   └── auth.js              # /register /login /me
│   │   ├── middleware/
│   │   │   ├── authenticate.js       # JWT verification middleware
│   │   │   └── errorHandler.js       # 404 + global error handler
│   │   └── seed.js                  # 10 sample jobs
│   ├── __tests__/
│   │   └── api.test.js              # Jest + Supertest — 20 tests
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js        # React context: login/register/logout/user
    │   ├── app/
    │   │   ├── layout.js            # Root layout wrapping AuthProvider + NavBar
    │   │   ├── globals.css
    │   │   ├── page.js              # Screen 1: Job list with filters + search
    │   │   ├── new-job/page.js      # Screen 2: New job form (auth-gated)
    │   │   ├── jobs/[id]/page.js    # Screen 3: Job detail + status/delete
    │   │   ├── login/page.js        # Login page
    │   │   └── register/page.js     # Register page
    │   ├── components/
    │   │   ├── NavBar.js            # Shows Login/Register or user + Logout
    │   │   ├── JobCard.js           # Card used on home page
    │   │   └── StatusBadge.js       # Coloured status pill
    │   └── lib/
    │       └── api.js               # All fetch calls (attaches JWT automatically)
    ├── .env.local.example
    └── package.json
```

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/globaltna
JWT_SECRET=replace_this_with_a_long_random_string_min_32_chars
JWT_EXPIRES_IN=7d
```

For tests, you can also set `MONGO_URI_TEST` (defaults to `globaltna_test` db):
```env
MONGO_URI_TEST=mongodb://localhost:27017/globaltna_test
```

### Frontend — `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Local Setup & Run

### Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas URI

---

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/globaltna-assessment.git
cd globaltna-assessment
```

### 2. Backend

```bash
cd backend
npm install
cp .env .env        # then edit .env with your MONGO_URI + JWT_SECRET
npm run dev                  # starts on :5000
```

### 3. Frontend (new terminal)

```bash
cd frontend
npm install
cp .env .env.local
npm run dev                  # starts on :3000
```

### 4. Seed the database (optional)

```bash
cd backend && npm run seed
```

### 5. Run tests

```bash
cd backend && npm test
```

---

## API Reference

### Auth endpoints (public)

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| POST   | `/api/auth/register`   | Create account, receive JWT    |
| POST   | `/api/auth/login`      | Login, receive JWT             |
| GET    | `/api/auth/me`         | Get current user (protected)   |

**Register / Login body:**
```json
{ "name": "Jane Smith", "email": "jane@example.com", "password": "secret123" }
```

**Response:**
```json
{ "success": true, "token": "<jwt>", "user": { "id": "...", "name": "...", "email": "..." } }
```

### Job endpoints

| Method | Endpoint         | Auth required | Description                    |
|--------|------------------|---------------|--------------------------------|
| GET    | `/api/jobs`      | No            | List all jobs (supports filters)|
| GET    | `/api/jobs/:id`  | No            | Single job                     |
| POST   | `/api/jobs`      | ✅ Yes        | Create job                     |
| PATCH  | `/api/jobs/:id`  | ✅ Yes        | Update status                  |
| DELETE | `/api/jobs/:id`  | ✅ Yes        | Delete job                     |

**Protected requests** require header:
```
Authorization: Bearer <token>
```

**Query params (GET /api/jobs):**
- `?category=Plumbing`
- `?status=Open`
- `?search=leaking` (keyword search across title + description)

---

## How Auth Works

```
1. User registers → POST /api/auth/register
   → password hashed with bcrypt (10 salt rounds)
   → JWT signed with JWT_SECRET, expires in 7 days
   → token returned to client

2. Client stores token in localStorage

3. On protected requests (POST/PATCH/DELETE jobs):
   → Frontend reads token from localStorage
   → Adds "Authorization: Bearer <token>" header

4. authenticate middleware on Express:
   → Extracts token from header
   → Verifies signature + expiry with jwt.verify()
   → Looks up user in DB
   → Attaches user to req.user
   → Calls next() if valid, returns 401 if not
```

---

## Features

### Core ✅
- List all job requests with category + status filters
- Keyword search across title and description
- Create a new request (form with client + server validation)
- View full job detail
- Update status (dropdown)
- Delete a job
- Proper HTTP codes (201, 400, 401, 404, 409, 500)
- Global error handler + 404 middleware

### Bonus ✅
- ✅ JWT auth (register, login, protected POST/PATCH/DELETE)
- ✅ Keyword search (`?search=`)
- ✅ Seed script (`npm run seed`)
- ✅ 20 Jest + Supertest tests covering all endpoints

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. New Web Service on [render.com](https://render.com)
3. Build command: `npm install` · Start command: `npm start`
4. Set env vars: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. Deploy
