# Hospital Core

Healthcare management platform for patients, doctors, medical histories, and appointments.

## Stack

- Frontend: React, Vite, React Query, Axios
- Core API: Node.js, Express, Mongoose
- Appointment API: independent Node.js and Express microservice
- Database: MongoDB
- Testing: Jest, React Testing Library, Supertest, Playwright
- Delivery: Docker Compose, Kubernetes/Minikube, GitHub Actions, Lighthouse CI, semantic-release

## Architecture

```mermaid
flowchart LR
    User[User] --> Frontend[React Frontend]
    Frontend -->|/api/patients\n/api/doctors| Backend[Core Backend API]
    Frontend -->|/api/appointments| Appointments[Appointment Service]
    Backend --> HospitalDB[(MongoDB: hospital)]
    Appointments --> AppointmentsDB[(MongoDB: hospital-appointments)]
```

Backend owns patients, doctors, and medical histories. Appointment service owns appointment booking and availability. Services deploy independently and do not import each other's source code.

## Repository Layout

```text
DECI4-S-415911-Hospital-Core/
├── frontend/                 React and Vite SPA
├── backend/                  Core patient and doctor API
├── appointment-service/      Standalone appointment API
├── e2e/                      Playwright end-to-end tests
├── infra/
│   ├── docker/               Development and production Compose files
│   ├── kubernetes/           Minikube manifests, TLS, Ingress, HPA
│   └── diagrams/             VPC blueprint
└── .github/workflows/        CI workflow
```

## Local Setup

### Prerequisites

- Node.js 24+
- npm
- MongoDB, or Docker Desktop
- Docker Desktop and Docker Compose for container workflow
- Minikube and `kubectl` for Kubernetes workflow

### Environment Files

Copy each `.env.example` file to `.env`. Do not commit `.env` files.

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item appointment-service\.env.example appointment-service\.env
Copy-Item frontend\.env.example frontend\.env
```

`backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital
MONGODB_URI_ATLAS=mongodb+srv://user:pass@cluster.mongodb.net/hospital
NODE_ENV=development
```

`appointment-service/.env`:

```env
APPOINTMENT_SERVICE_PORT=5001
APPOINTMENT_MONGODB_URI=mongodb://localhost:27017/hospital-appointments
APPOINTMENT_MONGODB_URI_ATLAS=mongodb+srv://user:pass@cluster.mongodb.net/hospital-appointments
NODE_ENV=development
```

`frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APPOINTMENT_API_URL=http://localhost:5001/api
```

`VITE_*` values are bundled by Vite during build. They are not container runtime settings.

### Run Services Directly

Use separate terminals:

```powershell
cd backend
npm install
npm run dev
```

```powershell
cd appointment-service
npm install
npm start
```

```powershell
cd frontend
npm install
npm run dev
```

Endpoints:

| Service | Local URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Core backend | `http://localhost:5000` |
| Appointment service | `http://localhost:5001` |

### Seed Core Database

`backend/src/seed.js` deletes all patients, doctors, and medical histories before inserting sample records. Do not run it against data that must be preserved.

```powershell
cd backend
node src/seed.js
```

## Tests

Run from each named directory:

```powershell
cd frontend
npm test
```

```powershell
cd backend
npm run test:integration
```

```powershell
cd appointment-service
npm run test:integration
```

```powershell
cd e2e
npm install
npx playwright test
```

CI runs frontend unit tests, backend and appointment integration tests, Playwright E2E tests, Lighthouse CI, and semantic-release on `master` pushes.

## Docker Compose

Development Compose provides MongoDB plus hot reload for frontend and both APIs:

```powershell
docker compose -f infra/docker/docker-compose.dev.yml up --build
```

Stop and remove data volume:

```powershell
docker compose -f infra/docker/docker-compose.dev.yml down -v
```

Production-style local Compose:

```powershell
docker compose -f infra/docker/docker-compose.prod.yml up --build
```

## Kubernetes and Minikube

The manifests deploy frontend, backend, appointment service, MongoDB, backend HPA, NGINX Ingress, self-signed TLS, and frontend runtime config.

```powershell
minikube start
minikube addons enable ingress
kubectl apply -f infra/kubernetes/
kubectl get deployments,pods,svc,ingress,hpa
```

With Minikube Docker driver on Windows, run this in an elevated terminal and keep it running:

```powershell
minikube tunnel
```

Map host name to tunnel loopback address in `C:\Windows\System32\drivers\etc\hosts`:

```text
127.0.0.1 hospital.local
```

Then verify TLS Ingress:

```powershell
curl.exe -k https://hospital.local
curl.exe -k https://hospital.local/api/health
curl.exe -k https://hospital.local/runtime-config.js
```

### Frontend Runtime Config

Kubernetes mounts ConfigMap key `runtime-config.js` into Nginx at `/usr/share/nginx/html/runtime-config.js`. Browser loads it before Vite bundle.

```text
https://hospital.local/runtime-config.js
```

Config file source: `infra/kubernetes/frontend-runtime-config.yaml`.

Current Kubernetes routes:

| Browser path | Service |
|---|---|
| `/` | `frontend-service` |
| `/api/appointments` | `appointment-service` |
| `/api` | `backend-service` |

Ingress uses longest matching path, so appointment routes do not collide with core backend routes.

## API Documentation

### Core Backend

Base URL: `http://localhost:5000/api`

| Method | Path | Success | Purpose |
|---|---|---|---|
| GET | `/health` | 200 | Service health |
| GET | `/patients` | 200 | List patients |
| POST | `/patients` | 201 | Create patient |
| GET | `/patients/search?q=value` | 200 | Search patients |
| GET | `/patients/:id` | 200 | Get patient |
| PUT | `/patients/:id` | 200 | Update patient |
| DELETE | `/patients/:id` | 200 | Delete patient |
| GET | `/patients/:id/history` | 200 | Get medical history |
| POST | `/patients/:id/history` | 201 | Add medical history entry |
| GET | `/doctors` | 200 | List doctors |
| POST | `/doctors` | 201 | Create doctor |
| GET | `/doctors/specialty/:specialty` | 200 | List doctors by specialty |
| GET | `/doctors/:id` | 200 | Get doctor |
| PUT | `/doctors/:id` | 200 | Update doctor |
| DELETE | `/doctors/:id` | 200 | Delete doctor |

Health response:

```http
GET /api/health
```

```json
{ "status": "healthy" }
```

Create patient:

```http
POST /api/patients
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "age": 35,
  "gender": "Male",
  "contact": "555-0101",
  "address": "123 Main St"
}
```

```json
{
  "message": "Patient created",
  "id": "65f0c0000000000000000001",
  "patient": {
    "_id": "65f0c0000000000000000001",
    "name": "John Doe",
    "age": 35,
    "gender": "Male",
    "contact": "555-0101",
    "address": "123 Main St"
  }
}
```

Create doctor:

```http
POST /api/doctors
Content-Type: application/json
```

```json
{
  "name": "Dr. Sarah Lee",
  "specialty": "Cardiology",
  "department": "Heart Care",
  "availability": ["Mon", "Wed", "Fri"]
}
```

Core API returns `400` for invalid request data or IDs, `404` for missing resources, and `503` when MongoDB is unavailable.

### Appointment Service

Base URL: `http://localhost:5001/api/appointments`

| Method | Path | Success | Purpose |
|---|---|---|---|
| GET | `/` | 200 | List appointments |
| POST | `/` | 201 | Book appointment |
| GET | `/availability?doctorId=:id&date=:date` | 200 | Check availability |
| GET | `/patient/:patientId` | 200 | List patient's appointments |
| GET | `/doctor/:doctorId` | 200 | List doctor's appointments |
| GET | `/:id` | 200 | Get appointment |
| PUT | `/:id` | 200 | Update appointment |
| DELETE | `/:id` | 200 | Cancel appointment |

Book appointment:

```http
POST /api/appointments
Content-Type: application/json
```

```json
{
  "patientId": "65f0c0000000000000000001",
  "doctorId": "65f0c0000000000000000002",
  "date": "2026-07-01T09:00:00.000Z",
  "reason": "Routine checkup"
}
```

```json
{
  "message": "Appointment booked",
  "id": "65f0c0000000000000000003",
  "appointment": {
    "_id": "65f0c0000000000000000003",
    "patientId": "65f0c0000000000000000001",
    "doctorId": "65f0c0000000000000000002",
    "date": "2026-07-01T09:00:00.000Z",
    "status": "scheduled",
    "reason": "Routine checkup",
    "notes": ""
  }
}
```

Appointment creation returns `409` when doctor is unavailable. Missing appointment records return `404`; unavailable database returns `503`.

## Cloud and Network Blueprint

Production components deploy separately: Netlify hosts frontend, Vercel hosts core backend, appointment service has its own deployment, and MongoDB Atlas holds production data. Configure real deployment URLs as deployment environment variables; no live URLs are recorded here.

VPC design: [`infra/diagrams/vpc-blueprint.md`](infra/diagrams/vpc-blueprint.md).

```mermaid
flowchart LR
    Browser[Browser] --> Netlify[Netlify Frontend]
    Netlify --> Backend[Vercel Backend API]
    Netlify --> Appointments[Appointment Service]
    Backend --> Atlas[(MongoDB Atlas)]
    Appointments --> Atlas
```

## Submission Evidence

Not committed here: screenshots, demo video, live deployment URLs, and PR merge evidence. Capture those from actual environment before submission. Required terminal proof includes:

```powershell
kubectl get nodes
kubectl get pods -o wide
kubectl get services
kubectl get ingress
kubectl get hpa
kubectl describe hpa
```
