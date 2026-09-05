/**
 * Water Intelligence - Main Application Controller (Dynamic Live Telemetry Edition)
 * Prepared for SIH 2026 - Saurav (Frontend, Dashboard & Data Visualisation)
 */

const CORRECT_PIN = "2026";

// Application State
const state = {
  currentRegionKey: "delhi",
  isLiveApiMode: false,
  backendApiUrl: "http://127.0.0.1:5000/api/water-intelligence",
  data: JSON.parse(JSON.stringify(REGION_DATA)), // Clone deep copy for dynamic mutations
  isUnlocked: false,
  autoStreamInterval: null,
  isAutoStreamActive: true
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

// Lock/Unlock Functions
window.lockDashboard = function() {
  localStorage.removeItem("wi_dashboard_unlocked");
  state.isUnlocked = false;
  const lockModal = document.getElementById("lockModal");
  if (lockModal) {
    lockModal.classList.remove("hidden");
    lockModal.classList.remove("opacity-0");
  }
  const pinInput = document.getElementById("pinInput");
  if (pinInput) {
    pinInput.value = "";
    pinInput.focus();
  }
};

window.unlockDashboard = function() {
  const pinInput = document.getElementById("pinInput");
  const errorMsg = document.getElementById("pinErrorMsg");
  const lockCard = document.getElementById("lockCard");
  const enteredPin = pinInput ? pinInput.value.trim() : "";

  if (enteredPin === CORRECT_PIN) {
    localStorage.setItem("wi_dashboard_unlocked", "true");
    state.isUnlocked = true;
    
    if (errorMsg) errorMsg.classList.add("hidden");

    const lockModal = document.getElementById("lockModal");
    if (lockModal) {
      lockModal.classList.add("transition-all", "duration-500", "opacity-0", "pointer-events-none");
      setTimeout(() => {
        lockModal.classList.add("hidden");
      }, 500);
    }

    setTimeout(() => {
      renderDashboard(state.currentRegionKey);
      if (mapInstance) mapInstance.invalidateSize();
    }, 100);

  } else {
    if (errorMsg) {
      errorMsg.textContent = "Incorrect Security PIN. Please try again.";
      errorMsg.classList.remove("hidden");
    }
    if (lockCard) {
      lockCard.classList.remove("animate-shake");
      void lockCard.offsetWidth;
      lockCard.classList.add("animate-shake");
    }
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
  }
};

/**
 * Main DOM Content Loaded Event Listener
 */
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  setupLockScreen();
  setupRegionDropdown();

  initMap(state.data, (selectedKey) => {
    state.currentRegionKey = selectedKey;
    const regionSelect = document.getElementById("regionSelect");
    if (regionSelect) regionSelect.value = selectedKey;
    renderDashboard(selectedKey);
  });

  applyLiveTelemetryJitter(state.currentRegionKey, false);
  renderDashboard(state.currentRegionKey);
  setupEventListeners();
  startLiveAutoStream();
});

function setupLockScreen() {
  const isUnlocked = localStorage.getItem("wi_dashboard_unlocked") === "true";
  const lockModal = document.getElementById("lockModal");
  const pinInput = document.getElementById("pinInput");
  const unlockBtn = document.getElementById("unlockBtn");

  if (isUnlocked) {
    state.isUnlocked = true;
    if (lockModal) lockModal.classList.add("hidden");
  } else {
    state.isUnlocked = false;
    if (lockModal) {
      lockModal.classList.remove("hidden");
      if (pinInput) setTimeout(() => pinInput.focus(), 200);
    }
  }

  if (unlockBtn) {
    unlockBtn.addEventListener("click", window.unlockDashboard);
  }

  if (pinInput) {
    pinInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        window.unlockDashboard();
      }
    });
  }
}

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
  const regionSelect = document.getElementById("regionSelect");
  if (regionSelect) {
    regionSelect.addEventListener("change", (e) => {
      window.selectRegion(e.target.value);
    });
  }

  const tabButtons = document.querySelectorAll("[data-tab-target]");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      switchTab(target);
    });
  });

  const btnManualRefresh = document.getElementById("btnManualRefresh");
  if (btnManualRefresh) {
    btnManualRefresh.addEventListener("click", () => {
      const icon = document.getElementById("refreshIcon");
      if (icon) {
        icon.classList.remove("spinning-icon");
        void icon.offsetWidth;
        icon.classList.add("spinning-icon");
      }
      applyLiveTelemetryJitter(state.currentRegionKey, true);
      renderDashboard(state.currentRegionKey);
    });
  }

  const autoStreamToggle = document.getElementById("autoStreamToggle");
  if (autoStreamToggle) {
    autoStreamToggle.addEventListener("change", (e) => {
      state.isAutoStreamActive = e.target.checked;
      const pulsePing = document.getElementById("livePulsePing");
      const pulseDot = document.getElementById("livePulseDot");
      const statusText = document.getElementById("liveStatusText");

      if (state.isAutoStreamActive) {
        startLiveAutoStream();
        if (pulsePing) pulsePing.classList.remove("hidden");
        if (pulseDot) pulseDot.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
        if (statusText) statusText.textContent = "Live Stream (6s)";
      } else {
        stopLiveAutoStream();
        if (pulsePing) pulsePing.classList.add("hidden");
        if (pulseDot) pulseDot.className = "relative inline-flex rounded-full h-2 w-2 bg-slate-500";
        if (statusText) statusText.textContent = "Stream Paused";
      }
    });
  }

  const btnTriggerSim = document.getElementById("btnTriggerSim");
  if (btnTriggerSim) {
    btnTriggerSim.addEventListener("click", () => {
      simulatePredictionDrift();
    });
  }

  const btnLockScreen = document.getElementById("btnLockScreen");
  if (btnLockScreen) {
    btnLockScreen.addEventListener("click", () => {
      window.lockDashboard();
    });
  }
}

function startLiveAutoStream() {
  if (state.autoStreamInterval) clearInterval(state.autoStreamInterval);
  state.autoStreamInterval = setInterval(() => {
    if (state.isAutoStreamActive) {
      applyLiveTelemetryJitter(state.currentRegionKey, false);
      renderDashboard(state.currentRegionKey);
    }
  }, 6000);
}

function stopLiveAutoStream() {
  if (state.autoStreamInterval) {
    clearInterval(state.autoStreamInterval);
    state.autoStreamInterval = null;
  }
}

function applyLiveTelemetryJitter(regionKey, isManual) {
  const baseData = REGION_DATA[regionKey];
  if (!baseData) return;

  const updated = JSON.parse(JSON.stringify(baseData));

  // 1. Storage micro variance (+/- 0.8%)
  const storageJitter = (Math.random() * 1.6 - 0.8);
  const newStorage = Math.max(8, Math.min(96, Number((baseData.storageLevel.value + storageJitter).toFixed(1))));
  updated.storageLevel.value = newStorage;

  // 2. Groundwater depth micro variance (+/- 0.15m)
  const gwJitter = (Math.random() * 0.3 - 0.15);
  const baseGwNum = parseFloat(baseData.groundwaterDepth.value);
  if (!isNaN(baseGwNum)) {
    updated.groundwaterDepth.value = `${(baseGwNum + gwJitter).toFixed(1)} m`;
  }

  // 3. Urban Consumption variance (+/- 4 MLD)
  const baseCons = parseInt(baseData.dailyConsumption);
  if (!isNaN(baseCons)) {
    const consJitter = Math.floor(Math.random() * 9 - 4);
    updated.dailyConsumption = `${baseCons + consJitter} MLD`;
  }

  // 4. ML 4-Day Forecast slight dynamic adjustment
  updated.next4Days = baseData.next4Days.map((item, idx) => {
    const dayJitter = Math.floor(Math.random() * 5 - 2);
    const val = Math.max(10, Math.min(95, item.value + dayJitter));
    return { ...item, value: val };
  });

  state.data[regionKey] = updated;

  // Update live timestamp
  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0];
  const lastUpdatedEl = document.getElementById("lastUpdatedBadge");
  if (lastUpdatedEl) {
    lastUpdatedEl.innerHTML = `<span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span> Live Ingested: ${timeStr}`;
  }

  flashMetricCards();
}

function flashMetricCards() {
  const elements = [
    document.getElementById("storageValue"),
    document.getElementById("groundwaterValue"),
    document.getElementById("consumptionValue")
  ];

  elements.forEach(el => {
    if (el) {
      el.classList.remove("flash-update");
      void el.offsetWidth;
      el.classList.add("flash-update");
    }
  });
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

  setText("regionTitle", data.name);
  setText("regionSubtitle", `Monitoring Zone: ${data.state} · Real-time Sensor Ingestion`);

  renderRiskStatusBadge(data.status, data.statusText);

  setText("trendValue", `${data.waterTrend.direction === 'down' ? '↓' : '↑'} ${data.waterTrend.label}`);
  setText("trendDelta", `${data.waterTrend.change} baseline variance`);
  const trendEl = document.getElementById("trendValue");
  if (trendEl) {
    trendEl.className = data.waterTrend.direction === 'down' 
      ? 'text-base sm:text-xl font-black text-rose-400 flex items-center gap-1' 
      : 'text-base sm:text-xl font-black text-emerald-400 flex items-center gap-1';
  }

  setText("forecast7dValue", data.forecast7d.label);
  setText("forecast7dNote", data.forecast7d.note);

  setText("storageValue", `${data.storageLevel.value}%`);
  setText("storageNote", data.storageLevel.label);
  setText("groundwaterValue", data.groundwaterDepth.value);
  setText("groundwaterNote", data.groundwaterDepth.label);
  setText("consumptionValue", data.dailyConsumption);
  setText("rainfallAnomalyValue", data.rainfallAnomaly);

  updateForecastChart(data.next4Days);
  updateHistoricalChart(data.historical);
  updateFactorDonut(data.factors);

  renderAlertBanner(data);
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

  badge.className = `px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider border flex items-center gap-1.5 ${colorClasses}`;
  badge.innerHTML = `<i data-lucide="${iconName}" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i> ${status} RISK`;
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
    <div class="rounded-2xl border p-4 sm:p-5 ${bgClass} backdrop-blur shadow-lg">
      <div class="flex items-start gap-3 sm:gap-3.5">
        <div class="p-2 sm:p-2.5 rounded-xl ${badgeClass} shrink-0 mt-0.5 shadow-md">
          <i data-lucide="${isHighOrCritical ? 'alert-triangle' : 'shield-check'}" class="w-4 h-4 sm:w-5 sm:h-5"></i>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-black text-sm sm:text-base tracking-tight text-white">${alert.title}</h4>
            <span class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-black uppercase ${badgeClass}">${data.status}</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 mb-3">${alert.summary}</p>
          
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
            <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Main Factors:</span>
            ${data.factors.map(f => `
              <span class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200">
                <span class="${f.trend === 'down' ? 'text-rose-400 font-black' : 'text-amber-400 font-black'}">${f.trend === 'down' ? '↓' : '↑'}</span>
                <span>${f.name}</span>
              </span>
            `).join('')}
          </div>

          <div class="bg-slate-900/90 rounded-xl p-3 sm:p-4 border border-slate-800">
            <p class="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-sky-400"></i> Proactive Decision Support (Early Action):
            </p>
            <ul class="space-y-1 text-xs text-slate-300 list-disc list-inside">
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
    <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 transition">
      <div class="flex items-center justify-between mb-1">
        <span class="text-xs font-bold text-slate-200 flex items-center gap-1">
          <span class="font-bold ${factor.trend === 'down' ? 'text-rose-400' : 'text-amber-400'}">
            ${factor.trend === 'down' ? '↓' : '↑'}
          </span>
          ${factor.name}
        </span>
        <span class="text-[10px] sm:text-[11px] font-black text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded-full border border-sky-500/30">
          ${factor.weight}% weight
        </span>
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed">${factor.desc}</p>
    </div>
  `).join('');
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
  flashMetricCards();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
