import { useState, useEffect, useCallback, useRef } from 'react';
import { useInfiniteScroll } from './useInfiniteScroll';
import type { Photo } from '../types/common';

export const useFetchPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const page = useRef(1);
  const shouldFetchPhotoOnce = useRef(true);
  const options = useRef({ rootMargin: '200px' });

  // Memoized function to fetch photos from the API
  const fetchPhotos = useCallback(async () => {
    if (isLoading || !hasMore) return; // Prevent multiple fetches
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page.current}&limit=20`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const newPhotos: Photo[] = await response.json();

      if (newPhotos.length === 0) {
        setHasMore(false); // No more photos to load
      } else {
        // Append new photos to the existing list, avoiding duplicates
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        page.current += 1;
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // Fetch initial data on component mount
  useEffect(() => {
    if(shouldFetchPhotoOnce.current) {
      fetchPhotos();
      shouldFetchPhotoOnce.current = false;
    }
  }, [fetchPhotos, page]); 

  // Use the custom hook for the trigger element
  const loaderRef = useInfiniteScroll({
    onLoadMore: fetchPhotos,
    isLoading,
    hasMore,
    options: options.current,
  });

  return { photos, loaderRef, isLoading, hasMore };
};
