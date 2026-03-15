import { useState, useEffect } from 'react';

export function useMapData() {
  const [statesGeo, setStatesGeo] = useState(null);
  const [stateFacts, setStateFacts] = useState(null);
  const [cityFacts, setCityFacts] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const base = import.meta.env.BASE_URL;
        const [geoRes, factsRes, citiesRes, eventsRes] = await Promise.all([
          fetch(`${base}data/geojson/india-states.geojson`),
          fetch(`${base}data/facts/states.json`),
          fetch(`${base}data/facts/cities.json`),
          fetch(`${base}data/events.json`),
        ]);

        if (!geoRes.ok) throw new Error('Failed to load map data');

        const [geo, facts, cities, evts] = await Promise.all([
          geoRes.json(),
          factsRes.ok ? factsRes.json() : {},
          citiesRes.ok ? citiesRes.json() : {},
          eventsRes.ok ? eventsRes.json() : [],
        ]);

        setStatesGeo(geo);
        setStateFacts(facts);
        setCityFacts(cities);
        setEvents(evts);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { statesGeo, stateFacts, cityFacts, events, loading, error };
}
