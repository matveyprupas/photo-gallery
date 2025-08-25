import { useState, useEffect, useCallback, useRef } from 'react';
import PhotoCard from './PhotoCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

import type { Photo } from '../types/common';

import './PhotoGallery.css';

interface Row {
  photos: Photo[];
  height: number;
}

interface PhotoGalleryProps {
  gap?: number;
  targetRowHeight?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  gap = 8,
  targetRowHeight = 240,
}) => {
  const [rows, setRows] = useState<Row[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Memoized function to fetch photos from the API
  const fetchPhotos = useCallback(async () => {
    if (isLoading || !hasMore) return; // Prevent multiple fetches
    setIsLoading(true);

    console.log('inside fetchPhotos page', page);

    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=20`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newPhotos: Photo[] = await response.json();

      if (newPhotos.length === 0) {
        setHasMore(false); // No more photos to load
      } else {
        // Append new photos to the existing list, avoiding duplicates
        setPhotos((prevPhotos) => {
          const existingIds = new Set(prevPhotos.map((p) => p.id));
          const filteredPhotos = newPhotos.filter(
            (p) => !existingIds.has(p.id)
          );
          return [...prevPhotos, ...filteredPhotos];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // Fetch initial data on component mount
  useEffect(() => {
    console.log('PhotoGallery useEffect fire fetchPhotos');

    fetchPhotos();
  }, []); // The empty dependency array ensures this runs only once

  // Use the custom hook for the trigger element
  const loaderRef = useInfiniteScroll({
    onLoadMore: fetchPhotos,
    isLoading,
    hasMore,
    options: { rootMargin: '200px' }, // Load images 200px before they are visible
  });

  // Funtion for calculating and building rows
  const buildRows = useCallback(() => {
    if (!containerRef.current || photos.length === 0) {
      setRows([]);
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const newRows: Row[] = [];
    let currentRow: Photo[] = [];
    let currentRowWidth = 0;

    photos.forEach((photo) => {
      const scaledWidth = photo.width * (targetRowHeight / photo.height);

      if (
        currentRow.length === 0 ||
        currentRowWidth + scaledWidth + gap * currentRow.length < containerWidth
      ) {
        currentRow.push(photo);
        currentRowWidth += scaledWidth;
      } else {
        const totalGapWidth = (currentRow.length - 1) * gap;
        const combinedPhotoWidth = currentRow.reduce(
          (acc, p) => acc + p.width * (targetRowHeight / p.height),
          0
        );

        const ratio = (containerWidth - totalGapWidth) / combinedPhotoWidth;
        const justifiedRowHeight = Math.floor(targetRowHeight * ratio);

        newRows.push({
          photos: currentRow.map((p) => ({
            ...p,
            displayWidth: Math.floor(p.width * (justifiedRowHeight / p.height)),
            displayHeight: justifiedRowHeight,
          })),
          height: justifiedRowHeight,
        });

        currentRow = [photo];
        currentRowWidth = scaledWidth;
      }
    });

    if (currentRow.length > 0) {
      newRows.push({
        photos: currentRow.map((photo) => ({
          ...photo,
          displayWidth: Math.floor(
            photo.width * (targetRowHeight / photo.height)
          ),
          displayHeight: targetRowHeight,
        })),
        height: targetRowHeight,
      });
    }

    setRows(newRows);
  }, [photos, gap, targetRowHeight]);

  useEffect(() => {
    buildRows();
    const resizeObserver = new ResizeObserver(buildRows);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [buildRows]);

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
