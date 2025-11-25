#!/usr/bin/env python3
'''
Quick Start - GNSS Professional (Interfaz Emlid)
Inicia la interfaz tipo Emlid con control total del ComNav
'''

import subprocess
import sys
import time
import os

def check_dependencies():
    '''Verificar dependencias'''
    try:
        import serial
        import flask
        import flask_socketio
        import flask_cors
        print("✓ Dependencias Python OK")
        return True
    except ImportError as e:
        print(f"✗ Falta dependencia: {e}")
        print("Ejecuta: pip install -r requirements.txt")
        return False

def start_services():
    '''Iniciar servicios necesarios para interfaz Emlid'''
    processes = []

    print("🚀 Iniciando GNSS Professional - Interfaz Emlid")
    print("=" * 60)

    # 1. Smart Processor (procesa datos NMEA del ComNav)
    print("1️⃣  Iniciando Smart Processor...")
    print("   (Procesamiento NMEA, ML, TILT)")
    proc1 = subprocess.Popen(
        [sys.executable, "smart_processor.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    processes.append(("Smart Processor", proc1))
    time.sleep(3)

    # 2. Interfaz Web Emlid (puerto 8000)
    print("2️⃣  Iniciando Interfaz Web Emlid...")
    print("   (Control ComNav + Visualización)")
    proc2 = subprocess.Popen(
        [sys.executable, "web_app_server.py"]
    )
    processes.append(("Interfaz Emlid", proc2))
    time.sleep(3)

    print("=" * 60)
    print("✅ Sistema iniciado correctamente")
    print("")
    print("🌟 INTERFAZ WEB EMLID:")
    print("   → http://localhost:8000")
    print("")
    print("📡 APIs disponibles:")
    print("   → http://localhost:8000/api/stats")
    print("   → http://localhost:8000/api/comnav/command")
    print("   → http://localhost:8000/api/comnav/mode")
    print("   → http://localhost:8000/api/comnav/gnss")
    print("   → http://localhost:8000/api/ntrip/config")
    print("")
    print("🔧 Características:")
    print("   ✓ Visualización de satélites en tiempo real")
    print("   ✓ Control total del receptor ComNav")
    print("   ✓ Configuración NTRIP para correcciones RTK")
    print("   ✓ Modos ROVER y BASE")
    print("   ✓ Configuración de constelaciones GNSS")
    print("   ✓ WebSocket para datos en tiempo real")
    print("")
    print("⌨️  Presiona Ctrl+C para detener")
    print("=" * 60)

    return processes

def main():
    if not check_dependencies():
        return 1

    # Verificar que existen los archivos necesarios
    required_files = ['smart_processor.py', 'web_app_server.py', 'html.html']
    missing = [f for f in required_files if not os.path.exists(f)]
    if missing:
        print(f"✗ Archivos faltantes: {', '.join(missing)}")
        return 1

    processes = start_services()

    try:
        while True:
            time.sleep(1)
            # Verificar que los procesos siguen corriendo
            for name, proc in processes:
                if proc.poll() is not None:
                    print(f"\n⚠️  {name} se detuvo inesperadamente")
    except KeyboardInterrupt:
        print("\n\n🛑 Deteniendo servicios...")
        for name, proc in processes:
            proc.terminate()
            print(f"   ✓ {name} detenido")
        print("\n👋 Sistema detenido correctamente\n")

    return 0

if __name__ == '__main__':
    sys.exit(main())
