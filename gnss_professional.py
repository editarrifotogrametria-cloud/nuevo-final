#!/usr/bin/env python3
"""
GNSS Professional - Sistema Integrado v2.0
Orquestador principal que integra todos los componentes
"""

import os
import sys
import time
import json
import threading
import logging
from pathlib import Path

# Configurar PATH para imports
BASE_DIR = Path(__file__).parent.absolute()
sys.path.insert(0, str(BASE_DIR))

# Importar componentes
try:
    from smart_processor import SmartProcessor
    from ntrip_client import NTRIPClient
    from project_manager import ProjectManager
    from comnav_controller import ComNavController
except ImportError as e:
    print(f"Error importando módulos: {e}")
    sys.exit(1)


class GNSSProfessionalSystem:
    """Sistema principal GNSS Professional"""

    def __init__(self, config_file='config/app_config.json'):
        self.config = self.load_config(config_file)
        self.logger = self.setup_logging()

        # Componentes
        self.smart_processor = None
        self.ntrip_client = None
        self.project_manager = None
        self.comnav_controller = None

        # Estado
        self.running = False
        self.threads = []

        self.logger.info("=" * 70)
        self.logger.info("🛰️  GNSS Professional System v2.0")
        self.logger.info("=" * 70)

    def load_config(self, config_file):
        """Cargar configuración"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"⚠️  Config file not found: {config_file}, using defaults")
            return self.get_default_config()
        except Exception as e:
            print(f"⚠️  Error loading config: {e}, using defaults")
            return self.get_default_config()

    def get_default_config(self):
        """Configuración por defecto"""
        return {
            "app": {
                "name": "GNSS Professional",
                "version": "2.0.0",
                "debug": False
            },
            "serial": {
                "port": "/dev/serial0",
                "baudrate": 115200
            },
            "ntrip": {
                "enabled": False
            },
            "ml": {
                "enabled": True
            },
            "data": {
                "base_dir": "data"
            }
        }

    def setup_logging(self):
        """Configurar logging"""
        logger = logging.getLogger('GNSSProfessional')
        logger.setLevel(logging.INFO)

        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%H:%M:%S'
        )
        console_handler.setFormatter(formatter)

        logger.addHandler(console_handler)

        # File handler (optional)
        log_file = self.config.get('logging', {}).get('log_file')
        if log_file:
            os.makedirs(os.path.dirname(log_file), exist_ok=True)
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(logging.INFO)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)

        return logger

    def initialize_components(self):
        """Inicializar todos los componentes"""
        self.logger.info("Inicializando componentes...")

        # 1. Smart Processor (NMEA + ML + TILT)
        try:
            self.smart_processor = SmartProcessor()
            self.logger.info("✓ Smart Processor inicializado")
        except Exception as e:
            self.logger.error(f"✗ Error inicializando Smart Processor: {e}")
            return False

        # 2. NTRIP Client (opcional)
        if self.config.get('ntrip', {}).get('enabled', False):
            try:
                ntrip_config = 'config/ntrip.json'
                self.ntrip_client = NTRIPClient(ntrip_config)
                self.logger.info("✓ NTRIP Client inicializado")
            except Exception as e:
                self.logger.warning(f"⚠️  NTRIP Client no disponible: {e}")

        # 3. Project Manager
        try:
            data_dir = self.config.get('data', {}).get('base_dir', 'data')
            self.project_manager = ProjectManager(data_dir)
            self.logger.info("✓ Project Manager inicializado")
        except Exception as e:
            self.logger.error(f"✗ Error inicializando Project Manager: {e}")

        # 4. ComNav Controller
        try:
            serial_port = self.config.get('serial', {}).get('port', '/dev/serial0')
            baudrate = self.config.get('serial', {}).get('baudrate', 115200)
            self.comnav_controller = ComNavController(serial_port, baudrate)
            self.logger.info("✓ ComNav Controller inicializado")
        except Exception as e:
            self.logger.warning(f"⚠️  ComNav Controller no disponible: {e}")

        return True

    def start_smart_processor(self):
        """Iniciar Smart Processor en thread"""
        def run():
            try:
                self.smart_processor.run()
            except Exception as e:
                self.logger.error(f"Error en Smart Processor: {e}")

        thread = threading.Thread(target=run, daemon=True, name="SmartProcessor")
        thread.start()
        self.threads.append(thread)
        self.logger.info("✓ Smart Processor iniciado")

    def start_ntrip_client(self):
        """Iniciar NTRIP Client en thread"""
        if not self.ntrip_client:
            return

        def run():
            try:
                self.ntrip_client.start()
            except Exception as e:
                self.logger.error(f"Error en NTRIP Client: {e}")

        thread = threading.Thread(target=run, daemon=True, name="NTRIPClient")
        thread.start()
        self.threads.append(thread)
        self.logger.info("✓ NTRIP Client iniciado")

    def start(self):
        """Iniciar el sistema completo"""
        self.logger.info("Iniciando GNSS Professional System...")

        # Inicializar componentes
        if not self.initialize_components():
            self.logger.error("Error inicializando componentes")
            return False

        # Iniciar componentes en threads
        self.start_smart_processor()

        if self.ntrip_client:
            self.start_ntrip_client()

        self.running = True
        self.logger.info("=" * 70)
        self.logger.info("✅ Sistema iniciado correctamente")
        self.logger.info("=" * 70)

        return True

    def stop(self):
        """Detener el sistema"""
        self.logger.info("Deteniendo sistema...")
        self.running = False

        # Detener Smart Processor
        if self.smart_processor:
            self.smart_processor.running = False

        # Detener NTRIP Client
        if self.ntrip_client:
            self.ntrip_client.stop()

        # Esperar threads
        for thread in self.threads:
            thread.join(timeout=5)

        self.logger.info("✓ Sistema detenido")

    def run_forever(self):
        """Ejecutar el sistema indefinidamente"""
        try:
            while self.running:
                time.sleep(1)
        except KeyboardInterrupt:
            self.logger.info("\n🛑 Detenido por usuario")
            self.stop()


def main():
    """Función principal"""
    import argparse

    parser = argparse.ArgumentParser(description='GNSS Professional System')
    parser.add_argument(
        '--config',
        default='config/app_config.json',
        help='Archivo de configuración'
    )
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Modo debug'
    )

    args = parser.parse_args()

    # Crear sistema
    system = GNSSProfessionalSystem(args.config)

    # Iniciar
    if system.start():
        system.run_forever()
    else:
        print("❌ Error iniciando el sistema")
        return 1

    return 0


if __name__ == '__main__':
    sys.exit(main())
