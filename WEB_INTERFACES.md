# 🌐 Interfaces Web - GNSS Professional

El sistema incluye **TRES** interfaces web completas, cada una con funcionalidades específicas:

---

## 🌟 1. Aplicación Web Principal (Puerto 8000)

**Archivo**: `web_app_server.py` + `html.html`
**URL**: http://localhost:8000

### Descripción
Aplicación web completa estilo **Emlid Reach** desarrollada con Vue.js y Ant Design.

### Características
- ✅ **Visualización de satélites en tiempo real**
  - SNR Charts para GPS, GLONASS, Galileo, BeiDou
  - Sky Plot interactivo con posición de satélites
  - Información detallada por constelación

- ✅ **Configuración completa del receptor**
  - GNSS Settings (sistemas activos)
  - Correction Input (NTRIP)
  - Base Output (correcciones RTCM)
  - Position Streaming

- ✅ **Gestión avanzada**
  - WiFi configuration
  - Bluetooth settings
  - Logging control
  - Firmware updates
  - Battery monitoring

### Pantallas Disponibles
```
/                       → Dashboard principal
/#/satellites           → Visualización de satélites (SNR + Sky Plot)
/#/correction-input     → Configuración NTRIP
/#/correction-output    → Salida de correcciones (Base Mode)
/#/base-mode            → Configuración de Base RTK
/#/logging              → Control de logging
/#/wi-fi                → Configuración WiFi
/#/mobile-data          → Datos móviles
/#/bluetooth            → Configuración Bluetooth
/#/gnss-settings        → Configuración GNSS
/#/position-streaming-1 → Salida de posición 1
/#/position-streaming-2 → Salida de posición 2
/#/general/updates      → Actualizaciones de firmware
/#/general/receiver     → Info del receptor
/#/general/battery      → Estado de batería
```

### Tecnologías
- **Frontend**: Vue.js 3
- **UI Framework**: Ant Design Vue
- **Charts**: D3.js
- **Build**: Webpack

---

## 📊 2. Dashboard & API Server (Puerto 5000)

**Archivo**: `gps_server_enhanced.py`
**URL**: http://localhost:5000

### Descripción
Dashboard técnico en tiempo real + API REST completa para gestión de proyectos.

### Interfaces Web

#### a) Dashboard en Tiempo Real (`/dashboard`)
- Monitor GNSS con actualización cada segundo
- Visualización de posición (Lat/Lon/Alt)
- Estado RTK (FIXED/FLOAT/DGPS/GPS)
- Satélites visibles y HDOP
- **ML + TILT integrado**:
  - Visualización animada del TILT
  - Ángulo de inclinación en tiempo real
  - Clasificación ML (LOS/NLOS/Multipath)
  - Confianza del clasificador

#### b) Gestión de Proyectos (`/projects`)
- Lista de proyectos de levantamiento
- Estadísticas por proyecto
- Creación de nuevos proyectos
- Visualización de puntos recolectados

#### c) Home (`/`)
- Landing page con links a todas las secciones
- Acceso rápido a Dashboard y Proyectos
- Documentación de API

### API REST Completa

#### Estadísticas GNSS
```bash
GET /api/stats
```
Retorna datos GNSS en tiempo real:
```json
{
  "position": {"lat": -33.4489, "lon": -70.6693, "alt": 570.5},
  "satellites": 12,
  "quality": 4,
  "hdop": 0.8,
  "rtk_status": "RTK_FIXED",
  "tilt": {
    "pitch": 0.5,
    "roll": -0.3,
    "heading": 45.2,
    "angle": 0.6,
    "status": "VALID"
  },
  "los_sats": 8,
  "multipath_sats": 3,
  "nlos_sats": 1,
  "avg_confidence": 85.3
}
```

#### Proyectos

```bash
# Listar proyectos
GET /api/projects

# Crear proyecto
POST /api/projects
{
  "name": "Levantamiento Campus",
  "description": "Topografía campus universitario",
  "datum": "WGS84"
}

# Obtener proyecto
GET /api/projects/:id

# Listar puntos del proyecto
GET /api/projects/:id/points

# Agregar punto
POST /api/projects/:id/points
{
  "point_id": "P001",
  "lat": -33.4489,
  "lon": -70.6693,
  "alt": 570.5,
  "quality": 4,
  "hdop": 0.8,
  "satellites": 12,
  "notes": "Punto de control"
}

# Exportar proyecto
GET /api/projects/:id/export/csv      # Exportar a CSV
GET /api/projects/:id/export/kml      # Exportar a KML (Google Earth)
GET /api/projects/:id/export/dxf      # Exportar a DXF (AutoCAD)
GET /api/projects/:id/export/geojson  # Exportar a GeoJSON (QGIS)
```

#### Control ComNav
```bash
POST /api/comnav/command
{
  "command": "VERSION"
}
```

### WebSocket (Tiempo Real)
```javascript
// Conectar al WebSocket
const socket = io('http://localhost:5000/gnss');

// Recibir datos en tiempo real
socket.on('stats', (data) => {
  console.log('Datos GNSS:', data);
});
```

---

## 📡 3. Sistema Integrado (Puerto interno)

**Archivo**: `gnss_professional.py`
**Descripción**: Orquestador que integra todos los componentes.

### Componentes Integrados
1. **Smart Processor** - Procesamiento NMEA + ML + TILT
2. **NTRIP Client** - Correcciones RTK automáticas
3. **Project Manager** - Gestión de datos
4. **ComNav Controller** - Control del receptor

---

## 🚀 Inicio Rápido

### Opción 1: Inicio Completo (Recomendado)
```bash
python3 quick_start.py
```

Inicia automáticamente:
- ✅ Smart Processor (backend)
- ✅ Web Application (puerto 8000)
- ✅ API Server (puerto 5000)

Acceder a:
- **Aplicación Web**: http://localhost:8000
- **Dashboard/API**: http://localhost:5000

### Opción 2: Inicio Individual

```bash
# Solo Web Application
python3 web_app_server.py
# → http://localhost:8000

# Solo Dashboard/API
python3 gps_server_enhanced.py
# → http://localhost:5000

# Solo Backend
python3 gnss_professional.py
```

---

## 📱 Guía de Uso

### Para Uso Diario (Recolección de Puntos)
👉 **Usar Aplicación Web** (puerto 8000)
- Interfaz completa y profesional
- Todas las funcionalidades en un solo lugar
- Similar a Emlid Flow

### Para Gestión de Proyectos
👉 **Usar Dashboard** (puerto 5000)
- Crear y gestionar proyectos
- Agregar puntos con metadatos
- Exportar a múltiples formatos

### Para Integración con Apps Externas
👉 **Usar API REST** (puerto 5000)
- Acceso programático a datos
- Integración con sistemas GIS
- Automatización de workflows

---

## 🔧 Configuración

### Conectar con Datos Reales

Los datos GNSS se leen desde:
```
/tmp/gnssai_dashboard_data.json
```

Este archivo es generado automáticamente por `smart_processor.py` cuando procesa datos del ComNav.

### Estructura de Archivos Estáticos

```
static/
├── js/
│   ├── chunk-vendors.31517009.js    # Vue.js + dependencias
│   ├── chunk-common.22a6f926.js     # Componentes comunes
│   ├── index.0bca27f0.js            # App principal
│   ├── 90.d65a0de5.js               # Chunk lazy-loaded
│   └── 42.59f2d0b4.js               # Otro chunk
├── css/
│   ├── chunk-vendors.d93e9d9a.css   # Estilos principales
│   ├── index.8349ed33.css           # Estilos de la app
│   └── 90.88d412b8.css              # Estilos adicionales
└── fonts/
    └── Inter-Bold.579e0f95.woff2    # Fuente
```

---

## 🎨 Screenshots

Las capturas de pantalla en el repositorio muestran:
- `Captura de pantalla 2025-11-22 023032.png` - Sky Plot de satélites
- `Captura de pantalla 2025-11-22 023117.png` - Dashboard principal

---

## 🔍 Debugging

### Verificar que los servidores están corriendo
```bash
# Web App
curl http://localhost:8000

# API
curl http://localhost:5000/api/stats | jq
```

### Ver logs
```bash
# Si Quick Start está corriendo
# Los logs se muestran en la terminal

# Si usas systemd
sudo journalctl -u gnss-web -f
```

### Problemas comunes

#### No se cargan los archivos JavaScript
```bash
# Verificar que los archivos están en static/
ls -la static/js/
ls -la static/css/

# Si no están, ejecutar:
bash -c "
cp *.js.txt static/js/ 2>/dev/null
cp *.css.txt static/css/ 2>/dev/null
"
```

#### Puerto ya en uso
```bash
# Cambiar puerto en web_app_server.py (línea 69):
app.run(host='0.0.0.0', port=8001)  # Usar otro puerto

# O matar el proceso
sudo lsof -t -i:8000 | xargs kill -9
```

---

## 📚 Recursos Adicionales

- **README.md** - Documentación general del proyecto
- **SYSTEM_STATUS.md** - Estado de todos los componentes
- **config/README.md** - Configuración NTRIP y otros

---

**Última actualización**: $(date)
**Versión**: 2.0.0
