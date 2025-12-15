#!/usr/bin/env python3
"""
Network Utilities para Mini Controlador
Detección de IP, información de red, etc.
"""

import logging
import socket
import subprocess
from typing import Dict, Optional

logger = logging.getLogger(__name__)


class NetworkUtils:
    """Utilidades de red"""

    def __init__(self):
        """Inicializar utilidades de red"""
        pass

    def get_local_ip(self) -> Optional[str]:
        """
        Obtener IP local del sistema

        Prioridad:
        1. Ethernet (eth0)
        2. Wi-Fi (wlan0)
        3. Otras interfaces
        4. Fallback via socket

        Returns:
            IP address como string, o None si no hay IP
        """
        # Lista de interfaces en orden de prioridad
        priority_interfaces = ['eth0', 'wlan0', 'usb0', 'en0', 'en1']

        # Intentar con cada interfaz
        for interface in priority_interfaces:
            ip = self._get_ip_from_interface(interface)
            if ip and ip != '127.0.0.1':
                logger.debug(f"IP encontrada en {interface}: {ip}")
                return ip

        # Fallback: obtener IP vía socket connect
        ip = self._get_ip_via_socket()
        if ip and ip != '127.0.0.1':
            logger.debug(f"IP encontrada vía socket: {ip}")
            return ip

        logger.warning("No se pudo determinar IP local")
        return None

    def _get_ip_from_interface(self, interface: str) -> Optional[str]:
        """
        Obtener IP de una interfaz específica

        Args:
            interface: Nombre de la interfaz (ej: eth0, wlan0)

        Returns:
            IP address o None
        """
        try:
            # Usar ip command (Linux)
            result = subprocess.run(
                ['ip', 'addr', 'show', interface],
                capture_output=True,
                text=True,
                timeout=2
            )

            if result.returncode == 0:
                # Buscar línea con inet
                for line in result.stdout.split('\n'):
                    if 'inet ' in line and not 'inet6' in line:
                        # Extraer IP
                        parts = line.strip().split()
                        if len(parts) >= 2:
                            ip_with_mask = parts[1]
                            ip = ip_with_mask.split('/')[0]
                            return ip

        except FileNotFoundError:
            # ip command no disponible, intentar con ifconfig
            try:
                result = subprocess.run(
                    ['ifconfig', interface],
                    capture_output=True,
                    text=True,
                    timeout=2
                )

                if result.returncode == 0:
                    # Buscar inet addr
                    for line in result.stdout.split('\n'):
                        if 'inet ' in line:
                            # Extraer IP (formato puede variar)
                            parts = line.strip().split()
                            for i, part in enumerate(parts):
                                if part == 'inet' and i + 1 < len(parts):
                                    ip = parts[i + 1].split(':')[-1]
                                    return ip
            except:
                pass

        except Exception as e:
            logger.debug(f"Error obteniendo IP de {interface}: {e}")

        return None

    def _get_ip_via_socket(self) -> Optional[str]:
        """
        Obtener IP local usando socket (método de fallback)

        Returns:
            IP address o None
        """
        try:
            # Crear socket y conectar a un servidor externo
            # (no envía datos, solo establece la ruta)
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(2)
            s.connect(('8.8.8.8', 80))  # Google DNS
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception as e:
            logger.debug(f"Error obteniendo IP vía socket: {e}")
            return None

    def get_panel_url(self, port: int = 8080) -> str:
        """
        Obtener URL completa del panel web

        Args:
            port: Puerto del servidor web

        Returns:
            URL completa (ej: http://192.168.1.120:8080/)
            o mensaje de error si no hay IP
        """
        ip = self.get_local_ip()

        if ip:
            url = f"http://{ip}:{port}/"
            return url
        else:
            return "ERROR: No IP available"

    def get_network_info(self) -> Dict:
        """
        Obtener información completa de red

        Returns:
            Dict con información de red
        """
        info = {
            "interface": "unknown",
            "ip_address": None,
            "mac_address": None,
            "netmask": None,
            "gateway": None,
            "wifi_ssid": None,
            "wifi_rssi": None,
            "wifi_quality": None,
            "wifi_frequency": None,
            "wifi_channel": None,
            "ethernet_connected": False
        }

        # Obtener IP
        ip = self.get_local_ip()
        if ip:
            info["ip_address"] = ip

            # Determinar interfaz activa
            for interface in ['eth0', 'wlan0', 'usb0']:
                interface_ip = self._get_ip_from_interface(interface)
                if interface_ip == ip:
                    info["interface"] = interface
                    break

        # Obtener MAC address
        if info["interface"] != "unknown":
            info["mac_address"] = self._get_mac_address(info["interface"])

        # Si es Wi-Fi, obtener información adicional
        if info["interface"].startswith('wlan'):
            wifi_info = self._get_wifi_info(info["interface"])
            info.update(wifi_info)

        # Verificar si hay Ethernet conectado
        if self._get_ip_from_interface('eth0'):
            info["ethernet_connected"] = True

        return info

    def _get_mac_address(self, interface: str) -> Optional[str]:
        """
        Obtener MAC address de una interfaz

        Args:
            interface: Nombre de la interfaz

        Returns:
            MAC address o None
        """
        try:
            # Leer desde sysfs (Linux)
            with open(f'/sys/class/net/{interface}/address', 'r') as f:
                mac = f.read().strip()
                return mac
        except:
            # Fallback con ip command
            try:
                result = subprocess.run(
                    ['ip', 'link', 'show', interface],
                    capture_output=True,
                    text=True,
                    timeout=2
                )

                if result.returncode == 0:
                    for line in result.stdout.split('\n'):
                        if 'link/ether' in line:
                            parts = line.strip().split()
                            if len(parts) >= 2:
                                return parts[1]
            except:
                pass

        return None

    def _get_wifi_info(self, interface: str) -> Dict:
        """
        Obtener información de Wi-Fi

        Args:
            interface: Nombre de la interfaz Wi-Fi

        Returns:
            Dict con información Wi-Fi
        """
        wifi_info = {
            "wifi_ssid": None,
            "wifi_rssi": None,
            "wifi_quality": None,
            "wifi_frequency": None,
            "wifi_channel": None
        }

        try:
            # Usar iwconfig
            result = subprocess.run(
                ['iwconfig', interface],
                capture_output=True,
                text=True,
                timeout=2
            )

            if result.returncode == 0:
                output = result.stdout

                # Extraer SSID
                if 'ESSID:' in output:
                    ssid_line = [line for line in output.split('\n') if 'ESSID:' in line][0]
                    ssid = ssid_line.split('ESSID:')[1].strip().strip('"')
                    wifi_info["wifi_ssid"] = ssid if ssid else None

                # Extraer RSSI
                if 'Signal level=' in output:
                    signal_line = [line for line in output.split('\n') if 'Signal level=' in line][0]
                    signal_str = signal_line.split('Signal level=')[1].split()[0]

                    # Puede estar en dBm o en escala 0-100
                    if 'dBm' in signal_str:
                        rssi = int(signal_str.replace('dBm', ''))
                        wifi_info["wifi_rssi"] = rssi
                        # Calcular calidad (0-100) desde RSSI
                        # -50 dBm = excelente (100%), -90 dBm = pobre (0%)
                        quality = max(0, min(100, 2 * (rssi + 100)))
                        wifi_info["wifi_quality"] = int(quality)

        except Exception as e:
            logger.debug(f"Error obteniendo info Wi-Fi: {e}")

        return wifi_info

    def is_connected_to_internet(self, timeout: float = 3.0) -> bool:
        """
        Verificar si hay conexión a internet

        Args:
            timeout: Timeout en segundos

        Returns:
            True si hay conexión
        """
        try:
            # Intentar conectar a Google DNS
            socket.create_connection(("8.8.8.8", 53), timeout=timeout)
            return True
        except OSError:
            return False


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    # Configurar logging
    logging.basicConfig(level=logging.DEBUG)

    # Crear instancia
    net_utils = NetworkUtils()

    # Probar funciones
    print("\n=== Network Utils Test ===\n")

    ip = net_utils.get_local_ip()
    print(f"IP Local: {ip}")

    panel_url = net_utils.get_panel_url(8080)
    print(f"Panel URL: {panel_url}")

    network_info = net_utils.get_network_info()
    print(f"\nNetwork Info:")
    for key, value in network_info.items():
        print(f"  {key}: {value}")

    internet = net_utils.is_connected_to_internet()
    print(f"\nInternet conectado: {internet}")
