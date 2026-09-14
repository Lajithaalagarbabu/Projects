import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import eventService from '../services/eventService';
import { Calendar, Users, Image as ImageIcon, Share2, ArrowLeft, CheckSquare, ExternalLink, Trash2 } from 'lucide-react';
import '../styles/dashboard.css';

export const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAdminEventById(eventId);
      setEvent(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await eventService.deleteEvent(eventId);
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <><Navbar /><Loading text="Loading event workspace..." /></>;

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2 style={{ marginBottom: '1rem', color: 'var(--danger)' }}>Error Loading Event</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Event not found'}</p>
            <Link to="/admin/dashboard" className="btn btn-secondary">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin/dashboard" className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Events</span>
          </Link>
          <div className="dashboard-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h1 className="dashboard-title">{event.name}</h1>
                {event.galleryPublished ? (
                  <span className="badge badge-published">Published</span>
                ) : (
                  <span className="badge badge-draft">Draft</span>
                )}
              </div>
              <p className="dashboard-subtitle">Created by {event.createdByName} • {event.eventDate || 'Date not set'}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleDelete} className="btn btn-danger">
                <Trash2 size={16} />
                <span>Delete Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple"><ImageIcon size={24} /></div>
            <div>
              <div className="stat-value">{event.totalPhotos}</div>
              <div className="stat-label">Uploaded Photos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green"><CheckSquare size={24} /></div>
            <div>
              <div className="stat-value">{event.selectedPhotos}</div>
              <div className="stat-label">Selected for Gallery</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-pink"><Users size={24} /></div>
            <div>
              <div className="stat-value">{event.teamMembersCount}</div>
              <div className="stat-label">Assigned Photographers</div>
            </div>
          </div>
        </div>

        {/* Quick Management Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          
          {/* Card 1: Team Management */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="stat-icon stat-icon-pink" style={{ width: 40, height: 40 }}><Users size={20} /></div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Team Management</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Add or remove team photographers who can upload photos for this event.
              </p>
            </div>
            <Link to={`/admin/events/${eventId}/team`} className="btn btn-secondary">
              <span>Manage Team Members ({event.teamMembersCount})</span>
            </Link>
          </div>

          {/* Card 2: Photo Selection */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="stat-icon stat-icon-purple" style={{ width: 40, height: 40 }}><ImageIcon size={20} /></div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Photo Review & Selection</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Review all team uploads and select the best shots to include in the client gallery.
              </p>
            </div>
            <Link to={`/admin/events/${eventId}/photos`} className="btn btn-primary">
              <span>Review Photos ({event.selectedPhotos} / {event.totalPhotos} selected)</span>
            </Link>
          </div>

          {/* Card 3: Gallery Publishing */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="stat-icon stat-icon-amber" style={{ width: 40, height: 40 }}><Share2 size={20} /></div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Gallery & Link Publishing</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Create PIN protection, publish gallery, and generate customer link.
              </p>
            </div>
            <Link to={`/admin/events/${eventId}/gallery`} className="btn btn-secondary">
              <span>{event.galleryPublished ? 'View Gallery Link & PIN' : 'Setup Gallery PIN & Publish'}</span>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default EventDetails;
