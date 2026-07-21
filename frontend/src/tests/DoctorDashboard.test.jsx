import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DoctorDashboard from '../components/DoctorDashboard/DoctorDashboard';

const patients = [{ _id: 'p1', name: 'John Doe' }];
const doctors = [{ _id: 'd1', name: 'Dr. Lee', specialty: 'Cardiology', department: 'Internal Medicine' }];
const appointments = [
    { _id: 'a1', patientId: 'p1', doctorId: 'd1', date: '2026-12-01T10:00:00Z', status: 'scheduled' }
];

jest.mock('../hooks/useApi', () => ({
    usePatients: () => ({ data: patients, isLoading: false }),
    useDoctors: () => ({ data: doctors, isLoading: false }),
    useAppointments: () => ({ data: appointments, isLoading: false })
}));

function renderWith(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('DoctorDashboard', () => {
    it('renders stats cards with patient/doctor/appointment counts', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => {
            expect(screen.getByText('Clinical overview')).toBeInTheDocument();
        });
        expect(screen.getByText('Total patients')).toBeInTheDocument();
        expect(screen.getByText('Doctors available')).toBeInTheDocument();
        expect(screen.getByText("Today's schedule")).toBeInTheDocument();
        expect(screen.getByText('All appointments')).toBeInTheDocument();
    });

    it('shows patient and doctor counts from data', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => screen.getByText('Clinical overview'));
        expect(screen.getByText('1 specialists')).toBeInTheDocument();
        const patientCount = screen.getByText('Registered patients');
        expect(patientCount).toBeInTheDocument();
    });

    it('renders recent appointments section', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => screen.getByText('Clinical overview'));
        expect(screen.getByText('Recent appointments')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders the workflow status cards', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => screen.getByText('Clinical overview'));
        expect(screen.getByText('Appointment pipeline')).toBeInTheDocument();
        expect(screen.getAllByText('Provider network').length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText('Active registry').length).toBeGreaterThanOrEqual(1);
    });
});
