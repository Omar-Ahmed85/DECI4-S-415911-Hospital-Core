# Hospital Core Appointment Service

Standalone appointment-booking microservice. Owns appointment creation, availability checks, updates, cancellations, and its MongoDB database.

## Responsibilities

- Create appointments
- Check doctor availability for a date and time
- List appointments by patient or doctor
- Update appointment status, time, reason, or notes
- Cancel appointments

This service does not import code from `../backend`. It can run independently after installation and environment setup.

## Requirements

- Node.js 24+
- npm
- MongoDB instance

## Setup

```powershell
cd appointment-service
npm install
Copy-Item .env.example .env
```

Configure `.env`:

```env
APPOINTMENT_SERVICE_PORT=5001
APPOINTMENT_MONGODB_URI=mongodb://localhost:27017/hospital-appointments
APPOINTMENT_MONGODB_URI_ATLAS=mongodb+srv://user:pass@cluster.mongodb.net/hospital-appointments
NODE_ENV=development
```

Variable use:

| Variable | Used by | Purpose |
|---|---|---|
| `APPOINTMENT_SERVICE_PORT` | Service | HTTP listen port. Defaults to `5001`. |
| `APPOINTMENT_MONGODB_URI` | Development/test service | Local MongoDB database URL. |
| `APPOINTMENT_MONGODB_URI_ATLAS` | Production service | MongoDB Atlas database URL. |
| `NODE_ENV` | Database config | Selects development or production database URL. |

Never commit real Atlas credentials.

## Run

Development with Node file watcher:

```powershell
npm run dev
```

Normal start:

```powershell
npm start
```

Service URL:

```text
http://localhost:5001
```

Basic check:

```powershell
curl.exe http://localhost:5001/
```

Expected response:

```json
{ "name": "Appointment Service", "status": "ok" }
```

## API

Base URL:

```text
http://localhost:5001/api/appointments
```

| Method | Path | Success | Purpose |
|---|---|---|---|
| GET | `/` | 200 | List all appointments |
| POST | `/` | 201 | Book appointment |
| GET | `/availability?doctorId=:id&date=:date` | 200 | Check availability |
| GET | `/patient/:patientId` | 200 | List patient appointments |
| GET | `/doctor/:doctorId` | 200 | List doctor appointments |
| GET | `/:id` | 200 | Get appointment |
| PUT | `/:id` | 200 | Update appointment |
| DELETE | `/:id` | 200 | Cancel appointment |

### Create Appointment

```http
POST /api/appointments
Content-Type: application/json
```

```json
{
  "patientId": "65f0c0000000000000000001",
  "doctorId": "65f0c0000000000000000002",
  "date": "2026-07-01T09:00:00.000Z",
  "reason": "Routine checkup",
  "notes": "First visit"
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
    "notes": "First visit"
  }
}
```

Possible results:

| Status | Meaning |
|---|---|
| 200 | Read, update, availability check, or cancellation succeeded |
| 201 | Appointment created |
| 400 | `doctorId` or `date` missing from availability request |
| 404 | Appointment not found |
| 409 | Doctor unavailable at requested date/time |
| 503 | MongoDB unavailable |

### Check Availability

```http
GET /api/appointments/availability?doctorId=65f0c0000000000000000002&date=2026-07-01T09:00:00.000Z
```

```json
{ "available": true }
```

### Update Appointment

```http
PUT /api/appointments/65f0c0000000000000000003
Content-Type: application/json
```

```json
{
  "status": "confirmed",
  "notes": "Confirmed by phone"
}
```

### Cancel Appointment

```http
DELETE /api/appointments/65f0c0000000000000000003
```

```json
{ "message": "Appointment cancelled" }
```

## Test

Integration tests require MongoDB URL in environment:

```powershell
$env:APPOINTMENT_MONGODB_URI = "mongodb://localhost:27017/hospital-appointments-test"
$env:NODE_ENV = "test"
npm run test:integration
```

## Docker and Kubernetes

Development Compose starts this service with MongoDB:

```powershell
docker compose -f ..\infra\docker\docker-compose.dev.yml up --build appointment-service mongo
```

Kubernetes manifest:

```text
../infra/kubernetes/appointment-service-deployment.yaml
```

Minikube Ingress routes browser requests from `https://hospital.local/api/appointments` to this service. The frontend appointment API base is `https://hospital.local/api/`; frontend client adds `/appointments` itself.
