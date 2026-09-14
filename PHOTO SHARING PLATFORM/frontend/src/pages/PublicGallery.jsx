import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import PhotoGrid from '../components/PhotoGrid';
import galleryService from '../services/galleryService';
import { Lock, Camera, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import '../styles/global.css';
import '../styles/gallery.css';

export const PublicGallery = () => {
  const { galleryCode } = useParams();
  const [galleryInfo, setGalleryInfo] = useState(null);
  const [pin, setPin] = useState('');
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInfo();
    // Check if session token exists in sessionStorage for this gallery
    const savedToken = sessionStorage.getItem(`gallery_token_${galleryCode}`);
    if (savedToken) {
      fetchPhotosWithToken(savedToken);
    }
  }, [galleryCode]);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const info = await galleryService.getPublicGalleryInfo(galleryCode);
      setGalleryInfo(info);
    } catch (err) {
      setError(err.response?.data?.message || 'Gallery not found or unpublished.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotosWithToken = async (token) => {
    try {
      const data = await galleryService.getPublicPhotos(galleryCode, token);
      setPhotos(data);
      setVerifiedToken(token);
    } catch (err) {
      sessionStorage.removeItem(`gallery_token_${galleryCode}`);
      setVerifiedToken(null);
    }
  };

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    if (!pin) return;

    setError('');
    setVerifying(true);

    try {
      const response = await galleryService.verifyPin(galleryCode, pin);
      if (response.verified && response.token) {
        sessionStorage.setItem(`gallery_token_${galleryCode}`, response.token);
        setVerifiedToken(response.token);
        await fetchPhotosWithToken(response.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect PIN. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <Loading text="Loading public gallery portal..." />;

  if (error && !galleryInfo && !verifiedToken) {
    return (
      <div className="pin-screen-container">
        <div className="pin-card card animate-fade-in">
          <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>Gallery Unavailable</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{error}</p>
        </div>
      </div>
    );
  }

  // STEP 1: PIN Protection Screen (if not verified)
  if (!verifiedToken) {
    return (
      <div className="pin-screen-container">
        <div className="pin-card card animate-fade-in" style={{ padding: '3rem 2.5rem' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '1.5rem',
            boxShadow: '0 0 25px var(--primary-glow)'
          }}>
            <Lock size={30} />
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem' }}>
            Protected Gallery
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.75rem' }}>
            Enter PIN to view photographs for <strong>"{galleryInfo?.eventName || 'Event'}"</strong>
          </p>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleVerifyPin}>
            <div className="pin-input-group">
              <input
                type="password"
                className="pin-input"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={10}
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              disabled={verifying}
            >
              <ShieldCheck size={18} />
              <span>{verifying ? 'Verifying PIN...' : 'View Gallery'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2: Photography Gallery View (once PIN verified)
  return (
    <div className="gallery-container animate-fade-in">
      <header className="gallery-hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>Official Event Gallery</span>
        </div>

        <h1 className="gallery-hero-title">{galleryInfo?.eventName || 'Photo Gallery'}</h1>
        
        <div className="gallery-hero-meta">
          <span>📸 {photos.length} Published Photograph(s)</span>
          <span>•</span>
          <span>🔒 PIN Protected</span>
        </div>
      </header>

      <main className="photo-grid-container">
        <PhotoGrid
          photos={photos}
          isAdmin={false}
          emptyMessage="No published photographs available in this gallery."
        />
      </main>
    </div>
  );
};

export default PublicGallery;
