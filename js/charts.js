/**
 * Water Intelligence - Data Visualisation Layer (Chart.js - Dark Blue & Black Theme)
 * Prepared for SIH 2026 - Saurav (Frontend & Visualisation)
 */

let forecastChartInstance = null;
let historicalChartInstance = null;
let factorDonutInstance = null;

// Global Chart.js Dark Theme Defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';

/**
 * Initializes and updates the 4-Day Water Availability Forecast Bar Chart
 */
function updateForecastChart(next4Days) {
  const ctx = document.getElementById('forecastChart');
  if (!ctx) return;

  const labels = next4Days.map(item => item.day);
  const dataValues = next4Days.map(item => item.value);
  const backgroundColors = next4Days.map(item => item.color);

  if (forecastChartInstance) {
    forecastChartInstance.destroy();
  }

  forecastChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Water Availability (%)',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.55,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#020617',
          titleColor: '#38bdf8',
          bodyColor: '#f1f5f9',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              const idx = context.dataIndex;
              const badge = next4Days[idx].badge || 'Status';
              return ` Availability: ${context.parsed.y}% (${badge})`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: function(value) { return value + '%'; },
            font: { size: 11 },
            color: '#64748b'
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          }
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: {
            font: { size: 12, weight: '600' },
            color: '#cbd5e1'
          }
        }
      },
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      }
    }
  });
}

/**
 * Initializes and updates the Multi-Metric Historical Trend Chart (Dark Theme)
 */
function updateHistoricalChart(historical) {
  const ctx = document.getElementById('historicalChart');
  if (!ctx) return;

  if (historicalChartInstance) {
    historicalChartInstance.destroy();
  }

  historicalChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: historical.labels,
      datasets: [
        {
          label: 'Water Availability (%)',
          data: historical.availability,
          borderColor: '#38bdf8', // Neon Sky Blue
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#38bdf8',
          yAxisID: 'yAvailability'
        },
        {
          label: 'Rainfall (mm)',
          data: historical.rainfall,
          borderColor: '#2dd4bf', // Teal / Cyan
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#2dd4bf',
          yAxisID: 'yRainfall'
        },
        {
          label: 'Consumption (MLD)',
          data: historical.consumption,
          borderColor: '#fb923c', // Electric Orange
          backgroundColor: 'transparent',
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#fb923c',
          yAxisID: 'yConsumption'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            color: '#cbd5e1',
            font: { size: 12, weight: '500' }
          }
        },
        tooltip: {
          backgroundColor: '#020617',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1,
          padding: 12,
          usePointStyle: true
        }
      },
      scales: {
        yAvailability: {
          type: 'linear',
          display: true,
          position: 'left',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Availability (%)',
            color: '#38bdf8',
            font: { size: 11, weight: '600' }
          },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', callback: val => val + '%' }
        },
        yRainfall: {
          type: 'linear',
          display: false,
          position: 'right',
          grid: { drawOnChartArea: false }
        },
        yConsumption: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Consumption (MLD)',
            color: '#fb923c',
            font: { size: 11, weight: '600' }
          },
          grid: { drawOnChartArea: false },
          ticks: { color: '#94a3b8' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.03)' },
          ticks: { color: '#cbd5e1' }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

/**
 * Initializes and updates the Factor Contribution Donut Chart
 */
function updateFactorDonut(factors) {
  const ctx = document.getElementById('factorDonut');
  if (!ctx) return;

  const labels = factors.map(f => f.name);
  const data = factors.map(f => f.weight);
  const colors = ['#f87171', '#fb923c', '#38bdf8', '#34d399'];

  if (factorDonutInstance) {
    factorDonutInstance.destroy();
  }

  factorDonutInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, factors.length),
        borderWidth: 2,
        borderColor: '#0f172a'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            color: '#cbd5e1',
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: '#020617',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return ` Impact Weight: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}
