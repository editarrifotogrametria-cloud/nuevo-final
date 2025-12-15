# 📋 CONTRATOS JSON COMPLETOS

## Tabla de Contenidos
1. [BLE GATT Characteristics](#ble-gatt-characteristics)
2. [REST API Endpoints](#rest-api-endpoints)
3. [WebSocket Messages](#websocket-messages)
4. [Configuration Files](#configuration-files)
5. [Error Responses](#error-responses)

---

## 🔵 BLE GATT Characteristics

### 1. DEVICE_INFO Characteristic
**UUID**: `00002A29-0000-1000-8000-00805F9B34FB`
**Properties**: `READ`
**Encoding**: `UTF-8 String (JSON)`

```json
{
  "device_name": "MINI-CONTROLADOR",
  "fw_version": "1.0.0",
  "serial": "MC-20250101-001",
  "model": "RPI-GNSS-K222",
  "manufacturer": "GNSS Professional",
  "build_date": "2025-12-15",
  "hardware_revision": "RPI-ZERO-2W"
}
```

**Campos**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `device_name` | string | Nombre del dispositivo |
| `fw_version` | string | Versión de firmware (semver) |
| `serial` | string | Número de serie único |
| `model` | string | Modelo del dispositivo |
| `manufacturer` | string | Fabricante |
| `build_date` | string | Fecha de compilación (ISO 8601) |
| `hardware_revision` | string | Revisión de hardware |

**Ejemplo de lectura (Android Kotlin)**:
```kotlin
val characteristic = gatt.getService(serviceUuid)
    ?.getCharacteristic(deviceInfoUuid)
gatt.readCharacteristic(characteristic)

// En el callback:
override fun onCharacteristicRead(
    gatt: BluetoothGatt,
    characteristic: BluetoothGattCharacteristic,
    status: Int
) {
    if (status == BluetoothGatt.GATT_SUCCESS) {
        val json = characteristic.getStringValue(0)
        val deviceInfo = JSONObject(json)
        val firmwareVersion = deviceInfo.getString("fw_version")
    }
}
```

---

### 2. PANEL_URL Characteristic
**UUID**: `00002A24-0000-1000-8000-00805F9B34FB`
**Properties**: `READ`
**Encoding**: `UTF-8 String`

**Formato**: URL completa con protocolo, IP y puerto

```
http://192.168.1.120:8080/
```

**Ejemplos válidos**:
```
http://192.168.1.120:8080/
http://10.0.0.50:8080/
http://172.16.0.10:8080/
```

**Casos de error**:
```
ERROR: No IP available
ERROR: Network interface down
```

**Validación (Android)**:
```kotlin
val urlString = characteristic.getStringValue(0)

if (urlString.startsWith("ERROR:")) {
    // Manejar error
    showError(urlString)
} else {
    // Validar URL
    val url = try {
        URL(urlString)
    } catch (e: MalformedURLException) {
        showError("URL inválida")
        return
    }

    // Verificar puerto 8080
    if (url.port != 8080) {
        showError("Puerto debe ser 8080")
        return
    }

    // URL válida, proceder
    verifyConnectivity(urlString)
}
```

---

### 3. HEALTH Characteristic
**UUID**: `00002A19-0000-1000-8000-00805F9B34FB`
**Properties**: `READ, NOTIFY`
**Encoding**: `UTF-8 String (JSON)`

```json
{
  "uptime_seconds": 3600,
  "cpu_percent": 25.5,
  "memory_percent": 42.3,
  "memory_mb": {
    "total": 1024,
    "used": 433,
    "free": 591
  },
  "temperature_celsius": 45.2,
  "wifi_connected": true,
  "wifi_ssid": "MyNetwork",
  "wifi_rssi": -55,
  "wifi_quality": 85,
  "ip_address": "192.168.1.120",
  "interface": "wlan0",
  "ethernet_connected": false,
  "timestamp": "2025-12-15T10:30:00Z",
  "status": "healthy"
}
```

**Campos**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `uptime_seconds` | integer | Segundos desde el arranque |
| `cpu_percent` | float | Uso de CPU (0-100) |
| `memory_percent` | float | Uso de memoria (0-100) |
| `memory_mb.total` | integer | RAM total en MB |
| `memory_mb.used` | integer | RAM usada en MB |
| `memory_mb.free` | integer | RAM libre en MB |
| `temperature_celsius` | float | Temperatura del CPU |
| `wifi_connected` | boolean | Estado conexión Wi-Fi |
| `wifi_ssid` | string | Nombre de la red Wi-Fi |
| `wifi_rssi` | integer | Intensidad señal Wi-Fi (dBm) |
| `wifi_quality` | integer | Calidad Wi-Fi (0-100) |
| `ip_address` | string | Dirección IP actual |
| `interface` | string | Interfaz de red activa |
| `ethernet_connected` | boolean | Estado conexión Ethernet |
| `timestamp` | string | Timestamp ISO 8601 |
| `status` | string | Estado general (healthy/warning/error) |

**Habilitar notificaciones (Android)**:
```kotlin
val characteristic = gatt.getService(serviceUuid)
    ?.getCharacteristic(healthUuid)

gatt.setCharacteristicNotification(characteristic, true)

val descriptor = characteristic.getDescriptor(
    UUID.fromString("00002902-0000-1000-8000-00805f9b34fb")
)
descriptor.value = BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE
gatt.writeDescriptor(descriptor)

// Recibir notificaciones cada 5 segundos
override fun onCharacteristicChanged(
    gatt: BluetoothGatt,
    characteristic: BluetoothGattCharacteristic
) {
    val json = characteristic.getStringValue(0)
    val health = JSONObject(json)
    updateHealthUI(health)
}
```

---

## 🌐 REST API Endpoints

### 1. GET /api/status

**Descripción**: Estado completo del sistema

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
  "server_time": "2025-12-15T10:30:45.123Z",
  "uptime_seconds": 7200,
  "device": {
    "name": "MINI-CONTROLADOR",
    "serial": "MC-20250101-001",
    "firmware_version": "1.0.0",
    "hardware_model": "RPI-ZERO-2W",
    "uptime_seconds": 7200,
    "boot_time": "2025-12-15T08:30:45Z"
  },
  "gnss": {
    "connected": true,
    "port": "/dev/ttyS0",
    "baudrate": 115200,
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
    "last_update": "2025-12-15T10:30:44.987Z",
    "age_seconds": 0.136
  },
  "ntrip": {
    "enabled": true,
    "connected": true,
    "host": "rtk2go.com",
    "port": 2101,
    "mountpoint": "MYBASE",
    "bytes_received": 1234567,
    "last_correction": "2025-12-15T10:30:43Z",
    "correction_age_seconds": 2.123
  },
  "network": {
    "interface": "wlan0",
    "ip_address": "192.168.1.120",
    "mac_address": "b8:27:eb:12:34:56",
    "netmask": "255.255.255.0",
    "gateway": "192.168.1.1",
    "wifi_ssid": "MyNetwork",
    "wifi_rssi": -55,
    "wifi_quality": 85,
    "wifi_frequency": 2437,
    "wifi_channel": 6,
    "ethernet_connected": false
  },
  "system": {
    "cpu_percent": 25.5,
    "cpu_count": 4,
    "memory_percent": 42.3,
    "memory_mb": {
      "total": 1024,
      "used": 433,
      "free": 591,
      "cached": 256
    },
    "temperature_celsius": 45.2,
    "disk_percent": 35.7,
    "disk_gb": {
      "total": 32.0,
      "used": 11.4,
      "free": 20.6
    },
    "load_average": [0.45, 0.38, 0.32]
  }
}
```

**Response 503 Service Unavailable** (GNSS desconectado):
```json
{
  "status": "degraded",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "error": {
    "code": "GNSS_NOT_CONNECTED",
    "message": "Módulo GNSS no responde en /dev/ttyS0"
  },
  "device": { /* ... */ },
  "gnss": {
    "connected": false,
    "port": "/dev/ttyS0",
    "error": "No data received in 10 seconds"
  },
  "system": { /* ... */ }
}
```

---

### 2. GET /api/config

**Descripción**: Configuración actual del sistema

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
      "gps": true,
      "glonass": true,
      "galileo": true,
      "beidou": true,
      "qzss": false
    },
    "nmea_output": {
      "gga": true,
      "rmc": true,
      "gsa": true,
      "gsv": true,
      "vtg": true,
      "zda": true
    }
  },
  "ntrip": {
    "enabled": true,
    "host": "rtk2go.com",
    "port": 2101,
    "mountpoint": "MYBASE",
    "username": "user@example.com",
    "password": "********",
    "gga_interval_seconds": 5,
    "reconnect_delay_seconds": 10,
    "timeout_seconds": 30
  },
  "web": {
    "port": 8080,
    "host": "0.0.0.0",
    "websocket_update_rate_hz": 5,
    "cors_enabled": true,
    "allowed_origins": ["*"]
  },
  "ble": {
    "enabled": true,
    "advertising_interval_ms": 1000,
    "device_name": "MINI-CONTROLADOR",
    "tx_power": 0
  },
  "logging": {
    "level": "INFO",
    "file": "/var/log/mini-controlador/app.log",
    "max_size_mb": 10,
    "backup_count": 5,
    "console_output": true
  },
  "data": {
    "auto_save": true,
    "save_interval_seconds": 60,
    "history_max_points": 1000,
    "database_path": "/var/lib/mini-controlador/data.db"
  }
}
```

---

### 3. POST /api/config

**Descripción**: Actualizar configuración (merge parcial)

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
    "mountpoint": "NEWBASE"
  },
  "web": {
    "websocket_update_rate_hz": 10
  }
}
```

**Response 200 OK**:
```json
{
  "status": "ok",
  "message": "Configuración actualizada correctamente",
  "restart_required": true,
  "updated_fields": [
    "gnss.update_rate_hz",
    "ntrip.mountpoint",
    "web.websocket_update_rate_hz"
  ],
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

**Response 400 Bad Request**:
```json
{
  "status": "error",
  "error_code": "INVALID_CONFIG",
  "message": "Configuración inválida",
  "errors": [
    {
      "field": "gnss.update_rate_hz",
      "value": 100,
      "error": "El valor debe estar entre 1 y 20"
    }
  ],
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

---

### 4. GET /api/satellites

**Descripción**: Lista detallada de satélites visibles

**Request**:
```http
GET /api/satellites HTTP/1.1
Host: 192.168.1.120:8080
Accept: application/json
```

**Response 200 OK**:
```json
{
  "timestamp": "2025-12-15T10:30:45.123Z",
  "total_visible": 24,
  "total_used": 18,
  "by_constellation": {
    "GPS": {
      "visible": 10,
      "used": 8
    },
    "GLONASS": {
      "visible": 8,
      "used": 6
    },
    "GALILEO": {
      "visible": 4,
      "used": 3
    },
    "BEIDOU": {
      "visible": 2,
      "used": 1
    }
  },
  "satellites": [
    {
      "prn": 1,
      "svid": 1,
      "constellation": "GPS",
      "elevation": 45.2,
      "azimuth": 123.5,
      "snr": 42.0,
      "used": true,
      "healthy": true,
      "ephemeris": true,
      "almanac": true
    },
    {
      "prn": 2,
      "svid": 2,
      "constellation": "GPS",
      "elevation": 32.1,
      "azimuth": 245.7,
      "snr": 38.5,
      "used": true,
      "healthy": true,
      "ephemeris": true,
      "almanac": true
    },
    {
      "prn": 65,
      "svid": 1,
      "constellation": "GLONASS",
      "elevation": 28.4,
      "azimuth": 67.3,
      "snr": 35.2,
      "used": true,
      "healthy": true,
      "ephemeris": true,
      "almanac": true
    }
  ]
}
```

**Campos de satélite**:
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `prn` | integer | Pseudo-Random Noise number |
| `svid` | integer | Satellite Vehicle ID |
| `constellation` | string | GPS/GLONASS/GALILEO/BEIDOU |
| `elevation` | float | Elevación en grados (0-90) |
| `azimuth` | float | Azimuth en grados (0-360) |
| `snr` | float | Signal-to-Noise Ratio (dB-Hz) |
| `used` | boolean | Usado en cálculo de posición |
| `healthy` | boolean | Estado de salud |
| `ephemeris` | boolean | Efemérides disponibles |
| `almanac` | boolean | Almanaque disponible |

---

### 5. GET /api/position/history

**Descripción**: Historial de posiciones

**Query Parameters**:
- `limit` (opcional): Número de puntos (default: 100, max: 1000)
- `since` (opcional): Timestamp ISO 8601 de inicio
- `fix_type` (opcional): Filtrar por tipo de fix (RTK_FIXED, RTK_FLOAT, DGPS, SINGLE)

**Request**:
```http
GET /api/position/history?limit=50&fix_type=RTK_FIXED HTTP/1.1
Host: 192.168.1.120:8080
Accept: application/json
```

**Response 200 OK**:
```json
{
  "count": 50,
  "total_stored": 1000,
  "query": {
    "limit": 50,
    "fix_type": "RTK_FIXED"
  },
  "points": [
    {
      "id": 1234,
      "timestamp": "2025-12-15T10:30:45.123Z",
      "latitude": -33.4489123,
      "longitude": -70.6693456,
      "altitude": 570.523,
      "fix_type": "RTK_FIXED",
      "fix_type_code": 4,
      "accuracy_horizontal": 0.014,
      "accuracy_vertical": 0.021,
      "satellites_used": 18,
      "hdop": 0.7,
      "vdop": 1.2,
      "speed_kmh": 0.0,
      "heading_degrees": 0.0
    },
    {
      "id": 1235,
      "timestamp": "2025-12-15T10:30:46.123Z",
      "latitude": -33.4489125,
      "longitude": -70.6693458,
      "altitude": 570.525,
      "fix_type": "RTK_FIXED",
      "fix_type_code": 4,
      "accuracy_horizontal": 0.015,
      "accuracy_vertical": 0.022,
      "satellites_used": 18,
      "hdop": 0.7,
      "vdop": 1.2,
      "speed_kmh": 0.1,
      "heading_degrees": 45.2
    }
  ],
  "statistics": {
    "avg_accuracy_horizontal": 0.0145,
    "avg_accuracy_vertical": 0.0215,
    "avg_satellites": 18.0,
    "time_range_seconds": 50
  }
}
```

---

### 6. POST /api/restart

**Descripción**: Reiniciar servicio backend

**Request**:
```http
POST /api/restart HTTP/1.1
Host: 192.168.1.120:8080
Content-Type: application/json

{
  "confirm": true
}
```

**Response 200 OK**:
```json
{
  "status": "ok",
  "message": "Reiniciando servicio en 2 segundos...",
  "restart_time": "2025-12-15T10:30:47Z"
}
```

---

### 7. GET /api/logs

**Descripción**: Logs recientes del sistema

**Query Parameters**:
- `lines` (opcional): Número de líneas (default: 100, max: 1000)
- `level` (opcional): Filtrar por nivel (DEBUG, INFO, WARNING, ERROR)
- `since` (opcional): Timestamp ISO 8601

**Request**:
```http
GET /api/logs?lines=50&level=ERROR HTTP/1.1
Host: 192.168.1.120:8080
Accept: application/json
```

**Response 200 OK**:
```json
{
  "count": 50,
  "query": {
    "lines": 50,
    "level": "ERROR"
  },
  "logs": [
    {
      "timestamp": "2025-12-15T10:30:45.123Z",
      "level": "ERROR",
      "module": "ntrip_client",
      "message": "Conexión NTRIP perdida: Connection timeout",
      "traceback": null
    },
    {
      "timestamp": "2025-12-15T10:30:46.456Z",
      "level": "ERROR",
      "module": "gnss_reader",
      "message": "Checksum error en NMEA sentence: $GNGGA...",
      "traceback": null
    }
  ]
}
```

---

## 🔌 WebSocket Messages

### Conexión
```javascript
const ws = new WebSocket('ws://192.168.1.120:8080/ws');
```

### 1. Mensaje: GNSS Update (Server → Client)

**Frecuencia**: 5 Hz (cada 200ms)

```json
{
  "type": "gnss_update",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "sequence": 12345,
  "data": {
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
    "age_seconds": 0.1
  }
}
```

**Fix Types**:
- `NO_FIX` (0): Sin fix
- `SINGLE` (1): GPS autónomo
- `DGPS` (2): DGPS/SBAS
- `PPS` (3): PPS
- `RTK_FIXED` (4): RTK Fixed
- `RTK_FLOAT` (5): RTK Float
- `ESTIMATED` (6): Dead reckoning
- `MANUAL` (7): Manual input
- `SIMULATION` (8): Simulation

---

### 2. Mensaje: Satellites Update (Server → Client)

**Frecuencia**: 1 Hz (cada 1s)

```json
{
  "type": "satellites_update",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "sequence": 123,
  "data": {
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

---

### 3. Mensaje: System Update (Server → Client)

**Frecuencia**: 0.2 Hz (cada 5s)

```json
{
  "type": "system_update",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "sequence": 24,
  "data": {
    "cpu_percent": 25.5,
    "memory_percent": 42.3,
    "temperature_celsius": 45.2,
    "uptime_seconds": 7200,
    "disk_percent": 35.7,
    "network": {
      "wifi_rssi": -55,
      "wifi_quality": 85
    }
  }
}
```

---

### 4. Mensaje: NTRIP Status (Server → Client)

**Frecuencia**: 0.2 Hz (cada 5s)

```json
{
  "type": "ntrip_status",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "data": {
    "connected": true,
    "bytes_received": 1234567,
    "bytes_sent": 56789,
    "last_correction": "2025-12-15T10:30:43Z",
    "correction_age_seconds": 2.123,
    "reconnect_count": 0
  }
}
```

---

### 5. Mensaje: Ping (Client → Server)

```json
{
  "type": "ping"
}
```

**Response (Server → Client)**:
```json
{
  "type": "pong",
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

---

### 6. Mensaje: Subscribe (Client → Server)

**Descripción**: Suscribirse a eventos específicos

```json
{
  "type": "subscribe",
  "channels": ["gnss", "satellites", "system", "ntrip"]
}
```

**Response**:
```json
{
  "type": "subscribe_ack",
  "channels": ["gnss", "satellites", "system", "ntrip"],
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

---

### 7. Mensaje: Error (Server → Client)

```json
{
  "type": "error",
  "timestamp": "2025-12-15T10:30:45.123Z",
  "error": {
    "code": "GNSS_DISCONNECTED",
    "message": "Módulo GNSS desconectado",
    "severity": "warning"
  }
}
```

---

## 📁 Configuration Files

### /etc/mini-controlador/config.json

```json
{
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
      "gps": true,
      "glonass": true,
      "galileo": true,
      "beidou": true,
      "qzss": false
    },
    "nmea_output": {
      "gga": true,
      "rmc": true,
      "gsa": true,
      "gsv": true,
      "vtg": true,
      "zda": true
    }
  },
  "ntrip": {
    "enabled": false,
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
    "cors_enabled": true,
    "allowed_origins": ["*"]
  },
  "ble": {
    "enabled": true,
    "advertising_interval_ms": 1000,
    "device_name": "MINI-CONTROLADOR",
    "tx_power": 0
  },
  "logging": {
    "level": "INFO",
    "file": "/var/log/mini-controlador/app.log",
    "max_size_mb": 10,
    "backup_count": 5,
    "console_output": true
  },
  "data": {
    "auto_save": true,
    "save_interval_seconds": 60,
    "history_max_points": 1000,
    "database_path": "/var/lib/mini-controlador/data.db"
  }
}
```

---

## ❌ Error Responses

### Formato Estándar de Error

```json
{
  "status": "error",
  "error_code": "ERROR_CODE",
  "message": "Mensaje legible para humanos",
  "details": {
    "field": "valor adicional"
  },
  "timestamp": "2025-12-15T10:30:45.123Z",
  "request_id": "uuid-1234-5678"
}
```

### Códigos de Error

| Código | HTTP | Descripción |
|--------|------|-------------|
| `GNSS_NOT_CONNECTED` | 503 | Módulo GNSS no responde |
| `GNSS_NO_FIX` | 200 | Sin fix GPS (no es error fatal) |
| `NTRIP_CONNECTION_FAILED` | 503 | Error al conectar NTRIP |
| `NTRIP_AUTH_FAILED` | 401 | Credenciales NTRIP inválidas |
| `CONFIG_INVALID` | 400 | Configuración inválida |
| `CONFIG_READ_ERROR` | 500 | Error al leer configuración |
| `CONFIG_WRITE_ERROR` | 500 | Error al escribir configuración |
| `NETWORK_ERROR` | 503 | Error de red |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `METHOD_NOT_ALLOWED` | 405 | Método HTTP no permitido |
| `RATE_LIMIT_EXCEEDED` | 429 | Demasiadas peticiones |

### Ejemplos de Errores

**GNSS no conectado**:
```json
{
  "status": "error",
  "error_code": "GNSS_NOT_CONNECTED",
  "message": "Módulo GNSS no responde en /dev/ttyS0",
  "details": {
    "port": "/dev/ttyS0",
    "timeout_seconds": 10,
    "last_data": "2025-12-15T10:20:45Z"
  },
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

**Configuración inválida**:
```json
{
  "status": "error",
  "error_code": "CONFIG_INVALID",
  "message": "Configuración inválida",
  "details": {
    "errors": [
      {
        "field": "gnss.update_rate_hz",
        "value": 100,
        "constraint": "Debe estar entre 1 y 20"
      },
      {
        "field": "web.port",
        "value": "abc",
        "constraint": "Debe ser un número entero"
      }
    ]
  },
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

**NTRIP autenticación fallida**:
```json
{
  "status": "error",
  "error_code": "NTRIP_AUTH_FAILED",
  "message": "Credenciales NTRIP inválidas",
  "details": {
    "host": "rtk2go.com",
    "mountpoint": "MYBASE",
    "username": "user@example.com"
  },
  "timestamp": "2025-12-15T10:30:45.123Z"
}
```

---

**Fin de Contratos JSON**

**Próximo paso**: Implementación completa del código
