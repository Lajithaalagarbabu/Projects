import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import PhotoGrid from '../components/PhotoGrid';
import photoService from '../services/photoService';
import eventService from '../services/eventService';
import { ArrowLeft, CheckSquare, Image as ImageIcon, Sparkles } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/gallery.css';

export const PhotoManagement = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEventAndPhotos();
  }, [eventId]);

  const loadEventAndPhotos = async () => {
    try {
      setLoading(true);
      const [eventData, photosData] = await Promise.all([
        eventService.getAdminEventById(eventId),
        photoService.getAdminPhotos(eventId),
      ]);
      setEvent(eventData);
      setPhotos(photosData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelect = async (photoId) => {
    try {
      const updatedPhoto = await photoService.togglePhotoSelection(photoId);
      setPhotos(photos.map((p) => (p.id === photoId ? updatedPhoto : p)));
    } catch (err) {
      alert('Failed to update selection: ' + (err.response?.data?.message || err.message));
    }
  };

  const selectedCount = photos.filter((p) => p.selected).length;

  if (loading) return <><Navbar /><Loading text="Loading event photo grid..." /></>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to={`/admin/events/${eventId}`} className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Event Details</span>
          </Link>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Review & Select Photos</h1>
              <p className="dashboard-subtitle">Select photographs to include in the published client gallery for "{event?.name}"</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="card" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckSquare size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  {selectedCount} / {photos.length} Selected
                </span>
              </div>
              <Link to={`/admin/events/${eventId}/gallery`} className="btn btn-primary">
                <Sparkles size={16} />
                <span>Create & Publish Gallery</span>
              </Link>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <PhotoGrid
          photos={photos}
          isAdmin={true}
          onToggleSelect={handleToggleSelect}
          emptyMessage="No photos uploaded for this event yet. Team members assigned to this event can upload photographs."
        />
      </div>
    </>
  );
};

export default PhotoManagement;
