#!/usr/bin/env python3
"""
BLE GATT Server para Mini Controlador
Implementa el profile BLE con características:
- DEVICE_INFO: Información del dispositivo
- PANEL_URL: URL del panel web
- HEALTH: Estado del sistema
"""

import asyncio
import json
import logging
from typing import Callable, Dict, Optional

logger = logging.getLogger(__name__)

# Intentar importar BlueZ (puede no estar disponible en sistemas sin BLE)
try:
    import dbus
    import dbus.mainloop.glib
    import dbus.service
    from gi.repository import GLib
    BLUEZ_AVAILABLE = True
except ImportError:
    BLUEZ_AVAILABLE = False
    logger.warning("BlueZ no disponible. BLE Server no funcionará.")


# UUIDs del GATT Profile
SERVICE_UUID = "0000181A-0000-1000-8000-00805F9B34FB"
DEVICE_INFO_UUID = "00002A29-0000-1000-8000-00805F9B34FB"
PANEL_URL_UUID = "00002A24-0000-1000-8000-00805F9B34FB"
HEALTH_UUID = "00002A19-0000-1000-8000-00805F9B34FB"

# Descriptor UUID para notificaciones
CCCD_UUID = "00002902-0000-1000-8000-00805F9B34FB"


class BLEServer:
    """Servidor BLE GATT para anunciar el mini controlador"""

    def __init__(
        self,
        device_name: str,
        device_info: Dict,
        get_panel_url_callback: Callable[[], str],
        get_health_callback: Callable[[], Dict]
    ):
        """
        Inicializar BLE Server

        Args:
            device_name: Nombre del dispositivo BLE
            device_info: Dict con información del dispositivo
            get_panel_url_callback: Función para obtener URL del panel
            get_health_callback: Función para obtener datos de salud
        """
        self.device_name = device_name
        self.device_info = device_info
        self.get_panel_url_callback = get_panel_url_callback
        self.get_health_callback = get_health_callback

        self.running = False
        self.mainloop = None
        self.advertising = False

        if not BLUEZ_AVAILABLE:
            logger.error("BlueZ no está disponible. BLE Server no puede iniciarse.")

    async def start(self):
        """Iniciar el servidor BLE"""
        if not BLUEZ_AVAILABLE:
            logger.warning("BLE Server no puede iniciarse (BlueZ no disponible)")
            return

        try:
            logger.info("Iniciando BLE Server...")

            # Inicializar DBus mainloop
            dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

            # Obtener bus del sistema
            self.bus = dbus.SystemBus()

            # Registrar aplicación GATT
            await self._register_gatt_application()

            # Iniciar advertising
            await self._start_advertising()

            self.running = True
            logger.info(f"BLE Server iniciado: {self.device_name}")

        except Exception as e:
            logger.error(f"Error al iniciar BLE Server: {e}")
            raise

    async def stop(self):
        """Detener el servidor BLE"""
        if not self.running:
            return

        try:
            logger.info("Deteniendo BLE Server...")

            # Detener advertising
            await self._stop_advertising()

            # Desregistrar aplicación
            await self._unregister_gatt_application()

            self.running = False
            logger.info("BLE Server detenido")

        except Exception as e:
            logger.error(f"Error al detener BLE Server: {e}")

    async def _register_gatt_application(self):
        """Registrar aplicación GATT con BlueZ"""
        try:
            # Esta es una implementación simplificada
            # En producción, necesitarías usar python-bluezero o bleak-peripheral
            logger.info("Registrando aplicación GATT...")

            # TODO: Implementar registro completo con BlueZ DBus API
            # Por ahora, simulamos el registro exitoso
            logger.info("Aplicación GATT registrada (simulado)")

        except Exception as e:
            logger.error(f"Error registrando GATT: {e}")
            raise

    async def _unregister_gatt_application(self):
        """Desregistrar aplicación GATT"""
        try:
            logger.info("Desregistrando aplicación GATT...")
            # TODO: Implementar desregistro
            logger.info("Aplicación GATT desregistrada (simulado)")
        except Exception as e:
            logger.error(f"Error desregistrando GATT: {e}")

    async def _start_advertising(self):
        """Iniciar advertising BLE"""
        try:
            logger.info("Iniciando advertising BLE...")

            # TODO: Implementar advertising con BlueZ DBus API
            # Configuración de advertising:
            # - Local Name: MINI-CONTROLADOR
            # - Service UUIDs: [SERVICE_UUID]
            # - TX Power: 0 dBm

            self.advertising = True
            logger.info(f"Advertising iniciado: {self.device_name}")

        except Exception as e:
            logger.error(f"Error iniciando advertising: {e}")
            raise

    async def _stop_advertising(self):
        """Detener advertising BLE"""
        try:
            if not self.advertising:
                return

            logger.info("Deteniendo advertising BLE...")

            # TODO: Implementar detención de advertising

            self.advertising = False
            logger.info("Advertising detenido")

        except Exception as e:
            logger.error(f"Error deteniendo advertising: {e}")

    def read_device_info(self) -> bytes:
        """Leer característica DEVICE_INFO"""
        try:
            info_json = json.dumps(self.device_info)
            logger.debug(f"DEVICE_INFO leída: {info_json}")
            return info_json.encode('utf-8')
        except Exception as e:
            logger.error(f"Error leyendo DEVICE_INFO: {e}")
            return b'{"error":"Error reading device info"}'

    def read_panel_url(self) -> bytes:
        """Leer característica PANEL_URL (dinámica)"""
        try:
            url = self.get_panel_url_callback()
            logger.debug(f"PANEL_URL leída: {url}")
            return url.encode('utf-8')
        except Exception as e:
            logger.error(f"Error leyendo PANEL_URL: {e}")
            return b'ERROR: No IP available'

    def read_health(self) -> bytes:
        """Leer característica HEALTH"""
        try:
            health_data = self.get_health_callback()
            health_json = json.dumps(health_data)
            logger.debug(f"HEALTH leída: longitud={len(health_json)} bytes")
            return health_json.encode('utf-8')
        except Exception as e:
            logger.error(f"Error leyendo HEALTH: {e}")
            return b'{"error":"Error reading health data"}'


# ============================================================================
# IMPLEMENTACIÓN ALTERNATIVA CON BLEAK (más portátil)
# ============================================================================

class BLEServerBleak:
    """
    Implementación alternativa usando bleak-peripheral
    (Requiere: pip install bleak-peripheral)

    Esta implementación es más portátil y funciona en Linux, macOS y Windows.
    """

    def __init__(
        self,
        device_name: str,
        device_info: Dict,
        get_panel_url_callback: Callable[[], str],
        get_health_callback: Callable[[], Dict]
    ):
        self.device_name = device_name
        self.device_info = device_info
        self.get_panel_url_callback = get_panel_url_callback
        self.get_health_callback = get_health_callback
        self.running = False

    async def start(self):
        """Iniciar servidor BLE con bleak"""
        try:
            logger.info("Iniciando BLE Server (bleak)...")

            # TODO: Implementar con bleak-peripheral cuando esté disponible
            # from bleak_peripheral import GATT, Peripheral, Service, Characteristic

            logger.info("BLE Server (bleak) iniciado (simulado)")
            self.running = True

        except Exception as e:
            logger.error(f"Error iniciando BLE Server (bleak): {e}")

    async def stop(self):
        """Detener servidor BLE"""
        if self.running:
            logger.info("Deteniendo BLE Server (bleak)...")
            self.running = False
            logger.info("BLE Server (bleak) detenido")


# ============================================================================
# MOCK BLE SERVER PARA TESTING
# ============================================================================

class MockBLEServer:
    """Mock del BLE Server para testing sin hardware BLE"""

    def __init__(
        self,
        device_name: str,
        device_info: Dict,
        get_panel_url_callback: Callable[[], str],
        get_health_callback: Callable[[], Dict]
    ):
        self.device_name = device_name
        self.device_info = device_info
        self.get_panel_url_callback = get_panel_url_callback
        self.get_health_callback = get_health_callback
        self.running = False

    async def start(self):
        """Iniciar servidor BLE (mock)"""
        logger.info(f"Mock BLE Server iniciado: {self.device_name}")
        logger.info(f"Device Info: {self.device_info}")
        logger.info(f"Panel URL: {self.get_panel_url_callback()}")
        logger.info(f"Health: {json.dumps(self.get_health_callback(), indent=2)}")
        self.running = True

    async def stop(self):
        """Detener servidor BLE (mock)"""
        if self.running:
            logger.info("Mock BLE Server detenido")
            self.running = False


# ============================================================================
# FACTORY FUNCTION
# ============================================================================

def create_ble_server(
    device_name: str,
    device_info: Dict,
    get_panel_url_callback: Callable[[], str],
    get_health_callback: Callable[[], Dict],
    mock: bool = False
) -> BLEServer:
    """
    Factory para crear BLE Server apropiado

    Args:
        device_name: Nombre del dispositivo
        device_info: Información del dispositivo
        get_panel_url_callback: Callback para obtener URL
        get_health_callback: Callback para obtener salud
        mock: Si True, usar mock server

    Returns:
        Instancia de BLE Server
    """
    if mock or not BLUEZ_AVAILABLE:
        logger.info("Usando Mock BLE Server")
        return MockBLEServer(
            device_name,
            device_info,
            get_panel_url_callback,
            get_health_callback
        )
    else:
        logger.info("Usando BLE Server real")
        return BLEServer(
            device_name,
            device_info,
            get_panel_url_callback,
            get_health_callback
        )


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    # Configurar logging
    logging.basicConfig(level=logging.DEBUG)

    # Callbacks de prueba
    def get_panel_url():
        return "http://192.168.1.120:8080/"

    def get_health():
        return {
            "uptime_seconds": 3600,
            "cpu_percent": 25.5,
            "memory_percent": 42.3,
            "temperature_celsius": 45.2,
            "wifi_connected": True,
            "wifi_ssid": "TestNetwork",
            "wifi_rssi": -55,
            "ip_address": "192.168.1.120",
            "interface": "wlan0",
            "status": "healthy"
        }

    # Crear servidor de prueba
    device_info = {
        "device_name": "MINI-CONTROLADOR",
        "fw_version": "1.0.0",
        "serial": "MC-20250101-001",
        "model": "RPI-GNSS-K222",
        "manufacturer": "GNSS Professional"
    }

    server = create_ble_server(
        "MINI-CONTROLADOR",
        device_info,
        get_panel_url,
        get_health,
        mock=True  # Usar mock para testing
    )

    # Ejecutar servidor
    async def main():
        await server.start()
        await asyncio.sleep(10)
        await server.stop()

    asyncio.run(main())
