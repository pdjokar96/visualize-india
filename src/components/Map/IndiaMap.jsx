import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import {
  CATEGORY_COLORS,
  DEFAULT_ZOOM,
  getHistoricalStateStyle,
  getStateStyle,
  INDIA_BOUNDS,
  INDIA_CENTER,
} from '../../utils/mapHelpers';
import 'leaflet/dist/leaflet.css';

function ZoomHandler({ onZoomEnd }) {
  useMapEvents({ zoomend: onZoomEnd });
  return null;
}

function FlyToHandler({ flyTo }) {
  const map = useMap();

  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo.center, flyTo.zoom || 8, { duration: 1 });
    }
  }, [flyTo, map]);

  return null;
}

function CityMarkers({ cities, zoomLevel, onCityClick }) {
  if (zoomLevel < 6 || !cities) return null;

  return Object.entries(cities).map(([name, data]) => (
    <CircleMarker
      key={name}
      center={data.coordinates}
      radius={zoomLevel >= 8 ? 6 : 4}
      pathOptions={{
        fillColor: '#ef4444',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.8,
      }}
      eventHandlers={{
        click: () => onCityClick(name, data),
      }}
    >
      {zoomLevel >= 7 && (
        <Tooltip permanent direction="top" offset={[0, -8]} className="state-tooltip">
          {name}
        </Tooltip>
      )}
    </CircleMarker>
  ));
}

function EventMarker({ event }) {
  if (!event) return null;

  return (
    <CircleMarker
      center={event.coordinates}
      radius={12}
      pathOptions={{
        fillColor: CATEGORY_COLORS[event.category] || '#ef4444',
        color: '#fff',
        weight: 3,
        fillOpacity: 0.7,
      }}
    >
      <Popup>
        <strong>{event.title}</strong>
        <br />
        <em>{event.date}</em>
        <br />
        {event.location}
      </Popup>
    </CircleMarker>
  );
}

export default function IndiaMap({
  statesGeo,
  cityFacts,
  onStateClick,
  onCityClick,
  selectedState,
  zoomLevel,
  onZoomEnd,
  flyTo,
  selectedEvent,
  historicalGeo,
  historicalYear,
}) {
  const [hoveredState, setHoveredState] = useState(null);
  const geoJsonRef = useRef(null);

  const geoData = historicalGeo || statesGeo;

  const onEachFeature = useCallback(
    (feature, layer) => {
      const name = feature.properties.name;

      layer.bindTooltip(name, {
        className: 'state-tooltip',
        sticky: true,
        direction: 'top',
        offset: [0, -10],
      });

      layer.on({
        mouseover: (e) => {
          setHoveredState(name);
          e.target.setStyle({
            weight: 2.5,
            fillOpacity: 0.6,
          });
          e.target.bringToFront();
        },
        mouseout: (e) => {
          setHoveredState(null);
          geoJsonRef.current?.resetStyle?.(e.target);
        },
        click: () => {
          if (onStateClick) onStateClick(name, feature.properties);
        },
      });
    },
    [onStateClick],
  );

  const style = useCallback(
    (feature) => {
      const name = feature.properties.name;
      const featureIndex = geoData?.features?.indexOf(feature) ?? 0;
      const isNew = feature.properties.isNew;

      if (historicalGeo) {
        return getHistoricalStateStyle(feature, isNew);
      }

      return getStateStyle(feature, featureIndex, name === selectedState, name === hoveredState);
    },
    [geoData, historicalGeo, hoveredState, selectedState],
  );

  const geoKey = useMemo(() => {
    if (historicalGeo) return `hist-${historicalYear}`;
    return `states-${statesGeo ? statesGeo.features.length : 0}`;
  }, [historicalGeo, historicalYear, statesGeo]);

  if (!geoData) return null;

  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      maxBounds={INDIA_BOUNDS}
      maxBoundsViscosity={0.8}
      minZoom={4}
      maxZoom={12}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com">CARTO</a> | Boundaries as per Survey of India'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        key={geoKey}
        data={geoData}
        style={style}
        onEachFeature={onEachFeature}
        ref={geoJsonRef}
      />
      <CityMarkers cities={cityFacts} zoomLevel={zoomLevel} onCityClick={onCityClick} />
      <ZoomHandler onZoomEnd={onZoomEnd} />
      <FlyToHandler flyTo={flyTo} />
      {selectedEvent && <EventMarker event={selectedEvent} />}
    </MapContainer>
  );
}
