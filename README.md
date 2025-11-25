# 🛰️ GNSS Professional

Sistema profesional de recolección y procesamiento GNSS para Raspberry Pi Zero 2W + ComNav K222/K902/K922

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/)
[![Platform](https://img.shields.io/badge/platform-Raspberry%20Pi-red.svg)](https://www.raspberrypi.org/)

## 📋 Características

### 🎯 Funcionalidades Principales

- ✅ **Recolección RTK de precisión** con soporte ComNav K222/K902/K922
- ✅ **Cliente NTRIP integrado** para correcciones RTK en tiempo real
- ✅ **Soporte TILT/INS** para levantamientos con bastón inclinado
- ✅ **Machine Learning** para clasificación de señales (LOS/NLOS/Multipath)
- ✅ **Gestor de proyectos** con organización profesional de puntos
- ✅ **Múltiples formatos de exportación** (CSV, DXF, KML, GeoJSON)
- ✅ **Interfaz web profesional** responsive y moderna
- ✅ **Dashboard en tiempo real** con visualización de datos
- ✅ **Bluetooth SPP** para conexión con aplicaciones móviles
- ✅ **WiFi Access Point** para acceso directo sin router

### 🔧 Tecnologías

- **Hardware**: Raspberry Pi Zero 2W + ComNav K222/K902/K922
- **Backend**: Python 3, Flask, SocketIO
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Protocolos**: NMEA-0183, RTCM3, NTRIP v1/v2
- **Comunicación**: UART, Bluetooth SPP, WiFi

## 📦 Contenido del Repositorio

```
gnss-professional/
├── install.sh                 # Script de instalación automatizada
├── smart_processor.py         # Procesador NMEA principal con ML y TILT
├── gps_server.py             # Servidor web Flask con múltiples interfaces
├── dashboard_server.py       # Dashboard HTML con visualización en tiempo real
├── ntrip_client.py           # Cliente NTRIP para correcciones RTK
├── project_manager.py        # Gestor de proyectos y puntos
├── comnav_controller.py      # Controlador ComNav K222/K902/K922
├── bluetooth_spp_server.py   # Servidor Bluetooth SPP
├── ml_classifier.py          # Clasificador ML para señales GNSS
├── gnssai_collector.py       # Recolector de datos para entrenar ML
├── config/                   # Archivos de configuración
│   └── ntrip.json           # Configuración NTRIP
├── data/                     # Datos de la aplicación
│   ├── projects/            # Proyectos de levantamiento
│   ├── points/              # Puntos recolectados
│   └── logs/                # Archivos de log
└── README.md                # Este archivo
```

## 🚀 Instalación

### Requisitos

- Raspberry Pi Zero 2W (o superior)
- Raspberry Pi OS (Bullseye o posterior)
- Módulo ComNav K222, K902 o K922
- Conexión UART habilitada
- Tarjeta microSD (mínimo 8GB)
- Conexión a Internet (para instalación)

### Instalación Automatizada

1. **Clonar el repositorio**:
```bash
git clone https://github.com/tu-usuario/gnss-professional.git
cd gnss-professional
```

2. **Ejecutar instalador**:
```bash
chmod +x install.sh
sudo ./install.sh
```

El instalador configurará automáticamente:
- Dependencias del sistema
- Entorno virtual Python
- Puerto serial UART
- Servicios systemd
- WiFi Access Point (opcional)

3. **Reiniciar el sistema**:
```bash
sudo reboot
```

### Instalación Manual

Si prefieres instalar manualmente:

```bash
# 1. Actualizar sistema
sudo apt-get update && sudo apt-get upgrade -y

# 2. Instalar dependencias
sudo apt-get install -y python3 python3-pip python3-venv git \
    bluetooth bluez libbluetooth-dev python3-bluetooth \
    hostapd dnsmasq nginx gpsd gpsd-clients

# 3. Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# 4. Instalar paquetes Python
pip install pyserial flask flask-socketio flask-cors requests \
    pybluez numpy python-socketio eventlet gevent gevent-websocket

# 5. Configurar puerto serial (ver sección Configuración UART)

# 6. Crear servicios systemd (ver sección Servicios)
```

## ⚙️ Configuración

### Configuración UART

Para habilitar el puerto serial:

1. **Editar /boot/config.txt**:
```bash
sudo nano /boot/config.txt
```

Agregar al final:
```
enable_uart=1
dtoverlay=disable-bt
```

2. **Deshabilitar consola serial**:
```bash
sudo raspi-config
# Interface Options → Serial Port
# Login shell: NO
# Serial hardware: YES
```

3. **Verificar puerto serial**:
```bash
ls -l /dev/serial0
# Debería mostrar: /dev/serial0 -> ttyAMA0

# Probar recepción de datos
cat /dev/serial0
```

### Configuración NTRIP

Editar `config/ntrip.json`:

```json
{
  "enabled": true,
  "host": "rtk2go.com",
  "port": 2101,
  "mountpoint": "YOUR_MOUNTPOINT",
  "username": "your_email@example.com",
  "password": "",
  "gga_interval": 5,
  "serial_port": "/dev/serial0",
  "serial_baud": 115200,
  "reconnect_delay": 10
}
```

Casters NTRIP públicos:
- **RTK2GO**: rtk2go.com:2101 (gratuito)
- **EUREF**: www.euref-ip.net:2101
- **IGS**: products.igs-ip.net:2101

### Configuración ComNav

Aplicar configuración profesional al módulo:

```bash
# Usando el controlador
python3 comnav_controller.py --config

# O manualmente
python3 comnav_controller.py --port /dev/serial0 --monitor 10
```

### WiFi Access Point

Si configuraste WiFi AP durante la instalación:

- **SSID**: GNSS-RTK (o el que elegiste)
- **Password**: gnss123456 (o el que elegiste)
- **IP del dispositivo**: 192.168.4.1
- **Rango DHCP**: 192.168.4.2 - 192.168.4.20

Acceder desde navegador: `http://192.168.4.1:5000`

## 🎮 Uso

### Servicios Systemd

Los siguientes servicios se instalan automáticamente:

```bash
# Ver estado de servicios
sudo systemctl status gnss-processor
sudo systemctl status gnss-web
sudo systemctl status gnss-bluetooth

# Iniciar/detener servicios
sudo systemctl start gnss-processor gnss-web
sudo systemctl stop gnss-processor gnss-web

# Habilitar/deshabilitar auto-inicio
sudo systemctl enable gnss-processor gnss-web
sudo systemctl disable gnss-processor gnss-web

# Ver logs en tiempo real
sudo journalctl -u gnss-processor -f
sudo journalctl -u gnss-web -f
```

### Interfaz Web

Acceder a: `http://IP_DEL_PI:5000`

**Interfaces disponibles**:

1. **Home** (`/`) - Página principal con links a todas las interfaces
2. **Professional** (`/professional`) - Interfaz completa con todas las funcionalidades
3. **Collector** (`/collector`) - Recolector simple de puntos
4. **Dashboard** (`/dashboard`) - Dashboard técnico con visualización de datos
5. **ComNav Control** (`/comnav`) - Control del módulo ComNav K222

### API REST

**Endpoints disponibles**:

```bash
# Obtener estadísticas GNSS
GET http://IP:5000/api/stats

# Enviar comando a ComNav
POST http://IP:5000/api/comnav/command
Content-Type: application/json
{
  "command": "VERSION"
}

# Ejemplo con curl
curl http://192.168.4.1:5000/api/stats | jq

curl -X POST http://192.168.4.1:5000/api/comnav/command \
  -H "Content-Type: application/json" \
  -d '{"command":"VERSION"}'
```

### Cliente NTRIP

**Ejecutar manualmente**:

```bash
# Con archivo de configuración
python3 ntrip_client.py --config config/ntrip.json

# Con parámetros por línea de comandos
python3 ntrip_client.py \
  --host rtk2go.com \
  --port 2101 \
  --mountpoint YOUR_MOUNTPOINT \
  --username your_email@example.com
```

### Gestor de Proyectos

**Uso programático**:

```python
from project_manager import ProjectManager

# Crear gestor
pm = ProjectManager('data')

# Crear proyecto
project = pm.create_project(
    name="Levantamiento Campus",
    description="Topografía del campus universitario",
    datum="WGS84"
)

# Agregar punto
pm.add_point(
    project['id'],
    'P001',
    lat=-33.4489,
    lon=-70.6693,
    alt=570.5,
    quality=4,  # RTK Fixed
    hdop=0.8,
    satellites=12,
    notes='Punto de control'
)

# Exportar
pm.export_to_csv(project['id'])
pm.export_to_kml(project['id'])
pm.export_to_dxf(project['id'])
```

### Controlador ComNav

**Comandos disponibles**:

```python
from comnav_controller import ComNavController

# Crear controlador
ctrl = ComNavController('/dev/serial0', 115200)
ctrl.connect()

# Información del receptor
ctrl.get_version()

# Configurar modo RTK
ctrl.set_rtk_mode('ROVER')

# Habilitar TILT
ctrl.enable_tilt(True)
ctrl.calibrate_tilt()
ctrl.set_pole_height(2.0)  # Altura de bastón en metros

# Configurar sistemas GNSS
ctrl.configure_gnss_systems(
    gps=True,
    glonass=True,
    galileo=True,
    beidou=True
)

# Aplicar configuración profesional
ctrl.apply_professional_config()

# Guardar configuración
ctrl.save_config()
```

## 📊 Machine Learning

El sistema incluye un clasificador ML para mejorar la precisión:

### Características

- **Clasificación en tiempo real** de señales satelitales
- **Categorías**: LOS (Line of Sight), NLOS (Non-Line of Sight), Multipath
- **Algoritmo**: Reglas heurísticas + ML híbrido
- **Entrada**: SNR, elevación, azimuth, historial temporal
- **Salida**: Clasificación + confianza (0-100%)

### Recolección de Datos

Para entrenar modelos personalizados:

```bash
# Recolectar datos en entorno urbano
python3 gnssai_collector.py 300 urban

# Recolectar datos en campo abierto
python3 gnssai_collector.py 300 open

# Datos se guardan en: ml_training_data/
```

## 📱 Bluetooth

Conectar desde aplicaciones móviles (SW Maps, Lefebure, etc):

1. **Activar Bluetooth en el Pi**:
```bash
sudo systemctl start bluetooth
sudo bluetoothctl
# [bluetooth]# power on
# [bluetooth]# discoverable on
```

2. **Iniciar servidor SPP**:
```bash
sudo systemctl start gnss-bluetooth
```

3. **Emparejar desde teléfono**:
   - Buscar "GNSS-AI"
   - Emparejar (sin PIN)
   - Conectar a puerto Serial/SPP

4. **Configurar app móvil**:
   - Protocolo: NMEA
   - Baudrate: 115200
   - Formato: NMEA-0183

## 🔧 Solución de Problemas

### No recibo datos NMEA

```bash
# Verificar puerto serial
ls -l /dev/serial0

# Probar lectura directa
cat /dev/serial0

# Verificar baudrate del ComNav
# Debería ser 115200 por defecto

# Verificar conexiones físicas
# TX del ComNav → RX del Pi (GPIO 15)
# RX del ComNav → TX del Pi (GPIO 14)
# GND → GND
```

### Servicios no inician

```bash
# Ver logs detallados
sudo journalctl -u gnss-processor -n 50
sudo journalctl -u gnss-web -n 50

# Verificar permisos
ls -l /dev/serial0
# Debería ser readable por el usuario

# Agregar usuario a grupo dialout
sudo usermod -a -G dialout $USER
# Reiniciar sesión
```

### Cliente NTRIP no conecta

```bash
# Verificar conectividad
ping rtk2go.com

# Verificar credenciales en config/ntrip.json

# Probar manualmente
python3 ntrip_client.py \
  --host rtk2go.com \
  --port 2101 \
  --mountpoint TEST \
  --username test@test.com

# Ver logs
sudo journalctl -u gnss-processor -f | grep NTRIP
```

### WiFi AP no funciona

```bash
# Verificar servicios
sudo systemctl status hostapd
sudo systemctl status dnsmasq

# Ver logs
sudo journalctl -u hostapd -n 50

# Verificar configuración
cat /etc/hostapd/hostapd.conf
cat /etc/dnsmasq.conf

# Reiniciar servicios
sudo systemctl restart hostapd
sudo systemctl restart dnsmasq
```

## 🎓 Documentación Adicional

### Formatos de Exportación

#### CSV
```
Point_ID,Latitude,Longitude,Altitude,Fix_Type,HDOP,Satellites,Timestamp,Notes
P001,-33.4489,-70.6693,570.5,RTK_FIXED,0.8,12,2024-11-25T10:30:00,Control point
```

#### KML (Google Earth)
- Visualización 3D
- Colores según calidad (verde=RTK Fixed, amarillo=Float, rojo=Single)
- Atributos completos

#### DXF (AutoCAD)
- Puntos como entidades POINT
- Texto con ID del punto
- Layer único

#### GeoJSON
- Compatible con QGIS, ArcGIS
- Propiedades completas
- Formato estándar OGC

### Sistemas de Coordenadas

Soporta:
- **Geográficas** (lat/lon WGS84)
- **UTM** (proyección universal)
- **Locales** (transformación personalizada)

### Precisiones Típicas

| Modo | Horizontal | Vertical |
|------|-----------|----------|
| RTK Fixed | 1-2 cm | 2-3 cm |
| RTK Float | 10-30 cm | 20-50 cm |
| DGPS | 30-100 cm | 50-150 cm |
| Single | 2-5 m | 5-10 m |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **ComNav Technology** por los excelentes receptores GNSS
- **Raspberry Pi Foundation** por el hardware accesible
- **RTK2GO** por el servicio NTRIP gratuito
- **Comunidad GNSS** por el conocimiento compartido

## 📧 Contacto

Para preguntas, sugerencias o reportar bugs:

- **Issues**: https://github.com/tu-usuario/gnss-professional/issues
- **Email**: tu-email@example.com

## 🗺️ Roadmap

### v1.1 (Próximamente)
- [ ] Soporte para más receptores (u-blox, Trimble)
- [ ] Base RTK con transmisión de correcciones
- [ ] Post-procesamiento PPK
- [ ] App móvil nativa

### v1.2 (Futuro)
- [ ] Integración con drones
- [ ] Procesamiento en la nube
- [ ] Machine Learning mejorado
- [ ] Soporte para cámaras (geotagging)

---

**GNSS Professional** - Topografía de precisión con Raspberry Pi

Made with ❤️ for the surveying community
