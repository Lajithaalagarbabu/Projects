import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Stethoscope, Users, Pill, Syringe, Clock, AlertTriangle, 
  Bell, LogOut, Check, X, PhoneCall, Plus, Trash2, Calendar, FileText,
  UserCheck, ShieldAlert, Award, Heart, TrendingUp, Info
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';

const API_BASE = 'http://localhost:8080/api';

// Custom Dropdown Component for Modern Unified Theme
function CustomSelect({ value, onChange, options, placeholder, required, disabled, error, className, style }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex(o => o.value === value);
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex(o => o.value === value);
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div className="custom-select-container" ref={dropdownRef} style={style}>
      <div 
        className={`custom-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className || ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <span>{selectedOption ? selectedOption.label : placeholder || '-- Select --'}</span>
        <span className="custom-select-arrow"></span>
      </div>
      <div className={`custom-select-options ${isOpen ? 'open' : ''}`}>
        {options.map((opt) => (
          <div 
            key={opt.value}
            className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
            onClick={() => {
              onChange(opt.value);
              setIsOpen(false);
            }}
          >
            <span>{opt.label}</span>
            {value === opt.value && <span className="custom-select-check">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.body.classList.remove('theme-emerald', 'theme-amethyst', 'theme-light');
    if (theme !== 'dark') {
      document.body.classList.add(`theme-${theme}`);
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth state
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    username: '', password: '', email: '', role: 'PATIENT',
    name: '', age: '', gender: 'Female', address: '', phone: '',
    bloodGroup: 'O+', emergencyContactName: '', emergencyContactPhone: '',
    specialization: '', availableTimings: ''
  });

  // Global app data state
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [inventoryMedicines, setInventoryMedicines] = useState([]);
  const [inventoryVaccines, setInventoryVaccines] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeReminders, setActiveReminders] = useState([]);
  const [pregnancyData, setPregnancyData] = useState(null);
  const [elderlyData, setElderlyData] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Loading states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // UI Active tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Input states for modal forms
  const [newAppointment, setNewAppointment] = useState({ doctorId: '', appointmentDate: '', reason: '' });
  const [newDiagnosis, setNewDiagnosis] = useState({
    patientId: '', diagnosis: '', treatmentDetails: '', notes: '',
    prescriptions: [{ medicineName: '', dosage: '1-0-1', frequency: 'Daily', durationDays: 30, startDate: new Date().toISOString().split('T')[0] }]
  });
  const [newPregnancy, setNewPregnancy] = useState({ lmpDate: '', bloodPressure: '120/80', hemoglobin: 12.0, weight: 60.0, notes: '' });
  const [newElderly, setNewElderly] = useState({ bloodPressureSys: 120, bloodPressureDia: 80, sugarFasting: 100, sugarPostPrandial: 140, heartRate: 72, weight: 65.0, chronicDiseases: 'None', notes: '' });
  const [newMedicine, setNewMedicine] = useState({ medicineName: '', quantity: 100, expiryDate: '' });
  const [newVaccine, setNewVaccine] = useState({ vaccineName: '', quantity: 50 });

  // Fetch helper
  const authFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Network error occurred');
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  };

  // Auth Functions
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      if (isLogin) {
        const data = await authFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username: authForm.username, password: authForm.password })
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        setSuccessMessage('Logged in successfully!');
      } else {
        await authFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify(authForm)
        });
        setIsLogin(true);
        setSuccessMessage('Registration successful! Please login.');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setPatients([]);
    setDoctors([]);
    setAppointments([]);
    setInventoryMedicines([]);
    setInventoryVaccines([]);
    setNotifications([]);
    setActiveReminders([]);
    setPregnancyData(null);
    setElderlyData([]);
    setAnalytics({});
  };

  // Loader Functions
  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const stats = await authFetch('/analytics/dashboard');
      setAnalytics(stats);

      const notifs = await authFetch('/notifications');
      setNotifications(notifs);

      if (user.role === 'ADMIN') {
        const pList = await authFetch('/patients');
        setPatients(pList);
        const dList = await authFetch('/doctors');
        setDoctors(dList);
        const appList = await authFetch('/appointments');
        setAppointments(appList);
        const medList = await authFetch('/inventory/medicines');
        setInventoryMedicines(medList);
        const vacList = await authFetch('/inventory/vaccines');
        setInventoryVaccines(vacList);
      } else if (user.role === 'DOCTOR') {
        const pList = await authFetch('/patients');
        setPatients(pList);
        const appList = await authFetch('/appointments');
        setAppointments(appList);
        const medList = await authFetch('/inventory/medicines');
        setInventoryMedicines(medList);
      } else if (user.role === 'PATIENT') {
        const appList = await authFetch('/appointments');
        setAppointments(appList);
        const records = await authFetch(`/medical-records/patient/${user.id}`);
        setMedicalRecords(records);
        const reminders = await authFetch('/reminders/active');
        setActiveReminders(reminders);
        const docList = await authFetch('/doctors');
        setDoctors(docList);
        const medList = await authFetch('/inventory/medicines');
        setInventoryMedicines(medList);
        const vacList = await authFetch('/inventory/vaccines');
        setInventoryVaccines(vacList);

        // Pregnancy Data
        if (authForm.gender === 'Female' || user.username.includes('priya')) {
          const preg = await authFetch(`/pregnancy/patient/${user.id}`);
          if (preg && preg.id) setPregnancyData(preg);
        }
        // Elderly Data
        const eld = await authFetch(`/elderly/patient/${user.id}`);
        setElderlyData(eld);
      } else if (user.role === 'STAFF') {
        const pList = await authFetch('/patients');
        setPatients(pList);
        const appList = await authFetch('/appointments');
        setAppointments(appList);
        const medList = await authFetch('/inventory/medicines');
        setInventoryMedicines(medList);
        const vacList = await authFetch('/inventory/vaccines');
        setInventoryVaccines(vacList);
      }
    } catch (err) {
      console.error('Failed to load clinic metrics:', err);
    }
  };

  useEffect(() => {
    if (token && user) {
      loadDashboardData();
    }
  }, [token, user]);

  // Operational Functions
  const handleMarkCompliance = async (prescriptionId, timeLabel, status) => {
    try {
      await authFetch(`/compliance?prescriptionId=${prescriptionId}&timeLabel=${timeLabel}&status=${status}`, {
        method: 'POST'
      });
      setSuccessMessage('Medicine adherence logged!');
      loadDashboardData(); // reload
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleTriggerEmergency = async () => {
    try {
      await authFetch('/notifications/trigger-emergency', { method: 'POST' });
      setSuccessMessage('🚨 Critical Emergency dispatched! PHC Doctors and Staff notified.');
      loadDashboardData();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleMarkNotifRead = async (id) => {
    try {
      await authFetch(`/notifications/${id}/read`, { method: 'PUT' });
      loadDashboardData();
    } catch (err) {}
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/inventory/medicines', {
        method: 'POST',
        body: JSON.stringify(newMedicine)
      });
      setSuccessMessage('Medicine stock added!');
      loadDashboardData();
      setNewMedicine({ medicineName: '', quantity: 100, expiryDate: '' });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctor: { id: newAppointment.doctorId },
          appointmentDate: newAppointment.appointmentDate,
          reason: newAppointment.reason
        })
      });
      setSuccessMessage('Appointment booked successfully!');
      loadDashboardData();
      setNewAppointment({ doctorId: '', appointmentDate: '', reason: '' });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleAddDiagnosis = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/medical-records', {
        method: 'POST',
        body: JSON.stringify({
          patient: { id: newDiagnosis.patientId },
          diagnosis: newDiagnosis.diagnosis,
          treatmentDetails: newDiagnosis.treatmentDetails,
          notes: newDiagnosis.notes,
          prescriptions: newDiagnosis.prescriptions
        })
      });
      setSuccessMessage('Medical record with prescriptions generated successfully!');
      loadDashboardData();
      setNewDiagnosis({
        patientId: '', diagnosis: '', treatmentDetails: '', notes: '',
        prescriptions: [{ medicineName: '', dosage: '1-0-1', frequency: 'Daily', durationDays: 30, startDate: new Date().toISOString().split('T')[0] }]
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleAddPregnancyRecord = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/pregnancy', {
        method: 'POST',
        body: JSON.stringify({
          patient: { id: user.id },
          lmpDate: newPregnancy.lmpDate,
          bloodPressure: newPregnancy.bloodPressure,
          hemoglobin: parseFloat(newPregnancy.hemoglobin),
          weight: parseFloat(newPregnancy.weight),
          notes: newPregnancy.notes
        })
      });
      setSuccessMessage('Gestational metrics uploaded!');
      loadDashboardData();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleAddElderlyRecord = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/elderly', {
        method: 'POST',
        body: JSON.stringify({
          patient: { id: user.id },
          bloodPressureSys: parseInt(newElderly.bloodPressureSys),
          bloodPressureDia: parseInt(newElderly.bloodPressureDia),
          sugarFasting: parseInt(newElderly.sugarFasting),
          sugarPostPrandial: parseInt(newElderly.sugarPostPrandial),
          heartRate: parseInt(newElderly.heartRate),
          weight: parseFloat(newElderly.weight),
          chronicDiseases: newElderly.chronicDiseases,
          notes: newElderly.notes
        })
      });
      setSuccessMessage('Elderly clinical tracking metrics logged!');
      loadDashboardData();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Render Login Panel
  if (!token) {
    return (
      <div className="auth-container">
        {/* Floating Theme Selector */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-glass)',
          padding: '6px 12px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-premium)'
        }}>
          <CustomSelect 
            value={theme} 
            onChange={setTheme}
            options={[
              { value: 'dark', label: 'Neon Dark' },
              { value: 'emerald', label: 'Emerald Healing' },
              { value: 'amethyst', label: 'Amethyst Purple' },
              { value: 'light', label: 'Crisp Light' }
            ]}
            style={{ width: '150px' }}
          />
        </div>

        <div className="glass-panel" style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Activity size={48} style={{ color: 'var(--color-accent)', marginBottom: '8px' }} />
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>SMART PHC SYSTEM</h2>
            <p style={{ color: 'var(--text-muted)' }}>Rural Healthcare & Adherence Portal</p>
          </div>

          {errorMessage && (
            <div className="status-badge high_risk" style={{ width: '100%', marginBottom: '16px', textAlign: 'center' }}>
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="status-badge available" style={{ width: '100%', marginBottom: '16px', textAlign: 'center' }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Username</label>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Enter username"
                required
                value={authForm.username} 
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Password</label>
              <input 
                type="password" 
                className="glass-input" 
                placeholder="Enter password"
                required
                value={authForm.password} 
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} 
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Email</label>
                  <input 
                    type="email" 
                    className="glass-input" 
                    placeholder="Enter email"
                    required
                    value={authForm.email} 
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} 
                  />
                </div>
                  <CustomSelect 
                    value={authForm.role}
                    onChange={(val) => setAuthForm({ ...authForm, role: val })}
                    options={[
                      { value: 'PATIENT', label: 'PATIENT' },
                      { value: 'DOCTOR', label: 'DOCTOR' },
                      { value: 'STAFF', label: 'HOSPITAL STAFF' },
                      { value: 'ADMIN', label: 'ADMINISTRATOR' }
                    ]}
                  />

                {authForm.role === 'PATIENT' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Full Name</label>
                      <input type="text" className="glass-input" placeholder="Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Age</label>
                      <input type="number" className="glass-input" placeholder="Age" value={authForm.age} onChange={(e) => setAuthForm({ ...authForm, age: parseInt(e.target.value) })} />
                    </div>
                      <CustomSelect 
                        value={authForm.gender}
                        onChange={(val) => setAuthForm({ ...authForm, gender: val })}
                        options={[
                          { value: 'Female', label: 'Female' },
                          { value: 'Male', label: 'Male' },
                          { value: 'Other', label: 'Other' }
                        ]}
                      />
                      <CustomSelect 
                        value={authForm.bloodGroup}
                        onChange={(val) => setAuthForm({ ...authForm, bloodGroup: val })}
                        options={[
                          { value: 'O+', label: 'O+' },
                          { value: 'A+', label: 'A+' },
                          { value: 'B+', label: 'B+' },
                          { value: 'AB+', label: 'AB+' },
                          { value: 'O-', label: 'O-' },
                          { value: 'A-', label: 'A-' }
                        ]}
                      />
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Address</label>
                      <input type="text" className="glass-input" placeholder="Village / Area Address" value={authForm.address} onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Phone</label>
                      <input type="text" className="glass-input" placeholder="Phone" value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Emergency Contact Name</label>
                      <input type="text" className="glass-input" placeholder="Emergency Name" value={authForm.emergencyContactName} onChange={(e) => setAuthForm({ ...authForm, emergencyContactName: e.target.value })} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Emergency Phone</label>
                      <input type="text" className="glass-input" placeholder="Emergency Phone" value={authForm.emergencyContactPhone} onChange={(e) => setAuthForm({ ...authForm, emergencyContactPhone: e.target.value })} />
                    </div>
                  </div>
                )}

                {authForm.role === 'DOCTOR' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Specialization</label>
                      <input type="text" className="glass-input" placeholder="Gynecologist / General Medicine" value={authForm.specialization} onChange={(e) => setAuthForm({ ...authForm, specialization: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem' }}>Available Timings</label>
                      <input type="text" className="glass-input" placeholder="e.g. 09:00 AM - 01:00 PM" value={authForm.availableTimings} onChange={(e) => setAuthForm({ ...authForm, availableTimings: e.target.value })} />
                    </div>
                  </>
                )}
              </>
            )}

            <button type="submit" className="glass-btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
              {loading ? 'Authenticating...' : isLogin ? 'SIGN IN' : 'REGISTER'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <span 
              style={{ color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register Here' : 'Login Here'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Active dashboards
  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={28} style={{ color: 'var(--color-accent)' }} />
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px' }}>PHC PORTAL</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>{user.role} VIEW</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <a href="#" className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </a>

          {user.role === 'ADMIN' && (
            <>
              <a href="#" className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
                <Users size={20} />
                <span>Patients</span>
              </a>
              <a href="#" className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>
                <Stethoscope size={20} />
                <span>Doctors</span>
              </a>
              <a href="#" className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
                <Pill size={20} />
                <span>Inventory</span>
              </a>
            </>
          )}

          {user.role === 'DOCTOR' && (
            <>
              <a href="#" className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
                <Users size={20} />
                <span>Patients Management</span>
              </a>
              <a href="#" className={`nav-link ${activeTab === 'prescribe' ? 'active' : ''}`} onClick={() => setActiveTab('prescribe')}>
                <FileText size={20} />
                <span>Add Record</span>
              </a>
            </>
          )}

          {user.role === 'PATIENT' && (
            <>
              <a href="#" className={`nav-link ${activeTab === 'adherence' ? 'active' : ''}`} onClick={() => setActiveTab('adherence')}>
                <Clock size={20} />
                <span>Medicine Reminders</span>
              </a>
              <a href="#" className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
                <Calendar size={20} />
                <span>Book Appointment</span>
              </a>
              {(authForm.gender === 'Female' || user.username.includes('priya')) && (
                <a href="#" className={`nav-link ${activeTab === 'pregnancy' ? 'active' : ''}`} onClick={() => setActiveTab('pregnancy')}>
                  <Heart size={20} />
                  <span>Pregnancy Portal</span>
                </a>
              )}
              {elderlyData.length > 0 && (
                <a href="#" className={`nav-link ${activeTab === 'elderly' ? 'active' : ''}`} onClick={() => setActiveTab('elderly')}>
                  <Activity size={20} />
                  <span>Elderly Chronic Care</span>
                </a>
              )}
              <a href="#" className={`nav-link ${activeTab === 'records' ? 'active' : ''}`} onClick={() => setActiveTab('records')}>
                <FileText size={20} />
                <span>Medical History</span>
              </a>
            </>
          )}

          {user.role === 'STAFF' && (
            <>
              <a href="#" className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
                <UserCheck size={20} />
                <span>Intake & Register</span>
              </a>
              <a href="#" className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
                <Syringe size={20} />
                <span>Stocks Levels</span>
              </a>
            </>
          )}

          <a href="#" className={`nav-link ${activeTab === 'stocks-checker' ? 'active' : ''}`} onClick={() => setActiveTab('stocks-checker')}>
            <Info size={20} />
            <span>Drug & Vaccine Stock</span>
          </a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Theme Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <CustomSelect 
              value={theme} 
              onChange={setTheme}
              options={[
                { value: 'dark', label: 'Neon Dark' },
                { value: 'emerald', label: 'Emerald Healing' },
                { value: 'amethyst', label: 'Amethyst Purple' },
                { value: 'light', label: 'Crisp Light' }
              ]}
            />
          </div>

          <div style={{ padding: '8px 12px', background: 'var(--bg-item-card-heavy)', borderRadius: '8px', fontSize: '0.85rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>Logged in as</div>
            <div style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{user.username}</div>
          </div>
          <button className="glass-btn danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleLogout}>
            <LogOut size={18} />
            <span>LOGOUT</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Floating status header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800 }}>Welcome Back, {user.username}</h2>
            <p style={{ color: 'var(--text-muted)' }}>PHC Center Operations Hub • {new Date().toLocaleDateString()}</p>
          </div>

          {/* In-App Notifications Hub */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
              <Bell size={24} />
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'var(--color-danger)', borderRadius: '50%',
                  width: '18px', height: '18px', display: 'flex',
                  alignItems: 'center', justifySelf: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 'bold'
                }}>
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messaging alerts */}
        {errorMessage && (
          <div className="status-badge high_risk" style={{ padding: '12px', width: '100%', marginBottom: '24px', borderRadius: '8px' }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="status-badge available" style={{ padding: '12px', width: '100%', marginBottom: '24px', borderRadius: '8px' }}>
            {successMessage}
          </div>
        )}

        {/* TAB PANELS */}

        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <div>
            {/* Notifications Hub Checklist */}
            {notifications.filter(n => !n.isRead).length > 0 && (
              <div className="glass-panel" style={{ marginBottom: '32px', borderLeft: '4px solid var(--color-danger)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', marginBottom: '12px' }}>
                  <ShieldAlert /> Critical Alerts & Notifications
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {notifications.filter(n => !n.isRead).map(n => (
                    <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'var(--bg-item-card)', padding: '12px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{n.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{n.message}</div>
                      </div>
                      <button className="glass-btn" style={{ padding: '4px 8px' }} onClick={() => handleMarkNotifRead(n.id)}>
                        <Check size={14} /> Mark Read
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics cards grid based on user role */}
            <div className="metrics-grid">
              {user.role === 'ADMIN' && (
                <>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Patients Registered</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{analytics.totalPatients || 0}</div>
                    </div>
                    <div className="metric-icon"><Users size={32} /></div>
                  </div>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>PHC Doctors</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{analytics.totalDoctors || 0}</div>
                    </div>
                    <div className="metric-icon"><Stethoscope size={32} /></div>
                  </div>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Daily Appointments</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{analytics.totalAppointments || 0}</div>
                    </div>
                    <div className="metric-icon"><Calendar size={32} /></div>
                  </div>
                </>
              )}

              {user.role === 'DOCTOR' && (
                <>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Today's Appts</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{analytics.todayAppointmentsCount || 0}</div>
                    </div>
                    <div className="metric-icon"><Clock size={32} /></div>
                  </div>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>High-Risk Pregnancies</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-danger)' }}>{analytics.highRiskPregnanciesCount || 0}</div>
                    </div>
                    <div className="metric-icon" style={{ color: 'var(--color-danger)' }}><AlertTriangle size={32} /></div>
                  </div>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Low Compliance Alert</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-warning)' }}>{analytics.lowCompliancePatientsCount || 0}</div>
                    </div>
                    <div className="metric-icon" style={{ color: 'var(--color-warning)' }}><ShieldAlert size={32} /></div>
                  </div>
                </>
              )}

              {user.role === 'PATIENT' && (
                <>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Adherence Score</div>
                      <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--color-success)' }}>{analytics.complianceRate || 100}%</div>
                    </div>
                    <div className="metric-icon" style={{ color: 'var(--color-success)' }}><Award size={32} /></div>
                  </div>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upcoming Visits</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{analytics.upcomingAppointments?.length || 0}</div>
                    </div>
                    <div className="metric-icon"><Calendar size={32} /></div>
                  </div>
                  <div className="glass-panel metric-card">
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Medical Logs</div>
                      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit' }}>{analytics.totalVisits || 0}</div>
                    </div>
                    <div className="metric-icon"><FileText size={32} /></div>
                  </div>
                </>
              )}
            </div>

            {/* Visual charts for metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div className="glass-panel">
                <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Medicine & Vaccine Stock Analysis</h3>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={inventoryMedicines.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="medicineName" stroke="var(--text-muted)" />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey="quantity" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel">
                <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>PHC Quick Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifySelf: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span>Gynecology Clinic</span>
                    <span className="status-badge available">Available Today</span>
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span>General Outpatient</span>
                    <span className="status-badge available">Available Today</span>
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span>COVID Vaccine Center</span>
                    <span className="status-badge out_of_stock">On Hold</span>
                  </div>
                  <div style={{ display: 'flex', justifySelf: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                    <span>TT Maternal Vaccines</span>
                    <span className="status-badge available">Stock Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MEDICINE ADHERENCE REMINDERS FOR PATIENT */}
        {activeTab === 'adherence' && (
          <div className="glass-panel">
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock style={{ color: 'var(--color-accent)' }} /> Today's Medicine Reminders Checklist
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Confirm your medicine intake schedules. Doctors can view this checklist compliance dynamically.</p>

            {activeReminders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <Check size={48} style={{ color: 'var(--color-success)', marginBottom: '12px' }} />
                <h4>No active reminders scheduled for today!</h4>
                <p>Excellent work. Make sure to consult your doctor for any new prescriptions.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeReminders.map((rem, idx) => (
                  <div key={idx} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--bg-item-card)', padding: '16px 24px', borderRadius: '12px',
                    borderLeft: `4px solid ${rem.status === 'TAKEN' ? 'var(--color-success)' : rem.status === 'SKIPPED' ? 'var(--color-danger)' : 'var(--color-primary)'}`
                  }}>
                    <div>
                      <h4 style={{ fontFamily: 'Outfit', fontWeight: 600 }}>{rem.medicineName}</h4>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span>Dosage: <strong>{rem.dosage}</strong></span>
                        <span>Schedule: <strong>{rem.timeLabel}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {rem.status === 'PENDING' ? (
                        <>
                          <button className="glass-btn primary" style={{ background: 'var(--color-success)', color: 'white' }} onClick={() => handleMarkCompliance(rem.prescriptionId, rem.timeLabel, 'TAKEN')}>
                            <Check size={16} /> Taken
                          </button>
                          <button className="glass-btn danger" onClick={() => handleMarkCompliance(rem.prescriptionId, rem.timeLabel, 'SKIPPED')}>
                            <X size={16} /> Skip
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge ${rem.status.toLowerCase()}`}>{rem.status}</span>
                          <button className="glass-btn" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => handleMarkCompliance(rem.prescriptionId, rem.timeLabel, 'PENDING')}>
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PATIENTS VIEW (ADMIN & DOCTOR & STAFF) */}
        {activeTab === 'patients' && (
          <div className="glass-panel">
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Primary Health Care Patient Directory</h3>
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age / Gender</th>
                  <th>Contact Phone</th>
                  <th>Blood Group</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{p.name}</td>
                    <td>{p.age} / {p.gender}</td>
                    <td>{p.phone}</td>
                    <td><span className="status-badge available" style={{ minWidth: '40px', textAlign: 'center' }}>{p.bloodGroup}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{p.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRESCRIBE / ADD MEDICAL RECORDS */}
        {activeTab === 'prescribe' && (
          <div className="glass-panel">
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Generate Medical Record & Add Diagnosis</h3>
            <form onSubmit={handleAddDiagnosis} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <CustomSelect 
                  value={newDiagnosis.patientId}
                  onChange={(val) => setNewDiagnosis({ ...newDiagnosis, patientId: val })}
                  placeholder="-- Choose Patient --"
                  options={patients.map(p => ({ value: p.id.toString(), label: `${p.name} (Age: ${p.age})` }))}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px' }}>Diagnosis</label>
                <input type="text" className="glass-input" required placeholder="e.g. Iron Deficiency Anemia / Type 2 Diabetes mellitus" value={newDiagnosis.diagnosis} onChange={(e) => setNewDiagnosis({ ...newDiagnosis, diagnosis: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px' }}>Treatment & Prescriptions Details</label>
                <textarea className="glass-input" rows="3" placeholder="Provide clinical treatment notes..." value={newDiagnosis.treatmentDetails} onChange={(e) => setNewDiagnosis({ ...newDiagnosis, treatmentDetails: e.target.value })} />
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-item-card)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontFamily: 'Outfit', marginBottom: '12px', color: 'var(--color-accent)' }}>Add Prescription Dose Interval</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Medicine Name</label>
                    <input type="text" className="glass-input" placeholder="e.g. Iron & Folic Acid" value={newDiagnosis.prescriptions[0].medicineName} onChange={(e) => {
                      const updated = [...newDiagnosis.prescriptions];
                      updated[0].medicineName = e.target.value;
                      setNewDiagnosis({ ...newDiagnosis, prescriptions: updated });
                    }} />
                  </div>
                  <div>
                    <CustomSelect 
                      value={newDiagnosis.prescriptions[0].dosage} 
                      onChange={(val) => {
                        const updated = [...newDiagnosis.prescriptions];
                        updated[0].dosage = val;
                        setNewDiagnosis({ ...newDiagnosis, prescriptions: updated });
                      }}
                      options={[
                        { value: '1-0-1', label: '1-0-1 (Morning / Night)' },
                        { value: '1-1-1', label: '1-1-1 (Morning/Noon/Night)' },
                        { value: '0-0-1', label: '0-0-1 (Night only)' },
                        { value: '1-0-0', label: '1-0-0 (Morning only)' }
                      ]}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Duration (Days)</label>
                    <input type="number" className="glass-input" value={newDiagnosis.prescriptions[0].durationDays} onChange={(e) => {
                      const updated = [...newDiagnosis.prescriptions];
                      updated[0].durationDays = parseInt(e.target.value);
                      setNewDiagnosis({ ...newDiagnosis, prescriptions: updated });
                    }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Frequency</label>
                    <input type="text" className="glass-input" value={newDiagnosis.prescriptions[0].frequency} readOnly />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px' }}>Additional Doctor Notes</label>
                <textarea className="glass-input" rows="2" placeholder="e.g. Advised plenty of fluids and walk" value={newDiagnosis.notes} onChange={(e) => setNewDiagnosis({ ...newDiagnosis, notes: e.target.value })} />
              </div>

              <button type="submit" className="glass-btn primary" style={{ width: '150px' }}><Plus /> Save Record</button>
            </form>
          </div>
        )}

        {/* BOOK APPOINTMENT FOR PATIENT */}
        {activeTab === 'appointments' && (
          <div className="glass-panel">
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Book Appointment with Doctor</h3>
            <form onSubmit={handleAddAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <CustomSelect 
                  value={newAppointment.doctorId}
                  onChange={(val) => setNewAppointment({ ...newAppointment, doctorId: val })}
                  placeholder="-- Select Doctor --"
                  options={doctors.map(d => ({ value: d.id.toString(), label: `${d.name} (${d.specialization}) - ${d.availableTimings}` }))}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px' }}>Appointment Date & Time</label>
                <input type="datetime-local" className="glass-input" required value={newAppointment.appointmentDate} onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px' }}>Reason for Visit</label>
                <input type="text" className="glass-input" required placeholder="e.g. Routine checkup, fever, gestational screening" value={newAppointment.reason} onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })} />
              </div>

              <button type="submit" className="glass-btn primary" style={{ width: '200px' }}><Calendar /> Book Appointment</button>
            </form>
          </div>
        )}

        {/* PREGNANCY PORTAL FOR MATERNAL CARE */}
        {activeTab === 'pregnancy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Heart style={{ color: 'var(--color-danger)' }} /> Pregnancy Gestational Care Progress Card
              </h3>

              {pregnancyData ? (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: 'var(--bg-item-card-subtle)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>EXPECTED DELIVERY DATE (EDD)</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-accent)' }}>{pregnancyData.edd}</div>
                      </div>
                      <div style={{ background: 'var(--bg-item-card-subtle)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CURRENT GESTATION WEEK</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-success)' }}>Week {pregnancyData.pregnancyWeek}</div>
                      </div>
                      <div style={{ background: 'var(--bg-item-card-subtle)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HEMOGLOBIN (Hb)</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pregnancyData.hemoglobin} g/dL</div>
                      </div>
                      <div style={{ background: 'var(--bg-item-card-subtle)', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BLOOD PRESSURE</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{pregnancyData.bloodPressure} mmHg</div>
                      </div>
                    </div>

                    {pregnancyData.highRiskStatus && (
                      <div className="status-badge high_risk" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle />
                        <span><strong>HIGH-RISK ALERT:</strong> {pregnancyData.highRiskReason}</span>
                      </div>
                    )}

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      <strong>Doctor Notes:</strong> {pregnancyData.notes || 'None'}
                    </div>
                  </div>

                  {/* Visual gauge representation */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', background: 'var(--bg-item-card)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                        <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-success)" strokeWidth="10" strokeDasharray="314" strokeDashoffset={314 - (314 * (pregnancyData.pregnancyWeek || 1) / 40)} />
                      </svg>
                      <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{Math.round((pregnancyData.pregnancyWeek / 40) * 100)}%</div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>COMPLETED</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>Standard 40 Weeks Cycle</span>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  <h4>No gestation metrics uploaded for your profile yet.</h4>
                  <p>Submit your Last Menstrual Period below to activate your progress tracker.</p>
                </div>
              )}
            </div>

            {/* Input logs form */}
            <div className="glass-panel">
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Self-Upload Gestational Metrics Logs</h3>
              <form onSubmit={handleAddPregnancyRecord} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Last Menstrual Period (LMP) Date</label>
                  <input type="date" className="glass-input" required value={newPregnancy.lmpDate} onChange={(e) => setNewPregnancy({ ...newPregnancy, lmpDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Active Weight (Kg)</label>
                  <input type="number" step="0.1" className="glass-input" required value={newPregnancy.weight} onChange={(e) => setNewPregnancy({ ...newPregnancy, weight: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Blood Pressure (e.g. 120/80)</label>
                  <input type="text" className="glass-input" required value={newPregnancy.bloodPressure} onChange={(e) => setNewPregnancy({ ...newPregnancy, bloodPressure: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Hemoglobin Score (g/dL)</label>
                  <input type="number" step="0.1" className="glass-input" required value={newPregnancy.hemoglobin} onChange={(e) => setNewPregnancy({ ...newPregnancy, hemoglobin: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px' }}>ANC Checkup Symptoms Notes</label>
                  <textarea className="glass-input" rows="2" placeholder="Describe how you feel (nausea, fatigue, etc.)" value={newPregnancy.notes} onChange={(e) => setNewPregnancy({ ...newPregnancy, notes: e.target.value })} />
                </div>

                <button type="submit" className="glass-btn primary" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>Upload Gestation Logs</button>
              </form>
            </div>
          </div>
        )}

        {/* ELDERLY CARE PORTAL FOR CHRONIC VITAL TRENDS */}
        {activeTab === 'elderly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel">
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp style={{ color: 'var(--color-accent)' }} /> Blood Sugar & Blood Pressure Chronological Trends
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Visual Area trends mapped directly for clinical monitoring. Keeps doctors updated on chronic diabetes and hypertension shifts.</p>

              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={elderlyData.slice().reverse()}>
                    <defs>
                      <linearGradient id="sys" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="fasting" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="recordDate" stroke="var(--text-muted)" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="bloodPressureSys" name="Systolic BP" stroke="var(--color-primary)" fillOpacity={1} fill="url(#sys)" />
                    <Area type="monotone" dataKey="sugarFasting" name="Glucose Fasting" stroke="var(--color-success)" fillOpacity={1} fill="url(#fasting)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Upload Logs form */}
            <div className="glass-panel">
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Self-Upload Chronic Vitals Logs</h3>
              <form onSubmit={handleAddElderlyRecord} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>BP Systolic (mmHg)</label>
                  <input type="number" className="glass-input" required value={newElderly.bloodPressureSys} onChange={(e) => setNewElderly({ ...newElderly, bloodPressureSys: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>BP Diastolic (mmHg)</label>
                  <input type="number" className="glass-input" required value={newElderly.bloodPressureDia} onChange={(e) => setNewElderly({ ...newElderly, bloodPressureDia: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Heart Rate (bpm)</label>
                  <input type="number" className="glass-input" required value={newElderly.heartRate} onChange={(e) => setNewElderly({ ...newElderly, heartRate: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Sugar Fasting (mg/dL)</label>
                  <input type="number" className="glass-input" required value={newElderly.sugarFasting} onChange={(e) => setNewElderly({ ...newElderly, sugarFasting: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Sugar Post-Prandial (mg/dL)</label>
                  <input type="number" className="glass-input" required value={newElderly.sugarPostPrandial} onChange={(e) => setNewElderly({ ...newElderly, sugarPostPrandial: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Current Weight (Kg)</label>
                  <input type="number" step="0.1" className="glass-input" required value={newElderly.weight} onChange={(e) => setNewElderly({ ...newElderly, weight: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Chronic Conditions (e.g. T2DM, Chronic Hypertension)</label>
                  <input type="text" className="glass-input" value={newElderly.chronicDiseases} onChange={(e) => setNewElderly({ ...newElderly, chronicDiseases: e.target.value })} />
                </div>
                <div style={{ gridColumn: 'span 3' }}>
                  <label style={{ display: 'block', marginBottom: '6px' }}>Daily Symptoms / Vitals Notes</label>
                  <textarea className="glass-input" rows="2" placeholder="Specify any symptoms felt (dizziness, chest tightening, fatigue, etc.)" value={newElderly.notes} onChange={(e) => setNewElderly({ ...newElderly, notes: e.target.value })} />
                </div>

                <button type="submit" className="glass-btn primary" style={{ gridColumn: 'span 3', justifyContent: 'center' }}>Upload Elderly Care Logs</button>
              </form>
            </div>
          </div>
        )}

        {/* MEDICAL HISTORY / RECORDS VIEW FOR PATIENT */}
        {activeTab === 'records' && (
          <div className="glass-panel">
            <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText style={{ color: 'var(--color-accent)' }} /> Personal Medical History & Diagnoses
            </h3>
            {medicalRecords.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                <h4>No historical medical record entries found for your profile.</h4>
                <p>Visit checkup registers are initialized automatically when primary clinic consultations finish.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {medicalRecords.map((rec) => (
                  <div key={rec.id} style={{ background: 'var(--bg-item-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ color: 'var(--color-accent)', fontFamily: 'Outfit' }}>Diagnosis: {rec.diagnosis}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consulting Doctor: {rec.doctor.name} ({rec.doctor.specialization})</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visit Date: {new Date(rec.visitDate).toLocaleDateString()}</span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <h5 style={{ fontWeight: 600, marginBottom: '4px' }}>Clinical Treatment & Advice:</h5>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{rec.treatmentDetails}</p>
                    </div>

                    {rec.prescriptions && rec.prescriptions.length > 0 && (
                      <div style={{ padding: '16px', background: 'var(--bg-item-card)', borderRadius: '8px' }}>
                        <h5 style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: '8px' }}>Prescribed Medication Schedule:</h5>
                        {rec.prescriptions.map((pr, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: idx < rec.prescriptions.length - 1 ? '1px solid var(--border-subtle)' : 'none', padding: '6px 0' }}>
                            <span>💊 <strong>{pr.medicineName}</strong></span>
                            <span>Dosage: <strong>{pr.dosage}</strong></span>
                            <span>Duration: <strong>{pr.durationDays} Days</strong></span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVENTORY / DRUG STOCKS CHECKER */}
        {activeTab === 'stocks-checker' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel">
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Pill style={{ color: 'var(--color-accent)' }} /> Medicine Stocks Inventory Tracker
              </h3>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Batch Quantity</th>
                    <th>Expiry Date</th>
                    <th>PHC Stock Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryMedicines.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.medicineName}</td>
                      <td>{m.quantity} Units</td>
                      <td>{m.expiryDate}</td>
                      <td>
                        <span className={`status-badge ${m.status.toLowerCase()}`}>
                          {m.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="glass-panel">
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Syringe style={{ color: 'var(--color-accent)' }} /> Injection & Vaccine Stock Availability
              </h3>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Vaccine / Injection Name</th>
                    <th>Stock Doses</th>
                    <th>Immunization Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryVaccines.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 600 }}>{v.vaccineName}</td>
                      <td>{v.quantity} Doses</td>
                      <td>
                        <span className={`status-badge ${v.status.toLowerCase()}`}>
                          {v.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADMIN & STAFF STOCKS EDITOR */}
        {activeTab === 'inventory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel">
              <h3 style={{ fontFamily: 'Outfit', marginBottom: '16px' }}>Manage Medicine Stock Register</h3>
              <form onSubmit={handleAddMedicine} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Medicine Name</label>
                  <input type="text" className="glass-input" required placeholder="e.g. Calcium Carbonate 500mg" value={newMedicine.medicineName} onChange={(e) => setNewMedicine({ ...newMedicine, medicineName: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Quantity</label>
                  <input type="number" className="glass-input" required value={newMedicine.quantity} onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseInt(e.target.value) })} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem' }}>Expiry Date</label>
                  <input type="date" className="glass-input" required value={newMedicine.expiryDate} onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })} />
                </div>
                <button type="submit" className="glass-btn primary" style={{ gridColumn: 'span 3', justifyContent: 'center' }}><Plus /> Add Medicine Stock Batch</button>
              </form>

              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Batch Quantity</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryMedicines.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600 }}>{m.medicineName}</td>
                      <td>{m.quantity} Units</td>
                      <td>{m.expiryDate}</td>
                      <td><span className={`status-badge ${m.status.toLowerCase()}`}>{m.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* EMERGENCY BUTTON COMPONENT */}
      {user.role === 'PATIENT' && (
        <button className="emergency-trigger-btn pulse-emergency" title="Press for Immediate Critical Support Alert" onClick={handleTriggerEmergency}>
          <PhoneCall size={32} />
        </button>
      )}
    </div>
  );
}
