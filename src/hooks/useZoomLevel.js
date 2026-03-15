import { useState, useCallback } from 'react';

export function useZoomLevel() {
  const [zoomLevel, setZoomLevel] = useState(5);

  const handleZoomEnd = useCallback((e) => {
    setZoomLevel(e.target.getZoom());
  }, []);

  // Determine which layers to show based on zoom
  const showStates = zoomLevel >= 4;
  const showDistricts = zoomLevel >= 7;
  const showCities = zoomLevel >= 6;

  return { zoomLevel, handleZoomEnd, showStates, showDistricts, showCities };
}
