import React from 'react';
import { Check, User, HardDrive, Calendar } from 'lucide-react';

export const PhotoCard = ({
  photo,
  isAdmin = false,
  onToggleSelect,
  onImageClick
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`photo-card ${photo.selected ? 'selected' : ''}`}>
      <div className="photo-wrapper" onClick={() => onImageClick && onImageClick(photo)}>
        <img
          src={photo.storageUrl}
          alt={photo.filename}
          className="photo-img"
          loading="lazy"
        />
        <div className="photo-overlay">
          <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
            {photo.filename}
          </span>
        </div>

        {isAdmin && onToggleSelect && (
          <div className="photo-checkbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`photo-checkbox ${photo.selected ? 'selected' : ''}`}
              onClick={() => onToggleSelect(photo.id)}
              title={photo.selected ? 'Unselect Photo' : 'Select Photo for Gallery'}
            >
              {photo.selected && <Check size={16} color="#fff" strokeWidth={3} />}
            </button>
          </div>
        )}
      </div>

      <div className="photo-info">
        <span className="photo-filename" title={photo.filename}>
          {photo.filename}
        </span>
        
        <div className="photo-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <User size={12} />
            {photo.uploadedByName || 'Team Member'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <HardDrive size={12} />
            {formatFileSize(photo.fileSize)}
          </span>
        </div>

        {photo.createdAt && (
          <div className="photo-meta" style={{ marginTop: '0.25rem', color: 'var(--text-subtle)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={12} />
              {formatDate(photo.createdAt)}
            </span>
            {photo.selected && (
              <span className="badge badge-published" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                Selected
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCard;
