import React, { useState, useEffect } from 'react';
import './index.css';
import AuthPage from './components/AuthPage';
import DashboardCharts from './components/DashboardCharts';
import { LogOut, Home, Users, User, Calendar, Plus } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [patients, setPatients] = useState([]);
  const [patientsPage, setPatientsPage] = useState(0);
  const [patientsTotalPages, setPatientsTotalPages] = useState(1);
  
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  
  // Forms State
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [patientForm, setPatientForm] = useState({ name: '', email: '', password: '', age: '', contactNumber: '', address: '' });

  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', specialization: '', experienceYears: '', availability: '' });

  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({ patientId: '', doctorId: '', appointmentDate: '' });

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    const response = await fetch(`http://localhost:8080${url}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
      handleLogout();
      throw new Error('Session expired');
    }
    return response;
  };

  const fetchPatients = (page = 0) => {
    fetchWithAuth(`/api/patients?page=${page}&size=5`)
      .then(r => r.json())
      .then(data => {
        setPatients(data.content || []); // from Page<Patient>
        setPatientsPage(data.number || 0);
        setPatientsTotalPages(data.totalPages || 1);
      })
      .catch(console.error);
  };

  const fetchDoctors = () => fetchWithAuth('/api/doctors').then(r => r.json()).then(setDoctors).catch(console.error);
  const fetchAppointments = () => fetchWithAuth('/api/appointments').then(r => r.json()).then(setAppointments).catch(console.error);

  useEffect(() => {
    if (!token) return;
    if (activeTab === 'patients') fetchPatients(0);
    if (activeTab === 'doctors') fetchDoctors();
    if (activeTab === 'appointments') {
      fetchAppointments();
      fetchWithAuth(`/api/patients?page=0&size=1000`).then(r=>r.json()).then(d=>setPatients(d.content || [])); // unpaginated for dropdown
      fetchDoctors();
    }
    if (activeTab === 'dashboard') {
      fetchWithAuth(`/api/patients?page=0&size=1000`).then(r=>r.json()).then(d=>setPatients(d.content || []));
      fetchDoctors(); fetchAppointments();
    }
  }, [activeTab, token]);

  const handleLogin = (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const notify = (msg) => { alert(msg); }; // Simple fallback toast

  const handleAddPatient = (e) => {
    e.preventDefault();
    fetchWithAuth('/api/patients', { method: 'POST', body: JSON.stringify(patientForm) })
    .then(r => r.json()).then(data => { fetchPatients(patientsPage); setShowAddPatient(false); notify('Patient added successfully!'); });
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    fetchWithAuth('/api/doctors', { method: 'POST', body: JSON.stringify(doctorForm) })
    .then(r => r.json()).then(data => { setDoctors(d => [...d, data]); setShowAddDoctor(false); notify('Doctor added successfully!'); });
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    fetchWithAuth('/api/appointments', { method: 'POST', body: JSON.stringify(appointmentForm) })
    .then(async r => {
        if (!r.ok) { let err = await r.json(); throw new Error(err.message || err.error || "Conflict! Doctor is not available."); }
        return r.json();
    })
    .then(data => { setAppointments(a => [...a, data]); setShowAddAppointment(false); notify('Appointment booked successfully!'); })
    .catch(err => notify(err.message));
  };

  const handleCompleteAppointment = (id) => {
    fetchWithAuth(`/api/appointments/${id}/complete`, { method: 'PUT' })
    .then(r => r.json())
    .then(data => {
      setAppointments(prev => prev.map(a => a.id === id ? data : a));
    });
  };

  if (!token) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">H</div>
          <div className="logo-text">HealthSync</div>
        </div>
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Home size={18}/> Dashboard</div>
          <div className={`nav-item ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}><Users size={18}/> Patients</div>
          <div className={`nav-item ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}><User size={18}/> Doctors</div>
          <div className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}><Calendar size={18}/> Appointments</div>
        </nav>
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', borderRadius: '8px', cursor: 'pointer' }}>
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header animate-fade">
          <div>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>System overview for HealthSync.</p>
          </div>
        </header>

        {activeTab === 'patients' && (
          <div className="animate-fade">
            <div className="recent-activity">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                <h2>Patients Database</h2><button className="btn-primary" onClick={() => setShowAddPatient(!showAddPatient)}><Plus size={16}/> Add Patient</button>
              </div>
              {showAddPatient && (
                <form onSubmit={handleAddPatient} style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px'}}>
                  <div style={{display: 'flex', gap: '1rem'}}><input value={patientForm.name} onChange={e=>setPatientForm({...patientForm, name: e.target.value})} placeholder="Name" required /><input value={patientForm.email} onChange={e=>setPatientForm({...patientForm, email: e.target.value})} placeholder="Email" type="email" required /></div>
                  <div style={{display: 'flex', gap: '1rem'}}><input value={patientForm.password} onChange={e=>setPatientForm({...patientForm, password: e.target.value})} placeholder="Password" type="password" required /><input value={patientForm.age} onChange={e=>setPatientForm({...patientForm, age: e.target.value})} placeholder="Age" type="number" required /></div>
                  <div style={{display: 'flex', gap: '1rem'}}><input value={patientForm.contactNumber} onChange={e=>setPatientForm({...patientForm, contactNumber: e.target.value})} placeholder="Contact" required /><input value={patientForm.address} onChange={e=>setPatientForm({...patientForm, address: e.target.value})} placeholder="Address" required /></div>
                  <button type="submit" className="btn-primary" style={{alignSelf: 'flex-start'}}>Save</button>
                </form>
              )}
              <div className="table-container">
                <table>
                  <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Contact</th></tr></thead>
                  <tbody>{patients.map(p => <tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.age}</td><td>{p.contactNumber}</td></tr>)}</tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
                  <button disabled={patientsPage === 0} onClick={() => fetchPatients(patientsPage - 1)} style={{ padding: '5px 15px', background: '#333', border: 'none', color: 'white', borderRadius: '5px', cursor: patientsPage === 0 ? 'not-allowed' : 'pointer'}}>Prev</button>
                  <span style={{ padding: '5px' }}>Page {patientsPage + 1} of {patientsTotalPages}</span>
                  <button disabled={patientsPage >= patientsTotalPages - 1} onClick={() => fetchPatients(patientsPage + 1)} style={{ padding: '5px 15px', background: '#333', border: 'none', color: 'white', borderRadius: '5px', cursor: patientsPage >= patientsTotalPages - 1 ? 'not-allowed' : 'pointer'}}>Next</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="animate-fade">
            <div className="recent-activity">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                <h2>Medical Staff</h2><button className="btn-primary" onClick={() => setShowAddDoctor(!showAddDoctor)}><Plus size={16}/> Add Doctor</button>
              </div>
              {showAddDoctor && (
                <form onSubmit={handleAddDoctor} style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px'}}>
                  <div style={{display: 'flex', gap: '1rem'}}><input value={doctorForm.name} onChange={e=>setDoctorForm({...doctorForm, name: e.target.value})} placeholder="Dr. Name" required /><input value={doctorForm.email} onChange={e=>setDoctorForm({...doctorForm, email: e.target.value})} placeholder="Email" type="email" required /></div>
                  <div style={{display: 'flex', gap: '1rem'}}><input value={doctorForm.password} onChange={e=>setDoctorForm({...doctorForm, password: e.target.value})} placeholder="Password" type="password" required /><input value={doctorForm.specialization} onChange={e=>setDoctorForm({...doctorForm, specialization: e.target.value})} placeholder="Speciality" required /></div>
                  <div style={{display: 'flex', gap: '1rem'}}><input value={doctorForm.experienceYears} onChange={e=>setDoctorForm({...doctorForm, experienceYears: e.target.value})} placeholder="Years of Exp" type="number" required /><input value={doctorForm.availability} onChange={e=>setDoctorForm({...doctorForm, availability: e.target.value})} placeholder="Availability (e.g. Mon-Fri)" required /></div>
                  <button type="submit" className="btn-primary" style={{alignSelf: 'flex-start'}}>Save</button>
                </form>
              )}
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Speciality</th><th>Exp</th><th>Availability</th></tr></thead>
                  <tbody>{doctors.map(d => <tr key={d.id}><td>{d.name}</td><td>{d.specialization}</td><td>{d.experienceYears}y</td><td>{d.availability}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="animate-fade">
            <div className="recent-activity">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                <h2>Appointments Log</h2><button className="btn-primary" onClick={() => setShowAddAppointment(!showAddAppointment)}><Plus size={16}/> Book Slot</button>
              </div>
              {showAddAppointment && (
                <form onSubmit={handleAddAppointment} style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px'}}>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <select required value={appointmentForm.patientId} onChange={e=>setAppointmentForm({...appointmentForm, patientId: e.target.value})} style={{flex: 1, padding: '0.8rem', borderRadius: '5px'}}>
                        <option value="">Select Patient</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <select required value={appointmentForm.doctorId} onChange={e=>setAppointmentForm({...appointmentForm, doctorId: e.target.value})} style={{flex: 1, padding: '0.8rem', borderRadius: '5px'}}>
                        <option value="">Select Doctor</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization}) - {d.availability}</option>)}
                    </select>
                  </div>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <input type="datetime-local" value={appointmentForm.appointmentDate} onChange={e=>setAppointmentForm({...appointmentForm, appointmentDate: e.target.value})} required style={{flex: 1, padding: '0.8rem', borderRadius: '5px'}}/>
                  </div>
                  <button type="submit" className="btn-primary" style={{alignSelf: 'flex-start'}}>Confirm Booking</button>
                </form>
              )}
              <div className="table-container">
                <table>
                  <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Status</th></tr></thead>
                  <tbody>{appointments.map(a => <tr key={a.id}><td>{a.id}</td><td>{a.patient?.name}</td><td>{a.doctor?.name}</td><td>{new Date(a.appointmentDate).toLocaleString()}</td><td><span className={`status ${a.status === 'COMPLETED' ? 'confirmed' : 'pending'}`}>{a.status}</span>{a.status === 'BOOKED' && <button onClick={() => handleCompleteAppointment(a.id)} style={{marginLeft: '10px', fontSize: '12px', padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Done</button>}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-fade">
             <div className="stats-grid">
              <div className="stat-card"><div className="stat-title">Total Patients</div><div className="stat-value">{patients.length} (Global)</div></div>
              <div className="stat-card"><div className="stat-title">Active Doctors</div><div className="stat-value">{doctors.length}</div></div>
              <div className="stat-card"><div className="stat-title">Total Appointments</div><div className="stat-value">{appointments.length}</div></div>
            </div>
            
            <DashboardCharts patients={patients} appointments={appointments} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
