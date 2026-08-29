/**
 * Water Intelligence - Mock Dataset & Region Telemetry
 * Prepared for SIH 2026 - Saurav (Frontend & Visualisation)
 * 
 * This file provides high-fidelity sample data for multiple Indian regions.
 * If the backend API is offline during the hackathon demo, the dashboard
 * seamlessly falls back to these records.
 */

const REGION_DATA = {
  "delhi": {
    name: "Delhi NCR",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    status: "HIGH", // LOW | MODERATE | HIGH | CRITICAL
    statusText: "High Shortage Risk",
    waterTrend: { label: "Declining", change: "-14%", direction: "down" },
    forecast7d: { label: "Decreasing", note: "Dry spell expected next 7 days", direction: "down" },
    storageLevel: { value: 34, label: "34% of Full Capacity", status: "warning" },
    groundwaterDepth: { value: "38.5 m", label: "Depleting (-1.2m YoY)", status: "danger" },
    dailyConsumption: "935 MLD",
    rainfallAnomaly: "-42% vs Normal",
    
    // 4-Day Forecast matching Slide 9 mockup
    next4Days: [
      { day: "Today", value: 58, color: "#10b981", badge: "Moderate" },
      { day: "Day 2", value: 48, color: "#f59e0b", badge: "Stressed" },
      { day: "Day 3", value: 38, color: "#f97316", badge: "High Risk" },
      { day: "Day 4", value: 28, color: "#ef4444", badge: "Critical" }
    ],

    // Multi-week Historical Trends
    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [45, 32, 18, 12, 5],        // in mm
      consumption: [810, 840, 890, 920, 935], // in MLD
      availability: [78, 68, 54, 42, 34]     // in % capacity
    },

    // Contributing Risk Factors
    factors: [
      { name: "Monsoon Deficit", weight: 45, trend: "down", desc: "42% below long-period average in Yamuna catchment" },
      { name: "Urban Consumption Surge", weight: 30, trend: "up", desc: "Peak summer/humidity demand up by 15.4%" },
      { name: "Upstream Inflow Reduction", weight: 25, trend: "down", desc: "Wazirabad barrage level down to 667.2 ft" }
    ],

    // Proactive Early Warning Alert
    alert: {
      active: true,
      level: "HIGH",
      title: "Water Shortage Risk Detected",
      summary: "The selected region is showing a declining water availability trend. Reduced rainfall and increasing consumption are primary contributing factors.",
      recommendations: [
        "Enforce phased municipal supply rationing in outer district sectors (08:00 - 17:00).",
        "Deploy mobile sensor telemetry to detect secondary distribution leakage in grid 4.",
        "Issue proactive conservation advisory to bulk commercial consumers.",
        "Prepare backup water tank logistics for high-density residential blocks."
      ]
    }
  },

  "bundelkhand": {
    name: "Bundelkhand (Jhansi Zone)",
    state: "Uttar Pradesh / MP",
    lat: 25.4484,
    lng: 78.5685,
    status: "CRITICAL",
    statusText: "Critical Drought Stress",
    waterTrend: { label: "Severely Depleting", change: "-28%", direction: "down" },
    forecast7d: { label: "Extreme Dry", note: "No precipitation expected", direction: "down" },
    storageLevel: { value: 19, label: "19% Reservoir Level", status: "danger" },
    groundwaterDepth: { value: "52.3 m", label: "Critical Over-Exploitation", status: "danger" },
    dailyConsumption: "280 MLD",
    rainfallAnomaly: "-58% vs Normal",

    next4Days: [
      { day: "Today", value: 32, color: "#f97316", badge: "High Risk" },
      { day: "Day 2", value: 24, color: "#ef4444", badge: "Critical" },
      { day: "Day 3", value: 18, color: "#b91c1c", badge: "Severe" },
      { day: "Day 4", value: 12, color: "#7f1d1d", badge: "Emergency" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [12, 8, 4, 0, 0],
      consumption: [240, 255, 270, 275, 280],
      availability: [42, 35, 28, 22, 19]
    },

    factors: [
      { name: "Consecutive Rain Failure", weight: 55, trend: "down", desc: "Catchment reservoirs receiving zero fresh runoff" },
      { name: "Agricultural Tube-well Draw", weight: 30, trend: "up", desc: "Unregulated borewell extraction for kharif sowing" },
      { name: "Soil Moisture Depletion", weight: 15, trend: "down", desc: "Topsoil aridity index exceeding critical threshold" }
    ],

    alert: {
      active: true,
      level: "CRITICAL",
      title: "Emergency Water Scarcity Warning",
      summary: "Critical reservoir and aquifer depletion detected. Immediate inter-agency mitigation required within 48 hours.",
      recommendations: [
        "Activate Emergency Water Supply Plan and prepare railway water tankers.",
        "Restrict non-essential industrial water intake immediately.",
        "Prioritize livestock and drinking water supply over secondary agricultural canals."
      ]
    }
  },

  "marathwada": {
    name: "Marathwada (Aurangabad / Sambhajinagar)",
    state: "Maharashtra",
    lat: 19.8762,
    lng: 75.3433,
    status: "HIGH",
    statusText: "High Water Stress",
    waterTrend: { label: "Declining", change: "-18%", direction: "down" },
    forecast7d: { label: "Deficit Trend", note: "Isolated light showers only", direction: "down" },
    storageLevel: { value: 27, label: "27% Jayakwadi Dam Storage", status: "warning" },
    groundwaterDepth: { value: "41.0 m", label: "Semi-Critical Zone", status: "danger" },
    dailyConsumption: "410 MLD",
    rainfallAnomaly: "-35% vs Normal",

    next4Days: [
      { day: "Today", value: 50, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 2", value: 41, color: "#f97316", badge: "Stressed" },
      { day: "Day 3", value: 31, color: "#ef4444", badge: "High Risk" },
      { day: "Day 4", value: 22, color: "#ef4444", badge: "Critical" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [30, 22, 14, 8, 4],
      consumption: [380, 390, 400, 405, 410],
      availability: [58, 49, 39, 31, 27]
    },

    factors: [
      { name: "Deficit Monsoon Inflow", weight: 48, trend: "down", desc: "Godavari basin feeder streams underperforming" },
      { name: "Sugarcane Belt Consumption", weight: 32, trend: "up", desc: "High water footprint crop irrigation demand" },
      { name: "Evaporative Losses", weight: 20, trend: "up", desc: "High ambient temperature increasing surface loss" }
    ],

    alert: {
      active: true,
      level: "HIGH",
      title: "Regional Shortage Prediction Flagged",
      summary: "Jayakwadi dam active storage falling below 30-day buffer threshold under current consumption velocity.",
      recommendations: [
        "Shift canal supply to micro-irrigation schedules.",
        "Enforce strict audit on urban municipal pipeline losses.",
        "Coordinate with state water board for synchronized dam gate control."
      ]
    }
  },

  "jaipur": {
    name: "Jaipur Metropolitan",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    status: "MODERATE",
    statusText: "Moderate Water Stress",
    waterTrend: { label: "Slowly Declining", change: "-6%", direction: "down" },
    forecast7d: { label: "Scattered Rain", note: "Moderate monsoon surge expected", direction: "up" },
    storageLevel: { value: 61, label: "61% Bisalpur Dam Level", status: "success" },
    groundwaterDepth: { value: "32.0 m", label: "Over-exploited in suburban zones", status: "warning" },
    dailyConsumption: "520 MLD",
    rainfallAnomaly: "-12% vs Normal",

    next4Days: [
      { day: "Today", value: 68, color: "#10b981", badge: "Normal" },
      { day: "Day 2", value: 64, color: "#10b981", badge: "Normal" },
      { day: "Day 3", value: 59, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 4", value: 55, color: "#f59e0b", badge: "Moderate" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [60, 45, 30, 25, 35],
      consumption: [500, 505, 515, 520, 520],
      availability: [72, 69, 66, 63, 61]
    },

    factors: [
      { name: "Bisalpur Reservoir Buffer", weight: 50, trend: "stable", desc: "Current storage provides 60-day urban buffer" },
      { name: "Suburban Ground Water Draw", weight: 30, trend: "up", desc: "Heavy reliance on private tankers in outer wards" },
      { name: "Monsoon Revival Outlook", weight: 20, trend: "up", desc: "Upcoming western disturbance may augment supply" }
    ],

    alert: {
      active: false,
      level: "MODERATE",
      title: "Advisory: Monitor Outer Subdivisions",
      summary: "Overall reservoir supply is stable, but groundwater drawdown in peripheral zones requires regulated extraction.",
      recommendations: [
        "Maintain normal urban distribution schedule while monitoring dam levels.",
        "Expedite rainwater harvesting structure inspections in educational institutions."
      ]
    }
  },

  "bengaluru": {
    name: "Bengaluru Urban Zone",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    status: "HIGH",
    statusText: "Borewell & Grid Stress",
    waterTrend: { label: "Declining", change: "-12%", direction: "down" },
    forecast7d: { label: "Moderate Showers", note: "Intermittent convective rainfall", direction: "up" },
    storageLevel: { value: 44, label: "44% Cauvery Reservoir Share", status: "warning" },
    groundwaterDepth: { value: "48.2 m", label: "Severe Borewell Depletion (IT Corridor)", status: "danger" },
    dailyConsumption: "1450 MLD",
    rainfallAnomaly: "-24% vs Normal",

    next4Days: [
      { day: "Today", value: 56, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 2", value: 51, color: "#f59e0b", badge: "Moderate" },
      { day: "Day 3", value: 43, color: "#f97316", badge: "Stressed" },
      { day: "Day 4", value: 36, color: "#ef4444", badge: "High Risk" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [42, 38, 25, 20, 28],
      consumption: [1380, 1400, 1420, 1440, 1450],
      availability: [65, 59, 52, 48, 44]
    },

    factors: [
      { name: "IT Corridor Borewell Failure", weight: 42, trend: "down", desc: "Over 35% public borewells running dry in Mahadevapura" },
      { name: "Cauvery Stage-V Inflow Lag", weight: 33, trend: "stable", desc: "Piped water feeder network undergoing balancing" },
      { name: "Lake Rejuvenation Deficit", weight: 25, trend: "down", desc: "Urban runoff bypassed into stormwater drains" }
    ],

    alert: {
      active: true,
      level: "HIGH",
      title: "Groundwater Stress & Piped Grid Imbalance",
      summary: "Peripheral wards facing tanker dependency and rapid groundwater table drop despite stable Cauvery river inflows.",
      recommendations: [
        "Fix maximum rate caps on private water tankers in high-stress zones.",
        "Mandate treated wastewater reuse for commercial tech parks and gardens.",
        "Accelerate recharge well injection in dry lake beds."
      ]
    }
  },

  "chennai": {
    name: "Chennai Coastal Region",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    status: "LOW",
    statusText: "Normal / Low Risk",
    waterTrend: { label: "Stable / Recovering", change: "+4%", direction: "up" },
    forecast7d: { label: "Normal Inflow", note: "Northeast monsoon preparedness on track", direction: "up" },
    storageLevel: { value: 76, label: "76% Combined Lake Storage", status: "success" },
    groundwaterDepth: { value: "14.5 m", label: "Healthy Aquifer Level", status: "success" },
    dailyConsumption: "860 MLD",
    rainfallAnomaly: "+14% vs Normal",

    next4Days: [
      { day: "Today", value: 82, color: "#10b981", badge: "Abundant" },
      { day: "Day 2", value: 80, color: "#10b981", badge: "Abundant" },
      { day: "Day 3", value: 78, color: "#10b981", badge: "Good" },
      { day: "Day 4", value: 75, color: "#10b981", badge: "Normal" }
    ],

    historical: {
      labels: ["W1 (Aug 01)", "W2 (Aug 08)", "W3 (Aug 15)", "W4 (Aug 22)", "Current (Aug 29)"],
      rainfall: [35, 50, 65, 40, 55],
      consumption: [840, 850, 855, 860, 860],
      availability: [68, 70, 73, 75, 76]
    },

    factors: [
      { name: "Major Reservoir Storage", weight: 60, trend: "up", desc: "Poondi, Chembarambakkam, Red Hills at healthy levels" },
      { name: "Desalination Plant Output", weight: 25, trend: "stable", desc: "Minjur & Nemmeli plants running at 92% capacity" },
      { name: "Rainwater Harvesting Recharge", weight: 15, trend: "up", desc: "Widespread rooftop RWH systems replenishing shallow wells" }
    ],

    alert: {
      active: false,
      level: "LOW",
      title: "System Status: Normal Operations",
      summary: "Current reservoir volumes and desalination outputs are sufficient to satisfy city demand for 120+ days.",
      recommendations: [
        "Continue routine distribution schedule.",
        "Perform pre-monsoon desilting of supply channels and surplus weirs."
      ]
    }
  }
};
