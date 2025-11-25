# 🛰️ Interfaz Emlid para ComNav

Sistema GNSS profesional con interfaz tipo Emlid Reach para receptores ComNav K222/K902/K922.

---

## 🚀 Inicio Rápido

### Instalación en Raspberry Pi Zero 2W

```bash
# 1. Clonar repositorio
git clone <tu-repo>
cd nuevo-final

# 2. Instalar dependencias
chmod +x install.sh
sudo ./install.sh

# 3. Reiniciar
sudo reboot
```

### Iniciar el Sistema

```bash
python3 quick_start.py
```

Luego accede a: **http://localhost:8000**

---

## 🌟 Interfaz Web

La interfaz tipo Emlid incluye:

### 📊 Dashboard Principal
- Posición en tiempo real (Lat/Lon/Alt)
- Estado RTK (FIXED/FLOAT/DGPS/SINGLE)
- Satélites visibles y calidad de señal
- HDOP, DOP values

### 🛰️ Visualización de Satélites
- **SNR Charts** por constelación (GPS, GLONASS, Galileo, BeiDou)
- **Sky Plot** interactivo con posición de satélites
- Información detallada por satélite

### ⚙️ Configuración GNSS
- Activar/desactivar constelaciones
- Configurar frecuencias
- Ajustes de elevación mínima

### 📡 Correcciones NTRIP
- Configuración de servidor NTRIP
- Conexión automática a caster
- Monitoreo de correcciones recibidas

### 🎯 Modo Base RTK
- Configurar receptor como base
- Transmitir correcciones RTCM3
- Survey-in automático o coordenadas fijas

### 📱 Otras Funciones
- Configuración WiFi
- Configuración Bluetooth
- Control de logging
- Actualizaciones de firmware
- Monitoreo de batería

---

## 🔧 Control ComNav

### API REST para Comandos

Todas las funciones de la interfaz web utilizan las siguientes APIs:

#### 1. Enviar Comando Personalizado

```bash
curl -X POST http://localhost:8000/api/comnav/command \
  -H "Content-Type: application/json" \
  -d '{"command": "VERSION"}'
```

**Respuesta:**
```json
{
  "success": true,
  "command": "VERSION",
  "response": "K222 v1.2.3..."
}
```

#### 2. Configurar Modo (ROVER/BASE)

**Modo ROVER:**
```bash
curl -X POST http://localhost:8000/api/comnav/mode \
  -H "Content-Type: application/json" \
  -d '{"mode": "ROVER"}'
```

**Modo BASE:**
```bash
curl -X POST http://localhost:8000/api/comnav/mode \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "BASE",
    "lat": -33.4489,
    "lon": -70.6693,
    "alt": 570.5
  }'
```

#### 3. Configurar Constelaciones GNSS

```bash
curl -X POST http://localhost:8000/api/comnav/gnss \
  -H "Content-Type: application/json" \
  -d '{
    "systems": {
      "GPS": true,
      "GLONASS": true,
      "GALILEO": true,
      "BEIDOU": false
    }
  }'
```

#### 4. Obtener Información del Receptor

```bash
curl http://localhost:8000/api/comnav/info
```

**Respuesta:**
```json
{
  "success": true,
  "status": {
    "model": "K222",
    "firmware": "v1.2.3",
    "mode": "ROVER",
    "rtk_status": "RTK_FIXED",
    "tilt_enabled": true
  },
  "version": "K222 v1.2.3 Build 20240115"
}
```

#### 5. Reiniciar Receptor

```bash
curl -X POST http://localhost:8000/api/comnav/reset
```

---

## 📡 Configuración NTRIP

### Obtener Configuración Actual

```bash
curl http://localhost:8000/api/ntrip/config
```

### Guardar Nueva Configuración

```bash
curl -X POST http://localhost:8000/api/ntrip/config \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "host": "rtk2go.com",
    "port": 2101,
    "mountpoint": "TU_MOUNTPOINT",
    "username": "tu_email@ejemplo.com",
    "password": ""
  }'
```

La configuración se guarda en: `config/ntrip.json`

---

## 🌐 WebSocket en Tiempo Real

Para recibir datos GNSS en tiempo real desde tu aplicación:

```javascript
import io from 'socket.io-client';

// Conectar al WebSocket
const socket = io('http://localhost:8000/gnss');

// Recibir datos
socket.on('gnss_data', (data) => {
  console.log('Posición:', data.position);
  console.log('Satélites:', data.satellites);
  console.log('RTK Status:', data.rtk_status);
  console.log('Satélites detalle:', data.satellites_detail);
});

// Manejar conexión
socket.on('connect', () => {
  console.log('Conectado al servidor GNSS');
});
```

---

## 📋 Comandos ComNav Disponibles

### Comandos Básicos

| Comando | Descripción |
|---------|-------------|
| `VERSION` | Ver versión del firmware |
| `CONFIG` | Ver configuración actual |
| `RESET` | Reiniciar receptor |
| `SAVECONFIG` | Guardar configuración en memoria |
| `FRESET` | Reset a valores de fábrica |

### Configuración de Modo

```bash
# Modo ROVER (default)
MODE ROVER

# Modo BASE con coordenadas conocidas
MODE BASE -33.4489 -70.6693 570.5

# Modo BASE con survey-in automático (60 min, precisión 2m)
MODE BASE SURVEY 60 2.0
```

### Configuración de Constelaciones

```bash
# Habilitar/deshabilitar sistemas GNSS
CONFIG SIGNALGROUP GPS ENABLE
CONFIG SIGNALGROUP GLONASS ENABLE
CONFIG SIGNALGROUP GALILEO ENABLE
CONFIG SIGNALGROUP BEIDOU DISABLE

# Ver sistemas activos
CONFIG SIGNALGROUP
```

### Configuración NTRIP Cliente

```bash
# Configurar NTRIP para recibir correcciones
CONFIG NTRIP CLIENT rtk2go.com:2101 MOUNTPOINT user password

# Ver estado NTRIP
LOG NTRIP
```

### Mensajes NMEA de Salida

```bash
# Habilitar mensajes NMEA en puerto serial
LOG GPGGA ONTIME 1.0
LOG GPGSA ONTIME 1.0
LOG GPGSV ONTIME 5.0
LOG GPRMC ONTIME 1.0

# Desactivar mensajes
UNLOG GPGGA
```

### Configuración TILT (solo K222/K922)

```bash
# Habilitar compensación de inclinación
CONFIG TILT ENABLE

# Calibrar TILT (seguir instrucciones en pantalla)
TILT CALIBRATE

# Configurar altura del bastón (en metros)
CONFIG POLEHEIGHT 2.0

# Ver estado TILT
LOG TILT ONTIME 1.0
```

### Mensajes RTCM (Modo Base)

```bash
# Configurar salida de correcciones RTCM3
LOG RTCM1005 ONTIME 10.0
LOG RTCM1077 ONTIME 1.0
LOG RTCM1087 ONTIME 1.0
LOG RTCM1097 ONTIME 1.0
LOG RTCM1127 ONTIME 1.0
```

---

## 🔍 Debugging

### Ver Logs del Sistema

```bash
# Ver logs del Smart Processor
tail -f /tmp/gnssai_smart.log

# Ver datos en tiempo real (JSON)
cat /tmp/gnssai_dashboard_data.json | jq

# Ver datos NMEA directos del puerto serial
cat /dev/serial0
```

### Verificar Conexión ComNav

```bash
# Test de puerto serial
ls -l /dev/serial0

# Permisos
sudo usermod -a -G dialout $USER

# Ver datos raw
sudo cat /dev/serial0 | head -20
```

### Problemas Comunes

#### La interfaz web no carga

```bash
# Verificar que el servidor está corriendo
curl http://localhost:8000

# Verificar procesos
ps aux | grep python

# Ver archivos estáticos
ls -la static/js/
ls -la static/css/
```

#### No hay datos GNSS

```bash
# Verificar smart_processor
ps aux | grep smart_processor

# Verificar archivo de datos
ls -la /tmp/gnssai_dashboard_data.json

# Ver logs
tail -f /tmp/gnssai_smart.log
```

#### ComNav no responde

```bash
# Verificar conexión serial
sudo screen /dev/serial0 115200

# Enviar comando manual
echo "VERSION" > /dev/serial0

# Verificar baudrate (debe ser 115200)
stty -F /dev/serial0
```

---

## 📦 Estructura de Datos

### Formato JSON de Salida

```json
{
  "position": {
    "lat": -33.4489,
    "lon": -70.6693,
    "alt": 570.5
  },
  "satellites": 12,
  "quality": 4,
  "hdop": 0.8,
  "rtk_status": "RTK_FIXED",
  "fix_type": "RTK Fixed",
  "satellites_detail": [
    {
      "prn": "G01",
      "elevation": 45,
      "azimuth": 120,
      "snr": 42,
      "system": "GPS",
      "used": true
    }
  ],
  "tilt": {
    "pitch": 0.5,
    "roll": -0.3,
    "heading": 45.2,
    "angle": 0.6,
    "status": "VALID"
  },
  "ml_classification": {
    "los_satellites": 8,
    "nlos_satellites": 1,
    "multipath_satellites": 3,
    "avg_confidence": 85.3
  }
}
```

---

## 🚀 Características Avanzadas

### 1. Machine Learning

El sistema incluye clasificación automática de señales:
- **LOS (Line of Sight)**: Señal directa, mejor calidad
- **NLOS (Non Line of Sight)**: Señal bloqueada/reflejada
- **Multipath**: Múltiples trayectorias de señal

### 2. Compensación TILT

Para receptores K222/K922 con IMU integrada:
- Compensación automática de inclinación del bastón
- Altura del bastón configurable
- Calibración de 8 puntos

### 3. Proyectos y Puntos

Gestión de puntos de levantamiento (disponible en puerto 5000):
```bash
# Ver proyectos
curl http://localhost:5000/api/projects

# Crear proyecto
curl -X POST http://localhost:5000/api/projects \
  -d '{"name": "Mi Proyecto", "datum": "WGS84"}'
```

---

## 📞 Soporte

Para más información consulta:
- **WEB_INTERFACES.md** - Documentación completa de APIs
- **SYSTEM_STATUS.md** - Estado de componentes
- **README.md** - Documentación general

---

**Versión:** 2.0.0
**Última actualización:** 2025-11-25
