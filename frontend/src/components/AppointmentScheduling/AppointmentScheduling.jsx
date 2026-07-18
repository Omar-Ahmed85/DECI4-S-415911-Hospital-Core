import { useState } from 'react';
import { usePatients, useDoctors, useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '../../hooks/useApi';

export default function AppointmentScheduling() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ patientId: '', doctorId: '', date: '', reason: '' });

    const { data: appointments = [], isLoading } = useAppointments();
    const { data: patients = [] } = usePatients();
    const { data: doctors = [] } = useDoctors();
    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();
    const deleteMutation = useDeleteAppointment();

    const patientName = (id) => patients.find(p => p._id === id)?.name || id;
    const doctorName = (id) => doctors.find(d => d._id === id)?.name || id;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData }, {
                onSuccess: () => {
                    setEditingId(null);
                    setShowForm(false);
                    setFormData({ patientId: '', doctorId: '', date: '', reason: '' });
                }
            });
        } else {
            createMutation.mutate(formData, {
                onSuccess: () => {
                    setShowForm(false);
                    setFormData({ patientId: '', doctorId: '', date: '', reason: '' });
                },
                onError: (err) => {
                    alert(err.message);
                }
            });
        }
    };

    const handleStatusChange = (id, status) => {
        updateMutation.mutate({ id, data: { status } });
    };

    const handleCancel = (id) => {
        if (window.confirm('Cancel this appointment?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleEdit = (appt) => {
        setEditingId(appt._id);
        setFormData({
            patientId: appt.patientId,
            doctorId: appt.doctorId,
            date: appt.date?.slice(0, 16) || '',
            reason: appt.reason || ''
        });
        setShowForm(true);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ patientId: '', doctorId: '', date: '', reason: '' });
    };

    if (isLoading) return <div>Loading appointments...</div>;

    return (
        <div>
            <h1>Appointment Scheduling</h1>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px' }}>
                    {showForm ? 'Cancel' : 'Book Appointment'}
                </button>
            </div>

            {showForm && (
                <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <h3>{editingId ? 'Update Appointment' : 'Book New Appointment'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Patient: </label>
                            <select
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="">Select patient</option>
                                {patients.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Doctor: </label>
                            <select
                                value={formData.doctorId}
                                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            >
                                <option value="">Select doctor</option>
                                {doctors.map(d => (
                                    <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Date/Time: </label>
                            <input
                                type="datetime-local"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Reason: </label>
                            <input
                                type="text"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '8px 16px' }}>
                                {editingId ? 'Update' : 'Book'}
                            </button>
                            <button type="button" onClick={handleFormCancel} style={{ padding: '8px 16px' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {appointments.length === 0 ? (
                <p>No appointments scheduled.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Patient</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Doctor</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(a => (
                            <tr key={a._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{patientName(a.patientId)}</td>
                                <td style={{ padding: '10px' }}>{doctorName(a.doctorId)}</td>
                                <td style={{ padding: '10px' }}>{new Date(a.date).toLocaleString()}</td>
                                <td style={{ padding: '10px' }}>
                                    <select
                                        value={a.status}
                                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                        style={{ padding: '4px' }}
                                    >
                                        <option value="scheduled">Scheduled</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                                    <button onClick={() => handleEdit(a)} style={{ padding: '4px 8px' }}>Edit</button>
                                    <button onClick={() => handleCancel(a._id)} style={{ padding: '4px 8px' }}>Cancel</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
