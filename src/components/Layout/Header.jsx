import styles from './Header.module.css';
import SearchBar from '../Search/SearchBar';

const TABS = [
  { id: 'explore', label: '🗺️ Explore', title: 'Explore the map' },
  { id: 'events', label: '📍 Where Did It Happen?', title: 'Famous events on the map' },
  { id: 'timeline', label: '📅 Through the Years', title: "How India's states evolved" },
];

export default function Header({ activeTab, onTabChange, stateFacts, cityFacts, events, onSelectState, onSelectCity, onSelectEvent }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>🇮🇳</span>
        <h1 className={styles.title}>Visualize India</h1>
        <span className={styles.subtitle}>Learn through maps</span>
      </div>
      <div className={styles.actions}>
        <SearchBar
          stateFacts={stateFacts}
          cityFacts={cityFacts}
          events={events}
          onSelectState={onSelectState}
          onSelectCity={onSelectCity}
          onSelectEvent={onSelectEvent}
        />
        <nav className={styles.nav}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
              title={tab.title}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
