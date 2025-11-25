#!/usr/bin/env python3
"""
ComNav Controller - GNSS Professional
Controlador completo para módulos ComNav K222/K902/K922
Incluye configuración, comandos, monitoreo y soporte TILT/INS
"""

import serial
import time
import threading
import logging
from datetime import datetime


class ComNavController:
    """Controlador profesional para receptores ComNav"""

    def __init__(self, port='/dev/serial0', baudrate=115200):
        self.port = port
        self.baudrate = baudrate
        self.serial = None
        self.running = False
        self.logger = self._setup_logger()

        # Estado del receptor
        self.status = {
            'model': 'Unknown',
            'firmware': 'Unknown',
            'mode': 'Unknown',
            'rtk_status': 'NO_FIX',
            'tilt_enabled': False,
            'tilt_status': 'NONE',
            'last_command': None,
            'last_response': None
        }

        # Callback para datos NMEA
        self.nmea_callback = None

    def _setup_logger(self):
        """Configurar logging"""
        logger = logging.getLogger('ComNav_Controller')
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

    # ========================================================================
    # CONEXIÓN Y COMUNICACIÓN
    # ========================================================================

    def connect(self):
        """Conectar al receptor ComNav"""
        try:
            self.serial = serial.Serial(
                self.port,
                self.baudrate,
                timeout=2,
                write_timeout=2
            )
            self.logger.info(f"✓ Conectado a ComNav en {self.port}")
            return True
        except Exception as e:
            self.logger.error(f"Error conectando a ComNav: {e}")
            return False

    def disconnect(self):
        """Desconectar del receptor"""
        if self.serial and self.serial.is_open:
            self.serial.close()
            self.logger.info("Desconectado de ComNav")

    def send_command(self, command, wait_response=True, timeout=2):
        """
        Enviar comando al receptor ComNav

        Args:
            command: Comando a enviar (sin \r\n)
            wait_response: Esperar respuesta
            timeout: Timeout en segundos

        Returns:
            Respuesta del receptor o None
        """
        if not self.serial or not self.serial.is_open:
            self.logger.error("Puerto serial no abierto")
            return None

        try:
            # Agregar terminadores si no los tiene
            if not command.endswith('\r\n'):
                command += '\r\n'

            # Enviar comando
            self.serial.write(command.encode('ascii'))
            self.status['last_command'] = command.strip()

            self.logger.debug(f"→ {command.strip()}")

            if not wait_response:
                return True

            # Esperar respuesta
            start_time = time.time()
            response_lines = []

            while time.time() - start_time < timeout:
                if self.serial.in_waiting:
                    line = self.serial.readline().decode('ascii', errors='ignore').strip()
                    response_lines.append(line)

                    self.logger.debug(f"← {line}")

                    # Detectar fin de respuesta
                    if 'OK' in line or 'ERROR' in line:
                        break

                time.sleep(0.1)

            response = '\n'.join(response_lines)
            self.status['last_response'] = response

            return response

        except Exception as e:
            self.logger.error(f"Error enviando comando: {e}")
            return None

    # ========================================================================
    # COMANDOS BÁSICOS
    # ========================================================================

    def get_version(self):
        """Obtener versión del firmware"""
        response = self.send_command('VERSION')
        if response and 'VERSION' in response:
            # Parsear respuesta para extraer modelo y firmware
            lines = response.split('\n')
            for line in lines:
                if 'K222' in line or 'K902' in line or 'K922' in line:
                    parts = line.split(',')
                    if len(parts) >= 2:
                        self.status['model'] = parts[0].strip()
                        self.status['firmware'] = parts[1].strip()
            return response
        return None

    def reset(self):
        """Reset del receptor (FRESET)"""
        self.logger.warning("Reseteando receptor ComNav...")
        return self.send_command('FRESET', wait_response=False)

    def save_config(self):
        """Guardar configuración en memoria no volátil"""
        self.logger.info("Guardando configuración...")
        return self.send_command('SAVECONFIG')

    # ========================================================================
    # CONFIGURACIÓN RTK
    # ========================================================================

    def set_rtk_mode(self, mode='ROVER'):
        """
        Configurar modo RTK

        Args:
            mode: 'ROVER', 'BASE', 'STATIC'
        """
        mode = mode.upper()
        valid_modes = ['ROVER', 'BASE', 'STATIC']

        if mode not in valid_modes:
            self.logger.error(f"Modo inválido: {mode}")
            return False

        self.logger.info(f"Configurando modo: {mode}")

        if mode == 'ROVER':
            # Configurar como rover
            cmd = 'MODE ROVER AUTO'
        elif mode == 'BASE':
            # Configurar como base (requiere coordenadas)
            cmd = 'MODE BASE AUTO'
        elif mode == 'STATIC':
            # Modo estático
            cmd = 'MODE STATIC'

        response = self.send_command(cmd)
        if response and 'OK' in response:
            self.status['mode'] = mode
            return True

        return False

    def configure_rtk_timeout(self, timeout=60):
        """Configurar timeout de RTK en segundos"""
        cmd = f'CONFIG RTK TIMEOUT {timeout}'
        return self.send_command(cmd)

    # ========================================================================
    # CONFIGURACIÓN DE MENSAJES NMEA
    # ========================================================================

    def configure_nmea_output(self, messages=None, rate=1.0):
        """
        Configurar salida de mensajes NMEA

        Args:
            messages: Lista de mensajes NMEA ['GGA', 'RMC', 'GSV', ...]
            rate: Tasa de actualización en Hz
        """
        if messages is None:
            # Configuración por defecto para GNSS profesional
            messages = ['GGA', 'RMC', 'GSA', 'GSV', 'VTG']

        self.logger.info(f"Configurando salida NMEA: {messages} @ {rate}Hz")

        # Deshabilitar todos los mensajes primero
        self.send_command('UNLOG')
        time.sleep(0.5)

        # Habilitar mensajes solicitados
        for msg in messages:
            interval = 1.0 / rate
            cmd = f'LOG {msg}TALKER ONTIME {interval}'
            response = self.send_command(cmd)

            if response and 'OK' in response:
                self.logger.info(f"  ✓ {msg} habilitado")
            else:
                self.logger.warning(f"  ✗ Error habilitando {msg}")

        return True

    def set_nmea_talker(self, talker='GN'):
        """
        Configurar talker ID de NMEA

        Args:
            talker: 'GP' (GPS only), 'GL' (GLONASS), 'GA' (Galileo), 'GN' (Multi-GNSS)
        """
        cmd = f'CONFIG NMEA TALKER {talker}'
        return self.send_command(cmd)

    # ========================================================================
    # CONFIGURACIÓN GNSS
    # ========================================================================

    def configure_gnss_systems(self, gps=True, glonass=True, galileo=True, beidou=True):
        """Configurar sistemas GNSS activos"""
        systems = []
        if gps:
            systems.append('GPS')
        if glonass:
            systems.append('GLONASS')
        if galileo:
            systems.append('GALILEO')
        if beidou:
            systems.append('BEIDOU')

        systems_str = '+'.join(systems)
        cmd = f'CONFIG GNSS {systems_str}'

        self.logger.info(f"Configurando sistemas GNSS: {systems_str}")
        return self.send_command(cmd)

    def set_elevation_mask(self, angle=10):
        """
        Configurar máscara de elevación

        Args:
            angle: Ángulo mínimo en grados (típico: 10-15)
        """
        cmd = f'ECUTOFF {angle}'
        self.logger.info(f"Configurando máscara de elevación: {angle}°")
        return self.send_command(cmd)

    # ========================================================================
    # CONFIGURACIÓN TILT/INS (K222/K922)
    # ========================================================================

    def enable_tilt(self, enable=True):
        """
        Habilitar/deshabilitar función TILT/INS

        Args:
            enable: True para habilitar, False para deshabilitar
        """
        if enable:
            self.logger.info("Habilitando TILT/INS...")
            cmd = 'CONFIG INS ENABLE'
        else:
            self.logger.info("Deshabilitando TILT/INS...")
            cmd = 'CONFIG INS DISABLE'

        response = self.send_command(cmd)

        if response and 'OK' in response:
            self.status['tilt_enabled'] = enable
            return True

        return False

    def calibrate_tilt(self):
        """
        Iniciar calibración de TILT

        El usuario debe:
        1. Mantener el bastón vertical
        2. Girar 360° lentamente
        3. Esperar confirmación
        """
        self.logger.info("Iniciando calibración TILT...")
        self.logger.info("INSTRUCCIONES:")
        self.logger.info("1. Mantén el bastón vertical")
        self.logger.info("2. Gira 360° lentamente (20-30 segundos)")
        self.logger.info("3. Espera confirmación")

        cmd = 'CONFIG INS CALIBRATE'
        response = self.send_command(cmd, timeout=60)

        if response and 'OK' in response:
            self.logger.info("✓ Calibración completada")
            self.status['tilt_status'] = 'CALIBRATED'
            return True
        else:
            self.logger.error("✗ Error en calibración")
            return False

    def set_pole_height(self, height_m):
        """
        Configurar altura del bastón para compensación TILT

        Args:
            height_m: Altura en metros (típico: 1.5 - 2.0)
        """
        cmd = f'CONFIG INS POLEHEIGHT {height_m}'
        self.logger.info(f"Configurando altura de bastón: {height_m}m")
        return self.send_command(cmd)

    def get_tilt_status(self):
        """Obtener estado actual del TILT/INS"""
        cmd = 'LOG INSSTATUS ONCE'
        response = self.send_command(cmd)

        if response:
            # Parsear respuesta para extraer estado
            # Formato específico depende del modelo ComNav
            self.status['last_response'] = response

        return response

    # ========================================================================
    # CONFIGURACIÓN BASE RTK
    # ========================================================================

    def configure_base(self, lat, lon, alt, antenna_height=0.0):
        """
        Configurar receptor como base RTK

        Args:
            lat: Latitud en grados decimales
            lon: Longitud en grados decimales
            alt: Altitud elipsoidal en metros
            antenna_height: Altura de antena en metros
        """
        self.logger.info("Configurando base RTK...")
        self.logger.info(f"  Posición: {lat}, {lon}, {alt}")
        self.logger.info(f"  Altura antena: {antenna_height}m")

        # Configurar modo base
        cmd = f'MODE BASE {lat} {lon} {alt}'
        response = self.send_command(cmd)

        if response and 'OK' in response:
            # Configurar altura de antena
            if antenna_height > 0:
                self.send_command(f'CONFIG ANTENNA HEIGHT {antenna_height}')

            self.status['mode'] = 'BASE'
            return True

        return False

    def configure_rtcm_messages(self):
        """Configurar mensajes RTCM para base RTK"""
        self.logger.info("Configurando mensajes RTCM...")

        # Mensajes RTCM3 estándar para base RTK
        rtcm_messages = [
            'RTCM1005',  # Posición de la estación
            'RTCM1074',  # GPS MSM4
            'RTCM1084',  # GLONASS MSM4
            'RTCM1094',  # Galileo MSM4
            'RTCM1124',  # BeiDou MSM4
            'RTCM1230',  # GLONASS code-phase bias
        ]

        for msg in rtcm_messages:
            cmd = f'LOG {msg} ONTIME 1'
            response = self.send_command(cmd)

            if response and 'OK' in response:
                self.logger.info(f"  ✓ {msg} habilitado")
            else:
                self.logger.warning(f"  ✗ Error habilitando {msg}")

        return True

    # ========================================================================
    # CONFIGURACIÓN AVANZADA
    # ========================================================================

    def set_dynamic_model(self, model='AUTOMOTIVE'):
        """
        Configurar modelo dinámico

        Args:
            model: 'STATIC', 'PEDESTRIAN', 'AUTOMOTIVE', 'AIRBORNE'
        """
        cmd = f'CONFIG DYNAMICS {model}'
        self.logger.info(f"Configurando modelo dinámico: {model}")
        return self.send_command(cmd)

    def configure_data_link(self, interface='UART1', protocol='NMEA', baudrate=115200):
        """
        Configurar interfaz de datos

        Args:
            interface: 'UART1', 'UART2', 'USB', 'BLUETOOTH'
            protocol: 'NMEA', 'RTCM3', 'BOTH'
            baudrate: Velocidad del puerto (115200, 230400, 460800)
        """
        cmd = f'CONFIG {interface} {protocol} {baudrate}'
        self.logger.info(f"Configurando {interface}: {protocol} @ {baudrate}")
        return self.send_command(cmd)

    # ========================================================================
    # PERFIL DE CONFIGURACIÓN PROFESIONAL
    # ========================================================================

    def apply_professional_config(self):
        """
        Aplicar configuración profesional optimizada

        Configuración recomendada para levantamientos topográficos
        """
        self.logger.info("=" * 60)
        self.logger.info("Aplicando configuración profesional...")
        self.logger.info("=" * 60)

        # 1. Configurar sistemas GNSS (todos activos)
        self.configure_gnss_systems(
            gps=True,
            glonass=True,
            galileo=True,
            beidou=True
        )
        time.sleep(0.5)

        # 2. Máscara de elevación
        self.set_elevation_mask(10)
        time.sleep(0.5)

        # 3. Modelo dinámico
        self.set_dynamic_model('PEDESTRIAN')
        time.sleep(0.5)

        # 4. Configurar salida NMEA
        self.configure_nmea_output(
            messages=['GGA', 'RMC', 'GSA', 'GSV', 'VTG'],
            rate=1.0
        )
        time.sleep(0.5)

        # 5. Talker multi-GNSS
        self.set_nmea_talker('GN')
        time.sleep(0.5)

        # 6. Timeout RTK
        self.configure_rtk_timeout(60)
        time.sleep(0.5)

        # 7. Guardar configuración
        self.save_config()

        self.logger.info("=" * 60)
        self.logger.info("✓ Configuración profesional aplicada")
        self.logger.info("=" * 60)

        return True

    # ========================================================================
    # UTILIDADES
    # ========================================================================

    def get_status(self):
        """Obtener estado actual del receptor"""
        return self.status.copy()

    def monitor(self, duration=10):
        """
        Monitorear receptor durante un tiempo

        Args:
            duration: Duración en segundos
        """
        self.logger.info(f"Monitoreando receptor durante {duration}s...")

        start_time = time.time()
        while time.time() - start_time < duration:
            if self.serial and self.serial.in_waiting:
                line = self.serial.readline().decode('ascii', errors='ignore').strip()
                print(line)

            time.sleep(0.1)


def main():
    """Función principal para testing"""
    import argparse

    parser = argparse.ArgumentParser(description='ComNav Controller')
    parser.add_argument('--port', default='/dev/serial0', help='Puerto serial')
    parser.add_argument('--baudrate', type=int, default=115200, help='Baudrate')
    parser.add_argument('--config', action='store_true', help='Aplicar config profesional')
    parser.add_argument('--monitor', type=int, help='Monitorear durante N segundos')

    args = parser.parse_args()

    # Crear controlador
    controller = ComNavController(args.port, args.baudrate)

    # Conectar
    if not controller.connect():
        print("Error: No se pudo conectar al receptor")
        return 1

    try:
        # Obtener versión
        print("\nObteniendo información del receptor...")
        controller.get_version()
        print(f"Modelo: {controller.status['model']}")
        print(f"Firmware: {controller.status['firmware']}")

        # Aplicar configuración si se solicitó
        if args.config:
            controller.apply_professional_config()

        # Monitorear si se solicitó
        if args.monitor:
            controller.monitor(args.monitor)

    except KeyboardInterrupt:
        print("\nDetenido por usuario")
    finally:
        controller.disconnect()

    return 0


if __name__ == '__main__':
    exit(main())
