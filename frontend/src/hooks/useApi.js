import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import appointmentApi from '../api/appointmentClient';

export function usePatients() {
    return useQuery({
        queryKey: ['patients'],
        queryFn: () => api.get('/patients').then(r => r.data)
    });
}

export function usePatient(id) {
    return useQuery({
        queryKey: ['patient', id],
        queryFn: () => api.get(`/patients/${id}`).then(r => r.data),
        enabled: !!id
    });
}

export function useSearchPatients(q) {
    return useQuery({
        queryKey: ['patients', 'search', q],
        queryFn: () => api.get('/patients/search', { params: { q } }).then(r => r.data),
        enabled: !!q
    });
}

export function usePatientHistory(id) {
    return useQuery({
        queryKey: ['patient', id, 'history'],
        queryFn: () => api.get(`/patients/${id}/history`).then(r => r.data),
        enabled: !!id
    });
}

export function useCreatePatient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post('/patients', data).then(r => r.data),
        onMutate: async (newPatient) => {
            await qc.cancelQueries({ queryKey: ['patients'] });
            const previous = qc.getQueryData(['patients']);
            qc.setQueryData(['patients'], old => old ? [...old, { ...newPatient, _id: `temp-${Date.now()}` }] : []);
            return { previous };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['patients'], ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['patients'] });
        }
    });
}

export function useUpdatePatient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => api.put(`/patients/${id}`, data).then(r => r.data),
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: ['patients'] });
            await qc.cancelQueries({ queryKey: ['patient', id] });
            const previous = qc.getQueryData(['patients']);
            const previousSingle = qc.getQueryData(['patient', id]);
            qc.setQueryData(['patients'], old => old?.map(p => p._id === id ? { ...p, ...data } : p) ?? []);
            qc.setQueryData(['patient', id], old => old ? { ...old, ...data } : undefined);
            return { previous, previousSingle };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['patients'], ctx.previous);
            qc.setQueryData(['patient', vars.id], ctx.previousSingle);
        },
        onSettled: (data, err, { id }) => {
            qc.invalidateQueries({ queryKey: ['patients'] });
            qc.invalidateQueries({ queryKey: ['patient', id] });
        }
    });
}

export function useDeletePatient() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/patients/${id}`).then(r => r.data),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['patients'] });
            const previous = qc.getQueryData(['patients']);
            qc.setQueryData(['patients'], old => old?.filter(p => p._id !== id) ?? []);
            return { previous };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['patients'], ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['patients'] });
        }
    });
}

export function useDoctors() {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: () => api.get('/doctors').then(r => r.data)
    });
}

export function useDoctor(id) {
    return useQuery({
        queryKey: ['doctor', id],
        queryFn: () => api.get(`/doctors/${id}`).then(r => r.data),
        enabled: !!id
    });
}

export function useCreateDoctor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => api.post('/doctors', data).then(r => r.data),
        onMutate: async (newDoctor) => {
            await qc.cancelQueries({ queryKey: ['doctors'] });
            const previous = qc.getQueryData(['doctors']);
            qc.setQueryData(['doctors'], old => old ? [...old, { ...newDoctor, _id: `temp-${Date.now()}` }] : []);
            return { previous };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['doctors'], ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['doctors'] });
        }
    });
}

export function useUpdateDoctor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => api.put(`/doctors/${id}`, data).then(r => r.data),
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: ['doctors'] });
            await qc.cancelQueries({ queryKey: ['doctor', id] });
            const previous = qc.getQueryData(['doctors']);
            const previousSingle = qc.getQueryData(['doctor', id]);
            qc.setQueryData(['doctors'], old => old?.map(d => d._id === id ? { ...d, ...data } : d) ?? []);
            qc.setQueryData(['doctor', id], old => old ? { ...old, ...data } : undefined);
            return { previous, previousSingle };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['doctors'], ctx.previous);
            qc.setQueryData(['doctor', vars.id], ctx.previousSingle);
        },
        onSettled: (data, err, { id }) => {
            qc.invalidateQueries({ queryKey: ['doctors'] });
            qc.invalidateQueries({ queryKey: ['doctor', id] });
        }
    });
}

export function useDeleteDoctor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => api.delete(`/doctors/${id}`).then(r => r.data),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['doctors'] });
            const previous = qc.getQueryData(['doctors']);
            qc.setQueryData(['doctors'], old => old?.filter(d => d._id !== id) ?? []);
            return { previous };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['doctors'], ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['doctors'] });
        }
    });
}

export function useAppointments() {
    return useQuery({
        queryKey: ['appointments'],
        queryFn: () => appointmentApi.get('/appointments').then(r => r.data)
    });
}

export function useAppointmentsByPatient(patientId) {
    return useQuery({
        queryKey: ['appointments', 'patient', patientId],
        queryFn: () => appointmentApi.get(`/appointments/patient/${patientId}`).then(r => r.data),
        enabled: !!patientId
    });
}

export function useCheckAvailability(doctorId, date) {
    return useQuery({
        queryKey: ['availability', doctorId, date],
        queryFn: () => appointmentApi.get('/appointments/availability', { params: { doctorId, date } }).then(r => r.data),
        enabled: !!doctorId && !!date
    });
}

export function useCreateAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => appointmentApi.post('/appointments', data).then(r => r.data),
        onMutate: async (newAppt) => {
            await qc.cancelQueries({ queryKey: ['appointments'] });
            if (newAppt.patientId) await qc.cancelQueries({ queryKey: ['appointments', 'patient', newAppt.patientId] });
            const previous = qc.getQueryData(['appointments']);
            const previousPatient = newAppt.patientId ? qc.getQueryData(['appointments', 'patient', newAppt.patientId]) : undefined;
            const temp = { ...newAppt, _id: `temp-${Date.now()}`, status: 'scheduled', createdAt: new Date().toISOString() };
            qc.setQueryData(['appointments'], old => old ? [...old, temp] : []);
            if (newAppt.patientId && previousPatient) {
                qc.setQueryData(['appointments', 'patient', newAppt.patientId], old => old ? [...old, temp] : [temp]);
            }
            return { previous, previousPatient };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['appointments'], ctx.previous);
            if (vars.patientId && ctx.previousPatient) {
                qc.setQueryData(['appointments', 'patient', vars.patientId], ctx.previousPatient);
            }
        },
        onSettled: (data, err, vars) => {
            qc.invalidateQueries({ queryKey: ['appointments'] });
            if (vars.patientId) qc.invalidateQueries({ queryKey: ['appointments', 'patient', vars.patientId] });
        }
    });
}

export function useUpdateAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => appointmentApi.put(`/appointments/${id}`, data).then(r => r.data),
        onMutate: async ({ id, data }) => {
            await qc.cancelQueries({ queryKey: ['appointments'] });
            const previous = qc.getQueryData(['appointments']);
            qc.setQueryData(['appointments'], old => old?.map(a => a._id === id ? { ...a, ...data } : a) ?? []);
            return { previous };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['appointments'], ctx.previous);
        },
        onSettled: (data, err, { id }) => {
            qc.invalidateQueries({ queryKey: ['appointments'] });
        }
    });
}

export function useDeleteAppointment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => appointmentApi.delete(`/appointments/${id}`).then(r => r.data),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: ['appointments'] });
            const previous = qc.getQueryData(['appointments']);
            qc.setQueryData(['appointments'], old => old?.filter(a => a._id !== id) ?? []);
            return { previous };
        },
        onError: (err, vars, ctx) => {
            qc.setQueryData(['appointments'], ctx.previous);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: ['appointments'] });
        }
    });
}