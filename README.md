# CBAD Task Manager

A small full-stack task manager, fully containerised with Docker and shipped through a GitHub Actions CI/CD pipeline.

Users can add tasks, mark them complete / incomplete (strike-through), and delete them. Blank tasks are rejected in the UI and by the API.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 (Create React App), Tailwind CSS 3, Axios |
| Backend | Node.js, Express, CORS, Jest + Supertest |
| Database | PostgreSQL 15 (container provisioned, Prisma schema defined) |
| Containers | Docker, Docker Compose |
| CI/CD | GitHub Actions, Docker Hub |

## Architecture

```
 Browser
    |  http://localhost:3000
    v
+-----------+   REST / JSON   +-----------+   DATABASE_URL   +------------+
| Frontend  | --------------> |  Backend  | ---------------> | PostgreSQL |
| React     |  :5000          |  Express  |  :5432           | (pgdata    |
| dev server|                 |           |                  |  volume)   |
+-----------+                 +-----------+                  +------------+
   port 3000                     port 5000                      port 5432
```

- The **frontend** calls the backend at `http://localhost:5000`.
- The **backend** exposes:
  - `GET /health`
  - `GET /tasks`
  - `POST /tasks`
  - `PATCH /tasks/:id` (body `{ "done": true|false }`)
  - `DELETE /tasks/:id`
- The **database** container runs with a persistent volume and credentials from `.env`. The Prisma schema (`backend/prisma/schema.prisma`) defines `Task` and `User` models.

> **Current limitation:** the backend keeps tasks in an in-memory array, so tasks are lost when the backend restarts. It receives `DATABASE_URL` but does not query Postgres yet. Wiring the routes to Prisma is the next step.

## Setup and run

Requirements: Docker and Docker Compose.

```bash
# 1. Create your local secrets file (never committed)
cp .env.example .env
#    then edit .env and set strong values for POSTGRES_PASSWORD and JWT_SECRET
#    e.g.  openssl rand -hex 32

# 2. Build and start everything
docker-compose up --build
```

Then open:

- App: http://localhost:3000
- API: http://localhost:5000 (health check: http://localhost:5000/health)

Compose refuses to start if `POSTGRES_PASSWORD` or `JWT_SECRET` is missing, so secrets are never silently defaulted.

Run the tests:

```bash
cd backend && npm install && npm test
cd frontend && npm install && CI=true npm test -- --watchAll=false
```

## Configuration

All secrets live in `.env` (git-ignored). `.env.example` lists the variables:

| Variable | Purpose |
| --- | --- |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password (required) |
| `POSTGRES_DB` | Database name |
| `JWT_SECRET` | Secret for signing tokens (required) |

## CI/CD pipeline

Defined in `.github/workflows/deploy.yml`. It runs on every push and pull request to `main`.

1. **build-and-test**: checks out the code, sets up Node.js 18, installs backend dependencies and runs the backend test suite (`npm test`).
2. **push-image**: runs only on pushes to `main`, and only after `build-and-test` succeeds. It logs in to Docker Hub, then builds and pushes two images:
   - `<DOCKER_USERNAME>/cbad-backend:latest`
   - `<DOCKER_USERNAME>/cbad-frontend:latest`

Required GitHub repository secrets (Settings > Secrets and variables > Actions):

| Secret | Value |
| --- | --- |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password or access token (token recommended) |

## Project structure

```
.
├── backend/            Express API, Prisma schema, Jest tests, Dockerfile
├── frontend/           React + Tailwind UI, Dockerfile
├── .github/workflows/  CI/CD pipeline
├── docker-compose.yml  frontend + backend + db
└── .env.example        template for required environment variables
```
