import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DoctorDashboard from '../components/DoctorDashboard/DoctorDashboard';

jest.mock('../hooks/useApi', () => ({
    usePatients: () => ({ data: [{ _id: 'p1', name: 'John Doe' }], isLoading: false }),
    useDoctors: () => ({ data: [{ _id: 'd1', name: 'Dr. Lee' }], isLoading: false }),
    useAppointments: () => ({ data: [], isLoading: false })
}));

function renderWith(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('DoctorDashboard', () => {
    it('renders stats cards with patient/doctor counts', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => {
            expect(screen.getByText('Doctor Dashboard')).toBeInTheDocument();
        });
        expect(screen.getByText('Total Patients')).toBeInTheDocument();
        expect(screen.getByText('Total Doctors')).toBeInTheDocument();
        expect(screen.getByText('Total Appointments')).toBeInTheDocument();
        expect(screen.getByText('Today Appointments')).toBeInTheDocument();
    });

    it('shows appointment count from data', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => screen.getByText('Doctor Dashboard'));
        const totals = screen.getAllByText(/^[0-9]+$/);
        expect(totals.length).toBeGreaterThanOrEqual(3);
    });

    it('renders activity overview section', async () => {
        renderWith(<DoctorDashboard />);
        await waitFor(() => screen.getByText('Activity Overview'));
        expect(screen.getByText('System running normally')).toBeInTheDocument();
    });
});
