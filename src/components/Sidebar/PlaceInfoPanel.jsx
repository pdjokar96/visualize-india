import styles from './PlaceInfoPanel.module.css';

function FactSection({ icon, title, facts }) {
  if (!facts) return null;

  const items = Array.isArray(facts) ? facts : [facts];
  if (items.length === 0) return null;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>{icon}</span>
        {title}
      </h3>
      <ul className={styles.factList}>
        {items.map((fact, i) => (
          <li key={i} className={styles.factItem}>{fact}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PlaceInfoPanel({ name, facts, type = 'State', onClose }) {
  if (!name) return null;

  const data = facts || {};
  const metaItems = [
    data.capital ? { label: 'Capital', value: data.capital } : null,
    type === 'City' && data.state ? { label: 'State', value: data.state } : null,
    data.area ? { label: 'Area', value: data.area } : null,
    data.population ? { label: 'Population', value: data.population } : null,
    data.languages?.length
      ? { label: 'Languages', value: data.languages.join(', ') }
      : null,
  ].filter(Boolean);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <span className={styles.type}>{data.type || type}</span>
          <h2 className={styles.name}>{name}</h2>
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose} title="Close">
          ✕
        </button>
      </div>

      {metaItems.length > 0 && (
        <div className={styles.meta}>
          {metaItems.map((item) => (
            <div key={item.label} className={styles.metaItem}>
              <span className={styles.metaLabel}>{item.label}</span>
              <span className={styles.metaValue}>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {data.overview && <p className={styles.overview}>{data.overview}</p>}

      <FactSection icon="🏛️" title="Historical" facts={data.historical} />
      <FactSection icon="🏔️" title="Geography & Geology" facts={data.geological} />
      <FactSection icon="🎭" title="Culture & Traditions" facts={data.cultural} />
      <FactSection icon="⭐" title="Fun Facts" facts={data.funFacts} />

      {data.links && data.links.length > 0 && (
        <div className={styles.links}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.sectionIcon}>🔗</span>
            Know More
          </h3>
          <div className={styles.linkList}>
            {data.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {link.title} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
