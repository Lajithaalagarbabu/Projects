import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import eventService from '../services/eventService';
import { Calendar, Image as ImageIcon, CheckSquare, Share2, Plus, Users, ArrowRight, Trash2, Eye } from 'lucide-react';
import '../styles/dashboard.css';

export const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAdminEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this event? All associated photos and gallery data will be removed.')) {
      return;
    }
    try {
      await eventService.deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (err) {
      alert('Failed to delete event: ' + (err.response?.data?.message || err.message));
    }
  };

  const totalEvents = events.length;
  const totalPhotos = events.reduce((sum, e) => sum + (e.totalPhotos || 0), 0);
  const selectedPhotos = events.reduce((sum, e) => sum + (e.selectedPhotos || 0), 0);
  const publishedGalleries = events.filter((e) => e.galleryPublished === true).length;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage photography events, team assignments, and client galleries</p>
          </div>
          <Link to="/admin/events/new" className="btn btn-primary">
            <Plus size={18} />
            <span>Create New Event</span>
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <Calendar size={26} />
            </div>
            <div>
              <div className="stat-value">{totalEvents}</div>
              <div className="stat-label">Total Events</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-pink">
              <ImageIcon size={26} />
            </div>
            <div>
              <div className="stat-value">{totalPhotos}</div>
              <div className="stat-label">Total Photos Uploaded</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <CheckSquare size={26} />
            </div>
            <div>
              <div className="stat-value">{selectedPhotos}</div>
              <div className="stat-label">Selected Photos</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-amber">
              <Share2 size={26} />
            </div>
            <div>
              <div className="stat-value">{publishedGalleries}</div>
              <div className="stat-label">Published Galleries</div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Your Events</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {events.length} event(s)</span>
        </div>

        {loading ? (
          <Loading text="Loading your events..." />
        ) : events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Calendar size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Events Created Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Get started by creating your first event to manage photographers and client galleries.
            </p>
            <Link to="/admin/events/new" className="btn btn-primary">
              <Plus size={18} />
              <span>Create Event</span>
            </Link>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div>
                  <div className="event-card-header">
                    <h3 className="event-card-title">{event.name}</h3>
                    {event.galleryPublished ? (
                      <span className="badge badge-published">Published</span>
                    ) : event.galleryCode ? (
                      <span className="badge badge-draft">Gallery Ready</span>
                    ) : (
                      <span className="badge badge-draft">Draft</span>
                    )}
                  </div>

                  <div className="event-card-date">
                    <Calendar size={14} />
                    <span>{event.eventDate || 'Date N/A'}</span>
                  </div>

                  <p className="event-card-desc">{event.description || 'No description provided.'}</p>
                </div>

                <div>
                  <div className="event-card-stats">
                    <span><strong>{event.totalPhotos}</strong> Photos</span>
                    <span>•</span>
                    <span><strong>{event.selectedPhotos}</strong> Selected</span>
                    <span>•</span>
                    <span><strong>{event.teamMembersCount}</strong> Team Members</span>
                  </div>

                  <div className="event-card-actions">
                    <Link to={`/admin/events/${event.id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                      <Eye size={15} />
                      <span>Manage</span>
                    </Link>
                    <Link to={`/admin/events/${event.id}/photos`} className="btn btn-primary btn-sm">
                      <ImageIcon size={15} />
                      <span>Review</span>
                    </Link>
                    <Link to={`/admin/events/${event.id}/team`} className="btn btn-secondary btn-sm" title="Team">
                      <Users size={15} />
                    </Link>
                    <button
                      onClick={(e) => handleDeleteEvent(event.id, e)}
                      className="btn btn-danger btn-sm"
                      title="Delete Event"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
