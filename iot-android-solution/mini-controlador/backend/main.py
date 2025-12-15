#!/usr/bin/env python3
"""
Mini Controlador - Backend Principal
FastAPI + WebSocket + GNSS + BLE Integration

Este es el servidor principal que expone:
- REST API en puerto 8080
- WebSocket para streaming en tiempo real
- Archivos estáticos del panel web
- Integración con BLE Server y GNSS Reader
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Set

import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Importaciones locales
from ble_server import BLEServer
from gnss_reader import GNSSReader
from network_utils import NetworkUtils
from system_monitor import SystemMonitor

# ============================================================================
# CONFIGURACIÓN
# ============================================================================

# Directorio base
BASE_DIR = Path(__file__).parent.parent
CONFIG_DIR = BASE_DIR / "config"
WEB_DIR = BASE_DIR / "web"
LOG_DIR = BASE_DIR / "logs"

# Asegurar que existen los directorios
LOG_DIR.mkdir(exist_ok=True)

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(LOG_DIR / 'backend.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# ============================================================================
# MODELOS PYDANTIC
# ============================================================================

class ConfigUpdate(BaseModel):
    """Modelo para actualización de configuración"""
    device: Optional[Dict] = None
    gnss: Optional[Dict] = None
    ntrip: Optional[Dict] = None
    web: Optional[Dict] = None
    ble: Optional[Dict] = None


class RestartRequest(BaseModel):
    """Modelo para solicitud de reinicio"""
    confirm: bool = False


# ============================================================================
# APLICACIÓN FASTAPI
# ============================================================================

app = FastAPI(
    title="Mini Controlador API",
    description="API REST y WebSocket para el mini controlador GNSS",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# ESTADO GLOBAL
# ============================================================================

class ApplicationState:
    """Estado global de la aplicación"""

    def __init__(self):
        self.config: Dict = {}
        self.gnss_reader: Optional[GNSSReader] = None
        self.ble_server: Optional[BLEServer] = None
        self.system_monitor: SystemMonitor = SystemMonitor()
        self.network_utils: NetworkUtils = NetworkUtils()
        self.websocket_clients: Set[WebSocket] = set()
        self.gnss_data: Dict = {}
        self.satellites_data: Dict = {}
        self.position_history: List[Dict] = []
        self.max_history_points: int = 1000

    def load_config(self):
        """Cargar configuración desde archivo JSON"""
        config_file = CONFIG_DIR / "config.json"
        if config_file.exists():
            with open(config_file, 'r') as f:
                self.config = json.load(f)
            logger.info(f"Configuración cargada desde {config_file}")
        else:
            logger.warning(f"Archivo de configuración no encontrado: {config_file}")
            self.config = self._get_default_config()

    def save_config(self):
        """Guardar configuración a archivo JSON"""
        config_file = CONFIG_DIR / "config.json"
        with open(config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
        logger.info(f"Configuración guardada en {config_file}")

    def _get_default_config(self) -> Dict:
        """Obtener configuración por defecto"""
        return {
            "version": "1.0",
            "device": {
                "name": "MINI-CONTROLADOR",
                "serial": "MC-20250101-001",
                "timezone": "America/Santiago",
                "language": "es"
            },
            "gnss": {
                "port": "/dev/ttyS0",
                "baudrate": 115200,
                "update_rate_hz": 5,
                "elevation_mask_degrees": 10,
                "pdop_mask": 10.0,
                "enabled_constellations": {
                    "gps": True,
                    "glonass": True,
                    "galileo": True,
                    "beidou": True,
                    "qzss": False
                }
            },
            "ntrip": {
                "enabled": False,
                "host": "rtk2go.com",
                "port": 2101,
                "mountpoint": "",
                "username": "",
                "password": "",
                "gga_interval_seconds": 5,
                "reconnect_delay_seconds": 10,
                "timeout_seconds": 30
            },
            "web": {
                "port": 8080,
                "host": "0.0.0.0",
                "websocket_update_rate_hz": 5,
                "cors_enabled": True,
                "allowed_origins": ["*"]
            },
            "ble": {
                "enabled": True,
                "advertising_interval_ms": 1000,
                "device_name": "MINI-CONTROLADOR",
                "tx_power": 0
            },
            "logging": {
                "level": "INFO",
                "file": str(LOG_DIR / "app.log"),
                "max_size_mb": 10,
                "backup_count": 5,
                "console_output": True
            },
            "data": {
                "auto_save": True,
                "save_interval_seconds": 60,
                "history_max_points": 1000,
                "database_path": "/var/lib/mini-controlador/data.db"
            }
        }

    def update_gnss_data(self, data: Dict):
        """Actualizar datos GNSS y agregar al historial"""
        self.gnss_data = data

        # Agregar a historial si hay fix válido
        if data.get('fix_type') not in ['NO_FIX', None]:
            position = {
                "id": len(self.position_history) + 1,
                "timestamp": data.get('timestamp', datetime.utcnow().isoformat() + 'Z'),
                "latitude": data.get('latitude'),
                "longitude": data.get('longitude'),
                "altitude": data.get('altitude'),
                "fix_type": data.get('fix_type'),
                "fix_type_code": data.get('fix_type_code'),
                "accuracy_horizontal": data.get('accuracy_horizontal'),
                "accuracy_vertical": data.get('accuracy_vertical'),
                "satellites_used": data.get('satellites_used'),
                "hdop": data.get('hdop'),
                "vdop": data.get('vdop'),
                "speed_kmh": data.get('speed_kmh'),
                "heading_degrees": data.get('heading_degrees')
            }

            self.position_history.append(position)

            # Limitar tamaño del historial
            if len(self.position_history) > self.max_history_points:
                self.position_history = self.position_history[-self.max_history_points:]

    def update_satellites_data(self, data: Dict):
        """Actualizar datos de satélites"""
        self.satellites_data = data


# Instancia global del estado
state = ApplicationState()

# ============================================================================
# EVENTOS DE INICIO/CIERRE
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Inicializar servicios al arrancar"""
    logger.info("=== Iniciando Mini Controlador Backend ===")

    # Cargar configuración
    state.load_config()

    # Inicializar GNSS Reader
    try:
        gnss_config = state.config.get('gnss', {})
        state.gnss_reader = GNSSReader(
            port=gnss_config.get('port', '/dev/ttyS0'),
            baudrate=gnss_config.get('baudrate', 115200),
            callback=state.update_gnss_data,
            satellites_callback=state.update_satellites_data
        )
        await state.gnss_reader.start()
        logger.info("GNSS Reader iniciado")
    except Exception as e:
        logger.error(f"Error al iniciar GNSS Reader: {e}")
        state.gnss_reader = None

    # Inicializar BLE Server
    if state.config.get('ble', {}).get('enabled', True):
        try:
            ble_config = state.config.get('ble', {})
            device_config = state.config.get('device', {})

            state.ble_server = BLEServer(
                device_name=ble_config.get('device_name', 'MINI-CONTROLADOR'),
                device_info={
                    "device_name": device_config.get('name', 'MINI-CONTROLADOR'),
                    "fw_version": "1.0.0",
                    "serial": device_config.get('serial', 'MC-20250101-001'),
                    "model": "RPI-GNSS-K222",
                    "manufacturer": "GNSS Professional"
                },
                get_panel_url_callback=lambda: state.network_utils.get_panel_url(8080),
                get_health_callback=lambda: state.system_monitor.get_health_data()
            )
            await state.ble_server.start()
            logger.info("BLE Server iniciado")
        except Exception as e:
            logger.error(f"Error al iniciar BLE Server: {e}")
            state.ble_server = None

    # Iniciar tarea de broadcast WebSocket
    asyncio.create_task(websocket_broadcaster())

    logger.info("=== Backend iniciado correctamente ===")


@app.on_event("shutdown")
async def shutdown_event():
    """Detener servicios al cerrar"""
    logger.info("=== Deteniendo Mini Controlador Backend ===")

    if state.gnss_reader:
        await state.gnss_reader.stop()
        logger.info("GNSS Reader detenido")

    if state.ble_server:
        await state.ble_server.stop()
        logger.info("BLE Server detenido")

    logger.info("=== Backend detenido ===")


# ============================================================================
# WEBSOCKET BROADCASTER
# ============================================================================

async def websocket_broadcaster():
    """Tarea para enviar datos a todos los clientes WebSocket"""
    update_rate_hz = state.config.get('web', {}).get('websocket_update_rate_hz', 5)
    interval = 1.0 / update_rate_hz  # 0.2 segundos para 5 Hz

    sequence_gnss = 0
    sequence_sats = 0
    sequence_system = 0

    while True:
        try:
            # Enviar actualización GNSS (cada ciclo @ 5 Hz)
            if state.gnss_data and state.websocket_clients:
                message = {
                    "type": "gnss_update",
                    "timestamp": datetime.utcnow().isoformat() + 'Z',
                    "sequence": sequence_gnss,
                    "data": state.gnss_data
                }
                await broadcast_message(message)
                sequence_gnss += 1

            # Enviar satélites cada 1 segundo (cada 5 ciclos)
            if sequence_gnss % 5 == 0 and state.satellites_data and state.websocket_clients:
                message = {
                    "type": "satellites_update",
                    "timestamp": datetime.utcnow().isoformat() + 'Z',
                    "sequence": sequence_sats,
                    "data": state.satellites_data
                }
                await broadcast_message(message)
                sequence_sats += 1

            # Enviar sistema cada 5 segundos (cada 25 ciclos)
            if sequence_gnss % 25 == 0 and state.websocket_clients:
                system_data = state.system_monitor.get_system_data()
                message = {
                    "type": "system_update",
                    "timestamp": datetime.utcnow().isoformat() + 'Z',
                    "sequence": sequence_system,
                    "data": system_data
                }
                await broadcast_message(message)
                sequence_system += 1

            await asyncio.sleep(interval)

        except Exception as e:
            logger.error(f"Error en websocket broadcaster: {e}")
            await asyncio.sleep(interval)


async def broadcast_message(message: Dict):
    """Enviar mensaje a todos los clientes WebSocket conectados"""
    disconnected_clients = set()

    for client in state.websocket_clients:
        try:
            await client.send_json(message)
        except Exception as e:
            logger.error(f"Error enviando a cliente WebSocket: {e}")
            disconnected_clients.add(client)

    # Eliminar clientes desconectados
    state.websocket_clients -= disconnected_clients


# ============================================================================
# ENDPOINTS REST API
# ============================================================================

@app.get("/")
async def root():
    """Servir index.html del panel web"""
    index_file = WEB_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    else:
        return JSONResponse(
            status_code=404,
            content={"error": "Panel web no encontrado"}
        )


@app.get("/api/status")
async def get_status():
    """Obtener estado completo del sistema"""
    try:
        # Datos del dispositivo
        device_info = {
            "name": state.config.get('device', {}).get('name', 'MINI-CONTROLADOR'),
            "serial": state.config.get('device', {}).get('serial', 'Unknown'),
            "firmware_version": "1.0.0",
            "hardware_model": "RPI-GNSS-K222",
            "uptime_seconds": state.system_monitor.get_uptime(),
            "boot_time": state.system_monitor.get_boot_time()
        }

        # Datos GNSS
        gnss_info = {
            "connected": state.gnss_reader is not None and state.gnss_reader.is_connected(),
            "port": state.config.get('gnss', {}).get('port', '/dev/ttyS0'),
            "baudrate": state.config.get('gnss', {}).get('baudrate', 115200),
        }

        if state.gnss_data:
            gnss_info.update(state.gnss_data)
        else:
            gnss_info.update({
                "fix_type": "NO_FIX",
                "fix_type_code": 0,
                "error": "No hay datos disponibles"
            })

        # Datos de red
        network_info = state.network_utils.get_network_info()

        # Datos del sistema
        system_info = state.system_monitor.get_system_data()

        return {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat() + 'Z',
            "server_time": datetime.utcnow().isoformat() + 'Z',
            "uptime_seconds": state.system_monitor.get_uptime(),
            "device": device_info,
            "gnss": gnss_info,
            "network": network_info,
            "system": system_info
        }

    except Exception as e:
        logger.error(f"Error en /api/status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/config")
async def get_config():
    """Obtener configuración actual"""
    try:
        # Ocultar password de NTRIP
        config_copy = json.loads(json.dumps(state.config))
        if 'ntrip' in config_copy and 'password' in config_copy['ntrip']:
            config_copy['ntrip']['password'] = '********'

        return config_copy

    except Exception as e:
        logger.error(f"Error en /api/config: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/config")
async def update_config(config_update: ConfigUpdate):
    """Actualizar configuración (merge parcial)"""
    try:
        updated_fields = []

        # Merge de configuración
        for key, value in config_update.dict(exclude_none=True).items():
            if key in state.config:
                state.config[key].update(value)
                for subkey in value.keys():
                    updated_fields.append(f"{key}.{subkey}")

        # Guardar configuración
        state.save_config()

        return {
            "status": "ok",
            "message": "Configuración actualizada correctamente",
            "restart_required": True,
            "updated_fields": updated_fields,
            "timestamp": datetime.utcnow().isoformat() + 'Z'
        }

    except Exception as e:
        logger.error(f"Error en POST /api/config: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/satellites")
async def get_satellites():
    """Obtener lista detallada de satélites"""
    try:
        if not state.satellites_data:
            return {
                "timestamp": datetime.utcnow().isoformat() + 'Z',
                "total_visible": 0,
                "total_used": 0,
                "satellites": []
            }

        return {
            "timestamp": datetime.utcnow().isoformat() + 'Z',
            **state.satellites_data
        }

    except Exception as e:
        logger.error(f"Error en /api/satellites: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/position/history")
async def get_position_history(
    limit: int = 100,
    fix_type: Optional[str] = None
):
    """Obtener historial de posiciones"""
    try:
        # Filtrar por fix_type si se especifica
        positions = state.position_history

        if fix_type:
            positions = [p for p in positions if p.get('fix_type') == fix_type]

        # Limitar cantidad
        positions = positions[-limit:]

        # Calcular estadísticas
        stats = {}
        if positions:
            acc_h = [p['accuracy_horizontal'] for p in positions if p.get('accuracy_horizontal')]
            acc_v = [p['accuracy_vertical'] for p in positions if p.get('accuracy_vertical')]
            sats = [p['satellites_used'] for p in positions if p.get('satellites_used')]

            stats = {
                "avg_accuracy_horizontal": sum(acc_h) / len(acc_h) if acc_h else 0,
                "avg_accuracy_vertical": sum(acc_v) / len(acc_v) if acc_v else 0,
                "avg_satellites": sum(sats) / len(sats) if sats else 0,
                "time_range_seconds": 0  # Calcular diferencia entre primero y último
            }

        return {
            "count": len(positions),
            "total_stored": len(state.position_history),
            "query": {
                "limit": limit,
                "fix_type": fix_type
            },
            "points": positions,
            "statistics": stats
        }

    except Exception as e:
        logger.error(f"Error en /api/position/history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/restart")
async def restart_service(request: RestartRequest):
    """Reiniciar el servicio backend"""
    if not request.confirm:
        raise HTTPException(status_code=400, detail="Debe confirmar el reinicio")

    logger.info("Reinicio solicitado vía API")

    # Programar reinicio
    asyncio.create_task(delayed_restart())

    return {
        "status": "ok",
        "message": "Reiniciando servicio en 2 segundos...",
        "restart_time": (datetime.utcnow()).isoformat() + 'Z'
    }


async def delayed_restart():
    """Reiniciar después de un delay"""
    await asyncio.sleep(2)
    logger.info("Ejecutando reinicio...")
    os.execv(sys.executable, [sys.executable] + sys.argv)


@app.get("/api/logs")
async def get_logs(lines: int = 100, level: Optional[str] = None):
    """Obtener logs recientes"""
    try:
        log_file = LOG_DIR / "backend.log"

        if not log_file.exists():
            return {
                "count": 0,
                "logs": []
            }

        # Leer últimas líneas del log
        with open(log_file, 'r') as f:
            all_lines = f.readlines()

        # Obtener últimas N líneas
        recent_lines = all_lines[-lines:]

        # Parsear logs
        logs = []
        for line in recent_lines:
            try:
                # Formato: 2025-12-15 10:30:45 - module - LEVEL - message
                parts = line.strip().split(' - ', 3)
                if len(parts) >= 4:
                    timestamp, module, log_level, message = parts

                    # Filtrar por nivel si se especifica
                    if level and log_level != level:
                        continue

                    logs.append({
                        "timestamp": timestamp,
                        "level": log_level,
                        "module": module,
                        "message": message,
                        "traceback": None
                    })
            except:
                continue

        return {
            "count": len(logs),
            "query": {
                "lines": lines,
                "level": level
            },
            "logs": logs
        }

    except Exception as e:
        logger.error(f"Error en /api/logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# WEBSOCKET ENDPOINT
# ============================================================================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket para streaming de datos en tiempo real"""
    await websocket.accept()
    state.websocket_clients.add(websocket)
    logger.info(f"Cliente WebSocket conectado. Total: {len(state.websocket_clients)}")

    try:
        while True:
            # Esperar mensajes del cliente (ping, subscribe, etc.)
            data = await websocket.receive_text()
            message = json.loads(data)

            # Manejar ping
            if message.get('type') == 'ping':
                await websocket.send_json({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat() + 'Z'
                })

            # Manejar subscribe
            elif message.get('type') == 'subscribe':
                channels = message.get('channels', [])
                await websocket.send_json({
                    "type": "subscribe_ack",
                    "channels": channels,
                    "timestamp": datetime.utcnow().isoformat() + 'Z'
                })

    except WebSocketDisconnect:
        logger.info("Cliente WebSocket desconectado")
    except Exception as e:
        logger.error(f"Error en WebSocket: {e}")
    finally:
        state.websocket_clients.discard(websocket)
        logger.info(f"Cliente WebSocket eliminado. Total: {len(state.websocket_clients)}")


# ============================================================================
# ARCHIVOS ESTÁTICOS
# ============================================================================

# Montar directorio de archivos estáticos
app.mount("/css", StaticFiles(directory=str(WEB_DIR / "css")), name="css")
app.mount("/js", StaticFiles(directory=str(WEB_DIR / "js")), name="js")


# ============================================================================
# PUNTO DE ENTRADA
# ============================================================================

if __name__ == "__main__":
    # Leer puerto de configuración
    port = 8080
    host = "0.0.0.0"

    # Ejecutar servidor
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level="info",
        access_log=True
    )
