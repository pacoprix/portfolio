# Portfolio — Francesc Folch Company

Personal portfolio: **React** frontend on GitHub Pages + **Spring Boot** REST API on Railway + **PostgreSQL**.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + TypeScript + TailwindCSS + Framer Motion |
| Backend | Spring Boot 3.5 + Spring Data JPA + Spring Security (JWT) |
| Database | PostgreSQL in production · H2 in-memory for local dev |
| Hosting | GitHub Pages (frontend) · Railway (backend + DB) |

---

## Local Development

No Docker or external database needed. The `dev` Spring profile uses an in-memory H2 database that is seeded automatically on startup.

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

- API available at `http://localhost:8080`
- H2 database console at `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:portfolio`
  - Username: `sa` · Password: *(empty)*
- Default admin credentials: `admin` / `admin`
- **Hot reload**: `spring-boot-devtools` is included — the server restarts automatically when a `.java` file is recompiled. In IntelliJ enable *Build → Compiler → Build project automatically*.

### 2. Frontend

```bash
cd frontend
npm install      # first time only
npm run dev
```

- App available at `http://localhost:5173/portfolio/`
- **Hot reload**: Vite HMR updates the browser instantly on every file save, no restart needed.
- The dev Vite server proxies API calls to `http://localhost:8080` via the `VITE_API_URL` env var (defaults to backend URL set in `.env.local` — see below).

### Environment file (frontend)

Create `frontend/.env.local` (git-ignored):

```env
VITE_API_URL=http://localhost:8080
```

---

## Deployment

Deployments are triggered automatically by GitHub Actions on every push to `main`.

| What | How | Workflow file |
|------|-----|--------------|
| Frontend | Builds with Vite → pushes to `gh-pages` branch → served by GitHub Pages | `.github/workflows/deploy-frontend.yml` |
| Backend | Builds JAR and runs tests → Railway auto-deploys from `main` via Git integration | `.github/workflows/deploy-backend.yml` |

### GitHub Actions secrets

Set these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `VITE_API_URL` | Railway backend public URL (e.g. `https://your-app.railway.app`) |

> `RAILWAY_TOKEN` is **not** needed — Railway deploys automatically via its Git integration. Just connect the repo in the Railway dashboard.

### Railway environment variables

Set these in the Railway service settings for the backend:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL JDBC URL (`jdbc:postgresql://...`) |
| `DATABASE_USERNAME` | DB username |
| `DATABASE_PASSWORD` | DB password |
| `JWT_SECRET` | Random secret ≥ 32 characters (generate with `openssl rand -base64 48`) |
| `CORS_ALLOWED_ORIGINS` | Frontend origin, e.g. `https://pacoprix.github.io` |
| `PORT` | Set to `8080` |

### First-time production admin user

There is no sign-up endpoint by design. Insert an admin user directly via the Railway PostgreSQL console:

```sql
-- Replace the hash with a BCrypt hash of your chosen password
INSERT INTO users (username, password)
VALUES ('admin', '$2b$10$...');
```

Generate a BCrypt hash with: `python3 -c "import bcrypt; print(bcrypt.hashpw(b'yourpassword', bcrypt.gensalt()).decode())"`

### Enable GitHub Pages

After the first successful frontend deploy:

1. Go to **Settings → Pages**
2. Set source to **Deploy from branch → `gh-pages` → `/ (root)`**
3. The site will be live at `https://pacoprix.github.io/portfolio/`
