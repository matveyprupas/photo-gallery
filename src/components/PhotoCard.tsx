import React from 'react';

import type { Photo } from '../types/common';

import './PhotoCard.css';

interface PhotoCardProps {
  photo: Photo;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div className="photo-card">
      <div className="photo-wrapper">
        <img
          src={photo.download_url}
          alt={`Photo ${photo.id}`}
          className="photo-img"
          style={{
            width: `${photo.displayWidth}px`,
            height: `${photo.displayHeight}px`,
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/${photo.displayWidth}x${photo.displayHeight}/ef4444/ffffff?text=Error`;
          }}
        />
      </div>
      <p className="photo-author">{photo.author}</p>
    </div>
  );
};

export default PhotoCard;
