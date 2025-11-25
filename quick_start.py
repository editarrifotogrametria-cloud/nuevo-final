#!/usr/bin/env python3
'''
Quick Start - GNSS Professional
Inicia todos los servicios necesarios
'''

import subprocess
import sys
import time

def check_dependencies():
    '''Verificar dependencias'''
    try:
        import serial
        import flask
        print("✓ Dependencias Python OK")
        return True
    except ImportError as e:
        print(f"✗ Falta dependencia: {e}")
        print("Ejecuta: pip install -r requirements.txt")
        return False

def start_services():
    '''Iniciar servicios'''
    processes = []

    print("🚀 Iniciando GNSS Professional...")
    print("=" * 60)

    # 1. Smart Processor
    print("1️⃣  Iniciando Smart Processor...")
    proc1 = subprocess.Popen(
        [sys.executable, "gnss_professional.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    processes.append(("Smart Processor", proc1))
    time.sleep(2)

    # 2. Web App (Interfaz Vue.js completa)
    print("2️⃣  Iniciando Web Application...")
    proc2 = subprocess.Popen(
        [sys.executable, "web_app_server.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    processes.append(("Web Application", proc2))
    time.sleep(2)

    # 3. API Server (Opcional - APIs adicionales)
    print("3️⃣  Iniciando API Server...")
    proc3 = subprocess.Popen(
        [sys.executable, "gps_server_enhanced.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    processes.append(("API Server", proc3))
    time.sleep(2)

    print("=" * 60)
    print("✅ Servicios iniciados")
    print("")
    print("📱 Interfaces disponibles:")
    print("  🌟 Aplicación Web:    http://localhost:8000")
    print("  📊 Dashboard & API:   http://localhost:5000")
    print("")
    print("Presiona Ctrl+C para detener")
    print("=" * 60)

    return processes

def main():
    if not check_dependencies():
        return 1

    processes = start_services()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Deteniendo servicios...")
        for name, proc in processes:
            proc.terminate()
            print(f"✓ {name} detenido")

    return 0

if __name__ == '__main__':
    sys.exit(main())
