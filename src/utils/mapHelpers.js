// Color palette for states (pastel, educational feel)
const STATE_COLORS = [
  '#93c5fd', '#86efac', '#fde68a', '#fca5a5', '#c4b5fd',
  '#fbcfe8', '#a5f3fc', '#d9f99d', '#fed7aa', '#e9d5ff',
  '#bfdbfe', '#bbf7d0', '#fef08a', '#fecaca', '#ddd6fe',
  '#f9a8d4', '#99f6e4', '#bef264', '#fdba74', '#f0abfc',
  '#a7f3d0', '#fcd34d', '#f87171', '#a78bfa', '#fb923c',
  '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#4ade80',
  '#c084fc', '#38bdf8', '#a3e635', '#fb7185', '#2dd4bf',
];

export function getStateColor(index) {
  return STATE_COLORS[index % STATE_COLORS.length];
}

export function getStateStyle(feature, index, isSelected, isHovered) {
  const baseColor = getStateColor(index);
  return {
    fillColor: isSelected ? '#2563eb' : isHovered ? '#3b82f6' : baseColor,
    weight: isSelected ? 3 : isHovered ? 2.5 : 1.5,
    opacity: 1,
    color: isSelected ? '#1d4ed8' : isHovered ? '#2563eb' : '#475569',
    fillOpacity: isSelected ? 0.5 : isHovered ? 0.6 : 0.45,
  };
}

export function getHistoricalStateStyle(feature, isNew) {
  // Use a hash of the historical name for consistent coloring of merged states
  const name = feature.properties.name || '';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  const colorIndex = Math.abs(hash) % STATE_COLORS.length;
  const baseColor = STATE_COLORS[colorIndex];

  return {
    fillColor: isNew ? '#fbbf24' : baseColor,
    weight: isNew ? 2.5 : 1.5,
    opacity: 1,
    color: isNew ? '#d97706' : '#475569',
    fillOpacity: isNew ? 0.65 : 0.45,
    dashArray: isNew ? '' : '',
  };
}

export const INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]];
export const INDIA_CENTER = [22.5, 80.0];
export const DEFAULT_ZOOM = 5;

export const CATEGORY_ICONS = {
  Historical: '🏛️',
  Scientific: '🔬',
  Natural: '🌊',
  Cultural: '🎭',
};

export const CATEGORY_COLORS = {
  Historical: '#dc2626',
  Scientific: '#2563eb',
  Natural: '#059669',
  Cultural: '#d97706',
};
