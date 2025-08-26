import { useState, useEffect, useCallback, useRef } from 'react';
import type { Photo, Row } from '../types/common';

// Defines the props for our custom hook
interface UseBuildRowsProps {
  photos: Photo[];
  gap: number;
  targetRowHeight: number;
}

export const useBuildRows = ({
  photos,
  gap,
  targetRowHeight,
}: UseBuildRowsProps) => {
  const [rows, setRows] = useState<Row[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const currentContainer = containerRef.current;

    if (currentContainer) {
      resizeObserver.observe(currentContainer);
    }
    return () => {
      if (currentContainer) {
        resizeObserver.unobserve(currentContainer);
      }
    };
  }, [buildRows]);

  return { rows, containerRef };
};
