import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppointmentScheduling from '../components/AppointmentScheduling/AppointmentScheduling';

const appointments = [
    { _id: 'a1', patientId: 'p1', doctorId: 'd1', date: '2026-12-01T10:00:00Z', status: 'scheduled', reason: 'checkup' }
];
const patients = [{ _id: 'p1', name: 'Alice' }];
const doctors = [{ _id: 'd1', name: 'Dr. Lee', specialty: 'Cardiology' }];

jest.mock('../hooks/useApi', () => ({
    usePatients: () => ({ data: patients, isLoading: false }),
    useDoctors: () => ({ data: doctors, isLoading: false }),
    useAppointments: () => ({ data: appointments, isLoading: false }),
    useCreateAppointment: () => ({ mutate: jest.fn() }),
    useUpdateAppointment: () => ({ mutate: jest.fn() }),
    useDeleteAppointment: () => ({ mutate: jest.fn() })
}));

function renderWith(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('AppointmentScheduling', () => {
    it('renders heading and appointment rows', async () => {
        renderWith(<AppointmentScheduling />);
        await waitFor(() => {
            expect(screen.getByText('Appointments')).toBeInTheDocument();
            expect(screen.getByText('Alice')).toBeInTheDocument();
        });
    });

    it('shows Book Appointment button', async () => {
        renderWith(<AppointmentScheduling />);
        expect(screen.getByRole('button', { name: '+ Book appointment' })).toBeInTheDocument();
    });

    it('opens booking form on button click', async () => {
        renderWith(<AppointmentScheduling />);
        fireEvent.click(screen.getByRole('button', { name: '+ Book appointment' }));
        await waitFor(() => {
            expect(screen.getByText('Book an appointment')).toBeInTheDocument();
            expect(screen.getByText('Choose a patient')).toBeInTheDocument();
            expect(screen.getByText('Choose a provider')).toBeInTheDocument();
        });
    });

    it('renders status select with current status', async () => {
        renderWith(<AppointmentScheduling />);
        await waitFor(() => screen.getByText('Alice'));
        const select = screen.getByLabelText('Appointment status');
        expect(select.value).toBe('scheduled');
    });

    it('renders Edit and Cancel buttons for each appointment', async () => {
        renderWith(<AppointmentScheduling />);
        await waitFor(() => screen.getByText('Alice'));
        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
});
