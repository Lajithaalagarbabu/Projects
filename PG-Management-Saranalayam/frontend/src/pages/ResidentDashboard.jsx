import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  User, Home, Utensils, Clock, Key, Zap, Bell, CheckCircle, 
  Send, Compass, CreditCard, ShieldAlert, Sparkles, Check
} from 'lucide-react';

export const ResidentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [profile, setProfile] = useState({
    id: 1,
    fullName: user ? user.name : 'Lajitha',
    email: user ? user.email : 'lajitha@ladieshostel.com',
    phone: '9123456780',
    emergencyContact: '9988776655',
    address: '123 Main Street, City',
    joiningDate: '2026-07-01',
    roomNumber: '101',
    roomType: 'AC (8 Sharing)',
    status: 'ACTIVE',
    outsideStatus: 'INSIDE',
    expectedReturnTime: ''
  });

  const [roommates, setRoommates] = useState([
    { name: 'Kavitha M', phone: '9123456781', status: 'Inside' },
    { name: 'Lajitha (You)', phone: '9123456780', status: 'Inside' }
  ]);

  const [todayFood, setTodayFood] = useState([
    { id: 1, mealType: 'BREAKFAST', foodItems: 'Idli, Vada, Chutney, Sambar, Tea / Coffee', timing: '8:00 AM - 9:00 AM' },
    { id: 2, mealType: 'LUNCH', foodItems: 'Rice, Chapati, Dal Fry, Ladyfinger Poriyal, Curd', timing: '12:30 PM - 2:00 PM' },
    { id: 3, mealType: 'SNACKS', foodItems: 'Samosa / Masala Sundal, Coffee / Milk', timing: '5:00 PM - 6:00 PM' },
    { id: 4, mealType: 'DINNER', foodItems: 'Phulka, Paneer Butter Masala, Jeera Rice, Rasam', timing: '7:30 PM - 9:00 PM' }
  ]);

  const [lateRequests, setLateRequests] = useState([
    { id: 1, date: '2026-09-11', expectedArrivalTime: '11:30 PM', reason: 'College Work', message: 'I will reach the hostel around 11:30 PM.', status: 'APPROVED' }
  ]);

  const [myBill, setMyBill] = useState({
    billingMonth: 'August 2026',
    amount: 200,
    status: 'UNPAID',
    paymentDate: null
  });

  const [myAccessLogs, setMyAccessLogs] = useState([
    { id: 1, date: '2026-09-11', entryTime: '08:15 AM', exitTime: '09:30 AM', accessType: 'FINGERPRINT_DOOR_SCAN', status: 'GRANTED' },
    { id: 2, date: '2026-09-10', entryTime: '07:45 PM', exitTime: '08:30 AM', accessType: 'FINGERPRINT_DOOR_SCAN', status: 'GRANTED' }
  ]);

  const [notices, setNotices] = useState([
    { id: 1, title: 'Hostel Gate Timings Reminder', content: 'All residents must return to the hostel by 10:00 PM.', postedDate: '2026-09-11' },
    { id: 2, title: 'August Electricity Bill Split', content: 'Total bill ₹6000 split equally (₹200 per resident). Please pay in your portal.', postedDate: '2026-09-11' }
  ]);

  // Form States
  const [lateForm, setLateForm] = useState({ date: new Date().toISOString().split('T')[0], expectedArrivalTime: '11:30 PM', reason: 'College Work', message: '' });
  const [outsideReturnTime, setOutsideReturnTime] = useState('10:00 PM');
  const [notificationMsg, setNotificationMsg] = useState('');

  useEffect(() => {
    fetchResidentData();
  }, [user]);

  const fetchResidentData = async () => {
    if (!user) return;
    try {
      const profRes = await api.get(`/resident/profile/${user.id}`);
      if (profRes.data) setProfile(profRes.data);

      const foodRes = await api.get('/resident/food/today');
      if (foodRes.data && foodRes.data.length > 0) setTodayFood(foodRes.data);

      const reqRes = await api.get(`/resident/late-arrival/${user.id}`);
      if (reqRes.data) setLateRequests(reqRes.data);

      const billRes = await api.get(`/resident/bill/${user.id}`);
      if (billRes.data && billRes.data.payment) {
        setMyBill({
          billingMonth: billRes.data.latestBill ? billRes.data.latestBill.billingMonth : 'August 2026',
          amount: billRes.data.payment.amount,
          status: billRes.data.payment.paymentStatus,
          paymentDate: billRes.data.payment.paymentDate
        });
      }

      const accessRes = await api.get(`/resident/access-history/${user.id}`);
      if (accessRes.data) setMyAccessLogs(accessRes.data);

      const noticeRes = await api.get('/resident/notices');
      if (noticeRes.data) setNotices(noticeRes.data);
    } catch (e) {
      console.log('Using pre-populated resident demo state');
    }
  };

  const handleToggleOutsideStatus = async (newStatus) => {
    setProfile({ ...profile, outsideStatus: newStatus, expectedReturnTime: newStatus === 'OUTSIDE' ? outsideReturnTime : '' });
    setNotificationMsg(`Outside status updated to: ${newStatus}`);
    try {
      await api.put(`/resident/outside-status/${user ? user.id : 1}`, {
        outsideStatus: newStatus,
        expectedReturnTime: newStatus === 'OUTSIDE' ? outsideReturnTime : ''
      });
    } catch (e) {}
  };

  const handleSubmitLateArrival = async (e) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      ...lateForm,
      status: 'PENDING'
    };
    setLateRequests([newReq, ...lateRequests]);
    setNotificationMsg('Late arrival permission request submitted to Admin!');
    setLateForm({ date: new Date().toISOString().split('T')[0], expectedArrivalTime: '11:30 PM', reason: 'College Work', message: '' });
    try {
      await api.post(`/resident/late-arrival/${user ? user.id : 1}`, lateForm);
    } catch (e) {}
  };

  const handlePayNow = async () => {
    const today = new Date().toISOString().split('T')[0];
    setMyBill({
      ...myBill,
      status: 'PAID',
      paymentDate: today
    });
    setNotificationMsg('Payment of ₹' + myBill.amount + ' completed successfully!');
    try {
      await api.post('/resident/pay/1', { transactionRef: 'PAY-UPI-' + Date.now() });
    } catch (e) {}
  };

  return (
    <div className="app-container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      {/* Resident Welcome Banner */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(139, 92, 246, 0.15))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome back, {profile.fullName}!</h2>
              <span className="badge badge-active">RESIDENT PORTAL</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Room {profile.roomNumber} • {profile.roomType} • Status: {profile.outsideStatus}
            </p>
          </div>

          {/* Quick Outside Status Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 18, 30, 0.6)', padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Compass size={20} color="var(--accent-rose)" />
            <div style={{ fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700 }}>Hostel Status:</div>
              <div style={{ color: profile.outsideStatus === 'INSIDE' ? '#34d399' : 'var(--accent-amber)', fontWeight: 800 }}>
                {profile.outsideStatus}
              </div>
            </div>

            {profile.outsideStatus === 'INSIDE' ? (
              <button onClick={() => handleToggleOutsideStatus('OUTSIDE')} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                Going Outside
              </button>
            ) : (
              <button onClick={() => handleToggleOutsideStatus('INSIDE')} className="btn-success" style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                Returned to Hostel
              </button>
            )}
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div style={{ padding: '12px 18px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {notificationMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { id: 'dashboard', label: 'My Dashboard', icon: User },
          { id: 'food', label: `Today's Food Menu`, icon: Utensils },
          { id: 'late-arrival', label: 'Late Arrival Request', icon: Clock },
          { id: 'bill', label: 'Electricity Bill', icon: Zap },
          { id: 'access', label: 'My Access Logs', icon: Key },
          { id: 'notices', label: 'Hostel Notices', icon: Bell },
        ].map(tab => {
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

      {/* TAB 1: Dashboard & Profile */}
      {activeTab === 'dashboard' && (
        <div className="grid-2">
          {/* Profile Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--accent-rose)" /> Personal Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
                <strong>{profile.fullName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <strong>{profile.email}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
                <strong>{profile.phone}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Emergency Contact:</span>
                <strong>{profile.emergencyContact}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                <strong>{profile.address}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Joining Date:</span>
                <strong>{profile.joiningDate}</strong>
              </div>
            </div>
          </div>

          {/* Room Details & Roommates */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={20} color="var(--accent-cyan)" /> My Room & Roommates
            </h3>

            <div style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '16px', borderRadius: '12px', marginBottom: '18px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Room {profile.roomNumber}</span>
                <span className="badge badge-ac">{profile.roomType}</span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px' }}>MY ROOMMATES</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {roommates.map((rm, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(15, 18, 30, 0.4)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rm.name}</div>
                  <span className="badge badge-active">{rm.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Food Menu */}
      {activeTab === 'food' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Utensils size={20} color="var(--accent-rose)" /> Today's Hostel Meal Menu
          </h3>

          <div className="grid-2">
            {todayFood.map(meal => (
              <div key={meal.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{meal.mealType}</span>
                  <span className="badge badge-ac">{meal.timing}</span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>{meal.foodItems}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Late Arrival Request */}
      {activeTab === 'late-arrival' && (
        <div className="grid-2">
          {/* Submit Request Form */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>Submit Late Arrival Request</h3>
            <form onSubmit={handleSubmitLateArrival} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>DATE</label>
                <input type="date" className="form-control" value={lateForm.date} onChange={e=>setLateForm({...lateForm, date: e.target.value})} required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>EXPECTED ARRIVAL TIME</label>
                <input type="text" className="form-control" value={lateForm.expectedArrivalTime} onChange={e=>setLateForm({...lateForm, expectedArrivalTime: e.target.value})} placeholder="e.g. 11:30 PM" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>REASON</label>
                <input type="text" className="form-control" value={lateForm.reason} onChange={e=>setLateForm({...lateForm, reason: e.target.value})} placeholder="e.g. College Work / Office Shift" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>MESSAGE FOR ADMIN</label>
                <textarea className="form-control" rows="3" value={lateForm.message} onChange={e=>setLateForm({...lateForm, message: e.target.value})} placeholder="Describe details..." />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                <Send size={18} /> Submit Permission Request
              </button>
            </form>
          </div>

          {/* Request Status History */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>My Request History & Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lateRequests.map(req => (
                <div key={req.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>{req.date}</span>
                    <span className={`badge ${req.status === 'APPROVED' ? 'badge-approved' : req.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Expected: {req.expectedArrivalTime}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reason: {req.reason}</div>
                  {req.message && <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-subtle)', marginTop: '4px' }}>"{req.message}"</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Electricity Bill & Pay Now */}
      {activeTab === 'bill' && (
        <div className="glass-card" style={{ padding: '28px', maxWidth: '540px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={22} color="var(--accent-amber)" /> Monthly Electricity Bill Share
          </h3>

          <div style={{ background: 'rgba(15, 18, 30, 0.7)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 700, letterSpacing: '0.5px' }}>
              BILLING MONTH: {myBill.billingMonth}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: '12px 0 6px' }}>
              ₹{myBill.amount}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <span className={`badge ${myBill.status === 'PAID' ? 'badge-paid' : 'badge-unpaid'}`} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                STATUS: {myBill.status}
              </span>
            </div>

            {myBill.status === 'PAID' ? (
              <div style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '12px' }}>
                ✓ Payment completed on {myBill.paymentDate}
              </div>
            ) : (
              <button onClick={handlePayNow} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '12px' }}>
                <CreditCard size={20} /> PAY NOW (₹{myBill.amount})
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', textAlign: 'center' }}>
            Equal division billing rule applied across active hostel residents.
          </div>
        </div>
      )}

      {/* TAB 5: Access Logs (Private Only) */}
      {activeTab === 'access' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>My Personal Door Access History</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Private door fingerprint scan history (Only visible to you)</p>
            </div>
            <span className="badge badge-ac">Biometric Security</span>
          </div>

          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry Time</th>
                <th>Exit Time</th>
                <th>Access Method</th>
                <th>Door Status</th>
              </tr>
            </thead>
            <tbody>
              {myAccessLogs.map(rec => (
                <tr key={rec.id}>
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

      {/* TAB 6: Notices */}
      {activeTab === 'notices' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Hostel Announcements & Bulletins</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notices.map(notice => (
              <div key={notice.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-rose)', marginBottom: '6px' }}>{notice.title}</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '10px' }}>{notice.content}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Posted on {notice.postedDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
