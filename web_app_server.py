#!/usr/bin/env python3
"""
GNSS Professional - Web App Server
Sirve la aplicación web Vue.js completa
"""

import os
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__, static_folder='static')
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_DATA_FILE = "/tmp/gnssai_dashboard_data.json"

# Servir el index principal
@app.route('/')
@app.route('/index.html')
def index():
    """Servir la aplicación web principal"""
    return send_from_directory(BASE_DIR, 'html.html')

# Servir archivos estáticos
@app.route('/static/js/<path:filename>')
def serve_js(filename):
    """Servir archivos JavaScript"""
    return send_from_directory(os.path.join(BASE_DIR, 'static', 'js'), filename)

@app.route('/static/css/<path:filename>')
def serve_css(filename):
    """Servir archivos CSS"""
    return send_from_directory(os.path.join(BASE_DIR, 'static', 'css'), filename)

@app.route('/static/fonts/<path:filename>')
def serve_fonts(filename):
    """Servir archivos de fuentes"""
    return send_from_directory(os.path.join(BASE_DIR, 'static', 'fonts'), filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Servir otros archivos estáticos"""
    return send_from_directory(os.path.join(BASE_DIR, 'static'), filename)

# API para datos GNSS
@app.route('/api/status')
@app.route('/api/stats')
def api_status():
    """API de estadísticas GNSS"""
    try:
        if os.path.exists(JSON_DATA_FILE):
            with open(JSON_DATA_FILE, 'r') as f:
                data = json.load(f)
                return jsonify(data)
    except:
        pass

    # Datos de ejemplo si no hay archivo
    return jsonify({
        "position": {"lat": 0, "lon": 0, "alt": 0},
        "satellites": 0,
        "quality": 0,
        "hdop": 0,
        "rtk_status": "NO_FIX"
    })

# Catch-all para SPA routing
@app.route('/<path:path>')
def catch_all(path):
    """Redirigir todas las rutas al index para Vue Router"""
    if path.startswith('static/'):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, 'html.html')

if __name__ == '__main__':
    print("=" * 70)
    print("🛰️  GNSS Professional - Web Application Server")
    print("=" * 70)
    print(f"📱 Web App:  http://0.0.0.0:8000")
    print(f"📡 API:      http://0.0.0.0:8000/api/stats")
    print("=" * 70)
    print("✅ Server running. Access the web app in your browser")
    print("")

    app.run(
        host='0.0.0.0',
        port=8000,
        debug=False
    )
