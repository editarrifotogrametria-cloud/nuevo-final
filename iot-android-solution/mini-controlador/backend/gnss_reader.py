#!/usr/bin/env python3
"""
GNSS Reader para Mini Controlador
Lee datos NMEA del módulo GNSS vía serial y parsea las sentencias
"""

import asyncio
import logging
import re
import serial
from datetime import datetime
from typing import Callable, Dict, List, Optional

logger = logging.getLogger(__name__)


class GNSSReader:
    """Lector de datos GNSS desde puerto serial"""

    # Mapeo de fix quality a nombres
    FIX_QUALITY_MAP = {
        0: ("NO_FIX", 0),
        1: ("SINGLE", 1),
        2: ("DGPS", 2),
        3: ("PPS", 3),
        4: ("RTK_FIXED", 4),
        5: ("RTK_FLOAT", 5),
        6: ("ESTIMATED", 6),
        7: ("MANUAL", 7),
        8: ("SIMULATION", 8)
    }

    def __init__(
        self,
        port: str = "/dev/ttyS0",
        baudrate: int = 115200,
        callback: Optional[Callable[[Dict], None]] = None,
        satellites_callback: Optional[Callable[[Dict], None]] = None
    ):
        """
        Inicializar GNSS Reader

        Args:
            port: Puerto serial (ej: /dev/ttyS0, COM3)
            baudrate: Velocidad del puerto
            callback: Función a llamar con datos GNSS actualizados
            satellites_callback: Función a llamar con datos de satélites
        """
        self.port = port
        self.baudrate = baudrate
        self.callback = callback
        self.satellites_callback = satellites_callback

        self.serial: Optional[serial.Serial] = None
        self.running = False
        self.connected = False

        # Datos GNSS actuales
        self.gnss_data: Dict = {}
        self.satellites: List[Dict] = []
        self.gsv_messages: Dict = {}  # Buffer para mensajes GSV multi-parte

    async def start(self):
        """Iniciar lectura del puerto serial"""
        try:
            logger.info(f"Abriendo puerto serial {self.port} @ {self.baudrate}")

            self.serial = serial.Serial(
                port=self.port,
                baudrate=self.baudrate,
                timeout=1.0,
                bytesize=serial.EIGHTBITS,
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE
            )

            self.connected = True
            self.running = True

            # Iniciar tarea de lectura
            asyncio.create_task(self._read_loop())

            logger.info(f"Puerto serial {self.port} abierto correctamente")

        except serial.SerialException as e:
            logger.error(f"Error abriendo puerto serial: {e}")
            self.connected = False
            raise
        except Exception as e:
            logger.error(f"Error inesperado: {e}")
            self.connected = False
            raise

    async def stop(self):
        """Detener lectura del puerto serial"""
        self.running = False

        if self.serial and self.serial.is_open:
            self.serial.close()
            logger.info(f"Puerto serial {self.port} cerrado")

        self.connected = False

    def is_connected(self) -> bool:
        """Verificar si el puerto está conectado"""
        return self.connected and self.serial and self.serial.is_open

    async def _read_loop(self):
        """Loop principal de lectura de datos NMEA"""
        logger.info("Iniciando loop de lectura NMEA...")

        while self.running:
            try:
                if not self.serial or not self.serial.is_open:
                    logger.warning("Puerto serial no disponible")
                    await asyncio.sleep(1)
                    continue

                # Leer línea del puerto serial
                line = self.serial.readline()

                if not line:
                    await asyncio.sleep(0.01)
                    continue

                # Decodificar
                try:
                    sentence = line.decode('ascii').strip()
                except UnicodeDecodeError:
                    logger.warning("Error decodificando línea NMEA")
                    continue

                # Parsear sentencia NMEA
                if sentence.startswith('$'):
                    await self._parse_nmea(sentence)

            except serial.SerialException as e:
                logger.error(f"Error leyendo puerto serial: {e}")
                self.connected = False
                await asyncio.sleep(1)
            except Exception as e:
                logger.error(f"Error en read loop: {e}")
                await asyncio.sleep(0.1)

        logger.info("Loop de lectura NMEA detenido")

    async def _parse_nmea(self, sentence: str):
        """
        Parsear sentencia NMEA

        Args:
            sentence: Sentencia NMEA completa con checksum
        """
        try:
            # Verificar checksum
            if not self._verify_checksum(sentence):
                logger.warning(f"Checksum inválido: {sentence}")
                return

            # Eliminar checksum
            if '*' in sentence:
                sentence = sentence.split('*')[0]

            # Separar campos
            fields = sentence.split(',')

            if not fields:
                return

            # Identificar tipo de sentencia
            sentence_type = fields[0]

            # GNGGA - Global Positioning System Fix Data
            if sentence_type.endswith('GGA'):
                await self._parse_gga(fields)

            # GNRMC - Recommended Minimum Specific GNSS Data
            elif sentence_type.endswith('RMC'):
                await self._parse_rmc(fields)

            # GNGSA - GNSS DOP and Active Satellites
            elif sentence_type.endswith('GSA'):
                await self._parse_gsa(fields)

            # GNGSV - GNSS Satellites in View
            elif sentence_type.endswith('GSV'):
                await self._parse_gsv(fields)

        except Exception as e:
            logger.error(f"Error parseando NMEA '{sentence}': {e}")

    async def _parse_gga(self, fields: List[str]):
        """Parsear sentencia GGA"""
        try:
            # $GNGGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh
            if len(fields) < 15:
                return

            # Tiempo UTC
            time_str = fields[1]

            # Latitud
            lat_raw = fields[2]
            lat_dir = fields[3]
            latitude = self._parse_lat_lon(lat_raw, lat_dir) if lat_raw else None

            # Longitud
            lon_raw = fields[4]
            lon_dir = fields[5]
            longitude = self._parse_lat_lon(lon_raw, lon_dir) if lon_raw else None

            # Fix quality
            fix_quality = int(fields[6]) if fields[6] else 0
            fix_type_name, fix_type_code = self.FIX_QUALITY_MAP.get(fix_quality, ("UNKNOWN", 0))

            # Número de satélites
            satellites_used = int(fields[7]) if fields[7] else 0

            # HDOP
            hdop = float(fields[8]) if fields[8] else 0.0

            # Altitud
            altitude = float(fields[9]) if fields[9] else 0.0

            # Actualizar datos GNSS
            self.gnss_data.update({
                "timestamp": datetime.utcnow().isoformat() + 'Z',
                "latitude": latitude,
                "longitude": longitude,
                "altitude": altitude,
                "fix_type": fix_type_name,
                "fix_type_code": fix_type_code,
                "satellites_used": satellites_used,
                "hdop": hdop,
                "last_update": datetime.utcnow().isoformat() + 'Z',
                "age_seconds": 0.0
            })

            # Calcular precisión estimada (simplificado)
            if fix_type_code == 4:  # RTK Fixed
                accuracy_h = 0.014  # ~1.4 cm
                accuracy_v = 0.021  # ~2.1 cm
            elif fix_type_code == 5:  # RTK Float
                accuracy_h = 0.15  # ~15 cm
                accuracy_v = 0.25  # ~25 cm
            elif fix_type_code == 2:  # DGPS
                accuracy_h = 0.5   # ~50 cm
                accuracy_v = 1.0   # ~1 m
            else:
                accuracy_h = hdop * 2.0
                accuracy_v = hdop * 3.0

            self.gnss_data.update({
                "accuracy_horizontal": accuracy_h,
                "accuracy_vertical": accuracy_v
            })

            # Llamar callback
            if self.callback:
                self.callback(self.gnss_data)

        except Exception as e:
            logger.error(f"Error parseando GGA: {e}")

    async def _parse_rmc(self, fields: List[str]):
        """Parsear sentencia RMC"""
        try:
            # $GNRMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a,a*hh
            if len(fields) < 13:
                return

            # Velocidad en nudos
            speed_knots = float(fields[7]) if fields[7] else 0.0
            speed_kmh = speed_knots * 1.852  # Convertir a km/h

            # Rumbo en grados
            heading_degrees = float(fields[8]) if fields[8] else 0.0

            # Actualizar datos
            self.gnss_data.update({
                "speed_kmh": speed_kmh,
                "heading_degrees": heading_degrees
            })

            # Llamar callback
            if self.callback:
                self.callback(self.gnss_data)

        except Exception as e:
            logger.error(f"Error parseando RMC: {e}")

    async def _parse_gsa(self, fields: List[str]):
        """Parsear sentencia GSA"""
        try:
            # $GNGSA,A,3,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,x.x,x.x,x.x*hh
            if len(fields) < 18:
                return

            # PDOP, HDOP, VDOP
            pdop = float(fields[15]) if fields[15] else 0.0
            hdop = float(fields[16]) if fields[16] else 0.0
            vdop = float(fields[17]) if fields[17] else 0.0

            # Actualizar datos
            self.gnss_data.update({
                "pdop": pdop,
                "hdop": hdop,
                "vdop": vdop
            })

        except Exception as e:
            logger.error(f"Error parseando GSA: {e}")

    async def _parse_gsv(self, fields: List[str]):
        """Parsear sentencia GSV (satélites en vista)"""
        try:
            # $GNGSV,x,x,xx,xx,xx,xxx,xx,...*hh
            if len(fields) < 4:
                return

            # Número total de mensajes y número de este mensaje
            total_messages = int(fields[1]) if fields[1] else 1
            message_num = int(fields[2]) if fields[2] else 1
            total_sats = int(fields[3]) if fields[3] else 0

            # Identificar constelación
            sentence_id = fields[0]
            if 'GP' in sentence_id:
                constellation = 'GPS'
            elif 'GL' in sentence_id:
                constellation = 'GLONASS'
            elif 'GA' in sentence_id:
                constellation = 'GALILEO'
            elif 'GB' in sentence_id or 'BD' in sentence_id:
                constellation = 'BEIDOU'
            else:
                constellation = 'UNKNOWN'

            # Clave única para este conjunto de mensajes
            gsv_key = f"{constellation}"

            # Inicializar buffer si es el primer mensaje
            if message_num == 1:
                self.gsv_messages[gsv_key] = {
                    "total_messages": total_messages,
                    "total_sats": total_sats,
                    "satellites": []
                }

            # Parsear satélites (4 por mensaje)
            for i in range(4):
                base_idx = 4 + (i * 4)
                if base_idx + 3 >= len(fields):
                    break

                prn = fields[base_idx]
                elevation = fields[base_idx + 1]
                azimuth = fields[base_idx + 2]
                snr = fields[base_idx + 3]

                if not prn:
                    continue

                satellite = {
                    "prn": int(prn),
                    "constellation": constellation,
                    "elevation": float(elevation) if elevation else 0.0,
                    "azimuth": float(azimuth) if azimuth else 0.0,
                    "snr": float(snr) if snr else 0.0,
                    "used": False  # Se actualiza con GSA
                }

                self.gsv_messages[gsv_key]["satellites"].append(satellite)

            # Si es el último mensaje, consolidar satélites
            if message_num == total_messages:
                await self._consolidate_satellites()

        except Exception as e:
            logger.error(f"Error parseando GSV: {e}")

    async def _consolidate_satellites(self):
        """Consolidar todos los satélites de los mensajes GSV"""
        try:
            all_satellites = []
            by_constellation = {}

            for gsv_key, gsv_data in self.gsv_messages.items():
                constellation = gsv_key
                sats = gsv_data["satellites"]

                all_satellites.extend(sats)

                by_constellation[constellation] = {
                    "visible": len(sats),
                    "used": 0  # Se actualizará con GSA
                }

            # Preparar datos de satélites
            satellites_data = {
                "total_visible": len(all_satellites),
                "total_used": self.gnss_data.get('satellites_used', 0),
                "by_constellation": by_constellation,
                "satellites": all_satellites
            }

            # Llamar callback
            if self.satellites_callback:
                self.satellites_callback(satellites_data)

            # Limpiar buffer
            self.gsv_messages.clear()

        except Exception as e:
            logger.error(f"Error consolidando satélites: {e}")

    def _parse_lat_lon(self, value: str, direction: str) -> float:
        """
        Parsear latitud o longitud de formato NMEA a decimal

        Args:
            value: Valor en formato DDMM.MMMM o DDDMM.MMMM
            direction: N/S/E/W

        Returns:
            Coordenada en grados decimales
        """
        if not value:
            return 0.0

        # Determinar si es latitud (2 dígitos) o longitud (3 dígitos)
        if len(value) >= 10:  # Longitud
            degrees = float(value[:3])
            minutes = float(value[3:])
        else:  # Latitud
            degrees = float(value[:2])
            minutes = float(value[2:])

        # Convertir a decimal
        decimal = degrees + (minutes / 60.0)

        # Aplicar dirección
        if direction in ['S', 'W']:
            decimal = -decimal

        return decimal

    def _verify_checksum(self, sentence: str) -> bool:
        """
        Verificar checksum de sentencia NMEA

        Args:
            sentence: Sentencia NMEA completa

        Returns:
            True si el checksum es válido
        """
        if '*' not in sentence:
            return False

        try:
            # Separar sentencia y checksum
            data, checksum = sentence.split('*')

            # Quitar el $
            data = data[1:]

            # Calcular checksum
            calculated = 0
            for char in data:
                calculated ^= ord(char)

            # Comparar
            expected = int(checksum, 16)

            return calculated == expected

        except Exception as e:
            logger.error(f"Error verificando checksum: {e}")
            return False


# ============================================================================
# MOCK GNSS READER PARA TESTING
# ============================================================================

class MockGNSSReader:
    """Mock del GNSS Reader para testing sin hardware"""

    def __init__(self, port: str = "/dev/null", baudrate: int = 115200,
                 callback: Optional[Callable[[Dict], None]] = None,
                 satellites_callback: Optional[Callable[[Dict], None]] = None):
        self.port = port
        self.baudrate = baudrate
        self.callback = callback
        self.satellites_callback = satellites_callback
        self.running = False
        self.connected = False

    async def start(self):
        """Iniciar mock reader"""
        logger.info(f"Mock GNSS Reader iniciado (simulado)")
        self.connected = True
        self.running = True

        # Iniciar tarea de datos simulados
        asyncio.create_task(self._mock_data_loop())

    async def stop(self):
        """Detener mock reader"""
        self.running = False
        self.connected = False
        logger.info("Mock GNSS Reader detenido")

    def is_connected(self) -> bool:
        """Verificar conexión"""
        return self.connected

    async def _mock_data_loop(self):
        """Generar datos GNSS simulados"""
        import random

        while self.running:
            # Datos GNSS simulados
            gnss_data = {
                "timestamp": datetime.utcnow().isoformat() + 'Z',
                "latitude": -33.4489 + random.uniform(-0.0001, 0.0001),
                "longitude": -70.6693 + random.uniform(-0.0001, 0.0001),
                "altitude": 570.5 + random.uniform(-0.5, 0.5),
                "fix_type": "RTK_FIXED",
                "fix_type_code": 4,
                "satellites_used": 18,
                "satellites_visible": 24,
                "hdop": 0.7,
                "vdop": 1.2,
                "pdop": 1.4,
                "accuracy_horizontal": 0.014,
                "accuracy_vertical": 0.021,
                "speed_kmh": 0.0,
                "heading_degrees": 0.0,
                "last_update": datetime.utcnow().isoformat() + 'Z',
                "age_seconds": 0.0
            }

            if self.callback:
                self.callback(gnss_data)

            # Datos de satélites simulados cada 1 segundo
            if random.random() > 0.8:
                satellites_data = {
                    "total_visible": 24,
                    "total_used": 18,
                    "by_constellation": {
                        "GPS": {"visible": 10, "used": 8},
                        "GLONASS": {"visible": 8, "used": 6},
                        "GALILEO": {"visible": 4, "used": 3},
                        "BEIDOU": {"visible": 2, "used": 1}
                    },
                    "satellites": [
                        {
                            "prn": i,
                            "constellation": "GPS",
                            "elevation": random.uniform(10, 90),
                            "azimuth": random.uniform(0, 360),
                            "snr": random.uniform(30, 50),
                            "used": True
                        }
                        for i in range(1, 9)
                    ]
                }

                if self.satellites_callback:
                    self.satellites_callback(satellites_data)

            await asyncio.sleep(0.2)  # 5 Hz


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    # Configurar logging
    logging.basicConfig(level=logging.DEBUG)

    # Callback de prueba
    def on_gnss_data(data: Dict):
        print(f"GNSS: {data.get('fix_type')} - "
              f"Lat: {data.get('latitude'):.6f}, "
              f"Lon: {data.get('longitude'):.6f}, "
              f"Sats: {data.get('satellites_used')}")

    def on_satellites_data(data: Dict):
        print(f"Satélites: {data.get('total_used')}/{data.get('total_visible')}")

    # Crear reader
    reader = MockGNSSReader(
        callback=on_gnss_data,
        satellites_callback=on_satellites_data
    )

    # Ejecutar
    async def main():
        await reader.start()
        await asyncio.sleep(10)
        await reader.stop()

    asyncio.run(main())
