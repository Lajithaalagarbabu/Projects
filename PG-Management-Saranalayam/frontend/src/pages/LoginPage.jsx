import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Shield, User, Wrench, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@ladieshostel.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message || 'Invalid credentials');
    }
  };

  const setPreset = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 16px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-rose), var(--accent-pink))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)'
          }}>
            <Sparkles size={30} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Hostel Portal Login</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Om Sakthi Saranalayam Ladies Hostel • Capacity: 30 Residents
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@ladieshostel.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Authenticating...' : <>Login to Hostel Portal <ArrowRight size={18} /></>}
          </button>
        </form>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', textAlign: 'center', marginBottom: '12px', letterSpacing: '0.5px' }}>
            QUICK DEMO ACCESSIBILITY PRESETS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setPreset('admin@ladieshostel.com', 'admin123')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', fontSize: '0.82rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} color="var(--accent-rose)" /> Admin Portal Demo
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>admin@ladieshostel.com</span>
            </button>

            <button
              onClick={() => setPreset('lajitha@ladieshostel.com', 'resident123')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', fontSize: '0.82rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="var(--accent-emerald)" /> Resident Portal Demo
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>lajitha@ladieshostel.com</span>
            </button>

            <button
              onClick={() => setPreset('lakshmi@ladieshostel.com', 'hk123')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'space-between', padding: '8px 12px', fontSize: '0.82rem' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wrench size={16} color="var(--accent-amber)" /> Housekeeper Demo
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>lakshmi@ladieshostel.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
