import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      gap: '1rem',
      color: 'var(--text-muted)'
    }}>
      <Loader2 className="animate-spin" size={38} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontWeight: 500, fontSize: '0.95rem' }}>{text}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
