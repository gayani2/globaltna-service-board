# GlobalTNA – Mini Service Request Board

A full-stack web application where homeowners can post trade service requests and tradespeople can browse, view, and manage them.

Built for the **GlobalTNA Full-Stack Developer Intern Technical Assessment**.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | Next.js 14 (App Router), Tailwind CSS   |
| Backend    | Node.js + Express                       |
| Database   | MongoDB (Mongoose ODM)                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs           |
| Deployment | Frontend → Vercel · Backend → Render    |

---

## Project Structure

```
globaltna-service-board/
│
├── backend/                          # Express REST API
│   ├── src/
│   │   ├── index.js                  # Server entry point
│   │   │
│   │   ├── models/
│   │   │   ├── JobRequest.js         # Job schema & validation
│   │   │   └── User.js               # User schema + bcrypt hook
│   │   │
│   │   ├── controllers/
│   │   │   ├── jobController.js      # Job CRUD logic
│   │   │   └── authController.js     # Register / login / me
│   │   │
│   │   ├── routes/
│   │   │   ├── jobs.js               # /api/jobs  (GET public, rest protected)
│   │   │   └── auth.js               # /api/auth/register, /login, /me
│   │   │
│   │   ├── middleware/
│   │   │   ├── authenticate.js       # JWT verification
│   │   │   └── errorHandler.js       # 404 + global error handler
│   │   │
│   │   └── seed.js                   # Inserts 10 sample jobs
│   │
│   ├── .env
│   └── package.json
│
└── frontend/                         # Next.js App
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.js        # Global auth state (login/logout/user)
    │   │
    │   ├── app/
    │   │   ├── layout.js             # Root layout + NavBar
    │   │   ├── page.js               # Home — job list, filters, search
    │   │   ├── new-job/
    │   │   │   └── page.js           # Create job form (login required)
    │   │   ├── jobs/[id]/
    │   │   │   └── page.js           # Job detail, status update, delete
    │   │   ├── login/
    │   │   │   └── page.js           # Login page
    │   │   └── register/
    │   │       └── page.js           # Register page
    │   │
    │   ├── components/
    │   │   ├── NavBar.js             # Login/Register or user + Logout
    │   │   ├── JobCard.js            # Job summary card
    │   │   └── StatusBadge.js        # Coloured status pill
    │   │
    │   └── lib/
    │       └── api.js                # All API calls + auto JWT header
    │
    ├── .env.local.exampl
    └── package.json
```

---

## Environment Variables

### Backend — `backend/.env`

Create a file called `.env` inside the `backend` folder

### Frontend — `frontend/.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Local Setup & Run

### Prerequisites

- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone https://github.com/gayani2/globaltna-service-board.git
cd globaltna-service-board
```

### 2. Backend

```bash
cd backend
npm install

# Create a .env file in the backend folder and add  variables


npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend

Open a new terminal:

```bash
cd frontend
npm install

npm run dev
# Runs on http://localhost:3000
```

### 4. Seed the database (optional)

```bash
cd backend && npm run seed
```

Clears the collection and inserts 10 sample job requests.

---

## API Reference

Base URL: `http://localhost:5000`

### Auth Endpoints

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/api/auth/register`   | Create account, receive JWT  |
| POST   | `/api/auth/login`      | Login, receive JWT           |
| GET    | `/api/auth/me`         | Get current user (protected) |

### Job Endpoints

| Method | Endpoint          | Auth Required | Description              |
|--------|-------------------|---------------|--------------------------|
| GET    | `/api/jobs`       | No            | List all jobs            |
| GET    | `/api/jobs/:id`   | No            | Get a single job         |
| POST   | `/api/jobs`       | Yes        | Create a job             |
| PATCH  | `/api/jobs/:id`   | Yes        | Update status            |
| DELETE | `/api/jobs/:id`   | Yes        | Delete a job             |

**Query params for GET /api/jobs:**

| Param      | Example               | Description                           |
|------------|-----------------------|---------------------------------------|
| `category` | `?category=Plumbing`  | Filter by category                    |
| `status`   | `?status=Open`        | Filter by status                      |
| `search`   | `?search=leaking`     | Keyword search in title + description |

**Protected requests** require header:
```
Authorization: Bearer <token>
```

---

## Data Model

```
JobRequest {
  title        : String   (required)
  description  : String   (required)
  category     : String   enum["Plumbing", "Electrical", "Painting", "Joinery", "Other"]
  location     : String
  contactName  : String
  contactEmail : String   (email format validated)
  status       : String   enum["Open", "In Progress", "Closed"]  default: "Open"
  createdAt    : Date     (auto)
  updatedAt    : Date     (auto)
}
```

---

## How Auth Works

```
1. User registers → POST /api/auth/register
   → password hashed with bcrypt (10 salt rounds)
   → JWT signed and returned to client

2. Client stores JWT in localStorage

3. On protected requests (POST/PATCH/DELETE):
   → Frontend attaches "Authorization: Bearer <token>" header

4. authenticate middleware on Express:
   → Verifies token signature and expiry
   → Attaches user to req.user
   → Returns 401 if invalid or missing
```

---

## Deployment

### Backend → Render

1. Push repo to GitHub
2. New **Web Service** on [render.com](https://render.com)
3. Set **Root Directory** to `backend`
4. Build command: `npm install` · Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
4. Deploy

---

## Live Demo

| | URL |
|--|-----|
| **Frontend** | https://globaltna-service-board-nine.vercel.app|
| **Backend**  | https://backend1-5wfj.onrender.com |
