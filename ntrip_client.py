#!/usr/bin/env python3
"""
NTRIP Client para GNSS Professional
Conecta a caster NTRIP y envia correcciones RTCM al receptor ComNav
Soporta NTRIP v1 y v2
"""

import socket
import base64
import time
import serial
import threading
import json
import os
from datetime import datetime
import logging

class NTRIPClient:
    """Cliente NTRIP profesional con reconexión automática"""

    def __init__(self, config_file=None):
        # Configuración por defecto
        self.config = {
            'host': 'rtk2go.com',
            'port': 2101,
            'mountpoint': 'YOUR_MOUNTPOINT',
            'username': 'your_email@example.com',
            'password': '',
            'gga_interval': 5,  # segundos
            'serial_port': '/dev/serial0',
            'serial_baud': 115200,
            'reconnect_delay': 10,
            'enabled': False
        }

        # Cargar configuración desde archivo si existe
        if config_file and os.path.exists(config_file):
            self.load_config(config_file)

        # Estado
        self.running = False
        self.connected = False
        self.socket = None
        self.serial = None
        self.initial_buffer = b''

        # Estadísticas
        self.stats = {
            'rtcm_received': 0,
            'rtcm_sent': 0,
            'bytes_received': 0,
            'bytes_sent': 0,
            'connection_time': 0,
            'last_rtcm': None,
            'reconnections': 0
        }

        # Logging
        self.logger = self._setup_logger()

        # GGA thread
        self.gga_thread = None

        # Última posición conocida (para GGA)
        self.last_position = {
            'lat': 0.0,
            'lon': 0.0,
            'alt': 0.0,
            'quality': 0
        }

    def _setup_logger(self):
        """Configurar sistema de logging"""
        logger = logging.getLogger('NTRIP_Client')
        logger.setLevel(logging.INFO)

        if not logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%H:%M:%S'
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.propagate = False

        return logger

    def load_config(self, config_file):
        """Cargar configuración desde archivo JSON"""
        try:
            with open(config_file, 'r') as f:
                loaded_config = json.load(f)
                self.config.update(loaded_config)
            self.logger.info(f"Configuración cargada desde {config_file}")
        except Exception as e:
            self.logger.error(f"Error cargando configuración: {e}")

    def save_config(self, config_file):
        """Guardar configuración a archivo JSON"""
        try:
            with open(config_file, 'w') as f:
                json.dump(self.config, f, indent=2)
            self.logger.info(f"Configuración guardada en {config_file}")
        except Exception as e:
            self.logger.error(f"Error guardando configuración: {e}")

    def update_position(self, lat, lon, alt, quality=1):
        """Actualizar posición para envío de GGA"""
        self.last_position = {
            'lat': lat,
            'lon': lon,
            'alt': alt,
            'quality': quality
        }

    def generate_gga(self):
        """Generar sentencia NMEA GGA desde posición actual"""
        lat = self.last_position['lat']
        lon = self.last_position['lon']
        alt = self.last_position['alt']
        quality = self.last_position['quality']

        # Convertir lat/lon a formato NMEA (DDMM.MMMM)
        lat_deg = int(abs(lat))
        lat_min = (abs(lat) - lat_deg) * 60
        lat_str = f"{lat_deg:02d}{lat_min:07.4f}"
        lat_dir = 'N' if lat >= 0 else 'S'

        lon_deg = int(abs(lon))
        lon_min = (abs(lon) - lon_deg) * 60
        lon_str = f"{lon_deg:03d}{lon_min:07.4f}"
        lon_dir = 'E' if lon >= 0 else 'W'

        # Tiempo UTC
        now = datetime.utcnow()
        time_str = now.strftime('%H%M%S.00')

        # Construir GGA (sin checksum aún)
        gga = (f"GPGGA,{time_str},{lat_str},{lat_dir},{lon_str},{lon_dir},"
               f"{quality},08,1.0,{alt:.1f},M,0.0,M,,")

        # Calcular checksum
        checksum = 0
        for char in gga:
            checksum ^= ord(char)

        # GGA completa
        gga_complete = f"${gga}*{checksum:02X}\r\n"

        return gga_complete

    def connect(self):
        """Conectar al caster NTRIP"""
        try:
            self.logger.info(f"Conectando a {self.config['host']}:{self.config['port']}...")

            # Crear socket
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.socket.settimeout(30)

            # Conectar
            self.socket.connect((self.config['host'], self.config['port']))

            # Construir request NTRIP
            mountpoint = self.config['mountpoint']

            # Autenticación básica
            auth_string = f"{self.config['username']}:{self.config['password']}"
            auth_bytes = auth_string.encode('ascii')
            auth_b64 = base64.b64encode(auth_bytes).decode('ascii')

            # Request HTTP para NTRIP v1
            request = (
                f"GET /{mountpoint} HTTP/1.0\r\n"
                f"User-Agent: NTRIP GNSSProfessional/1.0\r\n"
                f"Authorization: Basic {auth_b64}\r\n"
                f"Accept: */*\r\n"
                f"Connection: close\r\n"
                f"\r\n"
            )

            # Enviar request
            self.socket.sendall(request.encode())

            # Leer respuesta completa hasta fin de headers
            response_bytes = b''
            while b"\r\n\r\n" not in response_bytes:
                chunk = self.socket.recv(4096)
                if not chunk:
                    break
                response_bytes += chunk

            header_split = response_bytes.split(b"\r\n\r\n", 1)

            header_text = header_split[0].decode('ascii', errors='ignore') if header_split else ''
            self.initial_buffer = header_split[1] if len(header_split) > 1 else b''

            if 'ICY 200 OK' in header_text or 'HTTP/1.1 200 OK' in header_text:
                self.connected = True
                self.stats['connection_time'] = time.time()
                self.logger.info(f"✓ Conectado a mountpoint: {mountpoint}")
                return True
            else:
                self.logger.error(f"Error de conexión: {header_text}")
                return False

        except Exception as e:
            self.logger.error(f"Error conectando: {e}")
            return False

    def open_serial(self):
        """Abrir puerto serial al receptor"""
        try:
            if self.serial and self.serial.is_open:
                return True

            self.serial = serial.Serial(
                self.config['serial_port'],
                self.config['serial_baud'],
                timeout=1
            )
            self.logger.info(f"✓ Puerto serial abierto: {self.config['serial_port']}")
            return True

        except Exception as e:
            self.logger.error(f"Error abriendo serial: {e}")
            return False

    def send_gga_loop(self):
        """Thread que envía GGA periódicamente"""
        while self.running and self.connected:
            try:
                # Generar y enviar GGA
                gga = self.generate_gga()

                if self.socket:
                    self.socket.sendall(gga.encode())
                    self.logger.debug(f"→ GGA enviado: {gga.strip()}")

                # Esperar intervalo configurado
                time.sleep(self.config['gga_interval'])

            except Exception as e:
                self.logger.error(f"Error enviando GGA: {e}")
                break

    def receive_rtcm_loop(self):
        """Thread que recibe y reenvía datos RTCM"""
        buffer = self.initial_buffer or b''
        self.initial_buffer = b''

        if buffer:
            self.stats['bytes_received'] += len(buffer)
            if self.serial and self.serial.is_open:
                self.serial.write(buffer)
                self.stats['bytes_sent'] += len(buffer)

        while self.running and self.connected:
            try:
                # Recibir datos del caster
                data = self.socket.recv(4096)

                if not data:
                    self.logger.warning("Conexión cerrada por el servidor")
                    break

                buffer += data
                self.stats['bytes_received'] += len(data)

                # Enviar al receptor serial
                if self.serial and self.serial.is_open:
                    self.serial.write(data)
                    self.stats['bytes_sent'] += len(data)

                # Detectar mensajes RTCM (comienzan con 0xD3)
                while len(buffer) >= 3:
                    if buffer[0] == 0xD3:
                        # Mensaje RTCM encontrado
                        # Longitud está en los siguientes 10 bits
                        length = ((buffer[1] & 0x03) << 8) | buffer[2]
                        msg_length = length + 6  # header(3) + payload(length) + crc(3)

                        if len(buffer) >= msg_length:
                            # Mensaje completo
                            self.stats['rtcm_received'] += 1
                            self.stats['rtcm_sent'] += 1
                            self.stats['last_rtcm'] = time.time()

                            # Extraer mensaje y avanzar buffer
                            buffer = buffer[msg_length:]
                        else:
                            break  # Esperar más datos
                    else:
                        # No es RTCM, descartar byte
                        buffer = buffer[1:]

                time.sleep(0.01)

            except socket.timeout:
                continue
            except Exception as e:
                self.logger.error(f"Error recibiendo RTCM: {e}")
                break

    def start(self):
        """Iniciar cliente NTRIP"""
        if not self.config['enabled']:
            self.logger.warning("Cliente NTRIP deshabilitado en configuración")
            return False

        self.logger.info("=" * 60)
        self.logger.info("🛰️  NTRIP Client - GNSS Professional")
        self.logger.info("=" * 60)
        self.logger.info(f"Caster: {self.config['host']}:{self.config['port']}")
        self.logger.info(f"Mountpoint: {self.config['mountpoint']}")
        self.logger.info(f"Usuario: {self.config['username']}")
        self.logger.info("=" * 60)

        self.running = True

        # Abrir serial
        if not self.open_serial():
            self.logger.error("No se pudo abrir puerto serial")
            return False

        # Bucle principal con reconexión
        while self.running:
            try:
                # Conectar
                if self.connect():
                    # Iniciar threads
                    self.gga_thread = threading.Thread(
                        target=self.send_gga_loop,
                        daemon=True
                    )
                    self.gga_thread.start()

                    # Recibir RTCM (bloquea hasta desconexión)
                    self.receive_rtcm_loop()

                # Si llegamos aquí, hubo desconexión
                self.connected = False
                self.stats['reconnections'] += 1

                if self.socket:
                    self.socket.close()
                    self.socket = None

                # Esperar antes de reconectar
                if self.running:
                    self.logger.warning(
                        f"Reconectando en {self.config['reconnect_delay']}s..."
                    )
                    time.sleep(self.config['reconnect_delay'])

            except KeyboardInterrupt:
                self.logger.info("Detenido por usuario")
                self.running = False
                break
            except Exception as e:
                self.logger.error(f"Error en loop principal: {e}")
                time.sleep(self.config['reconnect_delay'])

        # Limpiar
        self.cleanup()
        return True

    def stop(self):
        """Detener cliente NTRIP"""
        self.logger.info("Deteniendo cliente NTRIP...")
        self.running = False
        self.connected = False

    def cleanup(self):
        """Limpiar recursos"""
        if self.socket:
            try:
                self.socket.close()
            except:
                pass

        if self.serial and self.serial.is_open:
            try:
                self.serial.close()
            except:
                pass

        self.logger.info("Cliente NTRIP detenido")

    def get_stats(self):
        """Obtener estadísticas"""
        stats = self.stats.copy()

        # Calcular tiempo de conexión
        if self.connected and self.stats['connection_time'] > 0:
            stats['uptime'] = time.time() - self.stats['connection_time']
        else:
            stats['uptime'] = 0

        # Tiempo desde último RTCM
        if self.stats['last_rtcm']:
            stats['last_rtcm_ago'] = time.time() - self.stats['last_rtcm']
        else:
            stats['last_rtcm_ago'] = None

        stats['connected'] = self.connected

        return stats


def main():
    """Función principal para ejecución standalone"""
    import sys
    import argparse

    parser = argparse.ArgumentParser(description='NTRIP Client para GNSS Professional')
    parser.add_argument(
        '--config',
        default='config/ntrip.json',
        help='Archivo de configuración JSON'
    )
    parser.add_argument(
        '--host',
        help='Hostname del caster NTRIP'
    )
    parser.add_argument(
        '--port',
        type=int,
        help='Puerto del caster NTRIP'
    )
    parser.add_argument(
        '--mountpoint',
        help='Mountpoint NTRIP'
    )
    parser.add_argument(
        '--username',
        help='Usuario NTRIP'
    )
    parser.add_argument(
        '--password',
        help='Contraseña NTRIP'
    )

    args = parser.parse_args()

    # Crear cliente
    client = NTRIPClient(config_file=args.config)

    # Sobrescribir config con argumentos de línea de comandos
    if args.host:
        client.config['host'] = args.host
    if args.port:
        client.config['port'] = args.port
    if args.mountpoint:
        client.config['mountpoint'] = args.mountpoint
    if args.username:
        client.config['username'] = args.username
    if args.password:
        client.config['password'] = args.password

    # Habilitar cliente
    client.config['enabled'] = True

    # Iniciar
    try:
        client.start()
    except KeyboardInterrupt:
        print("\nDetenido por usuario")
        client.stop()


if __name__ == '__main__':
    main()
