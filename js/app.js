/**
 * Water Intelligence - Main Application Controller (Dark Blue & Black Edition)
 * Prepared for SIH 2026 - Saurav (Frontend, Dashboard & Data Visualisation)
 */

// Application State
const state = {
  currentRegionKey: "delhi",
  isLiveApiMode: false,
  backendApiUrl: "http://127.0.0.1:5000/api/water-intelligence",
  data: REGION_DATA
};

// Expose selectRegion globally for Leaflet map popups
window.selectRegion = function(regionKey) {
  if (state.data[regionKey]) {
    state.currentRegionKey = regionKey;
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) regionSelect.value = regionKey;
    renderDashboard(regionKey);
    focusMapRegion(regionKey, state.data);
  }
};

/**
 * Main DOM Content Loaded Event Listener
 */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Populate Region Dropdown
  setupRegionDropdown();

  // Initialize Map
  initMap(state.data, (selectedKey) => {
    state.currentRegionKey = selectedKey;
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) regionSelect.value = selectedKey;
    renderDashboard(selectedKey);
  });

  // Initial Dashboard Render
  renderDashboard(state.currentRegionKey);

  // Setup Event Listeners
  setupEventListeners();
});

function setupRegionDropdown() {
  const select = document.getElementById("regionSelect");
  if (!select) return;

  select.innerHTML = "";
  Object.keys(state.data).forEach(key => {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = `${state.data[key].name} (${state.data[key].state})`;
    option.className = "bg-slate-900 text-slate-100 py-1";
    if (key === state.currentRegionKey) option.selected = true;
    select.appendChild(option);
  });
}

function setupEventListeners() {
  // Region Dropdown change
  const regionSelect = document.getElementById("regionSelect");
  if (regionSelect) {
    regionSelect.addEventListener("change", (e) => {
      window.selectRegion(e.target.value);
    });
  }

  // Tab switching
  const tabButtons = document.querySelectorAll("[data-tab-target]");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      switchTab(target);
    });
  });

  // API Mode Toggle
  const apiModeToggle = document.getElementById("apiModeToggle");
  if (apiModeToggle) {
    apiModeToggle.addEventListener("change", async (e) => {
      state.isLiveApiMode = e.target.checked;
      const statusBadge = document.getElementById("apiStatusBadge");
      
      if (state.isLiveApiMode) {
        statusBadge.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5"></span> Live API: Polling Backend`;
        statusBadge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 flex items-center border border-emerald-500/40 shadow-xs";
        await fetchLiveBackendData(state.currentRegionKey);
      } else {
        statusBadge.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1.5"></span> Demo Mode`;
        statusBadge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 flex items-center border border-sky-500/40 shadow-xs";
        renderDashboard(state.currentRegionKey);
      }
    });
  }

  // Quick Action Button
  const btnTriggerSim = document.getElementById("btnTriggerSim");
  if (btnTriggerSim) {
    btnTriggerSim.addEventListener("click", () => {
      simulatePredictionDrift();
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll("[data-tab-target]").forEach(btn => {
    if (btn.getAttribute("data-tab-target") === tabId) {
      btn.className = "tab-btn active-tab px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 border-sky-400 text-sky-400 flex items-center gap-2 whitespace-nowrap";
    } else {
      btn.className = "tab-btn px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-2 whitespace-nowrap";
    }
  });

  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.add("hidden");
  });
  const activePanel = document.getElementById(tabId);
  if (activePanel) {
    activePanel.classList.remove("hidden");
  }

  if (tabId === "map-view-tab" && mapInstance) {
    setTimeout(() => {
      mapInstance.invalidateSize();
    }, 150);
  }
}

function renderDashboard(regionKey) {
  const data = state.data[regionKey];
  if (!data) return;

  // 1. Header
  setText("regionTitle", data.name);
  setText("regionSubtitle", `Telemetry Node: ${data.state} · Updated Live`);

  // 2. Risk Status Badge
  renderRiskStatusBadge(data.status, data.statusText);

  // 3. KPI Cards
  setText("trendValue", `${data.waterTrend.direction === 'down' ? '↓' : '↑'} ${data.waterTrend.label}`);
  setText("trendDelta", `${data.waterTrend.change} baseline variance`);
  const trendEl = document.getElementById("trendValue");
  if (trendEl) {
    trendEl.className = data.waterTrend.direction === 'down' 
      ? 'text-xl font-black text-rose-400 flex items-center gap-1' 
      : 'text-xl font-black text-emerald-400 flex items-center gap-1';
  }

  setText("forecast7dValue", data.forecast7d.label);
  setText("forecast7dNote", data.forecast7d.note);

  setText("storageValue", `${data.storageLevel.value}%`);
  setText("storageNote", data.storageLevel.label);
  setText("groundwaterValue", data.groundwaterDepth.value);
  setText("groundwaterNote", data.groundwaterDepth.label);
  setText("consumptionValue", data.dailyConsumption);
  setText("rainfallAnomalyValue", data.rainfallAnomaly);

  // 4. Update Charts
  updateForecastChart(data.next4Days);
  updateHistoricalChart(data.historical);
  updateFactorDonut(data.factors);

  // 5. Render Early Warning Alert
  renderAlertBanner(data);

  // 6. Render Contributing Factors
  renderFactorsList(data.factors);

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderRiskStatusBadge(status, statusText) {
  const badge = document.getElementById("statusBadge");
  if (!badge) return;

  let colorClasses = "";
  let iconName = "alert-triangle";

  switch (status.toUpperCase()) {
    case "CRITICAL":
      colorClasses = "bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-lg shadow-rose-950/40 animate-pulse";
      iconName = "alert-octagon";
      break;
    case "HIGH":
      colorClasses = "bg-orange-950/90 text-orange-300 border-orange-500/60 shadow-lg shadow-orange-950/40";
      iconName = "alert-triangle";
      break;
    case "MODERATE":
      colorClasses = "bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-950/40";
      iconName = "info";
      break;
    case "LOW":
    default:
      colorClasses = "bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/40";
      iconName = "check-circle-2";
      break;
  }

  badge.className = `px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider border flex items-center gap-1.5 ${colorClasses}`;
  badge.innerHTML = `<i data-lucide="${iconName}" class="w-4 h-4"></i> ${status} RISK`;
}

function renderAlertBanner(data) {
  const alertContainer = document.getElementById("alertBannerContainer");
  if (!alertContainer) return;

  const alert = data.alert;
  if (!alert) {
    alertContainer.innerHTML = "";
    return;
  }

  const isHighOrCritical = data.status === "HIGH" || data.status === "CRITICAL";
  const bgClass = isHighOrCritical 
    ? "bg-rose-950/40 border-rose-800/60 text-rose-100" 
    : "bg-emerald-950/40 border-emerald-800/60 text-emerald-100";
  const badgeClass = isHighOrCritical ? "bg-rose-600 text-white" : "bg-emerald-600 text-white";

  alertContainer.innerHTML = `
    <div class="rounded-2xl border p-5 ${bgClass} backdrop-blur shadow-lg">
      <div class="flex items-start gap-3.5">
        <div class="p-2.5 rounded-xl ${badgeClass} shrink-0 mt-0.5 shadow-md">
          <i data-lucide="${isHighOrCritical ? 'alert-triangle' : 'shield-check'}" class="w-5 h-5"></i>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2.5 mb-1.5">
            <h4 class="font-black text-base tracking-tight text-white">${alert.title}</h4>
            <span class="text-[10px] px-2 py-0.5 rounded font-black uppercase ${badgeClass}">${data.status}</span>
          </div>
          <p class="text-sm text-slate-300 mb-3.5">${alert.summary}</p>
          
          <!-- Key Contributing Factors Pills (Slide 9) -->
          <div class="flex flex-wrap items-center gap-2 mb-3.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Main Factors:</span>
            ${data.factors.map(f => `
              <span class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 shadow-xs">
                <span class="${f.trend === 'down' ? 'text-rose-400 font-black' : 'text-amber-400 font-black'}">${f.trend === 'down' ? '↓' : '↑'}</span>
                <span>${f.name}</span>
              </span>
            `).join('')}
          </div>

          <!-- Actionable AI Recommendations -->
          <div class="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
            <p class="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sky-400"></i> Proactive Decision Support (Early Action):
            </p>
            <ul class="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              ${alert.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFactorsList(factors) {
  const container = document.getElementById("factorsListContainer");
  if (!container) return;

  container.innerHTML = factors.map(factor => `
    <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition">
      <div class="flex items-center justify-between mb-1.5">
        <span class="text-xs font-bold text-slate-200 flex items-center gap-1">
          <span class="font-bold ${factor.trend === 'down' ? 'text-rose-400' : 'text-amber-400'}">
            ${factor.trend === 'down' ? '↓' : '↑'}
          </span>
          ${factor.name}
        </span>
        <span class="text-[11px] font-black text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30">
          ${factor.weight}% weight
        </span>
      </div>
      <p class="text-xs text-slate-400 leading-relaxed">${factor.desc}</p>
    </div>
  `).join('');
}

async function fetchLiveBackendData(regionKey) {
  try {
    const url = `${state.backendApiUrl}?region=${encodeURIComponent(regionKey)}`;
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const liveJson = await response.json();
    
    state.data[regionKey] = liveJson;
    renderDashboard(regionKey);
  } catch (err) {
    console.warn("Live API connection unreachable, using fallback:", err);
    renderDashboard(regionKey);
    
    const banner = document.getElementById("apiStatusBadge");
    if (banner) {
      banner.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1.5"></span> API Standby (Demo Mock)`;
      banner.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 flex items-center border border-amber-500/40";
    }
  }
}

function simulatePredictionDrift() {
  const current = state.data[state.currentRegionKey];
  if (!current) return;

  current.status = "CRITICAL";
  current.statusText = "Simulated Heatwave & Inflow Shock";
  current.waterTrend = { label: "Severe Plunge", change: "-34%", direction: "down" };
  current.next4Days = [
    { day: "Today", value: 45, color: "#fb923c", badge: "Stressed" },
    { day: "Day 2", value: 32, color: "#f87171", badge: "Critical" },
    { day: "Day 3", value: 20, color: "#ef4444", badge: "Severe" },
    { day: "Day 4", value: 14, color: "#991b1b", badge: "Emergency" }
  ];
  current.alert.title = "SIMULATION ALERT: Accelerated Aquifer Depletion";
  current.alert.summary = "Deep learning model flags high probability of reservoir head exhaustion within 96 hours.";

  renderDashboard(state.currentRegionKey);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
