# 🌊 Water Intelligence — SIH 2026 Dashboard

> **Frontend, Dashboard & Data Visualisation Layer**  
> Built for **Saurav** | Smart India Hackathon 2026  
> Team: Deep · Bhavishya · Akansha · Kanika · Hasim · Saurav

---

## 🚀 How to Run the Dashboard (Zero Setup Needed)

You do **not** need to install Node.js or complex packages to run this project!

1. Go to this folder on your computer:  
   `C:\Users\asus\.gemini\antigravity\scratch\water-intelligence-dashboard\`
2. **Double-click on `index.html`** to open it in Chrome, Edge, or Firefox.
3. Alternatively, if you use VS Code, right-click `index.html` and choose **"Open with Live Server"**.

---

## 📁 File Structure & How Your Code Works

Here is the simple breakdown of every file so you understand how everything connects:

```
water-intelligence-dashboard/
├── index.html          # The main HTML structure (Navbar, KPI Cards, Chart Canvases, Alert Box)
├── css/
│   └── styles.css      # Custom styles (Glassmorphism, animations, Leaflet map styling)
├── js/
│   ├── mockData.js     # Fallback datasets for 6 Indian regions (Delhi, Bundelkhand, Jaipur, etc.)
│   ├── charts.js       # Chart.js configs (4-Day Forecast Bar Chart, Multi-signal Line Chart, Donut)
│   ├── map.js          # Leaflet.js interactive map with color-coded risk markers
│   └── app.js          # Main controller: updates text, switches regions, connects to backend API
└── README.md           # This guide and judge presentation cheat sheet
```

---

## 🔗 How to Connect with Deep & Akansha's Backend

When your teammates (**Deep** & **Akansha**) build the Flask or FastAPI backend:

1. They run their server at `http://127.0.0.1:5000`.
2. They should expose an endpoint: `GET /api/water-intelligence?region=delhi`.
3. Flip the **"Live API"** toggle switch on the top-right of your dashboard!
4. The dashboard will automatically call the backend and render the live predictions. If the backend is ever offline, it automatically falls back to your local demo data so your presentation never crashes.

---

## 🎤 Cheat Sheet: What to Say to the SIH Judges (For Saurav)

### 1. When introducing yourself and your role:
> *"Hello Judges! I am Saurav, and I am responsible for the **Frontend, Dashboard & Data Visualisation layer** of Water Intelligence. My goal was to take the complex machine learning predictions and fragmented environmental telemetry from our backend and turn them into an intuitive, actionable decision dashboard for authorities and citizens."*

---

### 2. Live Demo Flow (Matches Slide 22 of the Project Brief):

1. **Show the Region Selector & Status Badge:**  
   *"Here, an authority can select any monitored region, such as Delhi NCR or Bundelkhand. The dashboard immediately updates the real-time risk level—categorized as Low, Moderate, High, or Critical."*
2. **Show the 4-Day Forecast Chart:**  
   *"This bar chart renders the output of our AI prediction model, projecting water availability over the next 4 days. You can see the progressive color shift as water stress increases from yellow to red."*
3. **Show the Early Warning Alert & Mitigation Actions:**  
   *"Instead of just showing numbers, the system isolates the key contributing factors—such as a 42% rainfall deficit and an 18% consumption surge—and generates proactive recommendations before a shortage occurs."*
4. **Show the Geographic Map View (Tab 2):**  
   *"With our interactive Leaflet map, authorities get an instant nationwide perspective on where critical water stress is emerging, and clicking any pin navigates directly to that region's telemetry."*
5. **Show the 'Simulate AI Shift' Button:**  
   *"We also built a dynamic simulation trigger to demonstrate how the UI responds in real time when our ML pipeline detects sudden temperature spikes or aquifer drop anomalies."*

---

### 3. Answers to Common Judge Questions:

* **Q: "What technology stack did you use for the UI?"**  
  * **Answer:** *"I used semantic HTML5 and Tailwind CSS for a modern, responsive layout, Vanilla JavaScript (ES6+ async/await) for dynamic DOM updates and API integration, Chart.js for data visualisations, and Leaflet.js for interactive geospatial mapping."*

* **Q: "How does the frontend handle API failures during live telemetry updates?"**  
  * **Answer:** *"I built an asynchronous resilience layer. If the live model endpoint experiences latency or disconnects, the frontend displays an advisory badge and seamlessly loads cached region states without breaking the user experience."*
