/**
 * Water Intelligence - Geographic Intelligence & Interactive Map (Dark Blue & Black Theme)
 * Prepared for SIH 2026 - Saurav (Frontend & Visualisation)
 */

let mapInstance = null;
let markersGroup = null;

function getRiskColor(status) {
  switch (status.toUpperCase()) {
    case 'LOW':
      return '#34d399'; // Emerald
    case 'MODERATE':
      return '#fbbf24'; // Amber
    case 'HIGH':
      return '#fb923c'; // Orange
    case 'CRITICAL':
      return '#f87171'; // Red
    default:
      return '#94a3b8';
  }
}

/**
 * Initialize Leaflet interactive map with Dark Matter tiles
 */
function initMap(regionData, onSelectRegionCallback) {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Center on India
  mapInstance = L.map('map', {
    center: [22.5, 78.9],
    zoom: 4.8,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // Dark Theme Map Tiles (CartoDB Dark Matter)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> | Water Intelligence SIH 2026',
    maxZoom: 18
  }).addTo(mapInstance);

  markersGroup = L.featureGroup().addTo(mapInstance);

  // Add region pins
  Object.keys(regionData).forEach(key => {
    const region = regionData[key];
    const color = getRiskColor(region.status);

    // Glowing circle marker
    const marker = L.circleMarker([region.lat, region.lng], {
      radius: 11,
      fillColor: color,
      color: '#ffffff',
      weight: 2,
      opacity: 0.9,
      fillOpacity: 0.85
    });

    // Dark-themed Popup
    const popupContent = `
      <div class="p-1 text-slate-100">
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <strong class="text-sm font-black text-white tracking-tight">${region.name}</strong>
          <span class="text-[10px] px-2 py-0.5 rounded font-black uppercase text-slate-950 shadow-xs" style="background-color: ${color}">
            ${region.status}
          </span>
        </div>
        <p class="text-xs text-slate-300 mb-2">${region.statusText}</p>
        <div class="text-xs space-y-1.5 text-slate-200 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div class="flex justify-between">
            <span class="text-slate-400">Storage:</span>
            <strong class="text-sky-400 font-bold">${region.storageLevel.value}%</strong>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Trend:</span>
            <strong class="${region.waterTrend.direction === 'down' ? 'text-rose-400' : 'text-emerald-400'} font-bold">
              ${region.waterTrend.label} (${region.waterTrend.change})
            </strong>
          </div>
        </div>
        <button onclick="window.selectRegion('${key}')" class="mt-2.5 w-full text-center bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs py-1.5 px-2 rounded-lg transition shadow-md">
          Load Dashboard Data →
        </button>
      </div>
    `;

    marker.bindPopup(popupContent, { minWidth: 210 });

    marker.on('click', () => {
      if (onSelectRegionCallback) {
        onSelectRegionCallback(key);
      }
    });

    markersGroup.addLayer(marker);
  });
}

function focusMapRegion(regionKey, regionData) {
  if (!mapInstance || !regionData[regionKey]) return;
  const region = regionData[regionKey];
  mapInstance.flyTo([region.lat, region.lng], 7, {
    animate: true,
    duration: 1.2
  });
}
