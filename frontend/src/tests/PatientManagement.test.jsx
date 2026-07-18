import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatientManagement from '../components/PatientManagement/PatientManagement';

const patients = [
    { _id: 'p1', name: 'Alice', age: 30, gender: 'Female', contact: '555-1', address: 'St A' },
    { _id: 'p2', name: 'Bob', age: 40, gender: 'Male', contact: '555-2', address: 'St B' }
];

jest.mock('../hooks/useApi', () => ({
    usePatients: () => ({ data: patients, isLoading: false }),
    useSearchPatients: () => ({ data: [] }),
    usePatientHistory: () => ({ data: [] }),
    useCreatePatient: () => ({ mutate: jest.fn() }),
    useUpdatePatient: () => ({ mutate: jest.fn() }),
    useDeletePatient: () => ({ mutate: jest.fn() })
}));

function renderWith(ui) {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe('PatientManagement', () => {
    it('renders heading and patient list', async () => {
        renderWith(<PatientManagement />);
        await waitFor(() => {
            expect(screen.getByText('Patient Management')).toBeInTheDocument();
            expect(screen.getByText('Alice')).toBeInTheDocument();
            expect(screen.getByText('Bob')).toBeInTheDocument();
        });
    });

    it('shows Edit/Delete/History buttons for each patient', async () => {
        renderWith(<PatientManagement />);
        await waitFor(() => screen.getByText('Alice'));
        const editBtns = screen.getAllByRole('button', { name: 'Edit' });
        const delBtns = screen.getAllByRole('button', { name: 'Delete' });
        const hvBtns = screen.getAllByRole('button', { name: 'History' });
        expect(editBtns.length).toBe(2);
        expect(delBtns.length).toBe(2);
        expect(hvBtns.length).toBe(2);
    });

    it('opens Add patient form on button click', async () => {
        renderWith(<PatientManagement />);
        const addBtn = screen.getByRole('button', { name: 'Add Patient' });
        fireEvent.click(addBtn);
        await waitFor(() => {
            expect(screen.getByText('Add New Patient')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
        });
    });

    it('renders search input', async () => {
        renderWith(<PatientManagement />);
        const input = screen.getByPlaceholderText('Search patients by name or contact...');
        expect(input).toBeInTheDocument();
        fireEvent.change(input, { target: { value: 'Alice' } });
        expect(input.value).toBe('Alice');
    });
});
