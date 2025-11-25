#!/usr/bin/env python3
"""
Script de corrección automática de integración
Corrige problemas comunes en el sistema GNSS Professional
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.absolute()

def fix_smart_processor():
    """Corregir smart_processor.py"""
    file_path = BASE_DIR / "smart_processor.py"

    if not file_path.exists():
        print("⚠️  smart_processor.py no encontrado")
        return False

    with open(file_path, 'r') as f:
        content = f.read()

    # Corrección 1: Import correcto del clasificador
    old_import = """try:
    from gnss_ml_classifier import GNSS_ML_Classifier as GNSSClassifier
    ML_AVAILABLE = True
except ImportError:
    try:
        from ml_classifier import GNSS_ML_Classifier as GNSSClassifier
        ML_AVAILABLE = True
    except ImportError:
        print("⚠️  ML Classifier no disponible, continuaré sin ML.")
        ML_AVAILABLE = False"""

    new_import = """try:
    from ml_classifier import SignalClassifier as GNSSClassifier
    ML_AVAILABLE = True
except ImportError:
    print("⚠️  ML Classifier no disponible, continuaré sin ML.")
    ML_AVAILABLE = False
    GNSSClassifier = None"""

    if old_import in content:
        content = content.replace(old_import, new_import)
        print("✓ Corregido import de ML Classifier en smart_processor.py")

    # Corrección 2: Inicialización del clasificador
    old_init = 'self.classifier = GNSSClassifier(model="hybrid")'
    new_init = 'self.classifier = GNSSClassifier(model_type="hybrid")'

    if old_init in content:
        content = content.replace(old_init, new_init)
        print("✓ Corregida inicialización de clasificador")

    # Corrección 3: Llamada al clasificador
    old_call = """if self.ml_enabled and self.classifier:
                try:
                    result = self.classifier.process_gsv(line)
                    if result:
                        self.stats["ml_corrections"] += 1
                except Exception:
                    pass"""

    new_call = """if self.ml_enabled and self.classifier:
                try:
                    # Clasificar satélites actuales
                    classifications = self.classifier.classify_signals(self.satellites_detail)
                    if classifications:
                        self.stats["ml_corrections"] += 1
                except Exception as e:
                    pass"""

    if old_call in content:
        content = content.replace(old_call, new_call)
        print("✓ Corregida llamada a clasificador ML")

    # Guardar cambios
    with open(file_path, 'w') as f:
        f.write(content)

    print("✅ smart_processor.py corregido")
    return True


def create_quick_start():
    """Crear script de inicio rápido"""
    script_content = """#!/usr/bin/env python3
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

    # 2. Web Server
    print("2️⃣  Iniciando Web Server...")
    proc2 = subprocess.Popen(
        [sys.executable, "gps_server.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    processes.append(("Web Server", proc2))
    time.sleep(2)

    print("=" * 60)
    print("✅ Servicios iniciados")
    print("")
    print("Accede a:")
    print("  http://localhost:5000")
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
        print("\\n🛑 Deteniendo servicios...")
        for name, proc in processes:
            proc.terminate()
            print(f"✓ {name} detenido")

    return 0

if __name__ == '__main__':
    sys.exit(main())
"""

    file_path = BASE_DIR / "quick_start.py"
    with open(file_path, 'w') as f:
        f.write(script_content)

    os.chmod(file_path, 0o755)
    print("✅ quick_start.py creado")
    return True


def create_systemd_service_templates():
    """Crear templates de servicios systemd mejorados"""
    service_template = """[Unit]
Description=GNSS Professional - Sistema Completo
After=network.target
Wants=network-online.target

[Service]
Type=simple
User={user}
WorkingDirectory={workdir}
Environment="PATH={venv_path}/bin"
ExecStart={venv_path}/bin/python3 {workdir}/gnss_professional.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
"""

    file_path = BASE_DIR / "gnss-professional.service.template"
    with open(file_path, 'w') as f:
        f.write(service_template)

    print("✅ Template de servicio systemd creado")
    return True


def main():
    """Ejecutar todas las correcciones"""
    print("=" * 70)
    print("🔧 GNSS Professional - Corrección de Integración")
    print("=" * 70)
    print("")

    tasks = [
        ("Corrigiendo smart_processor.py", fix_smart_processor),
        ("Creando quick_start.py", create_quick_start),
        ("Creando templates systemd", create_systemd_service_templates),
    ]

    success = True
    for desc, func in tasks:
        print(f"\n{desc}...")
        try:
            if not func():
                success = False
                print(f"✗ Error en: {desc}")
        except Exception as e:
            print(f"✗ Excepción en {desc}: {e}")
            success = False

    print("\n" + "=" * 70)
    if success:
        print("✅ Todas las correcciones aplicadas exitosamente")
        print("\nPróximos pasos:")
        print("  1. python3 quick_start.py       # Iniciar sistema")
        print("  2. http://localhost:5000        # Acceder a la web")
    else:
        print("⚠️  Algunas correcciones fallaron")

    print("=" * 70)

    return 0 if success else 1


if __name__ == '__main__':
    import sys
    sys.exit(main())
