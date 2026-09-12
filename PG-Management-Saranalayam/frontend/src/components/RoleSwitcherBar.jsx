import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, UserCheck, Wrench } from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.15), rgba(139, 92, 246, 0.15))',
      borderBottom: '1px solid rgba(244, 63, 94, 0.2)',
      padding: '8px 24px',
      fontSize: '0.82rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>⚡ Interactive Demo Portal:</span>
        <span>Easily switch view roles to test feature permissions!</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => switchRole('ADMIN')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: user.role === 'ROLE_ADMIN' ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <ShieldCheck size={14} /> Admin Portal
        </button>

        <button
          onClick={() => switchRole('RESIDENT')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: user.role === 'ROLE_RESIDENT' ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <UserCheck size={14} /> Resident Portal
        </button>

        <button
          onClick={() => switchRole('HOUSEKEEPER')}
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: user.role === 'ROLE_HOUSEKEEPER' ? 'var(--accent-rose)' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Wrench size={14} /> Housekeeper Portal
        </button>
      </div>
    </div>
  );
};
