import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import PhotoGrid from '../components/PhotoGrid';
import photoService from '../services/photoService';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import '../styles/dashboard.css';
import '../styles/gallery.css';

export const MyPhotos = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPhotos();
  }, []);

  const fetchMyPhotos = async () => {
    try {
      setLoading(true);
      const data = await photoService.getMyPhotos();
      setPhotos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch uploaded photos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <><Navbar /><Loading text="Loading your uploaded photos..." /></>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/team/dashboard" className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">My Uploaded Photographs</h1>
              <p className="dashboard-subtitle">All event photos uploaded by your account ({photos.length} total)</p>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <PhotoGrid
          photos={photos}
          isAdmin={false}
          emptyMessage="You have not uploaded any photographs yet. Select an assigned event from your dashboard to begin uploading."
        />
      </div>
    </>
  );
};

export default MyPhotos;
