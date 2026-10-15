# SkillTrack AWS Capstone - Graduate Hire Progress Tracker

SkillTrack is a full-stack learning-progress tracking application designed for 20 graduate hires and their mentors. It replaces manually maintained spreadsheets with two dedicated dashboards, clear lab evidence tracking, and a relational PostgreSQL database schema.

---

## Architecture & Blueprint Mapping

```
                                +-------------------+
                                |   Amazon Cognito  |
                                | (User Auth / JWT) |
                                +---------+---------+
                                          |
                                    [Bearer JWT]
                                          |
   [ Browser (Graduate / Mentor) ] <=====> [ S3 + CloudFront (React SPA) ]
                                          |
                                          | HTTPS / REST
                                          v
                              +-----------------------+
                              | Amazon API Gateway    |
                              | /api/auth, /api/...   |
                              +-----------+-----------+
                                          |
                                          v
                              +-----------------------+
                              | Spring Boot / Lambda  |
                              | (Business Logic Tier) |
                              +-----------+-----------+
                                          |
                                          v
                              +-----------------------+
                              | Amazon RDS PostgreSQL |
                              | (3 Relational Tables) |
                              +-----------------------+
```

---

## Capstone Requirements Checklist

| Requirement | Implementation in SkillTrack |
|---|---|
| **Req 1: Two Dashboards** | Separate **Graduate Dashboard** (personal progress, module list, evidence submitter) and **Mentor Dashboard** (cohort metrics, graduate search/filter, evidence review drawer, CSV export). |
| **Req 2: Secure Sign-In** | Role-based JWT authentication (`ROLE_GRADUATE`, `ROLE_MENTOR`). Backend restricts graduates strictly to their own progress records. |
| **Req 3: Progress APIs** | Validated RESTful APIs for listing modules, updating training & lab statuses, submitting evidence links, and fetching mentor cohort statistics. |
| **Req 4: Replace Excel** | Relational data model (`graduates`, `training_modules`, `training_progress`). Dynamic calculation of completion percentages from individual database records. |
| **Req 5: Protect Credentials** | Database credentials configurable via environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`), no hardcoded secrets. |
| **Req 6: Observability** | Structured logging, centralized error responses with HTTP status codes, and health check endpoint at `/api/health`. |
| **Req 7: Reproducible Setup** | Automated data seeding with realistic 20-person graduate cohort, 2 mentors, 8 core AWS modules, and initial progress distribution. |
| **Req 8: Automated Delivery** | Vite React build pipeline and Maven build configuration. |

---

## 3 Core Relational Database Tables

1. **`graduates`**
   - `graduate_id` (PK, Long)
   - `name` (VARCHAR)
   - `email` (VARCHAR, Unique)
   - `password` (BCrypt hash)
   - `mentor_id` (FK to mentor graduate_id)
   - `role` (`GRADUATE` or `MENTOR`)
   - `created_at` (TIMESTAMP)

2. **`training_modules`**
   - `module_id` (PK, Long)
   - `title` (VARCHAR)
   - `topic` (VARCHAR)
   - `sequence_no` (INTEGER)
   - `lab_required` (BOOLEAN)
   - `description` (VARCHAR)
   - `estimated_hours` (INTEGER)

3. **`training_progress`**
   - `id` (PK, Long)
   - `graduate_id` (FK to graduates)
   - `module_id` (FK to training_modules)
   - `training_status` (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`)
   - `lab_status` (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `WAIVED`)
   - `evidence_url` (VARCHAR)
   - `evidence_notes` (VARCHAR)
   - `updated_at` (TIMESTAMP)
   - *Unique constraint on `(graduate_id, module_id)`*

---

## Quick Demo Credentials

All seed accounts have the default password: **`password123`**

### Mentor Accounts (Cohort Oversight & CSV Export)
- **Sarah Jenkins**: `sarah.jenkins@example.com`
- **David Miller**: `david.miller@example.com`

### Sample Graduate Accounts (Personal Learner View & Lab Submissions)
- **Alex Chen**: `alex.chen@example.com`
- **Priya Patel**: `priya.patel@example.com`
- **Marcus Vance**: `marcus.vance@example.com`
- *(+ 17 additional graduate accounts loaded into the database)*

---

## How to Run Locally

### 1. Start the Spring Boot Backend

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-26.0.1"
.\mvnw.cmd spring-boot:run
```
- Backend starts on `http://127.0.0.1:8080`
- Zero-setup H2 database runs automatically with preloaded seed data.
- To connect to **Amazon RDS / PostgreSQL**, provide environment variables:
  ```powershell
  $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://<rds-host>:5432/skilltrackdb"
  $env:SPRING_DATASOURCE_USERNAME = "postgres"
  $env:SPRING_DATASOURCE_PASSWORD = "<your-db-password>"
  ```

### 2. Start the React Frontend

In another terminal window:

```powershell
cd frontend
npm run dev
```
- Frontend starts at `http://127.0.0.1:5173`
- Open `http://127.0.0.1:5173` in your browser.

---

## REST API Reference

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/login` | POST | Public | Authenticates user and returns JWT token |
| `/api/auth/me` | GET | Authenticated | Returns current authenticated user |
| `/api/modules` | GET | Authenticated | Lists all 8 AWS training modules |
| `/api/graduate/progress` | GET | GRADUATE | Returns current graduate's progress & calculated percentages |
| `/api/graduate/progress/{moduleId}` | PUT | GRADUATE | Updates status and submits lab evidence URL for a module |
| `/api/mentor/graduates` | GET | MENTOR | Lists cohort overview (all 20 graduates + percentages) |
| `/api/mentor/graduates/{id}/progress` | GET | MENTOR | Returns specific graduate's full module breakdown |
| `/api/mentor/stats` | GET | MENTOR | Returns overall cohort KPI statistics |
| `/api/mentor/export` | GET | MENTOR | Downloads CSV export of cohort progress |
| `/api/health` | GET | Public | Health check endpoint |
