const request = require('supertest');
const mongoose = require('mongoose');

const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_API_URL || 'http://localhost:5001';

describe('Appointment Service CRUD', () => {
    const testAppt = { patientId: 'testP1', doctorId: 'testD1', date: new Date('2026-12-10T09:00:00Z').toISOString(), reason: 'checkup' };
    let createdId;

    it('POST /api/appointments creates appointment', async () => {
        const res = await request(APPOINTMENT_SERVICE_URL).post('/api/appointments').send(testAppt);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Appointment booked');
        expect(res.body.appointment.patientId).toBe(testAppt.patientId);
        createdId = res.body.id;
    });

    it('GET /api/appointments returns array', async () => {
        const res = await request(APPOINTMENT_SERVICE_URL).get('/api/appointments');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /api/appointments/:id returns one', async () => {
        const res = await request(APPOINTMENT_SERVICE_URL).get(`/api/appointments/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body._id).toBe(createdId);
    });

    it('PUT /api/appointments/:id updates appointment', async () => {
        const res = await request(APPOINTMENT_SERVICE_URL).put(`/api/appointments/${createdId}`).send({ status: 'confirmed' });
        expect(res.status).toBe(200);
        expect(res.body.appointment.status).toBe('confirmed');
    });

    it('DELETE /api/appointments/:id cancels appointment', async () => {
        const res = await request(APPOINTMENT_SERVICE_URL).delete(`/api/appointments/${createdId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Appointment cancelled');
    });

    it('POST duplicate time slot returns 409', async () => {
        const slot = { patientId: 'p2', doctorId: 'd1', date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() };
        const res1 = await request(APPOINTMENT_SERVICE_URL).post('/api/appointments').send(slot);
        expect(res1.status).toBe(201);
        
        const res2 = await request(APPOINTMENT_SERVICE_URL).post('/api/appointments').send(slot);
        expect(res2.status).toBe(409);
        expect(res2.body.message).toContain('not available');
    });
});
