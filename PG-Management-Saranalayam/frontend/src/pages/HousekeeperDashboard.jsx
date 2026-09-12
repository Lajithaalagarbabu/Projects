import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Wrench, CheckCircle, Clock, Bell, AlertCircle, Check } from 'lucide-react';

export const HousekeeperDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks');

  const [profile] = useState({
    name: user ? user.name : 'Lakshmi Devi',
    phone: '9876543210',
    assignedResponsibility: 'Ground Floor & Room 101/102 Cleaning'
  });

  const [tasks, setTasks] = useState([
    { id: 1, taskDescription: 'Sanitize Room 101 AC Filters & Deep Clean', roomNumber: '101', status: 'PENDING', assignedDate: '2026-09-11' },
    { id: 2, taskDescription: 'Mop Ground Floor Corridor & Entrance Mat', roomNumber: 'Ground', status: 'COMPLETED', assignedDate: '2026-09-11' },
    { id: 3, taskDescription: 'Clean Dining Area & Wash Basins post Lunch', roomNumber: 'Dining', status: 'PENDING', assignedDate: '2026-09-11' }
  ]);

  const [notices, setNotices] = useState([
    { id: 1, title: 'Weekly Deep Cleaning Schedule', content: 'Housekeepers will perform deep cleaning of common areas and bathrooms on Sunday 9 AM.', postedDate: '2026-09-11' },
    { id: 2, title: 'Hostel Gate Timings Reminder', content: 'All residents must return to the hostel by 10:00 PM.', postedDate: '2026-09-11' }
  ]);

  const [msg, setMsg] = useState('');

  const toggleTaskStatus = async (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
        setMsg(`Task status updated to ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    try {
      await api.put(`/housekeeper/tasks/${id}/status`, { status: 'COMPLETED' });
    } catch (e) {}
  };

  return (
    <div className="app-container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      {/* Welcome Banner */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(244, 63, 94, 0.15))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome, {profile.name}!</h2>
              <span className="badge badge-pending">HOUSEKEEPER</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Assigned Focus: {profile.assignedResponsibility}
            </p>
          </div>
          <span className="badge badge-ac" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
            Restricted Staff Portal
          </span>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '12px 18px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={18} /> {msg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('tasks')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid',
            borderColor: activeTab === 'tasks' ? 'var(--accent-amber)' : 'transparent',
            background: activeTab === 'tasks' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'tasks' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Wrench size={16} color="var(--accent-amber)" /> My Cleaning & Maintenance Duties ({tasks.filter(t=>t.status==='PENDING').length} Pending)
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid',
            borderColor: activeTab === 'notices' ? 'var(--accent-amber)' : 'transparent',
            background: activeTab === 'notices' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'notices' ? '#fff' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Bell size={16} color="var(--accent-amber)" /> Hostel Notices
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Daily Assigned Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {tasks.map(task => (
              <div key={task.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>{task.taskDescription}</span>
                    <span className="badge badge-ac">Location: {task.roomNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Assigned: {task.assignedDate}</div>
                </div>

                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className={task.status === 'COMPLETED' ? 'btn-success' : 'btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle size={16} /> {task.status === 'COMPLETED' ? 'COMPLETED' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Hostel Bulletins</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notices.map(n => (
              <div key={n.id} style={{ background: 'rgba(15, 18, 30, 0.6)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '6px' }}>{n.title}</h4>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{n.content}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '8px' }}>Posted on {n.postedDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
