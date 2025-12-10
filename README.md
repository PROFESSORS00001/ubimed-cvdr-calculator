# UBIMED CVDR Calculator

A web application for estimating 10-year cardiovascular disease risk using WHO/ISH and Framingham models.

## Project Structure

This is a monorepo containing:
- `client/`: React + TypeScript + Vite frontend.
- `server/`: Node.js + Express + TypeScript backend.
- `docker-compose.yml`: Orchestration for Client, Server, and PostgreSQL.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Must be running)
- Node.js (v18+) (Optional, if running locally without Docker)

## Getting Started

### Method 1: Docker (Recommended)

1.  Ensure Docker Desktop is running.
2.  Run the stack:
    ```bash
    docker-compose up --build
    ```
3.  Access the application:
    -   Frontend: `http://localhost:5173`
    -   Backend: `http://localhost:3000`

### Method 2: Manual Setup

**Backend:**
1.  Navigate to `server/`:
    ```bash
    cd server
    npm install
    ```
2.  Set up environment variables (`.env`). Ensure a local Postgres instance is running or update `DATABASE_URL`.
3.  Run the server:
    ```bash
    npm run dev
    ```

**Frontend:**
1.  Navigate to `client/`:
    ```bash
    cd client
    npm install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    ```

## Features

- **Risk Calculations**: WHO/ISH (Lab & Non-Lab), Framingham.
- **Dynamic Forms**: Input fields adjust based on selected chart.
- **History**: Local cache / database storage of past calculations (Fallback to mock data if DB unavailable).
- **Responsive Design**: Mobile-first UI using TailwindCSS.

## Known Issues / Notes

-   **Database**: The application requires a PostgreSQL database. If running via Docker, this is handled automatically. If running manually, ensure `DATABASE_URL` is correct.
-   **Authentication**: Currently disabled (Public access) as per specification.
-   **Exports**: PDF export is a placeholder in this prototype.

## Developer

Developed by Daniel Musa Kamara.
