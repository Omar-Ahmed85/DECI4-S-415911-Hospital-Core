const request = require('supertest');
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const app = require('../src/server');

beforeAll(async () => {
    await connectDB();
});

describe('Health Endpoint', () => {
    it('GET /api/health returns healthy', async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
    });
});

describe('Patient CRUD', () => {
    const testPatient = { name: 'Test Patient', age: 25, gender: 'Male', contact: '555-9999', address: 'Test St' };
    let createdId;

    it('POST /api/patients creates patient', async () => {
        const res = await request(app).post('/api/patients').send(testPatient);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Patient created');
        expect(res.body.patient.name).toBe(testPatient.name);
        createdId = res.body.id;
    });

    it('GET /api/patients returns array', async () => {
        const res = await request(app).get('/api/patients');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /api/patients/:id returns one', async () => {
        const res = await request(app).get(`/api/patients/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(createdId);
        expect(res.body.name).toBe(testPatient.name);
    });

    it('PUT /api/patients/:id updates patient', async () => {
        const res = await request(app).put(`/api/patients/${createdId}`).send({ age: 26 });
        expect(res.status).toBe(200);
        expect(res.body.patient.age).toBe(26);
    });

    it('DELETE /api/patients/:id deletes patient', async () => {
        const res = await request(app).delete(`/api/patients/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Patient deleted');
    });

    it('GET /api/patients/search?q=Test returns filtered', async () => {
        const res = await request(app).get('/api/patients/search?q=Test');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe('Doctor CRUD', () => {
    const testDoctor = { name: 'Dr. Test', specialty: 'Testology', department: 'Test Dept', availability: ['Mon'] };
    let createdId;

    it('POST /api/doctors creates doctor', async () => {
        const res = await request(app).post('/api/doctors').send(testDoctor);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Doctor created');
        createdId = res.body.id;
    });

    it('GET /api/doctors returns array', async () => {
        const res = await request(app).get('/api/doctors');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/doctors/:id returns one', async () => {
        const res = await request(app).get(`/api/doctors/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(createdId);
    });

    it('PUT /api/doctors/:id updates doctor', async () => {
        const res = await request(app).put(`/api/doctors/${createdId}`).send({ specialty: 'NewSpec' });
        expect(res.status).toBe(200);
        expect(res.body.doctor.specialty).toBe('NewSpec');
    });

    it('DELETE /api/doctors/:id deletes doctor', async () => {
        const res = await request(app).delete(`/api/doctors/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Doctor deleted');
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});