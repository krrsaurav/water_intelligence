"""
Water Intelligence Platform — Local REST API & Simulation Server
Module Owner: Akansha (Database & Backend API)
Smart India Hackathon (SIH 2026)

Serves:
- REST API for dashboard telemetry
- Live Open-Meteo weather integration
- Dynamic real-time weather & scenario simulation
- Static frontend assets & database inspector
"""

import os
import json
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import db_manager

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class WaterIntelligenceHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        def send_json(data, status=200):
            response_bytes = json.dumps(data).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(response_bytes)))
            self.end_headers()
            self.wfile.write(response_bytes)

        # 1. All Regions & Map Markers
        if path == "/api/regions":
            regions = db_manager.get_all_regions()
            return send_json(regions)

        # 2. Main Dashboard & Simulation Endpoint
        elif path == "/api/dashboard":
            region_id = query.get("region", ["REG-01"])[0]
            sim_rain = float(query.get("rain")[0]) if "rain" in query else None
            sim_temp = float(query.get("temp")[0]) if "temp" in query else None
            sim_usage = float(query.get("usage")[0]) if "usage" in query else None

            summary = db_manager.get_dashboard_summary(region_id, sim_rain, sim_temp, sim_usage)
            if summary:
                return send_json(summary)
            return send_json({"error": "Region not found"}, status=404)

        # 3. Live Open-Meteo Weather Sync
        elif path == "/api/live-weather":
            region_id = query.get("region", ["REG-01"])[0]
            summary = db_manager.get_dashboard_summary(region_id)
            if not summary:
                return send_json({"error": "Region not found"}, status=404)

            live_meteo = db_manager.fetch_live_weather_from_api(summary["latitude"], summary["longitude"])
            
            # Recalculate with real live precipitation and temperature
            live_summary = db_manager.get_dashboard_summary(
                region_id, 
                sim_rain=live_meteo["precipitation_mm"], 
                sim_temp=live_meteo["temperature_c"]
            )
            live_summary["live_telemetry_source"] = live_meteo
            return send_json(live_summary)

        # 4. Historical Time Series
        elif path == "/api/timeseries":
            region_id = query.get("region", ["REG-01"])[0]
            days = int(query.get("days", [14])[0])
            ts = db_manager.get_time_series_data(region_id, days)
            return send_json(ts)

        # 5. Database Inspector
        elif path == "/api/tables":
            table_name = query.get("table", ["regions"])[0]
            limit = int(query.get("limit", [25])[0])
            data = db_manager.get_raw_table(table_name, limit)
            return send_json(data)

        # Static file fallback
        return super().do_GET()

def run_server():
    db_manager.init_db()
    db_manager.seed_sample_data()

    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, WaterIntelligenceHandler)
    print(f"\n[SERVER] Water Intelligence Server listening on all network interfaces!")
    print(f"[SERVER] Local PC Access: http://localhost:{PORT}/index.html")
    print(f"[SERVER] Wi-Fi / Phone Access: http://192.168.1.37:{PORT}/index.html")
    print(f"[SERVER] Akansha Guide: http://192.168.1.37:{PORT}/akansha_guide.html\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[SERVER] Server stopped.")

if __name__ == "__main__":
    run_server()
