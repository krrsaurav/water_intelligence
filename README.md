# 🌊 Water Intelligence Platform — Database & Reactive AI Module

**Module Owner**: Akansha (Database, AI Engine & Platform Lead)  
**Hackathon**: Smart India Hackathon (SIH 2026)

---

## 📌 Module Overview

This repository contains Akansha's complete **Relational Database, Data Preprocessing Pipeline, Reactive AI Risk Engine, and Live SQL Inspector Dashboard** for the Water Intelligence Platform.

### 🌟 Key Features:
1. **Relational Schema (`schema.sql`)**: 5 core SQLite tables (`regions`, `weather_metrics`, `water_availability`, `water_consumption`, `prediction_alerts`) with composite indexing on `(region_id, date)`.
2. **Data Manager & Reactive AI Engine (`db_manager.py`)**:
   - Automated data validation & cleaning (zero nulls, value range clamping).
   - Generates 30-day realistic historical time-series for 4 key Indian regions (Delhi, Jaipur, Chennai, Bengaluru).
   - Reactive water balance engine that dynamically calculates 4-day forecast availability, risk levels, and warnings when rainfall changes.
3. **Interactive Dashboard & SQL Inspector (`index.html`)**:
   - Leaflet.js GIS map with color-coded risk markers.
   - 4-Day predictive bar charts & 14-day telemetry trends (Chart.js).
   - Live Weather Simulator (Heavy Rain, Heatwave Drought, Open-Meteo Satellite Feed).
   - Live Database Inspector tab to query and view raw SQLite tables directly in the UI.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/water-intelligence-module.git
cd water-intelligence-module

# 2. Run the local server
python server.py

# 3. Open in browser
http://localhost:8000/index.html
```

---

## 📁 Repository Structure

```
├── index.html            # Full interactive dashboard & database inspector UI
├── schema.sql            # Production SQLite relational schema
├── db_manager.py         # Python data management & reactive AI engine
├── server.py             # Lightweight REST API server
├── akansha_guide.html    # Akansha's presentation & viva action guide
├── .gitignore            # Clean repository ignore file
└── README.md             # Project documentation
```
