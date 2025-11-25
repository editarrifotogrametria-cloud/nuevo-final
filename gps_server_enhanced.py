#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GPS Server Enhanced - Con todas las APIs integradas
Incluye project_manager, NTRIP control, y más funcionalidades
"""

import os
import json
import time
import threading
from datetime import datetime
from flask import Flask, jsonify, send_file, send_from_directory, request
from flask_socketio import SocketIO

# Import local modules
from project_manager import ProjectManager

# ====================================================================
# Configuration
# ====================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")
JSON_DATA_FILE = "/tmp/gnssai_dashboard_data.json"

# ====================================================================
# Global State
# ====================================================================
latest_stats = {}
uptime_sec = 0
project_manager = None

# ====================================================================
# Flask App Setup
# ====================================================================
app = Flask(__name__)
app.config['SECRET_KEY'] = 'gnss-professional-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# ====================================================================
# Initialize Project Manager
# ====================================================================
def init_project_manager():
    global project_manager
    data_dir = os.path.join(BASE_DIR, "data")
    project_manager = ProjectManager(data_dir)
    print("✓ Project Manager initialized")

# ====================================================================
# Utility Functions
# ====================================================================
def safe_read_json(path):
    """Safely read JSON file."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

# ====================================================================
# Background Threads
# ====================================================================
def read_json_data():
    """Read GPS data from JSON file periodically."""
    global latest_stats
    while True:
        data = safe_read_json(JSON_DATA_FILE)
        if data:
            latest_stats = data
            try:
                socketio.emit("stats", data, namespace="/gnss")
            except Exception:
                pass
        time.sleep(1.0)

def update_uptime():
    """Update server uptime counter."""
    global uptime_sec
    while True:
        uptime_sec += 1
        time.sleep(1.0)

# ====================================================================
# Routes - Main Pages
# ====================================================================

@app.route("/")
def index():
    """Landing page with links to different interfaces."""
    html = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GNSS Professional</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                width: 100%;
            }
            .header {
                text-align: center;
                color: white;
                margin-bottom: 40px;
            }
            .header h1 {
                font-size: 48px;
                margin-bottom: 12px;
            }
            .header p {
                font-size: 18px;
                opacity: 0.9;
            }
            .cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 24px;
            }
            .card {
                background: white;
                border-radius: 12px;
                padding: 32px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transition: transform 0.3s, box-shadow 0.3s;
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                display: block;
            }
            .card:hover {
                transform: translateY(-8px);
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
            }
            .card-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            .card h2 {
                font-size: 22px;
                margin-bottom: 12px;
                color: #333;
            }
            .card p {
                color: #666;
                line-height: 1.6;
                font-size: 14px;
            }
            .badge {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                margin-top: 12px;
            }
            .badge-featured {
                background: #4CAF50;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛰️ GNSS Professional</h1>
                <p>Sistema profesional de recolección y procesamiento GNSS</p>
            </div>
            <div class="cards">
                <a href="/dashboard" class="card">
                    <div class="card-icon">📊</div>
                    <h2>Dashboard</h2>
                    <p>Monitor en tiempo real con visualización de datos GNSS, ML, y estadísticas.</p>
                    <span class="badge badge-featured">TIEMPO REAL</span>
                </a>
                <a href="/projects" class="card">
                    <div class="card-icon">📁</div>
                    <h2>Proyectos</h2>
                    <p>Gestión de proyectos de levantamiento con puntos y exportación.</p>
                    <span class="badge">GESTIÓN</span>
                </a>
                <a href="/api/stats" class="card">
                    <div class="card-icon">📡</div>
                    <h2>API REST</h2>
                    <p>API completa para integración con aplicaciones externas.</p>
                    <span class="badge">API</span>
                </a>
            </div>
        </div>
    </body>
    </html>
    """
    return html

@app.route("/dashboard")
def dashboard():
    """Dashboard page."""
    try:
        # Return embedded dashboard from dashboard_server.py
        from dashboard_server import DASHBOARD_HTML
        return DASHBOARD_HTML
    except:
        return "Dashboard no disponible", 500

@app.route("/projects")
def projects_page():
    """Projects management page."""
    projects = project_manager.list_projects() if project_manager else []

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proyectos - GNSS Professional</title>
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #f5f7fa;
                margin: 0;
                padding: 20px;
            }}
            .container {{
                max-width: 1200px;
                margin: 0 auto;
            }}
            .header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
            }}
            h1 {{
                color: #333;
            }}
            .btn {{
                background: #667eea;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }}
            .btn:hover {{
                background: #5568d3;
            }}
            .project-card {{
                background: white;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }}
            .project-card h3 {{
                margin: 0 0 8px 0;
                color: #333;
            }}
            .project-card p {{
                margin: 4px 0;
                color: #666;
            }}
            .stats {{
                display: flex;
                gap: 16px;
                margin-top: 12px;
            }}
            .stat {{
                background: #f0f2f5;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📁 Proyectos</h1>
                <a href="/api/projects/new" class="btn">+ Nuevo Proyecto</a>
            </div>
            {"<p>No hay proyectos aún</p>" if not projects else ""}
            {"".join([f'''
            <div class="project-card">
                <h3>{p['name']}</h3>
                <p>{p.get('description', 'Sin descripción')}</p>
                <div class="stats">
                    <div class="stat">Puntos: {p.get('statistics', {}).get('total_points', 0)}</div>
                    <div class="stat">RTK Fixed: {p.get('statistics', {}).get('rtk_fixed', 0)}</div>
                    <div class="stat">Creado: {p.get('created', 'N/A')[:10]}</div>
                </div>
            </div>
            ''' for p in projects])}
        </div>
    </body>
    </html>
    """
    return html

# ====================================================================
# API Routes - Stats
# ====================================================================

@app.route("/api/stats")
def api_stats():
    """API endpoint for GPS statistics."""
    data = dict(latest_stats) if latest_stats else {}
    data["uptime_sec"] = uptime_sec

    # Ensure tilt block exists
    if "tilt" not in data or not isinstance(data["tilt"], dict):
        data["tilt"] = {
            "pitch": 0.0,
            "roll": 0.0,
            "heading": 0.0,
            "angle": 0.0,
            "status": "NONE",
        }

    return jsonify(data)

# ====================================================================
# API Routes - Projects
# ====================================================================

@app.route("/api/projects", methods=["GET"])
def api_projects_list():
    """List all projects."""
    if not project_manager:
        return jsonify({"error": "Project manager not initialized"}), 500

    projects = project_manager.list_projects()
    return jsonify({"projects": projects})

@app.route("/api/projects", methods=["POST"])
def api_projects_create():
    """Create a new project."""
    if not project_manager:
        return jsonify({"error": "Project manager not initialized"}), 500

    data = request.get_json()
    name = data.get('name', 'Nuevo Proyecto')
    description = data.get('description', '')
    datum = data.get('datum', 'WGS84')

    project = project_manager.create_project(name, description, datum)
    return jsonify({"project": project}), 201

@app.route("/api/projects/<project_id>", methods=["GET"])
def api_projects_get(project_id):
    """Get project details."""
    if not project_manager:
        return jsonify({"error": "Project manager not initialized"}), 500

    project = project_manager.get_project(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404

    return jsonify({"project": project})

@app.route("/api/projects/<project_id>/points", methods=["GET"])
def api_projects_points_list(project_id):
    """List points in a project."""
    if not project_manager:
        return jsonify({"error": "Project manager not initialized"}), 500

    points = project_manager.list_points(project_id)
    return jsonify({"points": points})

@app.route("/api/projects/<project_id>/points", methods=["POST"])
def api_projects_points_add(project_id):
    """Add a point to a project."""
    if not project_manager:
        return jsonify({"error": "Project manager not initialized"}), 500

    data = request.get_json()

    point = project_manager.add_point(
        project_id,
        data.get('point_id', f'P{int(time.time())}'),
        data.get('lat', 0.0),
        data.get('lon', 0.0),
        data.get('alt', 0.0),
        data.get('quality', 1),
        data.get('hdop', 1.0),
        data.get('satellites', 0),
        data.get('occupation_time', 0),
        data.get('notes', '')
    )

    return jsonify({"point": point}), 201

@app.route("/api/projects/<project_id>/export/<format>", methods=["GET"])
def api_projects_export(project_id, format):
    """Export project to various formats."""
    if not project_manager:
        return jsonify({"error": "Project manager not initialized"}), 500

    try:
        if format == 'csv':
            file_path = project_manager.export_to_csv(project_id)
        elif format == 'kml':
            file_path = project_manager.export_to_kml(project_id)
        elif format == 'dxf':
            file_path = project_manager.export_to_dxf(project_id)
        elif format == 'geojson':
            file_path = project_manager.export_to_geojson(project_id)
        else:
            return jsonify({"error": "Invalid format"}), 400

        if not file_path:
            return jsonify({"error": "Export failed"}), 500

        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ====================================================================
# API Routes - ComNav Control
# ====================================================================

@app.route("/api/comnav/command", methods=["POST"])
def api_comnav_command():
    """Send command to ComNav device."""
    try:
        import serial
        data = request.get_json()
        command = data.get("command", "")

        if not command:
            return jsonify({"status": "error", "message": "No command provided"}), 400

        gps_port = os.getenv('GPS_PORT', '/dev/serial0')

        with serial.Serial(gps_port, 115200, timeout=2) as ser:
            cmd_str = f"{command}\r\n"
            ser.write(cmd_str.encode())
            time.sleep(0.5)
            response = ser.read(ser.in_waiting).decode('utf-8', errors='ignore')

        return jsonify({
            "status": "success",
            "command": command,
            "response": response,
            "port": gps_port
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ====================================================================
# WebSocket Events
# ====================================================================

@socketio.on("connect", namespace="/gnss")
def handle_connect():
    """Handle WebSocket connection."""
    print("🔗 Client connected to /gnss")
    if latest_stats:
        socketio.emit("stats", latest_stats, namespace="/gnss")

@socketio.on("disconnect", namespace="/gnss")
def handle_disconnect():
    """Handle WebSocket disconnection."""
    print("🔌 Client disconnected from /gnss")

# ====================================================================
# Main Entry Point
# ====================================================================

def main():
    """Start the enhanced GPS server."""
    # Initialize components
    init_project_manager()

    # Ensure directories exist
    os.makedirs(STATIC_DIR, exist_ok=True)
    os.makedirs(TEMPLATE_DIR, exist_ok=True)

    # Start background threads
    t_json = threading.Thread(target=read_json_data, daemon=True)
    t_json.start()

    t_uptime = threading.Thread(target=update_uptime, daemon=True)
    t_uptime.start()

    # Print startup information
    print("=" * 70)
    print("🛰️  GNSS Professional - Enhanced Web Server")
    print("=" * 70)
    print(f"🏠 Home:              http://0.0.0.0:5000")
    print(f"📊 Dashboard:         http://0.0.0.0:5000/dashboard")
    print(f"📁 Projects:          http://0.0.0.0:5000/projects")
    print(f"📡 API Stats:         http://0.0.0.0:5000/api/stats")
    print(f"📡 API Projects:      http://0.0.0.0:5000/api/projects")
    print(f"⚙️  API ComNav:        http://0.0.0.0:5000/api/comnav/command")
    print("=" * 70)
    print("✅ Server running. Press Ctrl+C to stop.")
    print("")

    # Run the server
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=False,
        allow_unsafe_werkzeug=True
    )

if __name__ == "__main__":
    main()
