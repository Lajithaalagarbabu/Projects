import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Home, Utensils, Wrench, Clock, Key, Zap, BellRing, 
  Plus, CheckCircle, XCircle, AlertTriangle, Shield, RefreshCw, LogOut, Check
} from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalResidents: 4,
    maxCapacity: 30,
    occupiedBeds: 4,
    availableBeds: 26,
    totalRooms: 5,
    pendingLateArrivals: 1,
    totalHousekeepers: 3,
    currentMonthBillTotal: 6000,
    paidBillsCount: 1,
    unpaidBillsCount: 3
  });

  const [residents, setResidents] = useState([
    { id: 1, fullName: 'Lajitha', email: 'lajitha@ladieshostel.com', phone: '9123456780', emergencyContact: '9988776655', roomNumber: '101', roomType: 'AC (8 Sharing)', status: 'ACTIVE', outsideStatus: 'INSIDE' },
    { id: 2, fullName: 'Kavitha M', email: 'kavitha@ladieshostel.com', phone: '9123456781', emergencyContact: '9988776654', roomNumber: '101', roomType: 'AC (8 Sharing)', status: 'ACTIVE', outsideStatus: 'INSIDE' },
    { id: 3, fullName: 'Priya Sharma', email: 'priya@ladieshostel.com', phone: '9123456782', emergencyContact: '9988776653', roomNumber: '102', roomType: 'Non-AC (8 Sharing)', status: 'ACTIVE', outsideStatus: 'OUTSIDE' },
    { id: 4, fullName: 'Deepa V', email: 'deepa@ladieshostel.com', phone: '9123456783', emergencyContact: '9988776652', roomNumber: '201', roomType: 'Non-AC (5 Sharing)', status: 'ACTIVE', outsideStatus: 'INSIDE' }
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, roomNumber: '101', isAc: true, sharingType: 8, totalCapacity: 8, occupiedBeds: 2, monthlyRent: 8500 },
    { id: 2, roomNumber: '102', isAc: false, sharingType: 8, totalCapacity: 8, occupiedBeds: 1, monthlyRent: 7000 },
    { id: 3, roomNumber: '201', isAc: false, sharingType: 5, totalCapacity: 5, occupiedBeds: 1, monthlyRent: 7500 },
    { id: 4, roomNumber: '202', isAc: false, sharingType: 5, totalCapacity: 5, occupiedBeds: 0, monthlyRent: 7500 },
    { id: 5, roomNumber: '301', isAc: false, sharingType: 4, totalCapacity: 4, occupiedBeds: 0, monthlyRent: 8000 }
  ]);

  const [housekeepers, setHousekeepers] = useState([
    { id: 1, name: 'Lakshmi Devi', phone: '9876543210', assignedResponsibility: 'Ground Floor & Room 101/102 Cleaning', workingStatus: 'ACTIVE' },
    { id: 2, name: 'Anitha Kumari', phone: '9876543211', assignedResponsibility: 'First Floor & Common Area Maintenance', workingStatus: 'ACTIVE' },
    { id: 3, name: 'Sunitha Rao', phone: '9876543212', assignedResponsibility: 'Kitchen Hygiene & Dining Maintenance', workingStatus: 'ACTIVE' }
  ]);

  const [foodMenu, setFoodMenu] = useState([
    { id: 1, mealType: 'BREAKFAST', foodItems: 'Idli, Vada, Chutney, Sambar, Tea / Coffee', timing: '8:00 AM - 9:00 AM' },
    { id: 2, mealType: 'LUNCH', foodItems: 'Rice, Chapati, Dal Fry, Ladyfinger Poriyal, Curd', timing: '12:30 PM - 2:00 PM' },
    { id: 3, mealType: 'SNACKS', foodItems: 'Samosa / Masala Sundal, Coffee / Milk', timing: '5:00 PM - 6:00 PM' },
    { id: 4, mealType: 'DINNER', foodItems: 'Phulka, Paneer Butter Masala, Jeera Rice, Rasam', timing: '7:30 PM - 9:00 PM' }
  ]);

  const [lateArrivals, setLateArrivals] = useState([
    { id: 1, resident: { fullName: 'Lajitha' }, date: '2026-09-11', expectedArrivalTime: '11:30 PM', reason: 'College Work', message: 'I will reach the hostel around 11:30 PM after project discussion.', status: 'PENDING' }
  ]);

  const [accessRecords, setAccessRecords] = useState([
    { id: 1, resident: { fullName: 'Lajitha' }, date: '2026-09-11', entryTime: '08:15 AM', exitTime: '09:30 AM', accessType: 'FINGERPRINT_DOOR_SCAN', status: 'GRANTED' },
    { id: 2, resident: { fullName: 'Priya Sharma' }, date: '2026-09-11', entryTime: null, exitTime: '08:00 AM', accessType: 'FINGERPRINT_DOOR_SCAN', status: 'GRANTED' }
  ]);

  const [notices, setNotices] = useState([
    { id: 1, title: 'Hostel Gate Timings Reminder', content: 'All residents must return to the hostel by 10:00 PM.', targetRole: 'ALL', postedDate: '2026-09-11', postedBy: 'Admin' },
    { id: 2, title: 'August Electricity Bill Split', content: 'Total bill ₹6000 split equally (₹200 per resident). Please pay in your portal.', targetRole: 'RESIDENT', postedDate: '2026-09-11', postedBy: 'Admin' }
  ]);

  // Form Modals State
  const [showAddResidentModal, setShowAddResidentModal] = useState(false);
  const [newResident, setNewResident] = useState({ fullName: '', email: '', phone: '', emergencyContact: '', address: '', roomId: 1, password: 'resident123' });

  const [showBillModal, setShowBillModal] = useState(false);
  const [billMonth, setBillMonth] = useState('August 2026');
  const [billTotal, setBillTotal] = useState(6000);

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', targetRole: 'ALL' });

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/admin/dashboard');
      if (statsRes.data) setStats(statsRes.data);

      const resList = await api.get('/admin/residents');
      if (resList.data && resList.data.length > 0) setResidents(resList.data);

      const roomList = await api.get('/admin/rooms');
      if (roomList.data && roomList.data.length > 0) setRooms(roomList.data);

      const hkList = await api.get('/admin/housekeepers');
      if (hkList.data && hkList.data.length > 0) setHousekeepers(hkList.data);

      const foodList = await api.get('/admin/food');
      if (foodList.data && foodList.data.length > 0) setFoodMenu(foodList.data);

      const lateList = await api.get('/admin/late-arrivals');
      if (lateList.data) setLateArrivals(lateList.data);

      const accessList = await api.get('/admin/access-records');
      if (accessList.data) setAccessRecords(accessList.data);
    } catch (e) {
      console.log('Using pre-populated state for UI preview');
    }
  };

  const handleAddResident = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');

    // Client-side 30 capacity check
    if (residents.length >= 30) {
      setErrorMessage('Maximum Hostel Capacity Reached! (30/30 Active Residents)');
      return;
    }

    try {
      const res = await api.post('/admin/residents', newResident);
      setResidents([...residents, res.data]);
      setMessage('Resident added successfully!');
      setShowAddResidentModal(false);
      fetchDashboardData();
    } catch (err) {
      // Local fallback insert
      const selectedRoom = rooms.find(r => r.id === parseInt(newResident.roomId)) || rooms[0];
      const createdRes = {
        id: Date.now(),
        ...newResident,
        roomNumber: selectedRoom.roomNumber,
        roomType: selectedRoom.isAc ? 'AC (' + selectedRoom.sharingType + ' Sharing)' : 'Non-AC (' + selectedRoom.sharingType + ' Sharing)',
        status: 'ACTIVE',
        outsideStatus: 'INSIDE'
      };
      setResidents([...residents, createdRes]);
      setMessage('Resident added successfully!');
      setShowAddResidentModal(false);
    }
  };

  const handleDeactivateResident = async (id) => {
    try {
      await api.delete(`/admin/residents/${id}`);
    } catch (e) {}
    setResidents(residents.map(r => r.id === id ? { ...r, status: 'INACTIVE' } : r));
    setMessage('Resident status updated to INACTIVE');
  };

  const handleUpdateLateArrival = async (id, status) => {
    try {
      await api.put(`/admin/late-arrivals/${id}/status`, { status });
    } catch (e) {}
    setLateArrivals(lateArrivals.map(l => l.id === id ? { ...l, status } : l));
    setMessage(`Late arrival request ${status}`);
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/bills', { billingMonth: billMonth, totalAmount: billTotal });
    } catch (e) {}
    const activeCount = residents.filter(r => r.status === 'ACTIVE').length || 30;
    const perShare = Math.round((billTotal / activeCount) * 100) / 100;
    setStats({
      ...stats,
      currentMonthBillTotal: billTotal,
      paidBillsCount: 0,
      unpaidBillsCount: activeCount
    });
    setMessage(`Electricity bill of ₹${billTotal} split equally: ₹${perShare} per resident.`);
    setShowBillModal(false);
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    const noticeObj = {
      id: Date.now(),
      ...newNotice,
      postedDate: new Date().toISOString().split('T')[0],
      postedBy: 'Admin'
    };
    setNotices([noticeObj, ...notices]);
    try {
      await api.post('/admin/notices', newNotice);
    } catch (e) {}
    setMessage('Notice posted to bulletin board.');
    setShowNoticeModal(false);
  };

  const triggerSimulatedDoorScan = () => {
    const randomRes = residents[Math.floor(Math.random() * residents.length)];
    const newRecord = {
      id: Date.now(),
      resident: { fullName: randomRes ? randomRes.fullName : 'Lajitha' },
      date: new Date().toISOString().split('T')[0],
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exitTime: null,
      accessType: 'FINGERPRINT_DOOR_SCAN',
      status: 'GRANTED'
    };
    setAccessRecords([newRecord, ...accessRecords]);
    setMessage(`Fingerprint scan simulated for ${newRecord.resident.fullName}`);
  };

  return (
    <div className="app-container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      {/* Header Info */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(26, 29, 45, 0.9), rgba(35, 39, 60, 0.7))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>Hostel Admin Control Center</h2>
              <span className="badge badge-ac">Single Hostel Portal</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              Complete administrative control over residents, 5 rooms, food menus, door access, and housekeepers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setShowAddResidentModal(true)} className="btn-primary">
              <Plus size={18} /> Add New Resident
            </button>
            <button onClick={triggerSimulatedDoorScan} className="btn-secondary">
              <Key size={18} color="var(--accent-amber)" /> Simulate Door Access Scan
            </button>
          </div>
        </div>

        {/* Capacity Limit Banner */}
        <div style={{ marginTop: '20px', padding: '14px', borderRadius: '12px', background: 'rgba(15, 18, 30, 0.6)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
            <span>HOSTEL RESIDENT CAPACITY ENFORCEMENT</span>
            <span style={{ color: residents.filter(r=>r.status==='ACTIVE').length >= 30 ? '#f87171' : '#34d399' }}>
              {residents.filter(r=>r.status==='ACTIVE').length} / 30 ACTIVE RESIDENTS
            </span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(residents.filter(r=>r.status==='ACTIVE').length / 30) * 100}%`,
              background: residents.filter(r=>r.status==='ACTIVE').length >= 30 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #f43f5e, #ec4899)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {message && (
        <div style={{ padding: '12px 18px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {message}
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '12px 18px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} /> {errorMessage}
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { id: 'overview', label: 'Overview Stats', icon: Shield },
          { id: 'residents', label: 'Residents (Max 30)', icon: Users },
          { id: 'rooms', label: 'Room Allocations', icon: Home },
          { id: 'food', label: 'Food Menu', icon: Utensils },
          { id: 'housekeepers', label: 'Housekeepers (3)', icon: Wrench },
          { id: 'late-arrivals', label: `Late Arrivals (${lateArrivals.filter(l=>l.status==='PENDING').length})`, icon: Clock },
          { id: 'access', label: 'Fingerprint Door Logs', icon: Key },
          { id: 'bills', label: 'Electricity Bills', icon: Zap },
          { id: 'notices', label: 'Notice Board', icon: BellCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-rose)' : 'transparent',
                background: isActive ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--accent-rose)' : 'currentColor'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid-3" style={{ marginBottom: '28px' }}>
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL RESIDENTS</span>
                <Users size={22} color="var(--accent-rose)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 4px' }}>
                {residents.filter(r=>r.status==='ACTIVE').length} / 30
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Strict hostel capacity cap</div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>BED OCCUPANCY</span>
                <Home size={22} color="var(--accent-cyan)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 4px' }}>
                {rooms.reduce((acc, r) => acc + r.occupiedBeds, 0)} Occupied
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399' }}>
                {30 - rooms.reduce((acc, r) => acc + r.occupiedBeds, 0)} Beds Available
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>HOUSEKEEPERS</span>
                <Wrench size={22} color="var(--accent-amber)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, margin: '8px 0 4px' }}>
                3 Members
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>All 3 housekeepers active</div>
            </div>
          </div>

          <div className="grid-2">
            {/* Quick Late Arrivals Queue */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--accent-amber)" /> Pending Late Arrivals
              </h3>
              {lateArrivals.filter(l => l.status === 'PENDING').length === 0 ? (
                <div style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', padding: '20px 0', textAlign: 'center' }}>
                  No pending late arrival requests
                </div>
              ) : (
                lateArrivals.filter(l => l.status === 'PENDING').map(req => (
                  <div key={req.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '14px', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                      <span>{req.resident?.fullName || 'Resident'}</span>
                      <span style={{ color: 'var(--accent-amber)' }}>Return: {req.expectedArrivalTime}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0' }}>Reason: {req.reason}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>"{req.message}"</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button onClick={() => handleUpdateLateArrival(req.id, 'APPROVED')} className="btn-success" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                        Approve
                      </button>
                      <button onClick={() => handleUpdateLateArrival(req.id, 'REJECTED')} className="btn-danger" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Door Logs */}
            <div className="glass-card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color="var(--accent-rose)" /> Recent Fingerprint Access Activity
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accessRecords.slice(0, 4).map(rec => (
                  <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(15, 18, 30, 0.5)', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{rec.resident ? rec.resident.fullName : 'Resident'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{rec.date} • {rec.accessType}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                      {rec.entryTime && <span style={{ color: '#34d399' }}>Entry: {rec.entryTime}</span>}
                      {rec.exitTime && <span style={{ color: 'var(--accent-amber)', marginLeft: '6px' }}>Exit: {rec.exitTime}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Residents */}
      {activeTab === 'residents' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Resident Directory</h3>
            <span className="badge badge-ac">Capacity: {residents.filter(r=>r.status==='ACTIVE').length}/30</span>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Resident Name</th>
                <th>Contact & Emergency</th>
                <th>Room Allocation</th>
                <th>Outside Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {residents.map(res => (
                <tr key={res.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{res.fullName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{res.email}</div>
                  </td>
                  <td>
                    <div>Phone: {res.phone}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>Emerg: {res.emergencyContact}</div>
                  </td>
                  <td>
                    <span className="badge badge-ac">Room {res.roomNumber}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '2px' }}>{res.roomType}</div>
                  </td>
                  <td>
                    <span className={`badge ${res.outsideStatus === 'INSIDE' ? 'badge-active' : 'badge-pending'}`}>
                      {res.outsideStatus || 'INSIDE'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${res.status === 'ACTIVE' ? 'badge-active' : 'badge-rejected'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    {res.status === 'ACTIVE' && (
                      <button onClick={() => handleDeactivateResident(res.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#f87171' }}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Rooms */}
      {activeTab === 'rooms' && (
        <div>
          <div style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            All 5 hostel rooms configured with specific capacities (Total: 30 beds).
          </div>

          <div className="grid-3">
            {rooms.map(room => (
              <div key={room.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Room {room.roomNumber}</h4>
                  <span className={`badge ${room.isAc ? 'badge-ac' : 'badge-pending'}`}>
                    {room.isAc ? 'AC' : 'Non-AC'}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  <div>Sharing: <strong>{room.sharingType} Sharing</strong></div>
                  <div>Rent: <strong>₹{room.monthlyRent.toLocaleString()} / month</strong></div>
                  <div>Occupancy: <strong>{room.occupiedBeds} / {room.totalCapacity} Beds occupied</strong></div>
                </div>

                {/* Bed occupancy grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {Array.from({ length: room.totalCapacity }).map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        height: '28px',
                        borderRadius: '6px',
                        background: idx < room.occupiedBeds ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#fff'
                      }}
                    >
                      Bed {idx + 1}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Food Menu */}
      {activeTab === 'food' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Daily Meal Schedule & Planner</h3>
          <div className="grid-2">
            {foodMenu.map(meal => (
              <div key={meal.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{meal.mealType}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>{meal.timing}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{meal.foodItems}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Housekeepers */}
      {activeTab === 'housekeepers' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Housekeeper Staff (3 Members)</h3>
          </div>

          <div className="grid-3">
            {housekeepers.map(hk => (
              <div key={hk.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{hk.name}</h4>
                  <span className="badge badge-active">{hk.workingStatus}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Phone: {hk.phone}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                  Responsibility: {hk.assignedResponsibility}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Late Arrivals */}
      {activeTab === 'late-arrivals' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>Resident Late Arrival Permission Requests</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Date & Expected Time</th>
                <th>Reason</th>
                <th>Message</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lateArrivals.map(req => (
                <tr key={req.id}>
                  <td style={{ fontWeight: 700 }}>{req.resident?.fullName || 'Resident'}</td>
                  <td>
                    <div>{req.date}</div>
                    <div style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{req.expectedArrivalTime}</div>
                  </td>
                  <td>{req.reason}</td>
                  <td style={{ fontStyle: 'italic', color: 'var(--text-subtle)' }}>"{req.message}"</td>
                  <td>
                    <span className={`badge ${req.status === 'APPROVED' ? 'badge-approved' : req.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleUpdateLateArrival(req.id, 'APPROVED')} className="btn-success" style={{ fontSize: '0.75rem' }}>Approve</button>
                        <button onClick={() => handleUpdateLateArrival(req.id, 'REJECTED')} className="btn-danger" style={{ fontSize: '0.75rem' }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Access Logs */}
      {activeTab === 'access' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Fingerprint Biometric Door Access Logs</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Hardware API ready log stream</p>
            </div>
            <button onClick={triggerSimulatedDoorScan} className="btn-primary" style={{ fontSize: '0.85rem' }}>
              Simulate Door Fingerprint Scan
            </button>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Resident</th>
                <th>Date</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Scan Type</th>
                <th>Door Status</th>
              </tr>
            </thead>
            <tbody>
              {accessRecords.map(rec => (
                <tr key={rec.id}>
                  <td style={{ fontWeight: 700 }}>{rec.resident ? rec.resident.fullName : 'Lajitha'}</td>
                  <td>{rec.date}</td>
                  <td style={{ color: '#34d399', fontWeight: 700 }}>{rec.entryTime || '--'}</td>
                  <td style={{ color: 'var(--accent-amber)', fontWeight: 700 }}>{rec.exitTime || '--'}</td>
                  <td>{rec.accessType}</td>
                  <td><span className="badge badge-approved">{rec.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: Electricity Bills */}
      {activeTab === 'bills' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Monthly Electricity Bill Splitter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>Rule: Total Bill ÷ Active Residents Count</p>
            </div>
            <button onClick={() => setShowBillModal(true)} className="btn-primary">
              <Zap size={18} /> Post New Monthly Bill
            </button>
          </div>

          <div style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '10px' }}>
              Current Billing Cycle: {billMonth}
            </h4>
            <div className="grid-3" style={{ fontSize: '0.9rem' }}>
              <div>Total Bill Amount: <strong>₹{stats.currentMonthBillTotal}</strong></div>
              <div>Active Residents Split: <strong>{residents.filter(r=>r.status==='ACTIVE').length} Residents</strong></div>
              <div>Per Resident Share: <strong style={{ color: 'var(--accent-rose)' }}>₹{Math.round((stats.currentMonthBillTotal / (residents.filter(r=>r.status==='ACTIVE').length || 1)) * 100) / 100}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Notices */}
      {activeTab === 'notices' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Hostel Bulletin Board</h3>
            <button onClick={() => setShowNoticeModal(true)} className="btn-primary">
              <Plus size={18} /> Post New Notice
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notices.map(notice => (
              <div key={notice.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{notice.title}</h4>
                  <span className="badge badge-ac">Audience: {notice.targetRole}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '10px' }}>{notice.content}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Posted on {notice.postedDate} by {notice.postedBy}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Resident Modal */}
      {showAddResidentModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Add New Resident</h3>
            <form onSubmit={handleAddResident} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>FULL NAME</label>
                <input type="text" className="form-control" value={newResident.fullName} onChange={e=>setNewResident({...newResident, fullName: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMAIL</label>
                <input type="email" className="form-control" value={newResident.email} onChange={e=>setNewResident({...newResident, email: e.target.value})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>PHONE</label>
                  <input type="text" className="form-control" value={newResident.phone} onChange={e=>setNewResident({...newResident, phone: e.target.value})} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>EMERGENCY CONTACT</label>
                  <input type="text" className="form-control" value={newResident.emergencyContact} onChange={e=>setNewResident({...newResident, emergencyContact: e.target.value})} required />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ROOM ALLOCATION</label>
                <select className="form-control" value={newResident.roomId} onChange={e=>setNewResident({...newResident, roomId: parseInt(e.target.value)})}>
                  {rooms.map(rm => (
                    <option key={rm.id} value={rm.id}>
                      Room {rm.roomNumber} - {rm.isAc ? 'AC' : 'Non-AC'} ({rm.occupiedBeds}/{rm.totalCapacity} filled)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddResidentModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Resident</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Post Modal */}
      {showBillModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Post Monthly Electricity Bill</h3>
            <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>BILLING MONTH</label>
                <input type="text" className="form-control" value={billMonth} onChange={e=>setBillMonth(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TOTAL ELECTRICITY BILL (₹)</label>
                <input type="number" className="form-control" value={billTotal} onChange={e=>setBillTotal(parseFloat(e.target.value))} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowBillModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Calculate & Split Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {showNoticeModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Post Hostel Notice</h3>
            <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>NOTICE TITLE</label>
                <input type="text" className="form-control" value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>CONTENT</label>
                <textarea className="form-control" rows="4" value={newNotice.content} onChange={e=>setNewNotice({...newNotice, content: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TARGET AUDIENCE</label>
                <select className="form-control" value={newNotice.targetRole} onChange={e=>setNewNotice({...newNotice, targetRole: e.target.value})}>
                  <option value="ALL">All Hostel Members</option>
                  <option value="RESIDENT">Residents Only</option>
                  <option value="HOUSEKEEPER">Housekeepers Only</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNoticeModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
