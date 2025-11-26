# 🛰️ GNSS App - Interfaz Emlid para ComNav

Aplicación GNSS profesional con interfaz tipo Emlid Reach para receptores ComNav K222/K902/K922.

---

## 🚀 Inicio Rápido

### Instalación en Raspberry Pi Zero 2W

```bash
# 1. Clonar
git clone <tu-repo>
cd gnss-app-clean

# 2. Instalar
chmod +x install.sh
sudo ./install.sh

# 3. Reiniciar
sudo reboot

# 4. Iniciar
python3 quick_start.py
```

**Acceso**: http://localhost:8000

---

## 📁 Archivos Principales

- `quick_start.py` - Iniciar aplicación
- `web_app_server.py` - Servidor web + APIs
- `smart_processor.py` - Procesador NMEA
- `comnav_controller.py` - Control ComNav
- `ntrip_client.py` - Cliente RTK
- `ml_classifier.py` - ML para señales
- `html.html` - Interfaz Vue.js
- `static/` - JS, CSS, fonts
- `config/` - Configuración

---

## ⚡ Funcionalidades

✅ Interfaz tipo Emlid Reach  
✅ Control completo ComNav K222/K902/K922  
✅ RTK con NTRIP (precisión 1-2 cm)  
✅ Soporte TILT/INS  
✅ Machine Learning (clasificación señales)  
✅ Gestión de proyectos  
✅ Exportación CSV/KML/DXF/GeoJSON  
✅ WebSocket en tiempo real  

---

## 📡 APIs REST

### Estadísticas
```bash
GET /api/status
```

### Comandos ComNav
```bash
POST /api/comnav/command
POST /api/comnav/mode
POST /api/comnav/gnss
POST /api/comnav/reset
GET  /api/comnav/info
```

### NTRIP
```bash
GET  /api/ntrip/config
POST /api/ntrip/config
```

---

## 🔧 Configuración

### Serial (ComNav)
`config/app_config.json`:
```json
{
  "serial": {
    "port": "/dev/serial0",
    "baudrate": 115200
  }
}
```

### NTRIP
`config/ntrip.json`:
```json
{
  "enabled": true,
  "host": "rtk2go.com",
  "port": 2101,
  "mountpoint": "TU_MOUNTPOINT",
  "username": "tu_email@ejemplo.com"
}
```

---

## 🐛 Troubleshooting

### No hay datos
```bash
ls -la /dev/serial0
sudo usermod -a -G dialout $USER
sudo reboot
```

### Reinstalar dependencias
```bash
pip3 install -r requirements.txt
```

---

## 📋 Requisitos

**Hardware**:  
- Raspberry Pi Zero 2W+  
- ComNav K222/K902/K922  
- UART habilitado  

**Software**:  
- Raspbian/Raspberry Pi OS  
- Python 3.7+  

---

¡Listo para usar! 🚀
