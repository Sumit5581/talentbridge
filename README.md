# TalentBridge — Job Portal & Recruitment Management System

A full-stack MERN application with four modules: **Candidate Portal**, **Employer Portal**, **HR Dashboard**, and **Analytics**.

## Features implemented
- Candidate profiles + resume upload (PDF/DOC/DOCX)
- Job posting portal (employers)
- Applicant tracking system with status pipeline (Applied → Shortlisted → Interview Scheduled → Interviewed → Offered/Rejected → Hired)
- Interview scheduling
- Admin dashboard (user management)
- HR dashboard with analytics charts (status breakdown, top jobs, totals)
- Real-time notifications via Socket.io (new job postings, application status changes, interview scheduling)
- Role-based auth (JWT) for Candidate / Employer / HR / Admin

## Tech stack
React + Vite + Tailwind • Node.js + Express • MongoDB + Mongoose • Socket.io • JWT auth • Multer (file uploads)

---

## 1. Run it locally first (do this before the meeting, to be safe)

### Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env`:
- `MONGO_URI` — get a free connection string from MongoDB Atlas (see step 2 below), or use a local MongoDB if you have one installed.
- `JWT_SECRET` — any long random string.

Then:
```bash
npm run seed     # creates demo accounts + sample jobs so the app isn't empty
npm run dev      # starts server on http://localhost:5000
```

### Frontend
In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env   # defaults already point to localhost:5000, fine for local dev
npm run dev             # starts on http://localhost:5173
```

Open `http://localhost:5173`. Log in with one of the seeded demo accounts (shown on the login page), or register your own candidate account and try uploading a resume.

---

## 2. Set up MongoDB Atlas (free, takes ~5 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free M0 cluster.
3. Under **Database Access**, create a database user with a username/password.
4. Under **Network Access**, click "Allow Access from Anywhere" (0.0.0.0/0) — fine for a demo.
5. Click **Connect** → **Drivers** → copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Paste it into `backend/.env` as `MONGO_URI`, adding `/talentbridge` before the `?`:
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/talentbridge?retryWrites=true&w=majority`

---

## 3. Deploy the backend to Render (free)

Vercel can't reliably run this Express + Socket.io + file-upload server (it's a serverless platform, not built for persistent connections). **Render's free tier handles this perfectly** and deploys just as easily.

1. Push this project to a GitHub repo.
2. Go to https://render.com → sign up/log in → **New** → **Web Service**.
3. Connect your GitHub repo, set **Root Directory** to `backend`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (same as your `.env`): `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (you'll fill this in after deploying the frontend).
7. Deploy. Render gives you a URL like `https://talentbridge-api.onrender.com`.
8. Once deployed, run the seed script once from your local machine pointed at the Atlas DB (`npm run seed` in `backend`, with `.env` pointing to Atlas) so your live database has demo data.

> Note: Render's free tier spins down when idle and "wakes up" on the first request, which can take ~30 seconds. For your meeting, open the live link a minute or two beforehand so it's already warm.

> Note on resumes: the free tier's disk storage resets on redeploy. Fine for a demo/meeting. For a real production system, swap `multer.diskStorage` for a cloud storage option like Cloudinary or AWS S3 — happy to add that later if needed.

---

## 4. Deploy the frontend to Vercel

1. Go to https://vercel.com → **Add New Project** → import the same GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite (auto-detected).
4. Add environment variables:
   - `VITE_API_URL` = `https://talentbridge-api.onrender.com/api` (your Render backend URL + `/api`)
   - `VITE_SOCKET_URL` = `https://talentbridge-api.onrender.com`
5. Deploy. Vercel gives you a live URL like `https://talentbridge.vercel.app`.
6. Go back to Render → update the backend's `CLIENT_URL` env var to your new Vercel URL, so CORS allows it. Redeploy the backend.

---

## 5. Demo flow for your HR ma'am
1. Show the **Home page** → explain the 4 modules.
2. **Register/login as Candidate** → go to Profile → upload a resume (PDF) → show it appears.
3. Go to **Browse Jobs** → apply to a job → note the "Applied" status appears in My Applications.
4. **Open a second browser tab**, log in as the seeded **Employer** account → go to "My Job Postings" → View Applicants → show the resume link, then change status to "Shortlisted" and schedule an interview.
5. Switch back to the **Candidate tab** → show the real-time notification bell light up and the interview details on My Applications.
6. Log in as **HR** → show the analytics dashboard (charts, applicant tracking table).
7. Log in as **Admin** → show user management.

---

## Project structure
```
talentbridge/
├── backend/          # Express API, MongoDB models, JWT auth, Socket.io
└── frontend/         # React + Vite + Tailwind, 4 portals
```
