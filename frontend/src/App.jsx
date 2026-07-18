import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import DoctorDashboard from './components/DoctorDashboard/DoctorDashboard';
import PatientManagement from './components/PatientManagement/PatientManagement';
import AppointmentScheduling from './components/AppointmentScheduling/AppointmentScheduling';
import './App.css';

const navLinkStyle = ({ isActive }) => ({
    padding: '10px 20px',
    textDecoration: 'none',
    color: isActive ? '#fff' : '#333',
    backgroundColor: isActive ? '#1976d2' : 'transparent',
    borderRadius: '4px'
});

function App() {
    return (
        <BrowserRouter>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <nav style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <NavLink to="/" style={navLinkStyle} end>Dashboard</NavLink>
                    <NavLink to="/patients" style={navLinkStyle}>Patients</NavLink>
                    <NavLink to="/appointments" style={navLinkStyle}>Appointments</NavLink>
                </nav>
                <Routes>
                    <Route path="/" element={<DoctorDashboard />} />
                    <Route path="/patients" element={<PatientManagement />} />
                    <Route path="/appointments" element={<AppointmentScheduling />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
