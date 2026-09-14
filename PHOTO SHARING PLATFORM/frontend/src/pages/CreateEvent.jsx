import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import eventService from '../services/eventService';
import { Calendar, ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import '../styles/auth.css';

export const CreateEvent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newEvent = await eventService.createEvent({
        name,
        description,
        eventDate: eventDate || null,
      });
      navigate(`/admin/events/${newEvent.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/admin/dashboard" className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="dashboard-title">Create New Event</h1>
          <p className="dashboard-subtitle">Setup a new photography event for team photo collection</p>
        </div>

        <div className="card">
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Arjun & Priya Wedding"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                className="form-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Description</label>
              <textarea
                className="form-input"
                rows="4"
                placeholder="Details about location, ceremony schedule, photo requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Link to="/admin/dashboard" className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                <Plus size={18} />
                <span>{loading ? 'Creating...' : 'Create Event'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
