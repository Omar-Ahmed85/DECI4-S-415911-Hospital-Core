import { usePatients, useDoctors, useAppointments } from '../../hooks/useApi';

export default function DoctorDashboard() {
    const { data: patients = [], isLoading: loadingP } = usePatients();
    const { data: doctors = [], isLoading: loadingD } = useDoctors();
    const { data: appointments = [], isLoading: loadingA } = useAppointments();

    if (loadingP || loadingD || loadingA) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-charcoal-soft)' }}>Loading dashboard...</div>;

    const today = new Date();
    const todayAppts = appointments.filter(a => new Date(a.date).toDateString() === today.toDateString());
    const recentAppts = [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const patientName = (id) => patients.find(p => p._id === id)?.name || 'Unknown';
    const doctorName = (id) => doctors.find(d => d._id === id)?.name || 'Unknown';

    return (
        <div>
            <div className="hero">
                <div className="hero-card">
                    <div>
                        <span className="eyebrow">Hospital Core Platform</span>
                        <h1>Clinical overview</h1>
                        <p className="lead">Real-time view of care activity, patient census, and appointment workflows across the platform.</p>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat"><strong>{patients.length}</strong><span>Registered patients</span></div>
                        <div className="hero-stat"><strong>{todayAppts.length}</strong><span>Today's visits</span></div>
                    </div>
                </div>
                <div className="hero-card sage">
                    <div>
                        <span className="eyebrow">Provider network</span>
                        <h2>{doctors.length} specialists</h2>
                        <p>{new Set(doctors.map(d => d.specialty)).size} specialties across {new Set(doctors.map(d => d.department)).size} departments.</p>
                    </div>
                </div>
            </div>

            <div className="stat-grid">
                <div className="stat-tile keylime">
                    <span className="label">Total patients</span>
                    <span className="value">{patients.length}</span>
                    <span className="meta">Active registry</span>
                </div>
                <div className="stat-tile mint">
                    <span className="label">Doctors available</span>
                    <span className="value">{doctors.length}</span>
                    <span className="meta">{new Set(doctors.map(d => d.specialty)).size} specialties</span>
                </div>
                <div className="stat-tile slate">
                    <span className="label">Today's schedule</span>
                    <span className="value">{todayAppts.length}</span>
                    <span className="meta">{todayAppts.filter(a => a.status === 'confirmed').length} confirmed</span>
                </div>
                <div className="stat-tile sage">
                    <span className="label">All appointments</span>
                    <span className="value">{appointments.length}</span>
                    <span className="meta">{appointments.filter(a => a.status === 'completed').length} completed</span>
                </div>
            </div>

            <div className="section">
                <div className="section-header">
                    <div>
                        <h2>Recent appointments</h2>
                        <p>Latest patient visit bookings and status updates</p>
                    </div>
                    <span className="section-tag">{appointments.length} total</span>
                </div>
                <div className="card table-card">
                    {recentAppts.length === 0 ? (
                        <div className="empty-row">No appointments scheduled yet</div>
                    ) : (
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Provider</th>
                                        <th>Scheduled</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAppts.map(a => (
                                        <tr key={a._id}>
                                            <td style={{ fontWeight: 600 }}>{patientName(a.patientId)}</td>
                                            <td>{doctorName(a.doctorId)}</td>
                                            <td>{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(a.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</td>
                                            <td>
                                                <span className={`badge ${a.status === 'confirmed' ? 'sage' : a.status === 'completed' ? 'slate' : a.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="section">
                <div className="split-3">
                    <div className="card keylime">
                        <span className="eyebrow">Workflow status</span>
                        <h3>Appointment pipeline</h3>
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>
                            <strong>{appointments.filter(a => a.status === 'scheduled').length}</strong> scheduled · 
                            <strong> {appointments.filter(a => a.status === 'confirmed').length}</strong> confirmed · 
                            <strong> {appointments.filter(a => a.status === 'completed').length}</strong> completed
                        </p>
                    </div>
                    <div className="card mint">
                        <span className="eyebrow">Clinical capacity</span>
                        <h3>Provider network</h3>
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>{doctors.length} practitioners across {new Set(doctors.map(d => d.department)).size} care departments.</p>
                    </div>
                    <div className="card slate">
                        <span className="eyebrow">Patient census</span>
                        <h3>Active registry</h3>
                        <p style={{ fontSize: '14px', marginTop: '8px' }}>{patients.length} individuals enrolled in the care platform.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
