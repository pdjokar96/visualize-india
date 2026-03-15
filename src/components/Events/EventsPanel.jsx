import { useMemo, useState } from 'react';
import styles from './EventsPanel.module.css';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/mapHelpers';

const CATEGORIES = ['All', 'Historical', 'Scientific', 'Natural', 'Cultural'];

export default function EventsPanel({ events, onEventSelect, selectedEvent }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return events.filter((event) => {
      const haystack = [event.title, event.location, event.description, event.state]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);
      const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeCategory, events, search]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>📍 Where Did It Happen?</h2>
        <p className={styles.subtitle}>Click an event to see it on the map</p>
      </div>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categories}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.categoryBtn} ${activeCategory === cat ? styles.activeCat : ''}`}
            onClick={() => setActiveCategory(cat)}
            style={cat !== 'All' && activeCategory === cat
              ? {
                  background: CATEGORY_COLORS[cat],
                  color: 'white',
                  borderColor: CATEGORY_COLORS[cat],
                }
              : {}}
          >
            {cat !== 'All' && CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      <div className={styles.eventList}>
        {filteredEvents.length === 0 ? (
          <p className={styles.noResults}>No events found</p>
        ) : (
          filteredEvents.map((event) => (
            <button
              key={event.id}
              type="button"
              className={`${styles.eventCard} ${selectedEvent?.id === event.id ? styles.selected : ''}`}
              onClick={() => onEventSelect(event)}
            >
              <div className={styles.eventHeader}>
                <span
                  className={styles.eventCategory}
                  style={{ background: CATEGORY_COLORS[event.category] }}
                >
                  {CATEGORY_ICONS[event.category]} {event.category}
                </span>
                <span className={styles.eventDate}>{event.date}</span>
              </div>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <p className={styles.eventLocation}>📍 {event.location}, {event.state}</p>
              <p className={styles.eventDesc}>{event.description}</p>
              {selectedEvent?.id === event.id && (
                <p className={styles.eventSignificance}>
                  <strong>Why it matters:</strong> {event.significance}
                </p>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
