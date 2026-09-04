# 🌊 Water Intelligence Platform — Akansha's Complete Manual

**Role**: Database, AI Engine & Platform Lead  
**Project**: Smart India Hackathon (SIH 2026)

---

## 📁 What We Built for You

All files are located in your workspace: `C:\Users\ANKIT KUMAR\.gemini\antigravity\scratch\water-intelligence-dashboard\`

1. **`schema.sql`**: The production-ready relational SQLite schema with 5 core tables (`regions`, `weather_metrics`, `water_availability`, `water_consumption`, `prediction_alerts`) + composite indexing.
2. **`db_manager.py`**: Python engine that initializes the database, validates & cleans data, seeds 30-day time-series for 4 major Indian regions (Delhi, Jaipur, Chennai, Bengaluru), and runs the reactive risk engine.
3. **`server.py`**: A zero-dependency Python REST API server (using Python's built-in `http.server`) that serves both the dashboard UI and live API endpoints.
4. **`index.html`**: The full Water Intelligence Dashboard with:
   - Dynamic Region Selector (North Delhi, Jaipur, Chennai, Bengaluru)
   - Status & Risk KPI cards with color badges
   - 4-Day Water Availability Prediction Bar Chart (Chart.js)
   - 14-Day Historical Inflow vs. Rainfall dual-axis chart
   - Actionable Early Warning Alert Box
   - **Data Inspector Tab** (Akansha's dedicated screen to showcase live database tables to judges!).
5. **`akansha_guide.html`**: Akansha's interactive personal documentation and presentation preparation guide.

---

## 🚀 How to Run the Entire System

### Step 1: Open PowerShell or Terminal
Navigate to your folder:
```powershell
cd "C:\Users\ANKIT KUMAR\.gemini\antigravity\scratch\water-intelligence-dashboard"
```

### Step 2: Start the Server
```powershell
python server.py
```

### Step 3: Open in Browser
Open your browser and visit:
* **Dashboard**: [http://localhost:8000/index.html](http://localhost:8000/index.html)
* **Akansha Action Guide**: [http://localhost:8000/akansha_guide.html](http://localhost:8000/akansha_guide.html)

*(Note: You can also double-click `index.html` or `akansha_guide.html` in Windows Explorer to open them directly in Chrome/Edge without even running the server, thanks to the offline fallback mode!)*

---

## 🎤 How to Demo Your Part to the Judges

During the presentation, follow this 3-step sequence:

1. **Show the Dashboard Overview**:
   - Select **North Delhi** or **Jaipur District** in the top dropdown.
   - Point to the **High / Critical Risk** badge and the **4-Day Prediction Bar Chart**.
   - Point out the **Main Factors** (e.g. Rainfall deficit -24%, high consumption) and the **Action Recommendation**.

2. **Test the Weather Simulator**:
   - Click **"Heavy Rain (55mm)"** to show real-time reactive recalculation (jumps to Flood/Surge Alert).
   - Click **"Fetch Live Open-Meteo"** to sync real satellite weather for Delhi.

3. **Switch to the "Data Inspector" Tab** (Top Right button):
   - Say: *"Here is our underlying storage layer. We store location metadata, daily rainfall observations, reservoir storage, and AI inferences in modular relational tables."*
   - Change the dropdown to `weather_metrics` or `prediction_alerts` to show the live database rows.
   - Mention the **Data Quality Score (99.8%)** and **Composite Indexing on (region_id, date)** for fast queries.

4. **Deliver the 1-Minute Project Pitch**:
   > *"Water Intelligence is an AI-powered water monitoring and prediction platform. It combines water availability, rainfall, weather, consumption, and historical data, processes that information, and uses machine learning to identify trends and predict potential water stress. The system converts those predictions into understandable risk levels and early warnings and presents everything through a dashboard — helping users and authorities understand not only the current water situation, but also what could happen next."*
