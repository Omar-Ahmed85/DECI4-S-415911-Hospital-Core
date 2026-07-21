import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import DoctorDashboard from './components/DoctorDashboard/DoctorDashboard';
import PatientManagement from './components/PatientManagement/PatientManagement';
import AppointmentScheduling from './components/AppointmentScheduling/AppointmentScheduling';
import Logo from './assets/Logo.svg';
import './App.css';

const navClass = ({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`;

function App() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <header className="site-header">
                    <NavLink to="/" className="brand" aria-label="Hospital Core dashboard">
                        <img src={Logo} alt="Hospital Core Logo" style={{ width: '50px', height: '50px', borderRadius: '14px' }} />
                        <span><strong>Hospital Core</strong><small>Care, made considered</small></span>
                    </NavLink>
                    <nav className="site-nav" aria-label="Primary navigation">
                        <NavLink to="/" end className={navClass}>Overview</NavLink>
                        <NavLink to="/patients" className={navClass}>Patients</NavLink>
                        <NavLink to="/appointments" className={navClass}>Appointments</NavLink>
                    </nav>
                    <NavLink to="/appointments" className="button-link">Book appointment <span>→</span></NavLink>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<DoctorDashboard />} />
                        <Route path="/patients" element={<PatientManagement />} />
                        <Route path="/appointments" element={<AppointmentScheduling />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
