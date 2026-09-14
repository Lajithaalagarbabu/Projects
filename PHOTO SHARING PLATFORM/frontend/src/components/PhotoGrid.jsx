import React, { useState } from 'react';
import PhotoCard from './PhotoCard';
import { X, Image as ImageIcon } from 'lucide-react';

export const PhotoGrid = ({
  photos = [],
  isAdmin = false,
  onToggleSelect,
  emptyMessage = 'No photos uploaded yet.'
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        color: 'var(--text-muted)'
      }}>
        <ImageIcon size={48} style={{ opacity: 0.4, marginBottom: '1rem', color: 'var(--primary)' }} />
        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Photos Found</h3>
        <p style={{ fontSize: '0.9rem' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="photo-grid">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isAdmin={isAdmin}
            onToggleSelect={onToggleSelect}
            onImageClick={(p) => setSelectedPhoto(p)}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="lightbox-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              title="Close Lightbox"
            >
              <X size={28} />
            </button>
            <img
              src={selectedPhoto.storageUrl}
              alt={selectedPhoto.filename}
              className="lightbox-img"
            />
            <div style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 500
            }}>
              {selectedPhoto.filename}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGrid;
