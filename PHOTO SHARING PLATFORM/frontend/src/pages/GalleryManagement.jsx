import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import galleryService from '../services/galleryService';
import eventService from '../services/eventService';
import { Share2, Lock, CheckCircle2, Copy, ExternalLink, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import '../styles/dashboard.css';

export const GalleryManagement = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [gallery, setGallery] = useState(null);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const eventData = await eventService.getAdminEventById(eventId);
      setEvent(eventData);

      try {
        const galleryData = await galleryService.getGalleryByEvent(eventId);
        setGallery(galleryData);
      } catch (err) {
        // Gallery not created yet
        setGallery(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gallery details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateGallery = async (e) => {
    e.preventDefault();
    if (!pin) return;
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = await galleryService.createGallery(eventId, pin);
      setGallery(data);
      setSuccess('Gallery created successfully with PIN protection!');
      setPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup gallery PIN');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!gallery) return;
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const updated = await galleryService.publishGallery(gallery.id);
      setGallery(updated);
      setSuccess('Gallery published! Customers can now access it using the shareable link and PIN.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish gallery');
    } finally {
      setSubmitting(false);
    }
  };

  const getFullShareableUrl = () => {
    if (!gallery) return '';
    return `${window.location.origin}/gallery/${gallery.galleryCode}`;
  };

  const handleCopyLink = () => {
    const url = getFullShareableUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) return <><Navbar /><Loading text="Loading gallery configuration..." /></>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={`/admin/events/${eventId}`} className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Event Details</span>
          </Link>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Gallery Management</h1>
              <p className="dashboard-subtitle">Configure client access, set PIN protection, and publish shareable link for "{event?.name}"</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Current Stats Banner */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Selected Photos Attached</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {event?.selectedPhotos || 0} / {event?.totalPhotos || 0} Photos
            </div>
          </div>

          {event?.selectedPhotos === 0 && (
            <div style={{ color: 'var(--warning)', fontSize: '0.88rem', fontWeight: 600 }}>
              ⚠️ You must select at least 1 photo before creating/publishing gallery.
            </div>
          )}
        </div>

        {/* Setup PIN Form / Status */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} color="var(--primary)" />
            <span>{gallery ? 'Gallery PIN Protection' : '1. Create & Set Gallery PIN'}</span>
          </h3>

          <form onSubmit={handleCreateOrUpdateGallery}>
            <div className="form-group">
              <label className="form-label">Set 4 to 10 Digit Security PIN</label>
              <input
                type="password"
                className="form-input"
                placeholder={gallery ? 'Enter new PIN to update' : 'e.g. 482917'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={10}
                required={!gallery}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '0.35rem', display: 'block' }}>
                Note: PIN is securely hashed using BCrypt. Customers must enter this PIN to unlock the gallery.
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={submitting || event?.selectedPhotos === 0}
            >
              <ShieldCheck size={16} />
              <span>{submitting ? 'Saving PIN...' : gallery ? 'Update Security PIN' : 'Create Gallery & Save PIN'}</span>
            </button>
          </form>
        </div>

        {/* Gallery Publishing & Link Display */}
        {gallery && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Share2 size={20} color="var(--accent)" />
              <span>2. Publish & Share Link</span>
            </h3>

            <div style={{ padding: '1rem', background: 'rgba(10, 13, 20, 0.6)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
                {gallery.published ? (
                  <span className="badge badge-published">Live & Published</span>
                ) : (
                  <span className="badge badge-draft">Draft (Unpublished)</span>
                )}
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Shareable Customer URL:
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  readOnly
                  value={getFullShareableUrl()}
                  style={{ fontSize: '0.9rem', color: 'var(--primary)' }}
                />
                <button onClick={handleCopyLink} className="btn btn-secondary btn-sm" title="Copy URL">
                  <Copy size={16} />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <a
                  href={getFullShareableUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  title="Open Preview"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {!gallery.published && (
              <button
                onClick={handlePublish}
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={submitting}
              >
                <Share2 size={18} />
                <span>{submitting ? 'Publishing...' : 'Publish Customer Gallery Now'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default GalleryManagement;
