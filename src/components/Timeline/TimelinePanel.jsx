import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './TimelinePanel.module.css';

const MILESTONES = [
  {
    year: 1947,
    title: 'Independence & Partition',
    description: 'India gains independence from British rule. The country is partitioned into India and Pakistan. The initial administrative divisions include provinces and princely states.',
    changes: ['British India becomes independent', 'Partition creates India and Pakistan', 'Princely states begin integration'],
  },
  {
    year: 1950,
    title: 'Republic of India',
    description: 'India becomes a Republic. The Constitution comes into effect, establishing Part A, B, C, and D states.',
    changes: ['Constitution of India comes into effect', 'States reorganized into Part A, B, C, and D categories'],
  },
  {
    year: 1956,
    title: 'States Reorganisation Act',
    description: 'The most sweeping reform of state boundaries. States were reorganized primarily along linguistic lines based on the recommendations of the States Reorganisation Commission.',
    changes: ['14 states and 6 union territories created', 'Linguistic basis for state boundaries', 'Andhra Pradesh, Kerala, Karnataka (as Mysore) formed', 'Part A/B/C/D classification abolished'],
  },
  {
    year: 1960,
    title: 'Bombay State Split',
    description: 'The bilingual Bombay State is divided into Gujarat and Maharashtra along linguistic lines after the Samyukta Maharashtra movement.',
    changes: ['Gujarat formed (Gujarati-speaking)', 'Maharashtra formed (Marathi-speaking)', 'Mumbai becomes capital of Maharashtra'],
  },
  {
    year: 1966,
    title: 'Punjab Reorganisation',
    description: 'Punjab is divided into the Hindi-speaking state of Haryana and Punjabi-speaking Punjab. Chandigarh becomes a shared capital and union territory.',
    changes: ['Haryana carved out of Punjab', 'Chandigarh becomes a Union Territory', 'Hill areas transferred to Himachal Pradesh'],
  },
  {
    year: 1971,
    title: 'Northeast Reorganisation',
    description: 'Several northeastern states gain full statehood. Himachal Pradesh also becomes a full state.',
    changes: ['Himachal Pradesh becomes a full state', 'Meghalaya becomes a full state', 'Manipur becomes a full state', 'Tripura becomes a full state'],
  },
  {
    year: 1975,
    title: 'Sikkim Joins India',
    description: 'The Kingdom of Sikkim, previously a protectorate, becomes the 22nd state of India after a referendum.',
    changes: ['Sikkim becomes the 22nd state', 'Monarchy abolished by referendum'],
  },
  {
    year: 1987,
    title: 'New States & UTs',
    description: 'Goa becomes a full state. Mizoram and Arunachal Pradesh also gain statehood.',
    changes: ['Goa becomes a state (separated from Daman and Diu)', 'Mizoram becomes a state', 'Arunachal Pradesh becomes a state'],
  },
  {
    year: 2000,
    title: 'Three New States',
    description: 'Three new states are carved out of existing large states to improve governance and development.',
    changes: ['Chhattisgarh carved from Madhya Pradesh', 'Uttarakhand carved from Uttar Pradesh', 'Jharkhand carved from Bihar'],
  },
  {
    year: 2014,
    title: 'Telangana Formation',
    description: 'Telangana is carved out of Andhra Pradesh as the 29th state, after decades of the Telangana movement.',
    changes: ['Telangana formed from Andhra Pradesh', 'Hyderabad serves as shared capital for 10 years', 'India now has 29 states'],
  },
  {
    year: 2019,
    title: 'J&K Reorganisation',
    description: 'Jammu and Kashmir is reorganized into two union territories: Jammu & Kashmir (with legislature) and Ladakh (without legislature).',
    changes: ['J&K becomes a Union Territory with legislature', 'Ladakh becomes a Union Territory without legislature', 'Article 370 provisions altered'],
  },
];

export default function TimelinePanel({ currentYear, onYearChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef(null);
  const playbackIndexRef = useRef(0);

  const currentMilestone = useMemo(() => {
    return MILESTONES.reduce((closest, milestone) => {
      return milestone.year <= currentYear ? milestone : closest;
    }, MILESTONES[0]);
  }, [currentYear]);

  const clearPlayback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearPlayback, [clearPlayback]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const playNext = () => {
      const milestone = MILESTONES[playbackIndexRef.current];

      if (!milestone) {
        clearPlayback();
        setIsPlaying(false);
        return;
      }

      onYearChange(milestone.year);
      playbackIndexRef.current += 1;

      timeoutRef.current = setTimeout(() => {
        if (playbackIndexRef.current < MILESTONES.length) {
          playNext();
        } else {
          clearPlayback();
          setIsPlaying(false);
        }
      }, 2000);
    };

    playNext();

    return clearPlayback;
  }, [clearPlayback, isPlaying, onYearChange]);

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      clearPlayback();
      setIsPlaying(false);
      return;
    }

    let index = MILESTONES.findIndex((milestone) => milestone.year >= currentYear);
    if (index === -1 || index >= MILESTONES.length) {
      index = 0;
    }

    playbackIndexRef.current = index;
    setIsPlaying(true);
  }, [clearPlayback, currentYear, isPlaying]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>📅 Through the Years</h2>
        <p className={styles.subtitle}>See how India's states evolved since independence</p>
      </div>

      <div className={styles.sliderSection}>
        <div className={styles.sliderHeader}>
          <span className={styles.yearLabel}>{currentYear}</span>
          <button type="button" className={styles.playBtn} onClick={handlePlay}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
        </div>
        <input
          type="range"
          min={1947}
          max={2024}
          value={currentYear}
          onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
          className={styles.slider}
        />
        <div className={styles.sliderMarks}>
          {MILESTONES.map((milestone) => (
            <button
              key={milestone.year}
              type="button"
              className={`${styles.mark} ${currentYear >= milestone.year ? styles.markActive : ''}`}
              onClick={() => onYearChange(milestone.year)}
              title={`${milestone.year}: ${milestone.title}`}
              style={{ left: `${((milestone.year - 1947) / (2024 - 1947)) * 100}%` }}
            >
              {milestone.year}
            </button>
          ))}
        </div>
      </div>

      {currentMilestone && (
        <div className={styles.milestoneCard}>
          <div className={styles.milestoneYear}>{currentMilestone.year}</div>
          <h3 className={styles.milestoneTitle}>{currentMilestone.title}</h3>
          <p className={styles.milestoneDesc}>{currentMilestone.description}</p>
          <div className={styles.changes}>
            <h4 className={styles.changesTitle}>Key Changes:</h4>
            <ul className={styles.changesList}>
              {currentMilestone.changes.map((change, i) => (
                <li key={i} className={styles.changeItem}>
                  <span className={styles.changeDot}>→</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className={styles.timelineList}>
        <h3 className={styles.timelineListTitle}>All Milestones</h3>
        {MILESTONES.map((milestone) => (
          <button
            key={milestone.year}
            type="button"
            className={`${styles.timelineItem} ${currentMilestone?.year === milestone.year ? styles.timelineItemActive : ''}`}
            onClick={() => onYearChange(milestone.year)}
          >
            <span className={styles.timelineDot} />
            <span className={styles.timelineYear}>{milestone.year}</span>
            <span className={styles.timelineLabel}>{milestone.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
