import { useRef, useCallback, useEffect, useMemo } from 'react';

// Defines the props for our custom hook
interface UseInfiniteScrollProps {
  // The function to call when more data needs to be loaded
  onLoadMore: () => void;
  // A flag to prevent multiple simultaneous loads
  isLoading: boolean;
  // A flag to stop observing when there's no more data
  hasMore: boolean;
  // Optional margin around the root, useful for triggering the load earlier
  options?: IntersectionObserverInit;
}

/**
 * A custom hook to implement infinite scrolling.
 *
 * @param {UseInfiniteScrollProps} props - The hook's parameters.
 * @returns A ref to attach to the trigger element.
 */
export const useInfiniteScroll = ({
  onLoadMore,
  isLoading,
  hasMore,
  options,
}: UseInfiniteScrollProps) => {
  // Use a ref to hold a reference to the observer element
  const observerRef = useRef<HTMLDivElement | null>(null);

  // useCallback ensures that the handleObserver function is not
  // recreated on every render, which is a performance optimization.
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      // If the target element is intersecting and we are not already loading
      // and there is more data to load, then call the onLoadMore function.
      if (target.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    },
    [onLoadMore, isLoading, hasMore]
  );

  const observer = useMemo<IntersectionObserver>(() => new IntersectionObserver(handleObserver, options), [handleObserver, options]);

  // useEffect sets up and cleans up the IntersectionObserver
  useEffect(() => {
    // Create an observer with the handler and options
    // const observer = new IntersectionObserver(handleObserver, options);
    // const observerLocal = observer.currnt;
    const currentElement = observerRef.current;

    // If the observerRef is attached to an element, start observing it
    if (currentElement) {
      observer.observe(currentElement);
    }

    // Cleanup function: disconnect the observer when the component unmounts
    // or when dependencies change.
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [handleObserver, options, observer]); // Rerun effect if these change

  return observerRef; // Return the ref to be attached to a DOM element
};
