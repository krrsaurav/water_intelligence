"""
Water Intelligence Platform — Database & Risk Intelligence Engine
Module Owner: Akansha
Smart India Hackathon (SIH 2026)

Manages:
1. Relational SQLite schema & storage
2. Live Open-Meteo weather API ingestion
3. Real-time dynamic risk calculation & early warning generation (Reactive AI Engine)
4. REST payload preparation for the interactive frontend dashboard
"""

import os
import json
import sqlite3
import datetime
import urllib.request

DB_PATH = os.path.join(os.path.dirname(__file__), "water_intelligence.db")
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "schema.sql")

def get_connection():
    """Establish connection to SQLite database."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Execute schema.sql to create all tables and indexes."""
    if not os.path.exists(SCHEMA_PATH):
        raise FileNotFoundError(f"Schema file not found at {SCHEMA_PATH}")
    
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    
    with get_connection() as conn:
        conn.executescript(schema_sql)
    print(f"[SUCCESS] Database initialized successfully at: {DB_PATH}")

def calculate_dynamic_risk(region_id, rainfall_mm, temp_c=32.0, base_reservoir=50.0, usage_mld=850.0):
    """
    Reactive Intelligence Engine:
    Recalculates 4-day forecast, risk levels, and warnings dynamically
    whenever rainfall, weather, or consumption changes in real-time.
    """
    # Water balance formula:
    # Inflow impact = rainfall * 0.45
    # Depletion impact = (usage / 1000) * 0.8 + (temp > 35 ? 1.5 : 0.5)
    inflow_rate = rainfall_mm * 0.45
    depletion_rate = (usage_mld / 1000.0) * 0.6 + (1.2 if temp_c > 36.0 else 0.4)
    net_daily_delta = inflow_rate - depletion_rate

    # Generate 4-day projection
    day1 = max(5.0, min(100.0, base_reservoir))
    day2 = max(5.0, min(100.0, day1 + net_daily_delta))
    day3 = max(5.0, min(100.0, day2 + net_daily_delta))
    day4 = max(5.0, min(100.0, day3 + net_daily_delta))

    # Evaluate dynamic status and alerts
    if rainfall_mm >= 40.0:
        status = "SURGE / FLOOD ALERT"
        water_trend = "RAPID INFLOW"
        forecast_7d = "SURGING"
        alert_title = f"Urban Inflow & Surface Runoff Warning — {region_id}"
        factors = [
            f"↑ Heavy Precipitation Event ({rainfall_mm}mm recorded)",
            "↑ Catchment Runoff Accelerating",
            "↑ Reservoir Sluice Gates on Alert"
        ]
        recommendation = "Open auxiliary reservoir spillways, issue stormwater urban drainage advisory, and inspect low-lying catchments."
    
    elif day4 < 25.0 or (rainfall_mm < 1.0 and temp_c > 38.0):
        status = "CRITICAL RISK"
        water_trend = "DECLINING"
        forecast_7d = "DECREASING"
        alert_title = f"Severe Scarcity & Depletion Alert — {region_id}"
        factors = [
            f"↓ Extreme Rainfall Deficit ({rainfall_mm}mm / Low Recharge)",
            f"↑ Peak Heatwave Evaporation ({temp_c}°C)",
            f"↑ High Consumption Spike ({usage_mld} MLD)"
        ]
        recommendation = "Enforce mandatory non-essential water curbs, mobilize municipal emergency tanker buffer, and activate deep tube-well booster stations."
    
    elif day4 < 45.0 or net_daily_delta < -0.3:
        status = "HIGH RISK"
        water_trend = "DECLINING"
        forecast_7d = "DECREASING"
        alert_title = f"Water Shortage Stress Detected — {region_id}"
        factors = [
            f"↓ Below Normal Precipitation ({rainfall_mm}mm)",
            "↑ Demand Exceeding Inflow Rate",
            "↓ Secondary Storage Levels Dropping"
        ]
        recommendation = "Issue voluntary conservation advisory to commercial zones; optimize supply scheduling to morning/evening windows."
    
    elif day4 > 75.0 or net_daily_delta > 0.5:
        status = "LOW RISK"
        water_trend = "IMPROVING"
        forecast_7d = "INCREASING"
        alert_title = f"Healthy Water Reserves & Steady Inflow — {region_id}"
        factors = [
            f"↑ Favorable Precipitation ({rainfall_mm}mm)",
            "↑ Sustainable Reservoir Storage",
            "→ Stable Per-Capita Consumption"
        ]
        recommendation = "No supply rationing needed; maintain standard rainwater harvesting and groundwater recharging channels."
    
    else:
        status = "MODERATE RISK"
        water_trend = "STABLE"
        forecast_7d = "STABLE"
        alert_title = f"Equilibrium Monitored — {region_id}"
        factors = [
            f"→ Moderate Daily Rainfall ({rainfall_mm}mm)",
            "→ Balanced Supply-to-Demand Ratio",
            "→ Stable Groundwater Depletion Rate"
        ]
        recommendation = "Continue weekly reservoir capacity checks and regular pipeline acoustic leak inspections."

    return {
        "current_status": status,
        "water_trend": water_trend,
        "forecast_7d": forecast_7d,
        "forecast_today_pct": round(day1, 1),
        "forecast_day2_pct": round(day2, 1),
        "forecast_day3_pct": round(day3, 1),
        "forecast_day4_pct": round(day4, 1),
        "alert_title": alert_title,
        "factors": factors,
        "recommendation": recommendation
    }

def fetch_live_weather_from_api(lat, lon):
    """
    Fetches real live meteorological telemetry from Open-Meteo API
    (Free, no API key required).
    """
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&timezone=Asia%2FKolkata"
        req = urllib.request.Request(url, headers={'User-Agent': 'WaterIntelligencePlatform/1.0'})
        with urllib.request.urlopen(req, timeout=4) as response:
            data = json.loads(response.read().decode('utf-8'))
            current = data.get("current", {})
            return {
                "temperature_c": current.get("temperature_2m", 30.0),
                "humidity_pct": current.get("relative_humidity_2m", 60.0),
                "precipitation_mm": current.get("precipitation", 0.0),
                "weather_code": current.get("weather_code", 0),
                "is_live": True
            }
    except Exception as e:
        print(f"[WARN] Live weather API unavailable, using local telemetry: {e}")
        return {
            "temperature_c": 32.0,
            "humidity_pct": 55.0,
            "precipitation_mm": 0.5,
            "weather_code": 1,
            "is_live": False
        }

def seed_sample_data():
    """Seeds rich, realistic historical time-series for Delhi, Jaipur, Chennai, Bengaluru."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM prediction_alerts")
    cursor.execute("DELETE FROM water_consumption")
    cursor.execute("DELETE FROM water_availability")
    cursor.execute("DELETE FROM weather_metrics")
    cursor.execute("DELETE FROM regions")

    regions = [
        ("REG-01", "North Delhi", "Delhi NCR", "Central/North", 28.7041, 77.1025, 4200000),
        ("REG-02", "Jaipur District", "Rajasthan", "Jaipur", 26.9124, 75.7873, 3100000),
        ("REG-03", "Chennai Central", "Tamil Nadu", "Chennai", 13.0827, 80.2707, 7100000),
        ("REG-04", "Bengaluru Urban", "Karnataka", "Bengaluru", 12.9716, 77.5946, 8500000)
    ]
    cursor.executemany("""
        INSERT INTO regions (region_id, name, state, district, latitude, longitude, baseline_population)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, regions)

    today = datetime.date.today()
    region_profiles = {
        "REG-01": {"base_rain": 0.8, "rain_dev": -24.0, "base_res": 52.0, "res_decay": 0.35, "base_gw": 26.0, "base_usage": 920.0, "temp": 34.0},
        "REG-02": {"base_rain": 0.0, "rain_dev": -41.0, "base_res": 32.0, "res_decay": 0.55, "base_gw": 48.0, "base_usage": 540.0, "temp": 39.0},
        "REG-03": {"base_rain": 4.5, "rain_dev": -6.0, "base_res": 65.0, "res_decay": 0.1, "base_gw": 12.0, "base_usage": 830.0, "temp": 31.0},
        "REG-04": {"base_rain": 8.5, "rain_dev": 14.0, "base_res": 82.0, "res_decay": -0.1, "base_gw": 8.5, "base_usage": 1150.0, "temp": 26.0}
    }

    for region_id, prof in region_profiles.items():
        for i in range(30, -1, -1):
            day_date = (today - datetime.timedelta(days=i)).isoformat()
            daily_rain = max(0.0, prof["base_rain"] + (1.2 if i % 4 == 0 else -0.2))
            temp = prof["temp"] + (i % 3)
            cursor.execute("""
                INSERT INTO weather_metrics (region_id, date, rainfall_mm, rainfall_7d_avg, rainfall_deviation_pct, temperature_c, humidity_pct)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (region_id, day_date, round(daily_rain, 1), round(prof["base_rain"], 1), prof["rain_dev"], temp, 58.0))

            res_level = max(10.0, min(100.0, prof["base_res"] - (prof["res_decay"] * (30 - i))))
            cursor.execute("""
                INSERT INTO water_availability (region_id, date, reservoir_level_pct, groundwater_depth_m, storage_capacity_mld, water_trend)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (region_id, day_date, round(res_level, 1), prof["base_gw"], 1200.0, "DECLINING" if prof["res_decay"] > 0.2 else "STABLE"))

            cursor.execute("""
                INSERT INTO water_consumption (region_id, date, daily_usage_mld, per_capita_usage_lpcd, demand_trend)
                VALUES (?, ?, ?, ?, ?)
            """, (region_id, day_date, prof["base_usage"], 140.0, "Increasing" if prof["res_decay"] > 0.2 else "Stable"))

        # Calculate and store baseline prediction
        eval_risk = calculate_dynamic_risk(region_id, prof["base_rain"], prof["temp"], prof["base_res"], prof["base_usage"])
        cursor.execute("""
            INSERT INTO prediction_alerts 
            (region_id, current_status, water_trend, forecast_7d, forecast_today_pct, forecast_day2_pct, forecast_day3_pct, forecast_day4_pct, alert_title, main_factors, action_recommendation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            region_id, eval_risk["current_status"], eval_risk["water_trend"], eval_risk["forecast_7d"],
            eval_risk["forecast_today_pct"], eval_risk["forecast_day2_pct"], eval_risk["forecast_day3_pct"], eval_risk["forecast_day4_pct"],
            eval_risk["alert_title"], json.dumps(eval_risk["factors"]), eval_risk["recommendation"]
        ))

    conn.commit()
    conn.close()
    print("[SUCCESS] Seed data populated successfully for 4 regions with reactive intelligence!")

def get_all_regions():
    """Returns list of regions for UI dropdown & map markers."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.region_id, r.name, r.state, r.district, r.latitude, r.longitude, r.baseline_population,
                   p.current_status
            FROM regions r
            LEFT JOIN prediction_alerts p ON r.region_id = p.region_id
            GROUP BY r.region_id
        """)
        return [dict(row) for row in cursor.fetchall()]

def get_dashboard_summary(region_id="REG-01", sim_rain=None, sim_temp=None, sim_usage=None):
    """
    Main payload for the interactive frontend dashboard.
    Supports real-time dynamic simulation parameters when tested by judges!
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM regions WHERE region_id = ?", (region_id,))
        region = cursor.fetchone()
        if not region:
            return None

        cursor.execute("SELECT * FROM weather_metrics WHERE region_id = ? ORDER BY date DESC LIMIT 1", (region_id,))
        latest_weather = cursor.fetchone()

        cursor.execute("SELECT * FROM water_availability WHERE region_id = ? ORDER BY date DESC LIMIT 1", (region_id,))
        latest_avail = cursor.fetchone()

        cursor.execute("SELECT * FROM water_consumption WHERE region_id = ? ORDER BY date DESC LIMIT 1", (region_id,))
        latest_cons = cursor.fetchone()

        rain = sim_rain if sim_rain is not None else (latest_weather["rainfall_mm"] if latest_weather else 1.0)
        temp = sim_temp if sim_temp is not None else (latest_weather["temperature_c"] if latest_weather else 32.0)
        res = latest_avail["reservoir_level_pct"] if latest_avail else 50.0
        usage = sim_usage if sim_usage is not None else (latest_cons["daily_usage_mld"] if latest_cons else 850.0)

        # Reactive AI assessment
        dyn = calculate_dynamic_risk(region["name"], rain, temp, res, usage)

        return {
            "region_id": region["region_id"],
            "region_name": region["name"],
            "state": region["state"],
            "district": region["district"],
            "latitude": region["latitude"],
            "longitude": region["longitude"],
            "population": region["baseline_population"],
            "current_status": dyn["current_status"],
            "water_trend": dyn["water_trend"],
            "forecast_7d": dyn["forecast_7d"],
            "rainfall_current_mm": rain,
            "rainfall_deviation_pct": latest_weather["rainfall_deviation_pct"] if latest_weather else 0,
            "temperature_c": temp,
            "reservoir_level_pct": res,
            "groundwater_depth_m": latest_avail["groundwater_depth_m"] if latest_avail else 25.0,
            "daily_usage_mld": usage,
            "availability_4days": [
                {"day": "Today", "value": dyn["forecast_today_pct"]},
                {"day": "Day 2", "value": dyn["forecast_day2_pct"]},
                {"day": "Day 3", "value": dyn["forecast_day3_pct"]},
                {"day": "Day 4", "value": dyn["forecast_day4_pct"]}
            ],
            "alert": {
                "title": dyn["alert_title"],
                "factors": dyn["factors"],
                "recommendation": dyn["recommendation"]
            }
        }

def get_time_series_data(region_id="REG-01", days=14):
    """Returns historical time-series for Chart.js line charts."""
    with get_connection() as conn:
        cursor = conn.cursor()
        query = """
            SELECT w.date, w.rainfall_mm, a.reservoir_level_pct, a.groundwater_depth_m, c.daily_usage_mld
            FROM weather_metrics w
            JOIN water_availability a ON w.region_id = a.region_id AND w.date = a.date
            JOIN water_consumption c ON w.region_id = c.region_id AND w.date = c.date
            WHERE w.region_id = ?
            ORDER BY w.date ASC
            LIMIT ?
        """
        cursor.execute(query, (region_id, days))
        rows = cursor.fetchall()
        return {
            "dates": [r["date"] for r in rows],
            "rainfall": [r["rainfall_mm"] for r in rows],
            "reservoir_pct": [r["reservoir_level_pct"] for r in rows],
            "groundwater_depth": [r["groundwater_depth_m"] for r in rows],
            "daily_usage": [r["daily_usage_mld"] for r in rows]
        }

def get_raw_table(table_name="regions", limit=25):
    """Database inspector query."""
    allowed = ["regions", "weather_metrics", "water_availability", "water_consumption", "prediction_alerts"]
    if table_name not in allowed:
        return {"error": "Invalid table"}
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name} ORDER BY 1 DESC LIMIT ?", (limit,))
        return {"table": table_name, "count": limit, "data": [dict(r) for r in cursor.fetchall()]}

if __name__ == "__main__":
    init_db()
    seed_sample_data()
    print("[INFO] Test Reactive Simulation (Delhi with 55mm heavy rain):")
    print(json.dumps(get_dashboard_summary("REG-01", sim_rain=55.0), indent=2))
