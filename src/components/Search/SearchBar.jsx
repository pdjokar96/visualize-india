import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ stateFacts, cityFacts, events, onSelectState, onSelectCity, onSelectEvent }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const items = [];

    if (stateFacts) {
      Object.keys(stateFacts).forEach(name => {
        if (name.toLowerCase().includes(q)) {
          items.push({ type: 'State', name, icon: '🏛️' });
        }
      });
    }

    if (cityFacts) {
      Object.keys(cityFacts).forEach(name => {
        if (name.toLowerCase().includes(q)) {
          items.push({ type: 'City', name, icon: '🏙️', data: cityFacts[name] });
        }
      });
    }

    if (events) {
      events.forEach(event => {
        if (
          event.title.toLowerCase().includes(q) ||
          event.location.toLowerCase().includes(q)
        ) {
          items.push({ type: 'Event', name: event.title, icon: '📍', data: event });
        }
      });
    }

    return items.slice(0, 10);
  }, [query, stateFacts, cityFacts, events]);

  const handleSelect = (item) => {
    if (item.type === 'State') onSelectState(item.name);
    else if (item.type === 'City') onSelectCity(item.name, item.data);
    else if (item.type === 'Event') onSelectEvent(item.data);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search states, cities, events..."
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className={styles.input}
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => { setQuery(''); setIsOpen(false); }}>✕</button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((item, i) => (
            <button
              key={`${item.type}-${item.name}-${i}`}
              className={styles.resultItem}
              onClick={() => handleSelect(item)}
            >
              <span className={styles.resultIcon}>{item.icon}</span>
              <div className={styles.resultText}>
                <span className={styles.resultName}>{item.name}</span>
                <span className={styles.resultType}>{item.type}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
