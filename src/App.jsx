import { useCallback, useEffect, useState } from 'react';
import Header from './components/Layout/Header';
import Layout from './components/Layout/Layout';
import IndiaMap from './components/Map/IndiaMap';
import PlaceInfoPanel from './components/Sidebar/PlaceInfoPanel';
import EventsPanel from './components/Events/EventsPanel';
import TimelinePanel from './components/Timeline/TimelinePanel';
import { useMapData } from './hooks/useMapData';
import { useZoomLevel } from './hooks/useZoomLevel';

const MILESTONE_YEARS = [1947, 1950, 1956, 1960, 1966, 1971, 1975, 1987, 2000, 2014, 2019, 2024];
function getNearestMilestone(year) {
  return MILESTONE_YEARS.reduce((prev, curr) => (curr <= year ? curr : prev), MILESTONE_YEARS[0]);
}

function LoadingScreen() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        color: 'var(--text-secondary)',
      }}
    >
      <div style={{ fontSize: '48px' }}>🇮🇳</div>
      <div style={{ fontSize: '18px', fontWeight: 600 }}>Loading Visualize India...</div>
      <div style={{ fontSize: '14px' }}>Preparing map data</div>
    </div>
  );
}

function ErrorScreen({ error }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '16px',
        color: '#dc2626',
      }}
    >
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <div style={{ fontSize: '18px', fontWeight: 600 }}>Failed to load data</div>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{error}</div>
    </div>
  );
}

export default function App() {
  const { statesGeo, stateFacts, cityFacts, events, loading, error } = useMapData();
  const { zoomLevel, handleZoomEnd } = useZoomLevel();

  const [activeTab, setActiveTab] = useState('explore');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const [timelineYear, setTimelineYear] = useState(1947);
  const [historicalGeo, setHistoricalGeo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (activeTab !== 'timeline') {
      return undefined;
    }

    const fileYear = getNearestMilestone(timelineYear);

    async function loadHistoricalGeo() {
      try {
        const response = await fetch(`/data/geojson/historical/${fileYear}.geojson`);
        if (!response.ok) {
          if (!cancelled) setHistoricalGeo(null);
          return;
        }

        const geo = await response.json();
        if (!cancelled) {
          setHistoricalGeo(geo);
        }
      } catch (err) {
        if (!cancelled) {
          setHistoricalGeo(null);
        }
        console.error('Failed to load historical map:', err);
      }
    }

    loadHistoricalGeo();

    return () => {
      cancelled = true;
    };
  }, [activeTab, timelineYear]);

  const handleStateClick = useCallback(
    (name) => {
      setSelectedPlace({ name, type: 'State', facts: stateFacts?.[name] });
      setActiveTab('explore');
      setSelectedEvent(null);
      setFlyTo(null);
    },
    [stateFacts],
  );

  const handleCityClick = useCallback((name, data) => {
    setSelectedPlace({ name, type: 'City', facts: data });
    setActiveTab('explore');
    setSelectedEvent(null);
    setFlyTo(Array.isArray(data?.coordinates) ? { center: data.coordinates, zoom: 8 } : null);
  }, []);

  const handleEventSelect = useCallback((event) => {
    setActiveTab('events');
    setSelectedPlace(null);
    setSelectedEvent(event);
    setFlyTo({ center: event.coordinates, zoom: 8 });
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab !== 'events') {
      setSelectedEvent(null);
    }
    if (tab !== 'timeline') {
      setHistoricalGeo(null);
    }
    if (tab === 'timeline') {
      setSelectedPlace(null);
    }
  }, []);

  const handleYearChange = useCallback((year) => {
    setTimelineYear(year);
    setSelectedEvent(null);
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} />;

  const renderSidebar = () => {
    switch (activeTab) {
      case 'explore':
        return selectedPlace ? (
          <PlaceInfoPanel
            name={selectedPlace.name}
            facts={selectedPlace.facts}
            type={selectedPlace.type}
            onClose={handleClosePanel}
          />
        ) : null;
      case 'events':
        return (
          <EventsPanel
            events={events}
            onEventSelect={handleEventSelect}
            selectedEvent={selectedEvent}
          />
        );
      case 'timeline':
        return <TimelinePanel currentYear={timelineYear} onYearChange={handleYearChange} />;
      default:
        return null;
    }
  };

  const sidebar = renderSidebar();
  const showSidebar = activeTab === 'events' || activeTab === 'timeline' || selectedPlace;

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        stateFacts={stateFacts}
        cityFacts={cityFacts}
        events={events}
        onSelectState={(name) => handleStateClick(name, {})}
        onSelectCity={handleCityClick}
        onSelectEvent={handleEventSelect}
      />
      <Layout sidebar={showSidebar ? sidebar : null}>
        <IndiaMap
          statesGeo={statesGeo}
          cityFacts={cityFacts}
          onStateClick={handleStateClick}
          onCityClick={handleCityClick}
          selectedState={activeTab === 'explore' && selectedPlace?.type === 'State' ? selectedPlace.name : null}
          zoomLevel={zoomLevel}
          onZoomEnd={handleZoomEnd}
          flyTo={flyTo}
          selectedEvent={selectedEvent}
          historicalGeo={activeTab === 'timeline' ? historicalGeo : null}
          historicalYear={timelineYear}
        />
        {activeTab === 'explore' && !selectedPlace && (
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.95)',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            color: '#475569',
            zIndex: 500,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            👆 Click on any state to explore • Zoom in to see cities • Use the tabs above to discover events and history
          </div>
        )}
      </Layout>
    </>
  );
}
