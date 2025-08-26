import PhotoCard from './PhotoCard';
import { useFetchPhotos } from '../hooks/useFetchPhotos';


import './PhotoGallery.css';
import { useBuildRows } from '../hooks/useBuildRows';


interface PhotoGalleryProps {
  gap?: number;
  targetRowHeight?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  gap = 8,
  targetRowHeight = 240,
}) => {
  const { photos, loaderRef, isLoading, hasMore } = useFetchPhotos();
  const { rows, containerRef } = useBuildRows({
    photos,
    gap,
    targetRowHeight,
  });

  return (
    <>
      <div ref={containerRef}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="gallery-row"
            style={{
              marginBottom: `${gap}px`,
              gap: `${gap}px`,
              height: `${row.height}px`,
            }}
          >
            {row.photos.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        ))}
      </div>

      <div className="loader-container" ref={loaderRef}>
        {isLoading && <p>Loading more content...</p>}
        {!hasMore && <p>You've reached the end! 👋</p>}
      </div>
    </>
  );
};

export default PhotoGallery;
