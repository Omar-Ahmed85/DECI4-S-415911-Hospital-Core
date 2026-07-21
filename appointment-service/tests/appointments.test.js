
process.env.APPOINTMENT_MONGODB_URI =
  process.env.APPOINTMENT_MONGODB_URI || 'mongodb://localhost:27017/hospital-appointments-test';
process.env.NODE_ENV = 'test';
process.env.APPOINTMENT_SERVICE_PORT = '5099'; // isolated port for tests

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');

const sampleAppointment = () => ({
  patientId: 'patient-001',
  doctorId: 'doctor-001',
  date: new Date('2026-08-15T10:00:00.000Z').toISOString(),
  status: 'scheduled',
  reason: 'Annual checkup',
});

beforeAll(async () => {
  await connectDB();
});

afterEach(async () => {
  // Wipe the test collection between tests so each test starts clean.
  const Appointment = mongoose.model('Appointment');
  await Appointment.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
});

// GET /api/appointments — list all

describe('GET /api/appointments', () => {
  it('returns an empty array when there are no appointments', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });

  it('returns all appointments', async () => {
    // Seed two appointments directly via the API
    await request(app).post('/api/appointments').send(sampleAppointment());
    await request(app)
      .post('/api/appointments')
      .send({
        ...sampleAppointment(),
        doctorId: 'doctor-002',
        date: new Date('2026-08-16T10:00:00.000Z').toISOString(),
      });

    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

// POST /api/appointments — create

describe('POST /api/appointments', () => {
  it('creates a new appointment and returns 201', async () => {
    const payload = sampleAppointment();
    const res = await request(app).post('/api/appointments').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Appointment booked');
    expect(res.body).toHaveProperty('id');
    expect(res.body.appointment).toMatchObject({
      patientId: payload.patientId,
      doctorId: payload.doctorId,
      status: 'scheduled',
      reason: payload.reason,
    });
  });

  it('returns 409 when the same doctor is already booked at the same time', async () => {
    const payload = sampleAppointment();
    // First booking succeeds
    await request(app).post('/api/appointments').send(payload);

    // Second booking at the exact same slot should conflict
    const res = await request(app).post('/api/appointments').send(payload);
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('message', 'Doctor not available at this time');
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ reason: 'no patient or doctor' });

    // Mongoose validation error → 400
    expect(res.status).toBe(400);
  });
});

// GET /api/appointments/:id — get one

describe('GET /api/appointments/:id', () => {
  it('returns a single appointment by ID', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .send(sampleAppointment());
    const id = created.body.id;

    const res = await request(app).get(`/api/appointments/${id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(id);
  });

  it('returns 404 for a non-existent appointment', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/appointments/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Appointment not found');
  });

  it('returns 400 for an invalid ID format', async () => {
    const res = await request(app).get('/api/appointments/not-a-valid-id');
    expect(res.status).toBe(400);
  });
});

// PUT /api/appointments/:id — update

describe('PUT /api/appointments/:id', () => {
  it('updates an appointment status and returns 200', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .send(sampleAppointment());
    const id = created.body.id;

    const res = await request(app)
      .put(`/api/appointments/${id}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Appointment updated');
    expect(res.body.appointment.status).toBe('confirmed');
  });

  it('updates notes and reason', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .send(sampleAppointment());
    const id = created.body.id;

    const res = await request(app)
      .put(`/api/appointments/${id}`)
      .send({ notes: 'Patient confirmed attendance', reason: 'Follow-up' });

    expect(res.status).toBe(200);
    expect(res.body.appointment.notes).toBe('Patient confirmed attendance');
    expect(res.body.appointment.reason).toBe('Follow-up');
  });

  it('returns 404 when updating a non-existent appointment', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .put(`/api/appointments/${fakeId}`)
      .send({ status: 'confirmed' });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Appointment not found');
  });

  it('returns 400 for invalid status value', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .send(sampleAppointment());
    const id = created.body.id;

    const res = await request(app)
      .put(`/api/appointments/${id}`)
      .send({ status: 'invalid-status' });

    expect(res.status).toBe(400);
  });
});

// DELETE /api/appointments/:id — cancel

describe('DELETE /api/appointments/:id', () => {
  it('cancels (deletes) an appointment and returns 200', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .send(sampleAppointment());
    const id = created.body.id;

    const res = await request(app).delete(`/api/appointments/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Appointment cancelled');
  });

  it('returns 404 when deleting a non-existent appointment', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/appointments/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Appointment not found');
  });

  it('confirms the appointment is gone after deletion', async () => {
    const created = await request(app)
      .post('/api/appointments')
      .send(sampleAppointment());
    const id = created.body.id;

    await request(app).delete(`/api/appointments/${id}`);

    const res = await request(app).get(`/api/appointments/${id}`);
    expect(res.status).toBe(404);
  });
});

// GET /api/appointments/patient/:patientId

describe('GET /api/appointments/patient/:patientId', () => {
  it('returns only appointments for the given patient', async () => {
    await request(app)
      .post('/api/appointments')
      .send({ ...sampleAppointment(), patientId: 'patient-A' });
    await request(app)
      .post('/api/appointments')
      .send({
        ...sampleAppointment(),
        patientId: 'patient-B',
        doctorId: 'doctor-002',
        date: new Date('2026-08-17T10:00:00.000Z').toISOString(),
      });

    const res = await request(app).get('/api/appointments/patient/patient-A');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].patientId).toBe('patient-A');
  });

  it('returns an empty array for a patient with no appointments', async () => {
    const res = await request(app).get('/api/appointments/patient/ghost-patient');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// GET /api/appointments/doctor/:doctorId

describe('GET /api/appointments/doctor/:doctorId', () => {
  it('returns only appointments for the given doctor', async () => {
    await request(app)
      .post('/api/appointments')
      .send({ ...sampleAppointment(), doctorId: 'doctor-X' });
    await request(app)
      .post('/api/appointments')
      .send({
        ...sampleAppointment(),
        doctorId: 'doctor-Y',
        date: new Date('2026-08-18T10:00:00.000Z').toISOString(),
      });

    const res = await request(app).get('/api/appointments/doctor/doctor-X');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].doctorId).toBe('doctor-X');
  });
});

// GET /api/appointments/availability?doctorId=&date=

describe('GET /api/appointments/availability', () => {
  it('returns available=true when the slot is free', async () => {
    const res = await request(app)
      .get('/api/appointments/availability')
      .query({ doctorId: 'doctor-001', date: '2026-09-01T09:00:00.000Z' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('available', true);
  });

  it('returns available=false when the slot is taken', async () => {
    const date = '2026-09-02T09:00:00.000Z';
    await request(app)
      .post('/api/appointments')
      .send({ patientId: 'patient-001', doctorId: 'doctor-001', date });

    const res = await request(app)
      .get('/api/appointments/availability')
      .query({ doctorId: 'doctor-001', date });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('available', false);
  });

  it('returns 400 when doctorId or date is missing', async () => {
    const res = await request(app)
      .get('/api/appointments/availability')
      .query({ doctorId: 'doctor-001' }); // missing date

    expect(res.status).toBe(400);
  });
});
