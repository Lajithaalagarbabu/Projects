import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Home, LogOut, User, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return <span className="badge badge-ac">ADMIN PORTAL</span>;
      case 'ROLE_HOUSEKEEPER':
        return <span className="badge badge-pending">HOUSEKEEPER</span>;
      default:
        return <span className="badge badge-active">RESIDENT</span>;
    }
  };

  return (
    <header style={{
      background: 'rgba(15, 18, 30, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(244, 63, 94, 0.4)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(to right, #ffffff, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Om Sakthi Saranalayam Ladies Hostel
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
              Private Hostel Management System
            </span>
          </div>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                {getRoleBadge(user.role)}
              </div>
            </div>

            <button onClick={logout} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
