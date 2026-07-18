# Hospital Core Healthcare Management System

> Production-Ready Cloud-Native Healthcare Management Platform

## Project Overview

Hospital Core is a cloud-native healthcare management platform designed to manage patients, doctors, and appointments through a scalable full-stack architecture.

The platform demonstrates modern software engineering practices including:

- React Single Page Application (SPA)
- Node.js + Express Backend
- MongoDB Database
- Appointment Booking Microservice
- Docker Containerization
- Docker Compose Orchestration
- Kubernetes Deployment (Minikube)
- GitHub Actions CI/CD
- Automated Testing
- Lighthouse Quality Audits
- Semantic Versioning
- MongoDB Atlas Production Database
- Netlify + Vercel Cloud Deployment

---

# Features

## Frontend Features

### Doctor Dashboard
- Patient statistics
- Appointment summaries
- Activity overview
- Live updates

### Patient Management
- Add patient
- Edit patient
- Delete patient
- Search patients
- View medical history

### Appointment Scheduling
- Create appointments
- Update appointments
- Cancel appointments
- Appointment status tracking

### Performance Features

#### React Query
- API response caching
- Background synchronization
- Automatic refetching
- Optimized network requests

#### Optimistic Updates
- Instant UI feedback
- Reduced perceived latency
- Automatic rollback on failure

---

## Backend Features

### MVC Architecture

```text
backend/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── config/
└── app.js
```

### REST API

- Patient Management APIs
- Doctor Management APIs
- Appointment APIs
- Health Check APIs

### Security

- Environment Variables
- MongoDB Connection Protection
- Input Validation
- Error Handling Middleware

---

## Appointment Booking Microservice

The Appointment Booking module is separated from the main backend into its own microservice.

### Responsibilities

- Appointment Creation
- Appointment Updates
- Appointment Cancellation
- Appointment Availability Checks

### Benefits

- Independent deployment
- Horizontal scaling
- Better fault isolation
- Improved maintainability

---

# Monorepo Structure

```text
Student-ID-Hospital-Core/

├── frontend/
│
├── backend/
│
├── appointment-service/
│
├── infra/
│   ├── docker/
│   ├── kubernetes/
│   └── diagrams/
│
├── .github/
│   └── workflows/
│
└── README.md
```

---

# System Architecture

```text
┌─────────────────┐
│     React UI    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Express Backend │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│    MongoDB      │
└─────────────────┘

        ▲
        │
┌─────────────────────────┐
│ Appointment Microservice│
└─────────────────────────┘
```

---

# Cloud Architecture (VPC Blueprint)

```text
Internet
    │
    ▼

┌───────────────────────────────┐
│         Public Subnet         │
├───────────────────────────────┤
│ Netlify Frontend              │
│ Vercel Backend API Gateway    │
└──────────────┬────────────────┘
               │
               ▼

┌───────────────────────────────┐
│         Private Subnet        │
├───────────────────────────────┤
│ MongoDB Atlas Cluster         │
│ Internal Services             │
└───────────────────────────────┘
```

### Security Separation

Public Layer:
- React Frontend
- API Gateway

Private Layer:
- MongoDB Atlas
- Internal Services
- Sensitive Healthcare Data

---

# Data Flow Diagram

```text
User
 │
 ▼
React Frontend
 │
 ▼
Express Backend
 │
 ├────────► MongoDB
 │
 ▼
Appointment Service
 │
 ▼
MongoDB
```

---

# Technology Stack

## Frontend

- React
- React Query
- Axios
- Jest
- React Testing Library

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## DevOps

- Docker
- Docker Compose
- Kubernetes
- GitHub Actions
- Lighthouse CI

## Cloud

- Netlify (Frontend)
- Vercel (Backend)
- MongoDB Atlas (Production Database)

---

# Getting Started

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker (for containerized development)
- Docker Compose (for orchestrated development)
- MongoDB (local or Atlas)
- Kubernetes CLI (kubectl)
- Minikube (for local Kubernetes)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Student-ID-Hospital-Core
```

### 2. Environment Setup

Create `.env` files in each service directory:

**Backend (.env in backend/)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital
MONGODB_URI_ATLAS=mongodb+srv://user:pass@cluster.mongodb.net/hospital
NODE_ENV=development
```

**Appointment Service (.env in appointment-service/)**
```env
APPOINTMENT_SERVICE_PORT=5001
APPOINTMENT_MONGODB_URI=mongodb://localhost:27017/hospital-appointments
```

**Frontend (.env in frontend/)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_APPOINTMENT_API_URL=http://localhost:5001/api
```

### 3. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# Appointment Service
cd appointment-service && npm install
```

### 4. Start the Services

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Appointment Service
cd appointment-service && npm start
```

### 5. Seed the Database

```bash
node backend/src/seed.js
```

---

# API Documentation

## Health Check

- `GET /api/health` - Check backend health status

## Patient Management

- `GET /api/patients` - List all patients
- `POST /api/patients` - Create a new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

## Doctor Management

- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor by ID

## Appointment Management (Microservice)

- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - List all appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

---

# Testing

```bash
# Unit Tests
npm test

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e
```

---

# Docker Development

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down -v
```

---

# Kubernetes Development

```bash
# Start Minikube
minikube start

# Enable ingress
minikube addons enable ingress

# Deploy applications
kubectl apply -f infra/kubernetes/

# Check status
kubectl get pods,svc,ingress
```

---

# CI/CD Pipeline

The GitHub Actions pipeline includes:
- Automated testing
- Lighthouse quality audits
- Semantic versioning
- Automated releases

---

# License

This project is part of a Software Engineering program curriculum.
