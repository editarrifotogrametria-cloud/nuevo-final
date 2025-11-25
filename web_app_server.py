#!/usr/bin/env python3
"""
GNSS Professional - Web App Server
Sirve la aplicación web Vue.js completa con control ComNav
"""

import os
import sys
import time
import json
import threading
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

# Importar controlador ComNav
try:
    from comnav_controller import ComNavController
    COMNAV_AVAILABLE = True
except ImportError:
    COMNAV_AVAILABLE = False
    print("⚠️  ComNav Controller no disponible")

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'gnss-emlid-secret-key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_DATA_FILE = "/tmp/gnssai_dashboard_data.json"

# Instancia global del controlador ComNav
comnav = None
latest_data = {}

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

# ====================================================================
# FUNCIONES DE INICIALIZACIÓN
# ====================================================================

def init_comnav():
    """Inicializar controlador ComNav"""
    global comnav
    if not COMNAV_AVAILABLE:
        return

    try:
        gps_port = os.getenv('GPS_PORT', '/dev/serial0')
        comnav = ComNavController(port=gps_port, baudrate=115200)
        if comnav.connect():
            print(f"✓ ComNav conectado en {gps_port}")
            # Obtener información del receptor
            threading.Thread(target=get_receiver_info, daemon=True).start()
        else:
            print("✗ No se pudo conectar a ComNav")
            comnav = None
    except Exception as e:
        print(f"✗ Error inicializando ComNav: {e}")
        comnav = None

def get_receiver_info():
    """Obtener información del receptor"""
    if comnav:
        time.sleep(1)
        comnav.send_command("VERSION")
        comnav.send_command("CONFIG")

def read_gnss_data():
    """Leer datos GNSS del archivo JSON y emitir por WebSocket"""
    global latest_data
    while True:
        try:
            if os.path.exists(JSON_DATA_FILE):
                with open(JSON_DATA_FILE, 'r') as f:
                    data = json.load(f)
                    latest_data = data
                    # Emitir por WebSocket
                    socketio.emit('gnss_data', data, namespace='/gnss')
        except Exception as e:
            pass
        time.sleep(1)

# ====================================================================
# API - DATOS GNSS
# ====================================================================

@app.route('/api/status')
@app.route('/api/stats')
def api_status():
    """API de estadísticas GNSS en tiempo real"""
    if latest_data:
        return jsonify(latest_data)

    # Datos por defecto
    return jsonify({
        "position": {"lat": 0, "lon": 0, "alt": 0},
        "satellites": 0,
        "quality": 0,
        "hdop": 0,
        "rtk_status": "NO_FIX",
        "satellites_detail": []
    })

# ====================================================================
# API - COMANDOS COMNAV
# ====================================================================

@app.route('/api/comnav/command', methods=['POST'])
def comnav_command():
    """Enviar comando personalizado a ComNav"""
    if not comnav:
        return jsonify({
            "success": False,
            "error": "ComNav no disponible"
        }), 503

    data = request.get_json()
    command = data.get('command', '')

    if not command:
        return jsonify({
            "success": False,
            "error": "Comando vacío"
        }), 400

    try:
        response = comnav.send_command(command, wait_response=True, timeout=2)
        return jsonify({
            "success": True,
            "command": command,
            "response": response or "OK"
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/comnav/mode', methods=['POST'])
def comnav_set_mode():
    """Configurar modo de operación (ROVER/BASE)"""
    if not comnav:
        return jsonify({"success": False, "error": "ComNav no disponible"}), 503

    data = request.get_json()
    mode = data.get('mode', 'ROVER').upper()

    try:
        if mode == 'ROVER':
            comnav.set_rover_mode()
        elif mode == 'BASE':
            lat = data.get('lat')
            lon = data.get('lon')
            alt = data.get('alt')
            if lat and lon and alt:
                comnav.set_base_mode(lat, lon, alt)
            else:
                return jsonify({"success": False, "error": "Coordenadas requeridas para modo BASE"}), 400
        else:
            return jsonify({"success": False, "error": "Modo inválido"}), 400

        return jsonify({"success": True, "mode": mode})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/comnav/gnss', methods=['POST'])
def comnav_configure_gnss():
    """Configurar sistemas GNSS activos"""
    if not comnav:
        return jsonify({"success": False, "error": "ComNav no disponible"}), 503

    data = request.get_json()
    systems = data.get('systems', {})

    try:
        # Configurar cada sistema
        for system, enabled in systems.items():
            if system.upper() == 'GPS':
                comnav.send_command(f"CONFIG SIGNALGROUP GPS {'ENABLE' if enabled else 'DISABLE'}")
            elif system.upper() == 'GLONASS':
                comnav.send_command(f"CONFIG SIGNALGROUP GLONASS {'ENABLE' if enabled else 'DISABLE'}")
            elif system.upper() == 'GALILEO':
                comnav.send_command(f"CONFIG SIGNALGROUP GALILEO {'ENABLE' if enabled else 'DISABLE'}")
            elif system.upper() == 'BEIDOU':
                comnav.send_command(f"CONFIG SIGNALGROUP BEIDOU {'ENABLE' if enabled else 'DISABLE'}")

        # Guardar configuración
        comnav.save_config()

        return jsonify({"success": True, "systems": systems})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/comnav/reset', methods=['POST'])
def comnav_reset():
    """Reset del receptor ComNav"""
    if not comnav:
        return jsonify({"success": False, "error": "ComNav no disponible"}), 503

    try:
        comnav.send_command("RESET")
        return jsonify({"success": True, "message": "Receptor reiniciado"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/comnav/info', methods=['GET'])
def comnav_info():
    """Obtener información del receptor"""
    if not comnav:
        return jsonify({"success": False, "error": "ComNav no disponible"}), 503

    try:
        version = comnav.send_command("VERSION", wait_response=True)
        return jsonify({
            "success": True,
            "status": comnav.status,
            "version": version
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ====================================================================
# API - CONFIGURACIÓN NTRIP
# ====================================================================

@app.route('/api/ntrip/config', methods=['GET'])
def ntrip_get_config():
    """Obtener configuración NTRIP"""
    config_file = os.path.join(BASE_DIR, 'config', 'ntrip.json')
    try:
        if os.path.exists(config_file):
            with open(config_file, 'r') as f:
                config = json.load(f)
                return jsonify({"success": True, "config": config})
    except Exception as e:
        pass

    return jsonify({
        "success": True,
        "config": {
            "enabled": False,
            "host": "",
            "port": 2101,
            "mountpoint": "",
            "username": "",
            "password": ""
        }
    })

@app.route('/api/ntrip/config', methods=['POST'])
def ntrip_set_config():
    """Configurar NTRIP"""
    data = request.get_json()
    config_file = os.path.join(BASE_DIR, 'config', 'ntrip.json')

    try:
        # Crear directorio config si no existe
        os.makedirs(os.path.join(BASE_DIR, 'config'), exist_ok=True)

        # Guardar configuración
        with open(config_file, 'w') as f:
            json.dump(data, f, indent=2)

        return jsonify({"success": True, "message": "Configuración NTRIP guardada"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ====================================================================
# WEBSOCKET
# ====================================================================

@socketio.on('connect', namespace='/gnss')
def handle_connect():
    """Cliente conectado a WebSocket"""
    print("🔗 Cliente conectado al WebSocket")
    if latest_data:
        emit('gnss_data', latest_data)

@socketio.on('disconnect', namespace='/gnss')
def handle_disconnect():
    """Cliente desconectado"""
    print("🔌 Cliente desconectado del WebSocket")

# Catch-all para SPA routing
@app.route('/<path:path>')
def catch_all(path):
    """Redirigir todas las rutas al index para Vue Router"""
    if path.startswith('static/'):
        return send_from_directory(BASE_DIR, path)
    return send_from_directory(BASE_DIR, 'html.html')

if __name__ == '__main__':
    print("=" * 70)
    print("🛰️  GNSS Professional - Interfaz Emlid con Control ComNav")
    print("=" * 70)

    # Inicializar ComNav
    print("Inicializando ComNav...")
    init_comnav()

    # Iniciar thread de lectura de datos
    print("Iniciando lectura de datos GNSS...")
    data_thread = threading.Thread(target=read_gnss_data, daemon=True)
    data_thread.start()

    print("=" * 70)
    print(f"📱 Interfaz Web Emlid:    http://0.0.0.0:8000")
    print(f"📡 API Stats:             http://0.0.0.0:8000/api/stats")
    print(f"⚙️  API ComNav:            http://0.0.0.0:8000/api/comnav/")
    print(f"🌐 WebSocket:             ws://0.0.0.0:8000/gnss")
    print("=" * 70)
    print("")
    print("APIs disponibles:")
    print("  POST /api/comnav/command      - Enviar comando ComNav")
    print("  POST /api/comnav/mode         - Configurar ROVER/BASE")
    print("  POST /api/comnav/gnss         - Configurar constelaciones")
    print("  POST /api/comnav/reset        - Reiniciar receptor")
    print("  GET  /api/comnav/info         - Info del receptor")
    print("  GET  /api/ntrip/config        - Obtener config NTRIP")
    print("  POST /api/ntrip/config        - Guardar config NTRIP")
    print("=" * 70)
    print("✅ Servidor ejecutándose. Accede desde tu navegador")
    print("")

    # Ejecutar servidor con SocketIO
    socketio.run(
        app,
        host='0.0.0.0',
        port=8000,
        debug=False,
        allow_unsafe_werkzeug=True
    )
