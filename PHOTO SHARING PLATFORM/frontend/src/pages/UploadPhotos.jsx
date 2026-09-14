import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import photoService from '../services/photoService';
import eventService from '../services/eventService';
import { Upload, ArrowLeft, Image as ImageIcon, X, Check, AlertCircle, HardDrive } from 'lucide-react';
import '../styles/dashboard.css';

export const UploadPhotos = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEventInfo();
  }, [eventId]);

  const fetchEventInfo = async () => {
    try {
      setLoading(true);
      const data = await eventService.getTeamMemberEventById(eventId);
      setEvent(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setError('');
    const validFiles = [];
    const newPreviews = [];

    for (let file of files) {
      // Validate file format
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setError(`File "${file.name}" has invalid type. Only JPG, JPEG, PNG, WEBP are allowed.`);
        continue;
      }

      // Validate size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" exceeds maximum size limit of 10MB.`);
        continue;
      }

      validFiles.push(file);
      newPreviews.push({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      });
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setError('Please select at least one photo file to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      await photoService.uploadPhotos(eventId, selectedFiles);
      setSuccess(`Successfully uploaded ${selectedFiles.length} photo(s) to Cloudinary & Event!`);
      setSelectedFiles([]);
      setPreviews([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please check file format and connection.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <><Navbar /><Loading text="Loading event upload portal..." /></>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/team/dashboard" className="nav-link" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Upload Event Photographs</h1>
              <p className="dashboard-subtitle">Event: "{event?.name}"</p>
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
            <Check size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Dropzone Container */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '3rem 2rem',
              textAlign: 'center',
              background: 'rgba(10, 13, 20, 0.4)',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)',
            }}
            onClick={() => document.getElementById('photo-input').click()}
          >
            <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Click to Select or Drop Images Here
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Supports multiple files (JPG, JPEG, PNG, WEBP) • Up to 10MB per file
            </p>
            <input
              id="photo-input"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Previews Grid */}
        {previews.length > 0 && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                Selected Files ({previews.length})
              </h3>
              <button
                type="button"
                onClick={() => { setSelectedFiles([]); setPreviews([]); }}
                className="btn btn-secondary btn-sm"
              >
                Clear All
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
              {previews.map((preview, index) => (
                <div
                  key={index}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: '#0a0d14',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <img src={preview.url} alt={preview.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      borderRadius: '50%',
                      padding: '4px',
                      border: 'none',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpload}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={uploading}
            >
              <Upload size={18} />
              <span>{uploading ? 'Uploading to Cloudinary...' : `Upload ${selectedFiles.length} Photo(s)`}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadPhotos;
