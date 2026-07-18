import { usePatients, useDoctors, useAppointments } from '../../hooks/useApi';

export default function DoctorDashboard() {
    const { data: patients = [], isLoading: loadingP } = usePatients();
    const { data: doctors = [], isLoading: loadingD } = useDoctors();
    const { data: appointments = [], isLoading: loadingA } = useAppointments();

    if (loadingP || loadingD || loadingA) return <div>Loading dashboard...</div>;

    const todayAppts = appointments.filter(a => {
        const d = new Date(a.date);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    });

    const recentAppts = appointments.slice(0, 5);

    return (
        <div>
            <h1>Doctor Dashboard</h1>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Total Patients</h3>
                    <p style={{ fontSize: '2em', margin: 0 }}>{patients.length}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Total Doctors</h3>
                    <p style={{ fontSize: '2em', margin: 0 }}>{doctors.length}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Today Appointments</h3>
                    <p style={{ fontSize: '2em', margin: 0 }}>{todayAppts.length}</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Total Appointments</h3>
                    <p style={{ fontSize: '2em', margin: 0 }}>{appointments.length}</p>
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h2>Recent Appointments</h2>
                {recentAppts.length === 0 ? (
                    <p>No appointments yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Patient ID</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Doctor ID</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppts.map(a => (
                                <tr key={a._id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{a.patientId}</td>
                                    <td style={{ padding: '10px' }}>{a.doctorId}</td>
                                    <td style={{ padding: '10px' }}>{new Date(a.date).toLocaleString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px', 
                                            backgroundColor: a.status === 'confirmed' ? '#4CAF50' : '#FFC107',
                                            color: '#fff'
                                        }}>
                                            {a.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div>
                <h2>Activity Overview</h2>
                <ul>
                    <li>System running normally</li>
                    <li>{patients.length} patients registered</li>
                    <li>{doctors.length} doctors available</li>
                    <li>{appointments.filter(a => a.status === 'scheduled').length} appointments scheduled</li>
                    <li>{appointments.filter(a => a.status === 'confirmed').length} appointments confirmed</li>
                    <li>{appointments.filter(a => a.status === 'completed').length} appointments completed</li>
                </ul>
            </div>
        </div>
    );
}
