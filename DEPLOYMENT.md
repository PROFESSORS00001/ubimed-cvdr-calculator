# UBIMED CVDR Calculator - Deployment Guide

This guide will walk you through deploying the application to the web for free using standard cloud providers.

## Architecture Overview
-   **Database**: PostgreSQL (Stores patient data) -> Deployed on **Neon** or **Supabase**.
-   **Backend**: Node.js API (Connects to DB) -> Deployed on **Render** or **Railway**.
-   **Frontend**: React App (The UI) -> Deployed on **Vercel** or **Netlify**.

---

## Part 1: Database Setup (PostgreSQL)
We recommend **Neon** (neon.tech) or **Supabase** (supabase.com) for a free, managed Postgres database.

1.  **Sign Up**: Create an account on Neon or Supabase.
2.  **Create Project**: Create a new project named `ubimed-cvdr`.
3.  **Get Connection String**: Copy the "Connection String" (starts with `postgres://...`).
    -   *Save this for Part 2!*
4.  **Run Schema**:
    -   Go to the **SQL Editor** in your dashboard.
    -   Open the `server/schema.sql` file from this project.
    -   Copy the content and paste it into the SQL Editor.
    -   Click **Run** to create the tables.

---

## Part 2: Backend Deployment (Render)
We recommend **Render** (render.com) for hosting the Node.js server.

1.  **Push Code**: Ensure your project is pushed to your GitHub repository.
2.  **New Web Service**: In Render, click "New +", select "Web Service", and connect your GitHub repo.
3.  **Settings**:
    -   **Root Directory**: `server`
    -   **Build Command**: `npm install && npm run build`
    -   **Start Command**: `npm start`
4.  **Environment Variables**:
    -   Scroll down to "Environment Variables".
    -   Add `DATABASE_URL`: *Paste the connection string from Part 1*.
    -   Add `ALLOWED_ORIGINS`: `https://your-frontend-url.vercel.app` (You can add this later after Part 3).
5.  **Deploy**: Click "Create Web Service".
    -   Wait for it to go live. Copy the **Service URL** (e.g., `https://ubimed-server.onrender.com`).

---

## Part 3: Frontend Deployment (Vercel)
We recommend **Vercel** (vercel.com) for the React frontend.

1.  **New Project**: In Vercel, click "Add New...", select "Project", and import your GitHub repo.
2.  **Framework Preset**: It should auto-detect "Vite".
3.  **Root Directory**: Click "Edit" and select `client`.
4.  **Environment Variables**:
    -   Add `VITE_API_URL`: *Paste the Backend Service URL from Part 2* + `/api`.
    -   *Example*: `https://ubimed-server.onrender.com/api`
5.  **Deploy**: Click "Deploy".

---

## Final Step: Connect Them
1.  Go back to **Render (Backend)** environment variables.
2.  Update `ALLOWED_ORIGINS` to match your new **Vercel (Frontend)** URL.
3.  **Redeploy** the backend if necessary.

**✅ Success! Your application is now live.**
