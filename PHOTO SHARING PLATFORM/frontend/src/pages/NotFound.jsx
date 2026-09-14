import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Home } from 'lucide-react';
import '../styles/auth.css';

export const NotFound = () => {
  return (
    <div className="auth-container">
      <div className="auth-card card" style={{ textAlign: 'center' }}>
        <Camera size={56} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>404</h1>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Page Not Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          The page or gallery link you are looking for does not exist or has been removed.
        </p>
        <Link to="/login" className="btn btn-primary">
          <Home size={18} />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
