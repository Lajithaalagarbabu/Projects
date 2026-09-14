import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import eventService from '../services/eventService';
import photoService from '../services/photoService';
import { Calendar, Upload, Image as ImageIcon, ArrowRight } from 'lucide-react';
import '../styles/dashboard.css';

export const TeamDashboard = () => {
  const [events, setEvents] = useState([]);
  const [myPhotos, setMyPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [eventsData, photosData] = await Promise.all([
        eventService.getTeamMemberEvents(),
        photoService.getMyPhotos(),
      ]);
      setEvents(eventsData);
      setMyPhotos(photosData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Photographer Dashboard</h1>
            <p className="dashboard-subtitle">View assigned events and upload event photographs</p>
          </div>
          <Link to="/team/photos" className="btn btn-secondary">
            <ImageIcon size={18} />
            <span>View All My Uploads</span>
          </Link>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-purple"><Calendar size={26} /></div>
            <div>
              <div className="stat-value">{events.length}</div>
              <div className="stat-label">Assigned Events</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-pink"><ImageIcon size={26} /></div>
            <div>
              <div className="stat-value">{myPhotos.length}</div>
              <div className="stat-label">My Uploaded Photos</div>
            </div>
          </div>
        </div>

        {/* Assigned Events */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>Assigned Events</h2>
        </div>

        {loading ? (
          <Loading text="Loading assigned events..." />
        ) : events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Calendar size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>No Events Assigned Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Your Lead Admin will assign you to events so you can upload photographs.
            </p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div>
                  <div className="event-card-header">
                    <h3 className="event-card-title">{event.name}</h3>
                    <span className="badge badge-team">Assigned</span>
                  </div>

                  <div className="event-card-date">
                    <Calendar size={14} />
                    <span>{event.eventDate || 'Date N/A'}</span>
                  </div>

                  <p className="event-card-desc">{event.description || 'No description provided.'}</p>
                </div>

                <div>
                  <div className="event-card-actions" style={{ marginTop: '1rem' }}>
                    <Link to={`/team/events/${event.id}/upload`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      <Upload size={15} />
                      <span>Upload Photos</span>
                    </Link>
                    <Link to={`/team/events/${event.id}`} className="btn btn-secondary btn-sm">
                      <ImageIcon size={15} />
                      <span>My Photos</span>
                    </Link>
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

export default TeamDashboard;
