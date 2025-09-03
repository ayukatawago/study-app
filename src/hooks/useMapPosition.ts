import { useState, useRef, useCallback, useEffect } from 'react';

interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

interface CountryPosition {
  coordinates: [number, number];
  bbox?: number[];
}

export const useMapPosition = () => {
  const [position, setPosition] = useState<MapPosition>({
    coordinates: [0, 0],
    zoom: 0.2,
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [countryPosition, setCountryPosition] = useState<CountryPosition | null>(null);

  const positionRef = useRef<MapPosition>(position);
  const animationRef = useRef<number | null>(null);
  const animationStartRef = useRef<number>(0);
  const animationTargetRef = useRef<MapPosition | null>(null);

  // Keep the ref updated with latest position
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const animateToPosition = useCallback(
    (
      startCoords: [number, number],
      endCoords: [number, number],
      startZoom: number,
      endZoom: number,
      onComplete?: () => void
    ) => {
      setIsTransitioning(true);

      const steps = 10;
      let currentStep = 0;
      const stepDuration = 50;

      const animateStep = () => {
        currentStep++;
        const progress = currentStep / steps;

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);

        const nextX = startCoords[0] + (endCoords[0] - startCoords[0]) * easedProgress;
        const nextY = startCoords[1] + (endCoords[1] - startCoords[1]) * easedProgress;
        const nextZoom = startZoom + (endZoom - startZoom) * easedProgress;

        setPosition({
          coordinates: [nextX, nextY],
          zoom: nextZoom,
        });

        if (currentStep < steps) {
          setTimeout(animateStep, stepDuration);
        } else {
          setPosition({
            coordinates: endCoords,
            zoom: endZoom,
          });

          setTimeout(() => {
            setIsTransitioning(false);
            if (onComplete) onComplete();
          }, 100);
        }
      };

      requestAnimationFrame(() => animateStep());
    },
    []
  );

  const zoomToCountry = useCallback(
    (targetPosition: CountryPosition, zoomLevel: number) => {
      const currentCoords = positionRef.current.coordinates;
      const currentZoom = positionRef.current.zoom;

      animateToPosition(currentCoords, targetPosition.coordinates, currentZoom, zoomLevel, () =>
        setIsZoomed(true)
      );
    },
    [animateToPosition]
  );

  const zoomToWorld = useCallback(() => {
    const currentCoords = position.coordinates;
    const currentZoom = position.zoom;
    const worldCoords: [number, number] = [0, 0];
    const worldZoom = 0.2;

    animateToPosition(currentCoords, worldCoords, currentZoom, worldZoom, () => setIsZoomed(false));
  }, [position, animateToPosition]);

  const resetPosition = useCallback(() => {
    setPosition({ coordinates: [0, 0] as [number, number], zoom: 0.2 });
    setIsZoomed(false);
    setCountryPosition(null);
  }, []);

  return {
    position,
    setPosition,
    isZoomed,
    isTransitioning,
    countryPosition,
    setCountryPosition,
    positionRef,
    animateToPosition,
    zoomToCountry,
    zoomToWorld,
    resetPosition,
  };
};
