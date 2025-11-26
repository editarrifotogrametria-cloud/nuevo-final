#!/usr/bin/env python3
"""
Verificador del Sistema GNSS App
Verifica que todos los componentes estén instalados correctamente
"""

import os
import sys
from pathlib import Path

def check_file(filepath, description):
    """Verificar si un archivo existe"""
    if os.path.exists(filepath):
        size = os.path.getsize(filepath)
        print(f"✅ {description}: {filepath} ({size} bytes)")
        return True
    else:
        print(f"❌ {description}: {filepath} NO ENCONTRADO")
        return False

def check_directory(dirpath, description):
    """Verificar si un directorio existe"""
    if os.path.isdir(dirpath):
        count = len(list(Path(dirpath).rglob('*')))
        print(f"✅ {description}: {dirpath} ({count} archivos)")
        return True
    else:
        print(f"❌ {description}: {dirpath} NO ENCONTRADO")
        return False

def check_python_module(module_name):
    """Verificar si un módulo Python está instalado"""
    try:
        __import__(module_name)
        print(f"✅ Módulo Python: {module_name}")
        return True
    except ImportError:
        print(f"❌ Módulo Python: {module_name} NO INSTALADO")
        return False

def main():
    print("=" * 70)
    print("🛰️  VERIFICACIÓN DEL SISTEMA GNSS APP")
    print("=" * 70)
    print()

    all_ok = True

    # Verificar archivos Python principales
    print("📄 ARCHIVOS PYTHON")
    print("-" * 70)
    python_files = [
        ('quick_start.py', 'Iniciador principal'),
        ('web_app_server.py', 'Servidor web'),
        ('smart_processor.py', 'Procesador NMEA'),
        ('comnav_controller.py', 'Controlador ComNav'),
        ('ntrip_client.py', 'Cliente NTRIP'),
        ('ml_classifier.py', 'Clasificador ML'),
        ('project_manager.py', 'Gestor de proyectos'),
    ]

    for filename, desc in python_files:
        if not check_file(filename, desc):
            all_ok = False
    print()

    # Verificar interfaz web
    print("🌐 INTERFAZ WEB")
    print("-" * 70)
    if not check_file('html.html', 'Interfaz Vue.js'):
        all_ok = False
    print()

    # Verificar directorios
    print("📁 DIRECTORIOS")
    print("-" * 70)
    dirs = [
        ('static', 'Archivos estáticos'),
        ('static/js', 'JavaScript'),
        ('static/css', 'CSS'),
        ('config', 'Configuración'),
    ]

    for dirname, desc in dirs:
        if not check_directory(dirname, desc):
            all_ok = False
    print()

    # Verificar módulos Python
    print("🐍 MÓDULOS PYTHON")
    print("-" * 70)
    modules = ['serial', 'flask', 'flask_socketio', 'flask_cors', 'requests']

    for module in modules:
        if not check_python_module(module):
            all_ok = False
    print()

    # Verificar archivos de configuración
    print("⚙️  CONFIGURACIÓN")
    print("-" * 70)
    config_files = [
        ('config/ntrip.json', 'Config NTRIP'),
        ('config/app_config.json', 'Config aplicación'),
        ('requirements.txt', 'Dependencias'),
        ('install.sh', 'Instalador'),
    ]

    for filename, desc in config_files:
        if not check_file(filename, desc):
            all_ok = False
    print()

    # Verificar archivos JavaScript
    print("📦 ARCHIVOS JAVASCRIPT")
    print("-" * 70)
    js_files = [
        'static/js/chunk-vendors.31517009.js',
        'static/js/chunk-common.22a6f926.js',
        'static/js/index.0bca27f0.js',
    ]

    for jsfile in js_files:
        if not check_file(jsfile, os.path.basename(jsfile)):
            all_ok = False
    print()

    # Verificar archivos CSS
    print("🎨 ARCHIVOS CSS")
    print("-" * 70)
    css_files = [
        'static/css/chunk-vendors.d93e9d9a.css',
        'static/css/index.8349ed33.css',
    ]

    for cssfile in css_files:
        if not check_file(cssfile, os.path.basename(cssfile)):
            all_ok = False
    print()

    # Resultado final
    print("=" * 70)
    if all_ok:
        print("✅ SISTEMA COMPLETO - Todos los archivos OK")
        print()
        print("🚀 Para iniciar:")
        print("   python3 quick_start.py")
        print()
        print("🌐 Luego abre tu navegador en:")
        print("   http://localhost:8000")
        print("=" * 70)
        return 0
    else:
        print("❌ SISTEMA INCOMPLETO - Faltan archivos o módulos")
        print()
        print("Instala las dependencias:")
        print("   pip3 install -r requirements.txt")
        print()
        print("O ejecuta el instalador completo:")
        print("   chmod +x install.sh")
        print("   sudo ./install.sh")
        print("=" * 70)
        return 1

if __name__ == '__main__':
    sys.exit(main())
