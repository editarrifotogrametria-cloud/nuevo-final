# 🏗️ ARQUITECTURA COMPLETA - MINI CONTROLADOR IoT + ANDROID

## 📋 Índice
1. [Visión General](#visión-general)
2. [Diagrama de Arquitectura](#diagrama-de-arquitectura)
3. [Especificación BLE](#especificación-ble)
4. [Especificación REST API](#especificación-rest-api)
5. [Especificación WebSocket](#especificación-websocket)
6. [Flujo de Conexión UX](#flujo-de-conexión-ux)
7. [Estructura de Datos](#estructura-de-datos)

---

## 🎯 Visión General

### Componentes del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                     ECOSISTEMA COMPLETO                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│  MINI CONTROLADOR    │         │   APP ANDROID        │
│  (Raspberry Pi)      │         │   (Smartphone)       │
├──────────────────────┤         ├──────────────────────┤
│                      │         │                      │
│ ┌────────────────┐  │  BLE    │ ┌────────────────┐  │
│ │  BLE Server    │◄─┼─────────┼─┤  BLE Scanner   │  │
│ │  Advertising   │  │  Scan   │ │  GATT Client   │  │
│ └────────────────┘  │         │ └────────────────┘  │
│                      │         │         │           │
│ ┌────────────────┐  │         │         ▼           │
│ │  Web Server    │◄─┼─────────┼─┐ ┌────────────┐   │
│ │  FastAPI       │  │  Wi-Fi  │ └─┤  WebView   │   │
│ │  Port 8080     │  │  HTTP   │   │  Embedded  │   │
│ └────────────────┘  │         │   └────────────┘   │
│                      │         │                      │
│ ┌────────────────┐  │         │                      │
│ │  GNSS Module   │  │         │                      │
│ │  ComNav K222   │  │         │                      │
│ └────────────────┘  │         │                      │
└──────────────────────┘         └──────────────────────┘
```

### Tecnologías Clave

**Mini Controlador:**
- **Hardware**: Raspberry Pi Zero 2W / Pi 4
- **OS**: Raspberry Pi OS (Linux)
- **Backend**: Python 3.9+ con FastAPI
- **BLE Stack**: BlueZ 5.55+ con python-bluez / bleak
- **Web Server**: Uvicorn (ASGI)
- **Frontend**: SPA (HTML5 + JavaScript + Leaflet + Chart.js)
- **Process Manager**: systemd

**App Android:**
- **Language**: Kotlin 1.9+
- **Min SDK**: 21 (Android 5.0 Lollipop)
- **Target SDK**: 34 (Android 14)
- **BLE Library**: Android BLE API (android.bluetooth)
- **HTTP Client**: OkHttp / Retrofit
- **WebView**: Android WebView con JavaScript habilitado
- **UI**: Material Design 3

---

## 🗺️ Diagrama de Arquitectura

### Arquitectura de 3 Capas

```
┌───────────────────────────────────────────────────────────────────┐
│                      CAPA DE PRESENTACIÓN                          │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────┐         ┌─────────────────────┐         │
│  │   Web Dashboard     │         │   Android App       │         │
│  │   (Responsive SPA)  │         │   (Kotlin Native)   │         │
│  └─────────────────────┘         └─────────────────────┘         │
│            │                                │                      │
│            │ HTTP/WS                        │ BLE + HTTP          │
│            ▼                                ▼                      │
├───────────────────────────────────────────────────────────────────┤
│                      CAPA DE APLICACIÓN                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │              FastAPI Backend (Puerto 8080)               │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │                                                           │    │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐    │    │
│  │  │ REST API    │  │ WebSocket    │  │ Static      │    │    │
│  │  │ Endpoints   │  │ Stream 5Hz   │  │ Files       │    │    │
│  │  └─────────────┘  └──────────────┘  └─────────────┘    │    │
│  │                                                           │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │           BLE GATT Server (BlueZ)                        │    │
│  ├──────────────────────────────────────────────────────────┤    │
│  │  Service: MINI-CONTROLADOR                               │    │
│  │  - Characteristic: DEVICE_INFO                           │    │
│  │  - Characteristic: PANEL_URL                             │    │
│  │  - Characteristic: HEALTH                                │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                    │
├───────────────────────────────────────────────────────────────────┤
│                      CAPA DE DATOS                                 │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ Config JSON │  │ GNSS Data   │  │ Network     │              │
│  │ Files       │  │ Stream      │  │ Detection   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
┌──────────────────────────────────────────────────────────────────┐
│                    FLUJO DE DESCUBRIMIENTO                        │
└──────────────────────────────────────────────────────────────────┘

1. ADVERTISING BLE
   ┌─────────────┐
   │ Mini Ctrl   │ ──► BLE Advertising (continuo)
   └─────────────┘     Name: "MINI-CONTROLADOR"
                       Service UUID: 0000181A-0000-1000-8000-00805F9B34FB

2. SCAN Y DESCUBRIMIENTO
                       ┌─────────────┐
   BLE Scan ◄────────  │ Android App │
   Filtro: "MINI-*"    └─────────────┘

3. CONEXIÓN GATT
   ┌─────────────┐                    ┌─────────────┐
   │ Mini Ctrl   │ ◄── GATT Connect ──│ Android App │
   └─────────────┘                    └─────────────┘
                   ──► Discover Services
                   ◄── Service List
                   ──► Read PANEL_URL
                   ◄── "http://192.168.1.120:8080/"

4. VERIFICACIÓN DE CONECTIVIDAD
                                      ┌─────────────┐
   GET /api/status ◄──────────────── │ Android App │
   (timeout 3s)                       └─────────────┘

   Si responde 200 OK:
   ├─► Continuar al WebView
   │
   Si timeout/error:
   └─► Mostrar mensaje: "Conecta tu teléfono a la misma red Wi-Fi"

5. APERTURA DE PANEL
                                      ┌─────────────┐
   WebView.loadUrl()  ◄────────────  │ Android App │
   http://192.168.1.120:8080/         └─────────────┘
```

---

## 📡 Especificación BLE

### Perfiles y Servicios

```
┌─────────────────────────────────────────────────────────────────┐
│                   BLE GATT HIERARCHY                             │
└─────────────────────────────────────────────────────────────────┘

DEVICE: MINI-CONTROLADOR
│
├── Generic Access (0x1800) [Estándar]
│   ├── Device Name (0x2A00): "MINI-CONTROLADOR"
│   └── Appearance (0x2A01): Generic Computer
│
├── Generic Attribute (0x1801) [Estándar]
│   └── Service Changed (0x2A05)
│
└── Custom Service: MINI_CONTROLADOR_SERVICE
    UUID: 0000181A-0000-1000-8000-00805F9B34FB
    │
    ├── Characteristic: DEVICE_INFO
    │   UUID: 00002A29-0000-1000-8000-00805F9B34FB
    │   Properties: READ
    │   Descriptor: Client Characteristic Configuration (0x2902)
    │   Value: JSON String
    │   {
    │     "device_name": "MINI-CONTROLADOR",
    │     "fw_version": "1.0.0",
    │     "serial": "MC-20250101-001",
    │     "model": "RPI-GNSS-K222",
    │     "manufacturer": "GNSS Professional"
    │   }
    │
    ├── Characteristic: PANEL_URL
    │   UUID: 00002A24-0000-1000-8000-00805F9B34FB
    │   Properties: READ
    │   Descriptor: Client Characteristic Configuration (0x2902)
    │   Value: String (URL completa)
    │   Ejemplo: "http://192.168.1.120:8080/"
    │   Nota: Se recalcula dinámicamente cada lectura
    │
    └── Characteristic: HEALTH
        UUID: 00002A19-0000-1000-8000-00805F9B34FB
        Properties: READ, NOTIFY
        Descriptor: Client Characteristic Configuration (0x2902)
        Value: JSON String
        {
          "uptime_seconds": 3600,
          "cpu_percent": 25.5,
          "memory_percent": 42.3,
          "temperature_celsius": 45.2,
          "wifi_connected": true,
          "wifi_ssid": "MyNetwork",
          "wifi_rssi": -55,
          "ip_address": "192.168.1.120",
          "interface": "wlan0",
          "timestamp": "2025-12-15T10:30:00Z"
        }
```

### UUIDs Definitivos

| Elemento | UUID | Tipo | Notas |
|----------|------|------|-------|
| **Service Principal** | `0000181A-0000-1000-8000-00805F9B34FB` | Primary Service | Environmental Sensing (reutilizado) |
| **DEVICE_INFO** | `00002A29-0000-1000-8000-00805F9B34FB` | Characteristic | Manufacturer Name String (reutilizado) |
| **PANEL_URL** | `00002A24-0000-1000-8000-00805F9B34FB` | Characteristic | Model Number String (reutilizado) |
| **HEALTH** | `00002A19-0000-1000-8000-00805F9B34FB` | Characteristic | Battery Level (reutilizado) |

**Nota sobre UUIDs**: Usamos UUIDs estándar de Bluetooth SIG para máxima compatibilidad. Si prefieres UUIDs completamente custom, usar el rango: `XXXXXX00-YYYY-YYYY-YYYY-XXXXXXXXXXXX` donde reemplazas los X.

### Advertising Packet

```python
# Estructura del advertising packet
{
    "local_name": "MINI-CONTROLADOR",
    "service_uuids": ["0000181A-0000-1000-8000-00805F9B34FB"],
    "tx_power": 0,  # 0 dBm
    "appearance": 128,  # Generic Computer
    "flags": 0x06  # LE General Discoverable Mode, BR/EDR Not Supported
}
```

### Detección de IP Local

```python
# Algoritmo de detección de IP (pseudo-código)
def get_local_ip():
    interfaces = get_network_interfaces()

    # Prioridad de interfaces
    priority = ["eth0", "wlan0", "usb0"]

    for iface in priority:
        if iface in interfaces:
            ip = get_ip_address(iface)
            if ip and ip != "127.0.0.1":
                return ip

    # Fallback: obtener IP de default gateway
    return get_ip_via_socket_connect()

# Actualización dinámica en PANEL_URL
def read_panel_url_characteristic():
    ip = get_local_ip()
    if ip:
        url = f"http://{ip}:8080/"
    else:
        url = "ERROR: No IP available"
    return url.encode('utf-8')
```

---

## 🌐 Especificación REST API

### Base URL
```
http://{DEVICE_IP}:8080
```

### Endpoints

#### 1. GET /api/status
**Descripción**: Obtener estado actual del sistema y GNSS

**Request**:
```http
GET /api/status HTTP/1.1
Host: 192.168.1.120:8080
Accept: application/json
```

**Response 200 OK**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "device": {
    "name": "MINI-CONTROLADOR",
    "serial": "MC-20250101-001",
    "firmware_version": "1.0.0",
    "uptime_seconds": 7200
  },
  "gnss": {
    "fix_type": "RTK_FIXED",
    "fix_type_code": 4,
    "latitude": -33.4489123,
    "longitude": -70.6693456,
    "altitude": 570.523,
    "accuracy_horizontal": 0.014,
    "accuracy_vertical": 0.021,
    "satellites_used": 18,
    "satellites_visible": 24,
    "hdop": 0.7,
    "vdop": 1.2,
    "pdop": 1.4,
    "speed_kmh": 0.0,
    "heading_degrees": 0.0,
    "last_update": "2025-12-15T10:30:44.987Z"
  },
  "network": {
    "interface": "wlan0",
    "ip_address": "192.168.1.120",
    "mac_address": "b8:27:eb:12:34:56",
    "wifi_ssid": "MyNetwork",
    "wifi_rssi": -55,
    "wifi_quality": 85
  },
  "system": {
    "cpu_percent": 25.5,
    "memory_percent": 42.3,
    "temperature_celsius": 45.2,
    "disk_percent": 35.7
  }
}
```

#### 2. GET /api/config
**Descripción**: Obtener configuración actual

**Request**:
```http
GET /api/config HTTP/1.1
Host: 192.168.1.120:8080
Accept: application/json
```

**Response 200 OK**:
```json
{
  "device": {
    "name": "MINI-CONTROLADOR",
    "timezone": "America/Santiago"
  },
  "gnss": {
    "port": "/dev/ttyS0",
    "baudrate": 115200,
    "update_rate_hz": 5,
    "elevation_mask_degrees": 10,
    "enabled_constellations": {
      "gps": true,
      "glonass": true,
      "galileo": true,
      "beidou": true
    }
  },
  "ntrip": {
    "enabled": true,
    "host": "rtk2go.com",
    "port": 2101,
    "mountpoint": "YOUR_MOUNT",
    "username": "user@example.com",
    "gga_interval_seconds": 5
  },
  "web": {
    "port": 8080,
    "websocket_update_rate_hz": 5
  }
}
```

#### 3. POST /api/config
**Descripción**: Actualizar configuración (requiere reinicio)

**Request**:
```http
POST /api/config HTTP/1.1
Host: 192.168.1.120:8080
Content-Type: application/json

{
  "gnss": {
    "update_rate_hz": 10
  },
  "ntrip": {
    "enabled": true,
    "mountpoint": "NEW_MOUNT"
  }
}
```

**Response 200 OK**:
```json
{
  "status": "ok",
  "message": "Configuración actualizada. Reinicia el servicio para aplicar cambios.",
  "restart_required": true
}
```

#### 4. GET /api/satellites
**Descripción**: Obtener lista detallada de satélites

**Response 200 OK**:
```json
{
  "timestamp": "2025-12-15T10:30:45.123Z",
  "total_visible": 24,
  "total_used": 18,
  "satellites": [
    {
      "prn": 1,
      "constellation": "GPS",
      "elevation": 45.2,
      "azimuth": 123.5,
      "snr": 42.0,
      "used": true
    },
    {
      "prn": 2,
      "constellation": "GPS",
      "elevation": 32.1,
      "azimuth": 245.7,
      "snr": 38.5,
      "used": true
    }
  ]
}
```

#### 5. GET /api/position/history
**Descripción**: Obtener historial de posiciones (últimas 100)

**Query Parameters**:
- `limit` (opcional): Número de puntos (default: 100, max: 1000)

**Response 200 OK**:
```json
{
  "count": 100,
  "points": [
    {
      "timestamp": "2025-12-15T10:30:45.123Z",
      "latitude": -33.4489123,
      "longitude": -70.6693456,
      "altitude": 570.523,
      "fix_type": "RTK_FIXED",
      "accuracy_horizontal": 0.014
    }
  ]
}
```

#### 6. POST /api/restart
**Descripción**: Reiniciar el servicio backend

**Response 200 OK**:
```json
{
  "status": "ok",
  "message": "Reiniciando servicio..."
}
```

#### 7. GET /api/logs
**Descripción**: Obtener logs recientes

**Query Parameters**:
- `lines` (opcional): Número de líneas (default: 100)

**Response 200 OK**:
```json
{
  "lines": 100,
  "logs": [
    "2025-12-15 10:30:45 INFO: Sistema iniciado",
    "2025-12-15 10:30:46 INFO: GNSS conectado",
    "2025-12-15 10:30:47 INFO: RTK Fixed obtenido"
  ]
}
```

### Códigos de Error Estándar

```json
{
  "status": "error",
  "error_code": "GNSS_NOT_CONNECTED",
  "message": "Módulo GNSS no conectado",
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

**Códigos de Error**:
- `GNSS_NOT_CONNECTED`: Módulo GNSS no responde
- `NO_FIX`: Sin fix GPS
- `CONFIG_INVALID`: Configuración inválida
- `NTRIP_FAILED`: Error en cliente NTRIP
- `INTERNAL_ERROR`: Error interno del servidor

---

## 🔌 Especificación WebSocket

### Conexión
```javascript
const ws = new WebSocket('ws://192.168.1.120:8080/ws');
```

### Protocolo

#### Mensaje del Servidor → Cliente (cada 200ms @ 5Hz)

```json
{
  "type": "gnss_update",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "data": {
    "fix_type": "RTK_FIXED",
    "latitude": -33.4489123,
    "longitude": -70.6693456,
    "altitude": 570.523,
    "accuracy_horizontal": 0.014,
    "accuracy_vertical": 0.021,
    "satellites_used": 18,
    "satellites_visible": 24,
    "hdop": 0.7,
    "speed_kmh": 0.0,
    "heading_degrees": 0.0
  }
}
```

#### Mensaje Satélites (cada 1s)

```json
{
  "type": "satellites_update",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "data": {
    "total_visible": 24,
    "total_used": 18,
    "satellites": [
      {
        "prn": 1,
        "constellation": "GPS",
        "elevation": 45.2,
        "azimuth": 123.5,
        "snr": 42.0,
        "used": true
      }
    ]
  }
}
```

#### Mensaje de Sistema (cada 5s)

```json
{
  "type": "system_update",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "data": {
    "cpu_percent": 25.5,
    "memory_percent": 42.3,
    "temperature_celsius": 45.2,
    "uptime_seconds": 7200
  }
}
```

#### Mensaje Cliente → Servidor (Ping)

```json
{
  "type": "ping"
}
```

**Respuesta**:
```json
{
  "type": "pong",
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

### Manejo de Reconexión

```javascript
// Pseudo-código JavaScript
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 2000; // 2 segundos

function connectWebSocket() {
    const ws = new WebSocket('ws://192.168.1.120:8080/ws');

    ws.onopen = () => {
        console.log('WebSocket conectado');
        reconnectAttempts = 0;
    };

    ws.onclose = () => {
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            setTimeout(connectWebSocket, reconnectDelay * reconnectAttempts);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
    };
}
```

---

## 🚀 Flujo de Conexión UX (Opción 1)

### Secuencia Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLUJO UX PASO A PASO                            │
└─────────────────────────────────────────────────────────────────┘

[1] USUARIO ABRE APP ANDROID
    ┌───────────────────────┐
    │                       │
    │   🔍 BUSCAR           │
    │                       │
    │   Presiona aquí para  │
    │   encontrar tu        │
    │   mini controlador    │
    │                       │
    └───────────────────────┘

[2] APP INICIA SCAN BLE
    ┌───────────────────────┐
    │  ⏳ Buscando...       │
    │                       │
    │  🔵 🔵 🔵            │
    │                       │
    │  Escaneando           │
    │  dispositivos BLE     │
    └───────────────────────┘

[3] DISPOSITIVOS ENCONTRADOS
    ┌───────────────────────┐
    │  Dispositivos:        │
    │                       │
    │  📡 MINI-CONTROLADOR │
    │      MC-20250101-001  │
    │      RSSI: -55 dBm    │
    │                       │
    │  [CONECTAR]           │
    └───────────────────────┘

[4] CONEXIÓN GATT Y LECTURA
    ┌───────────────────────┐
    │  ⏳ Conectando...     │
    │                       │
    │  Obteniendo URL del   │
    │  panel web...         │
    │                       │
    └───────────────────────┘

[5A] VERIFICACIÓN EXITOSA
    ┌───────────────────────┐
    │  ✅ Conectado!        │
    │                       │
    │  Abriendo panel...    │
    │                       │
    └───────────────────────┘
         ▼
    ┌───────────────────────┐
    │  PANEL WEB EMBEBIDO   │
    ├───────────────────────┤
    │  🛰️ RTK FIXED         │
    │  Lat: -33.4489        │
    │  Lon: -70.6693        │
    │  Alt: 570.5 m         │
    │                       │
    │  🗺️ [Mapa Leaflet]   │
    │                       │
    │  📊 [Gráficas]        │
    └───────────────────────┘

[5B] ERROR DE CONECTIVIDAD
    ┌───────────────────────┐
    │  ⚠️ No se pudo        │
    │     conectar          │
    │                       │
    │  Conecta tu teléfono  │
    │  a la misma red Wi-Fi │
    │  que el mini          │
    │  controlador:         │
    │                       │
    │  Red: MyNetwork       │
    │  IP: 192.168.1.120    │
    │                       │
    │  [REINTENTAR]         │
    │  [CONFIGURACIÓN]      │
    └───────────────────────┘
```

### Manejo de Estados

| Estado | UI | Acción |
|--------|----|--------------------|
| **Inicial** | Pantalla con botón "BUSCAR" | Usuario toca botón |
| **Escaneando** | Indicador de progreso + lista dinámica | Mostrar dispositivos encontrados |
| **Dispositivo Seleccionado** | Spinner de carga | Conectar GATT |
| **Leyendo GATT** | Mensaje "Obteniendo URL..." | Leer características |
| **Verificando HTTP** | Spinner + mensaje | GET /api/status con timeout 3s |
| **Éxito** | Transición suave | Abrir WebView |
| **Error Red** | Diálogo con diagnóstico | Botón reintentar + ayuda |
| **Error BLE** | Diálogo de error | Botón volver a escanear |

---

## 📊 Estructura de Datos

### Configuración del Sistema

**Archivo**: `/etc/mini-controlador/config.json`

```json
{
  "device": {
    "name": "MINI-CONTROLADOR",
    "serial": "MC-20250101-001",
    "timezone": "America/Santiago"
  },
  "gnss": {
    "port": "/dev/ttyS0",
    "baudrate": 115200,
    "update_rate_hz": 5,
    "elevation_mask_degrees": 10,
    "enabled_constellations": {
      "gps": true,
      "glonass": true,
      "galileo": true,
      "beidou": true
    }
  },
  "ntrip": {
    "enabled": false,
    "host": "rtk2go.com",
    "port": 2101,
    "mountpoint": "",
    "username": "",
    "password": "",
    "gga_interval_seconds": 5
  },
  "web": {
    "port": 8080,
    "websocket_update_rate_hz": 5,
    "cors_enabled": true,
    "allowed_origins": ["*"]
  },
  "ble": {
    "enabled": true,
    "advertising_interval_ms": 1000,
    "device_name": "MINI-CONTROLADOR"
  },
  "logging": {
    "level": "INFO",
    "file": "/var/log/mini-controlador/app.log",
    "max_size_mb": 10,
    "backup_count": 5
  }
}
```

### Base de Datos SQLite (opcional para historial)

```sql
-- Tabla de posiciones
CREATE TABLE positions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude REAL,
    longitude REAL,
    altitude REAL,
    fix_type TEXT,
    accuracy_horizontal REAL,
    accuracy_vertical REAL,
    satellites_used INTEGER,
    hdop REAL
);

-- Tabla de eventos
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    event_type TEXT,
    message TEXT,
    severity TEXT
);

-- Índices
CREATE INDEX idx_positions_timestamp ON positions(timestamp);
CREATE INDEX idx_events_timestamp ON events(timestamp);
```

---

## 🔐 Seguridad

### Consideraciones

1. **BLE**: Sin autenticación (para simplificar descubrimiento). Para producción considerar BLE pairing.

2. **HTTP**: Sin HTTPS en red local (para simplificar). Para producción considerar:
   - Self-signed certificates
   - Let's Encrypt con DynDNS
   - VPN (WireGuard)

3. **API**: Sin autenticación en red local. Para producción:
   - API Keys
   - JWT tokens
   - OAuth2

4. **Red**: Firewall con iptables:
```bash
# Permitir solo red local
iptables -A INPUT -i wlan0 -s 192.168.1.0/24 -p tcp --dport 8080 -j ACCEPT
iptables -A INPUT -i wlan0 -p tcp --dport 8080 -j DROP
```

---

## 📈 Métricas de Performance

### Objetivos

| Métrica | Valor Objetivo |
|---------|----------------|
| **BLE Discovery Time** | < 2 segundos |
| **GATT Connection** | < 1 segundo |
| **HTTP Response Time** | < 200ms |
| **WebSocket Latency** | < 50ms |
| **Panel Load Time** | < 2 segundos |
| **Update Rate** | 5 Hz (GNSS) |
| **Memory Usage** | < 200 MB |
| **CPU Usage** | < 30% |

---

## ✅ Checklist de Validación

### Mini Controlador
- [ ] BLE advertising visible en escaneo
- [ ] Características GATT legibles
- [ ] PANEL_URL devuelve IP correcta
- [ ] IP se actualiza al cambiar de red
- [ ] API REST responde en < 200ms
- [ ] WebSocket transmite a 5 Hz
- [ ] Panel web responsive
- [ ] Servicio systemd auto-start
- [ ] Logs rotativos funcionando

### App Android
- [ ] BLE scan encuentra dispositivos
- [ ] Filtrado por nombre funciona
- [ ] Conexión GATT exitosa
- [ ] Lectura de características OK
- [ ] Validación de URL correcta
- [ ] Ping HTTP con timeout
- [ ] WebView carga panel
- [ ] JavaScript habilitado
- [ ] WebSocket funciona en WebView
- [ ] Manejo de errores claro
- [ ] Permisos BLE solicitados
- [ ] Permisos Internet OK

---

## 🎨 Paleta de Colores UI (Español)

```css
/* Dashboard Profesional GNSS */
:root {
  --color-primary: #2196F3;      /* Azul principal */
  --color-secondary: #4CAF50;    /* Verde éxito */
  --color-warning: #FF9800;      /* Naranja advertencia */
  --color-error: #F44336;        /* Rojo error */
  --color-rtk-fixed: #4CAF50;    /* Verde RTK Fixed */
  --color-rtk-float: #FF9800;    /* Naranja RTK Float */
  --color-dgps: #2196F3;         /* Azul DGPS */
  --color-single: #F44336;       /* Rojo Single */
  --color-background: #0a0e27;   /* Fondo oscuro */
  --color-surface: #1a1f3a;      /* Superficie */
  --color-text: #ffffff;         /* Texto */
  --color-text-secondary: #b0bec5; /* Texto secundario */
}
```

---

## 📦 Resumen de Entregables

### Fase 2: Mini Controlador
```
mini-controlador/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── ble_server.py        # BLE GATT server
│   ├── gnss_reader.py       # GNSS data reader
│   ├── network_utils.py     # IP detection
│   └── requirements.txt     # Python deps
├── web/
│   ├── index.html           # Panel SPA
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js           # Main app
│       ├── websocket.js     # WS client
│       ├── map.js           # Leaflet map
│       └── charts.js        # Chart.js graphs
├── systemd/
│   ├── mini-controlador.service
│   └── mini-controlador-ble.service
├── config/
│   └── config.json
├── install.sh
└── README.md
```

### Fase 3: App Android
```
AndroidApp/
├── app/
│   ├── build.gradle.kts
│   ├── src/
│   │   └── main/
│   │       ├── AndroidManifest.xml
│   │       ├── java/com/gnss/minicontrol/
│   │       │   ├── MainActivity.kt
│   │       │   ├── ScanActivity.kt
│   │       │   ├── WebViewActivity.kt
│   │       │   ├── ble/
│   │       │   │   ├── BleScanner.kt
│   │       │   │   ├── GattClient.kt
│   │       │   │   └── BleDevice.kt
│   │       │   └── utils/
│   │       │       ├── NetworkUtils.kt
│   │       │       └── PermissionManager.kt
│   │       └── res/
│   │           ├── layout/
│   │           │   ├── activity_main.xml
│   │           │   ├── activity_scan.xml
│   │           │   └── activity_webview.xml
│   │           ├── values/
│   │           │   ├── strings.xml
│   │           │   ├── colors.xml
│   │           │   └── themes.xml
│   │           └── drawable/
├── build.gradle.kts
└── settings.gradle.kts
```

---

**Fin de Fase 1: Arquitectura Completa**

**Próximo paso**: Fase 2 - Desarrollo completo del mini controlador
