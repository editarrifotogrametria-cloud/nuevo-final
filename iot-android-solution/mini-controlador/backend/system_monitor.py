#!/usr/bin/env python3
"""
System Monitor para Mini Controlador
Monitoreo de CPU, memoria, temperatura, etc.
"""

import logging
import os
import time
from datetime import datetime
from typing import Dict, Optional

logger = logging.getLogger(__name__)

# Intentar importar psutil
try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False
    logger.warning("psutil no disponible. Usando métodos alternativos.")


class SystemMonitor:
    """Monitor de sistema"""

    def __init__(self):
        """Inicializar monitor de sistema"""
        self.boot_time = self._get_boot_time_internal()

    def get_uptime(self) -> int:
        """
        Obtener uptime del sistema en segundos

        Returns:
            Uptime en segundos
        """
        if PSUTIL_AVAILABLE:
            return int(time.time() - psutil.boot_time())
        else:
            # Leer de /proc/uptime (Linux)
            try:
                with open('/proc/uptime', 'r') as f:
                    uptime_seconds = float(f.readline().split()[0])
                    return int(uptime_seconds)
            except:
                return 0

    def get_boot_time(self) -> str:
        """
        Obtener timestamp de inicio del sistema

        Returns:
            Timestamp ISO 8601
        """
        return self.boot_time

    def _get_boot_time_internal(self) -> str:
        """Obtener boot time interno"""
        if PSUTIL_AVAILABLE:
            boot_timestamp = psutil.boot_time()
        else:
            # Calcular desde uptime
            try:
                with open('/proc/uptime', 'r') as f:
                    uptime_seconds = float(f.readline().split()[0])
                    boot_timestamp = time.time() - uptime_seconds
            except:
                boot_timestamp = time.time()

        return datetime.fromtimestamp(boot_timestamp).isoformat() + 'Z'

    def get_cpu_percent(self) -> float:
        """
        Obtener uso de CPU

        Returns:
            Porcentaje de uso de CPU (0-100)
        """
        if PSUTIL_AVAILABLE:
            return psutil.cpu_percent(interval=0.1)
        else:
            # Leer de /proc/stat (Linux)
            try:
                with open('/proc/stat', 'r') as f:
                    cpu_line = f.readline()
                    fields = cpu_line.split()

                    # Calcular porcentaje (simplificado)
                    # Esto es solo una aproximación
                    total = sum(int(x) for x in fields[1:])
                    idle = int(fields[4])

                    if total > 0:
                        usage = 100 * (total - idle) / total
                        return usage

            except:
                pass

        return 0.0

    def get_cpu_count(self) -> int:
        """
        Obtener número de CPUs

        Returns:
            Número de CPUs
        """
        if PSUTIL_AVAILABLE:
            return psutil.cpu_count()
        else:
            try:
                return os.cpu_count() or 1
            except:
                return 1

    def get_memory_percent(self) -> float:
        """
        Obtener uso de memoria

        Returns:
            Porcentaje de uso de memoria (0-100)
        """
        if PSUTIL_AVAILABLE:
            return psutil.virtual_memory().percent
        else:
            # Leer de /proc/meminfo (Linux)
            try:
                mem_info = {}
                with open('/proc/meminfo', 'r') as f:
                    for line in f:
                        parts = line.split(':')
                        if len(parts) == 2:
                            key = parts[0].strip()
                            value = int(parts[1].strip().split()[0])
                            mem_info[key] = value

                total = mem_info.get('MemTotal', 0)
                available = mem_info.get('MemAvailable', mem_info.get('MemFree', 0))

                if total > 0:
                    used_percent = 100 * (total - available) / total
                    return used_percent

            except:
                pass

        return 0.0

    def get_memory_mb(self) -> Dict[str, int]:
        """
        Obtener memoria en MB

        Returns:
            Dict con total, used, free, cached
        """
        if PSUTIL_AVAILABLE:
            mem = psutil.virtual_memory()
            return {
                "total": int(mem.total / (1024 * 1024)),
                "used": int(mem.used / (1024 * 1024)),
                "free": int(mem.available / (1024 * 1024)),
                "cached": int(mem.cached / (1024 * 1024)) if hasattr(mem, 'cached') else 0
            }
        else:
            # Leer de /proc/meminfo
            try:
                mem_info = {}
                with open('/proc/meminfo', 'r') as f:
                    for line in f:
                        parts = line.split(':')
                        if len(parts) == 2:
                            key = parts[0].strip()
                            value = int(parts[1].strip().split()[0])  # kB
                            mem_info[key] = value

                return {
                    "total": mem_info.get('MemTotal', 0) // 1024,
                    "used": (mem_info.get('MemTotal', 0) - mem_info.get('MemAvailable', 0)) // 1024,
                    "free": mem_info.get('MemAvailable', mem_info.get('MemFree', 0)) // 1024,
                    "cached": mem_info.get('Cached', 0) // 1024
                }

            except:
                return {"total": 0, "used": 0, "free": 0, "cached": 0}

    def get_temperature_celsius(self) -> Optional[float]:
        """
        Obtener temperatura del CPU

        Returns:
            Temperatura en Celsius o None si no disponible
        """
        if PSUTIL_AVAILABLE:
            try:
                temps = psutil.sensors_temperatures()

                # Raspberry Pi
                if 'cpu_thermal' in temps:
                    return temps['cpu_thermal'][0].current

                # Otras plataformas
                if 'coretemp' in temps:
                    return temps['coretemp'][0].current

            except:
                pass

        # Método alternativo para Raspberry Pi
        try:
            with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
                temp_millidegrees = int(f.read().strip())
                return temp_millidegrees / 1000.0
        except:
            pass

        return None

    def get_disk_percent(self) -> float:
        """
        Obtener uso de disco

        Returns:
            Porcentaje de uso de disco (0-100)
        """
        if PSUTIL_AVAILABLE:
            return psutil.disk_usage('/').percent
        else:
            # Usar du command (menos preciso)
            try:
                import shutil
                stat = shutil.disk_usage('/')
                used_percent = 100 * stat.used / stat.total
                return used_percent
            except:
                return 0.0

    def get_disk_gb(self) -> Dict[str, float]:
        """
        Obtener disco en GB

        Returns:
            Dict con total, used, free
        """
        if PSUTIL_AVAILABLE:
            disk = psutil.disk_usage('/')
            return {
                "total": disk.total / (1024 ** 3),
                "used": disk.used / (1024 ** 3),
                "free": disk.free / (1024 ** 3)
            }
        else:
            try:
                import shutil
                stat = shutil.disk_usage('/')
                return {
                    "total": stat.total / (1024 ** 3),
                    "used": stat.used / (1024 ** 3),
                    "free": stat.free / (1024 ** 3)
                }
            except:
                return {"total": 0.0, "used": 0.0, "free": 0.0}

    def get_load_average(self) -> list:
        """
        Obtener load average

        Returns:
            Lista con load average [1min, 5min, 15min]
        """
        if PSUTIL_AVAILABLE:
            return list(psutil.getloadavg())
        else:
            try:
                return list(os.getloadavg())
            except:
                return [0.0, 0.0, 0.0]

    def get_system_data(self) -> Dict:
        """
        Obtener datos completos del sistema

        Returns:
            Dict con todos los datos del sistema
        """
        return {
            "cpu_percent": round(self.get_cpu_percent(), 1),
            "cpu_count": self.get_cpu_count(),
            "memory_percent": round(self.get_memory_percent(), 1),
            "memory_mb": self.get_memory_mb(),
            "temperature_celsius": self.get_temperature_celsius(),
            "disk_percent": round(self.get_disk_percent(), 1),
            "disk_gb": {
                k: round(v, 1) for k, v in self.get_disk_gb().items()
            },
            "load_average": [round(x, 2) for x in self.get_load_average()]
        }

    def get_health_data(self) -> Dict:
        """
        Obtener datos de salud (para BLE HEALTH characteristic)

        Returns:
            Dict con datos de salud
        """
        temp = self.get_temperature_celsius()

        # Determinar estado general
        cpu = self.get_cpu_percent()
        mem = self.get_memory_percent()

        if cpu > 90 or mem > 90 or (temp and temp > 80):
            status = "warning"
        elif temp and temp > 85:
            status = "error"
        else:
            status = "healthy"

        health = {
            "uptime_seconds": self.get_uptime(),
            "cpu_percent": round(cpu, 1),
            "memory_percent": round(mem, 1),
            "memory_mb": self.get_memory_mb(),
            "status": status,
            "timestamp": datetime.utcnow().isoformat() + 'Z'
        }

        if temp is not None:
            health["temperature_celsius"] = round(temp, 1)

        # Agregar información de red (si está disponible)
        try:
            from network_utils import NetworkUtils
            net_utils = NetworkUtils()
            net_info = net_utils.get_network_info()

            health.update({
                "wifi_connected": bool(net_info.get("wifi_ssid")),
                "wifi_ssid": net_info.get("wifi_ssid"),
                "wifi_rssi": net_info.get("wifi_rssi"),
                "wifi_quality": net_info.get("wifi_quality"),
                "ip_address": net_info.get("ip_address"),
                "interface": net_info.get("interface"),
                "ethernet_connected": net_info.get("ethernet_connected", False)
            })
        except:
            pass

        return health


# ============================================================================
# TESTING
# ============================================================================

if __name__ == "__main__":
    # Configurar logging
    logging.basicConfig(level=logging.DEBUG)

    # Crear instancia
    monitor = SystemMonitor()

    # Probar funciones
    print("\n=== System Monitor Test ===\n")

    print(f"Uptime: {monitor.get_uptime()} segundos")
    print(f"Boot Time: {monitor.get_boot_time()}")
    print(f"CPU: {monitor.get_cpu_percent()}%")
    print(f"CPU Count: {monitor.get_cpu_count()}")
    print(f"Memory: {monitor.get_memory_percent()}%")
    print(f"Memory MB: {monitor.get_memory_mb()}")
    print(f"Temperature: {monitor.get_temperature_celsius()}°C")
    print(f"Disk: {monitor.get_disk_percent()}%")
    print(f"Disk GB: {monitor.get_disk_gb()}")
    print(f"Load Average: {monitor.get_load_average()}")

    print("\n=== System Data ===\n")
    import json
    print(json.dumps(monitor.get_system_data(), indent=2))

    print("\n=== Health Data ===\n")
    print(json.dumps(monitor.get_health_data(), indent=2))
