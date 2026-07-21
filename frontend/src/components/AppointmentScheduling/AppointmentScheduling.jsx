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

    const patientName = (id) => patients.find((p) => p._id === id)?.name || 'Unknown';
    const doctor = (id) => doctors.find((d) => d._id === id);
    const doctorName = (id) => doctor(id)?.name || 'Unknown';

    const resetForm = () => {
        setEditingId(null);
        setShowForm(false);
        setFormData({ patientId: '', doctorId: '', date: '', reason: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData }, { onSuccess: resetForm });
        } else {
            createMutation.mutate(formData, { onSuccess: resetForm, onError: (err) => alert(err.message) });
        }
    };

    const handleStatusChange = (id, status) => updateMutation.mutate({ id, data: { status } });
    const handleCancel = (id) => { if (window.confirm('Cancel this appointment?')) deleteMutation.mutate(id); };
    const handleEdit = (appt) => {
        setEditingId(appt._id);
        setFormData({ patientId: appt.patientId, doctorId: appt.doctorId, date: appt.date?.slice(0, 16) || '', reason: appt.reason || '' });
        setShowForm(true);
    };

    const sorted = [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));
    const confirmed = appointments.filter((a) => a.status === 'confirmed').length;
    const scheduled = appointments.filter((a) => a.status === 'scheduled').length;

    if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-charcoal-soft)' }}>Loading appointments...</div>;

    return (
        <div>
            <div className="page-header">
                <div>
                    <span className="eyebrow">Care coordination</span>
                    <h1>Appointments</h1>
                    <p>Plan patient visits, update attendance, and keep care teams aligned.</p>
                </div>
                <button onClick={() => (showForm ? resetForm() : setShowForm(true))}>{showForm ? 'Cancel' : '+ Book appointment'}</button>
            </div>

            <div className="split" style={{ marginBottom: '32px' }}>
                <div className="card keylime">
                    <span className="eyebrow">Scheduling desk</span>
                    <h2>{appointments.length} planned visits</h2>
                    <p style={{ fontSize: '14px', maxWidth: '42ch' }}>Manage every visit in one calm, clear view—from booking through completion.</p>
                </div>
                <div className="card slate">
                    <span className="eyebrow">Current status</span>
                    <div className="hero-stats" style={{ marginTop: '8px' }}>
                        <div className="hero-stat"><strong>{scheduled}</strong><span>Scheduled</span></div>
                        <div className="hero-stat"><strong>{confirmed}</strong><span>Confirmed</span></div>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="card mint" style={{ marginBottom: '24px' }}>
                    <span className="eyebrow">{editingId ? 'Modify visit' : 'New visit'}</span>
                    <h2>{editingId ? 'Update appointment' : 'Book an appointment'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="field-grid">
                            <div className="field">
                                <label>Patient</label>
                                <select value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })} required>
                                    <option value="">Choose a patient</option>
                                    {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="field">
                                <label>Provider</label>
                                <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} required>
                                    <option value="">Choose a provider</option>
                                    {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} · {d.specialty}</option>)}
                                </select>
                            </div>
                            <div className="field">
                                <label>Date and time</label>
                                <input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                            <div className="field">
                                <label>Reason for visit</label>
                                <input type="text" placeholder="Routine consultation" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
                            </div>
                        </div>
                        <div className="btn-row">
                            <button type="submit">{editingId ? 'Save changes' : 'Confirm booking'}</button>
                            <button type="button" className="ghost" onClick={resetForm}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card table-card">
                <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--color-border-mist)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ marginBottom: '4px' }}>Visit schedule</h2>
                        <p style={{ fontSize: '14px', color: 'var(--color-charcoal-soft)' }}>Upcoming and completed patient appointments</p>
                    </div>
                    <span className="section-tag">{appointments.length} visits</span>
                </div>
                {sorted.length === 0 ? (
                    <div className="empty-row">No appointments scheduled yet</div>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr><th>Patient</th><th>Provider</th><th>Specialty</th><th>Date & time</th><th>Status</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {sorted.map((a) => (
                                    <tr key={a._id}>
                                        <td style={{ fontWeight: 600 }}>{patientName(a.patientId)}</td>
                                        <td>{doctorName(a.doctorId)}</td>
                                        <td>{doctor(a.doctorId)?.specialty || '—'}</td>
                                        <td>
                                            {new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            <br />
                                            <small style={{ color: 'var(--color-charcoal-soft)' }}>{new Date(a.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</small>
                                        </td>
                                        <td>
                                            <select aria-label="Appointment status" value={a.status} onChange={(e) => handleStatusChange(a._id, e.target.value)} style={{ padding: '7px 10px', fontSize: '12px' }}>
                                                <option value="scheduled">Scheduled</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="actions">
                                            <button className="ghost sm" onClick={() => handleEdit(a)}>Edit</button>
                                            <button className="danger sm" onClick={() => handleCancel(a._id)}>Cancel</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
