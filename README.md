# 🇮🇳 Visualize India — Learn Geography Through Interactive Maps

**An open-source, interactive map of India built for curious minds.** Zoom into states, districts, and cities. Discover historical events, geological wonders, and cultural facts — all pinned to the places where they happened.

🌐 **[Try it live →](https://pdjokar96.github.io/visualize-india/)**

---

## Why This Exists

Geography textbooks are boring. Maps shouldn't be.

**Visualize India** turns a static map into a living, clickable encyclopedia. It's built for students (ages 12+), teachers, quiz enthusiasts, and anyone who's ever wondered *"where exactly did that happen?"* — and wants to see it on a map.

No sign-ups. No ads. No tracking. Just India, beautifully mapped.

---

## ✨ Features

### 🗺️ Multi-Level Interactive Map
- **States & Union Territories** — see all 28 states and 8 UTs with official boundaries
- **City Markers** — zoom in to discover 30+ major cities with curated facts
- **Hover & Click** — highlight any region and open a detailed info panel

### 📖 Place Info Sidebar
Click any state or city to see:
- Historical significance & key dates
- Geological & geographical facts
- Cultural highlights & fun trivia
- Quick links to learn more (Wikipedia, Gov portals)

### ⚡ "Where Did It Happen?"
A curated collection of **50 landmark events** across Indian history, science, nature, and culture:
- *Where was the first nuclear test conducted?*
- *Where did the Jallianwala Bagh massacre take place?*
- *Where was India's Silicon Valley born?*

Click an event → the map flies to the exact location and highlights it.

### 🕰️ Through the Years (1947 → Today)
Watch India's states evolve over time:
- Slide through **12 milestone years** from Independence to today
- See how states like Telangana, Jharkhand, and Uttarakhand were carved out
- Hit play for an animated timeline walkthrough

### 🔍 Smart Search
Search across states, cities, and events — instantly jump to any place on the map.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + Vite |
| **Mapping** | Leaflet.js via react-leaflet |
| **Styling** | CSS Modules + CSS Variables |
| **Data** | Static JSON (no backend needed) |
| **Hosting** | GitHub Pages |

Zero dependencies on external APIs. Everything runs client-side.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Run Locally

```bash
git clone https://github.com/pdjokar96/visualize-india.git
cd visualize-india
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start exploring!

### Build for Production

```bash
npm run build
```

The optimized build is output to the `docs/` folder (configured for GitHub Pages).

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- **Add more cities** — expand `public/data/facts/cities.json` with new entries
- **Add more events** — contribute to `public/data/events.json`
- **District-level data** — help add district boundaries and facts (big impact!)
- **Improve facts** — fix inaccuracies, add sources, enrich descriptions
- **Accessibility** — improve keyboard navigation, screen reader support
- **Translations** — help make this available in Hindi and regional languages

### Data Format

Each city in `cities.json`:
```json
{
  "name": "Jaipur",
  "state": "Rajasthan",
  "coordinates": [26.9124, 75.7873],
  "facts": {
    "overview": "The Pink City, founded in 1727...",
    "historical": ["Founded by Maharaja Sawai Jai Singh II..."],
    "geological": ["Located in the semi-arid region..."],
    "cultural": ["Famous for block printing, lac bangles..."],
    "funFacts": ["The entire old city was painted pink in 1876..."],
    "links": [{ "label": "Wikipedia", "url": "https://en.wikipedia.org/wiki/Jaipur" }]
  }
}
```

---

## 📁 Project Structure

```
visualize-india/
├── public/
│   └── data/
│       ├── geojson/          # State boundaries (current + historical)
│       ├── facts/            # States & cities JSON data
│       └── events.json       # "Where Did It Happen?" events
├── src/
│   ├── components/
│   │   ├── Map/              # IndiaMap (Leaflet)
│   │   ├── Layout/           # Header, Layout
│   │   ├── Sidebar/          # PlaceInfoPanel
│   │   ├── Events/           # EventsPanel
│   │   ├── Timeline/         # TimelinePanel
│   │   └── Search/           # SearchBar
│   ├── hooks/                # useMapData, useZoomLevel
│   ├── utils/                # Map helpers, colors, constants
│   ├── App.jsx               # Main orchestrator
│   └── main.jsx              # Entry point
└── docs/                     # Production build (GitHub Pages)
```

---

## 📝 Notes

- **Boundaries** are shown as per the official map of India (Survey of India). This includes the complete territory of Jammu & Kashmir and Ladakh as integral parts of India.
- **Data is curated, not generated.** Facts are hand-picked for educational value. If you spot an error, please open an issue.
- This is a passion project — built to make learning geography fun and visual.

---

## 📜 License

MIT — use it, fork it, teach with it.

---

<p align="center">
  Built with ❤️ for India's next generation of explorers.
</p>
