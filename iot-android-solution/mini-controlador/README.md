# 🛰️ MINI CONTROLADOR - Backend + Panel Web

Sistema backend completo para Raspberry Pi con GNSS, BLE y panel web.

## 📋 Características

- ✅ **FastAPI** servidor REST + WebSocket
- ✅ **BLE GATT Server** para descubrimiento desde Android
- ✅ **GNSS Reader** vía serial (ComNav K222/K902/K922)
- ✅ **Panel Web** responsive con mapa Leaflet + gráficas Chart.js
- ✅ **WebSocket 5Hz** streaming en tiempo real
- ✅ **Detección automática de IP** dinámica
- ✅ **Servicio systemd** con auto-start
- ✅ **Monitoreo de sistema** (CPU, RAM, temperatura)

---

## 🚀 Instalación Rápida

### Requisitos

- Raspberry Pi Zero 2W / Pi 3 / Pi 4
- Raspberry Pi OS (Bullseye o posterior)
- Módulo GNSS conectado vía UART
- Tarjeta microSD (8GB+)
- Conexión a Internet

### Instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd mini-controlador

# 2. Ejecutar instalador
chmod +x install.sh
sudo ./install.sh

# 3. Reiniciar
sudo reboot

# 4. Verificar servicio
sudo systemctl status mini-controlador
```

---

## 🗂️ Estructura del Proyecto

```
mini-controlador/
├── backend/
│   ├── main.py                  # FastAPI app principal
│   ├── ble_server.py            # BLE GATT Server
│   ├── gnss_reader.py           # Lector NMEA serial
│   ├── network_utils.py         # Utilidades de red
│   ├── system_monitor.py        # Monitor de sistema
│   └── requirements.txt         # Dependencias Python
├── web/
│   └── index.html               # Panel web (SPA)
├── config/
│   └── config.json              # Configuración
├── systemd/
│   └── mini-controlador.service # Servicio systemd
├── logs/                        # Logs de la aplicación
├── install.sh                   # Script de instalación
└── README.md                    # Este archivo
```

---

## ⚙️ Configuración

### Archivo de Configuración

Editar `/home/pi/mini-controlador/config/config.json`:

```json
{
  "device": {
    "name": "MINI-CONTROLADOR",
    "serial": "MC-20250101-001"
  },
  "gnss": {
    "port": "/dev/ttyS0",
    "baudrate": 115200,
    "update_rate_hz": 5
  },
  "web": {
    "port": 8080,
    "websocket_update_rate_hz": 5
  },
  "ble": {
    "enabled": true,
    "device_name": "MINI-CONTROLADOR"
  }
}
```

### Puerto Serial

Verificar que el puerto serial está configurado:

```bash
# Ver dispositivos serial
ls -l /dev/serial*
ls -l /dev/ttyS*
ls -l /dev/ttyAMA*

# Probar recepción de datos
cat /dev/ttyS0

# Si no funciona, verificar /boot/config.txt
sudo nano /boot/config.txt
# Debe contener:
# enable_uart=1
# dtoverlay=disable-bt
```

---

## 🎮 Uso

### Servicios systemd

```bash
# Ver estado
sudo systemctl status mini-controlador

# Iniciar servicio
sudo systemctl start mini-controlador

# Detener servicio
sudo systemctl stop mini-controlador

# Reiniciar servicio
sudo systemctl restart mini-controlador

# Ver logs en tiempo real
sudo journalctl -u mini-controlador -f

# Ver últimas 100 líneas
sudo journalctl -u mini-controlador -n 100
```

### Ejecución Manual (para debugging)

```bash
cd /home/pi/mini-controlador
source venv/bin/activate
cd backend
python main.py
```

---

## 🌐 Panel Web

Acceder al panel web desde cualquier navegador:

```
http://IP_DEL_PI:8080/
```

Para encontrar la IP del Pi:

```bash
hostname -I
# O
ip addr show wlan0  # Wi-Fi
ip addr show eth0   # Ethernet
```

### Características del Panel

- **Mapa interactivo** con posición en tiempo real
- **Gráficas** de SNR de satélites y precisión
- **Sky Plot** para visualización de satélites
- **Estado del sistema** (CPU, memoria, temperatura)
- **Log de eventos** en tiempo real
- **Responsive** para móviles y tablets

---

## 📡 BLE GATT Profile

### Service Principal

- **UUID**: `0000181A-0000-1000-8000-00805F9B34FB`

### Características

| Característica | UUID | Props | Descripción |
|----------------|------|-------|-------------|
| **DEVICE_INFO** | `00002A29-...` | READ | Info del dispositivo (JSON) |
| **PANEL_URL** | `00002A24-...` | READ | URL del panel web |
| **HEALTH** | `00002A19-...` | READ, NOTIFY | Estado del sistema (JSON) |

### Testing BLE

```bash
# Escanear dispositivos BLE
sudo hcitool lescan

# Conectar con bluetoothctl
bluetoothctl
scan on
# Debe aparecer: MINI-CONTROLADOR
```

---

## 🔧 API REST

### Base URL

```
http://IP:8080/api
```

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/status` | Estado completo del sistema |
| GET | `/api/config` | Configuración actual |
| POST | `/api/config` | Actualizar configuración |
| GET | `/api/satellites` | Lista de satélites |
| GET | `/api/position/history` | Historial de posiciones |
| POST | `/api/restart` | Reiniciar servicio |
| GET | `/api/logs` | Logs del sistema |

### Ejemplos

```bash
# Obtener estado
curl http://192.168.1.120:8080/api/status | jq

# Obtener satélites
curl http://192.168.1.120:8080/api/satellites | jq

# Actualizar configuración
curl -X POST http://192.168.1.120:8080/api/config \
  -H "Content-Type: application/json" \
  -d '{"web": {"websocket_update_rate_hz": 10}}'
```

---

## 🔌 WebSocket

### Conexión

```javascript
const ws = new WebSocket('ws://IP:8080/ws');

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
};
```

### Mensajes

| Tipo | Frecuencia | Descripción |
|------|------------|-------------|
| `gnss_update` | 5 Hz | Datos GNSS |
| `satellites_update` | 1 Hz | Estado satélites |
| `system_update` | 0.2 Hz | Métricas sistema |

---

## 🐛 Solución de Problemas

### Servicio no inicia

```bash
# Ver logs detallados
sudo journalctl -u mini-controlador -n 100 --no-pager

# Verificar permisos puerto serial
ls -l /dev/ttyS0

# Verificar que usuario está en grupo dialout
groups pi
# Debe aparecer: dialout

# Agregar si falta
sudo usermod -a -G dialout pi
# Reiniciar sesión
```

### No recibo datos GNSS

```bash
# Probar lectura directa
cat /dev/ttyS0

# Verificar baudrate del módulo (debe ser 115200)
# Verificar conexiones:
# TX módulo → RX Pi (GPIO 15)
# RX módulo → TX Pi (GPIO 14)
# GND → GND
```

### BLE no funciona

```bash
# Verificar servicio Bluetooth
sudo systemctl status bluetooth

# Iniciar si está detenido
sudo systemctl start bluetooth

# Habilitar al inicio
sudo systemctl enable bluetooth

# Verificar adaptador
hciconfig
# Debe mostrar: hci0
```

### Panel web no carga

```bash
# Verificar que el servidor está escuchando
sudo netstat -tulpn | grep 8080

# Verificar firewall (si está habilitado)
sudo iptables -L

# Verificar desde el mismo Pi
curl http://localhost:8080

# Verificar desde otro dispositivo en la misma red
ping IP_DEL_PI
curl http://IP_DEL_PI:8080
```

---

## 📊 Métricas de Performance

| Métrica | Objetivo | Típico |
|---------|----------|--------|
| Uso de CPU | < 30% | ~15-20% |
| Uso de RAM | < 200MB | ~120-150MB |
| Latencia WebSocket | < 50ms | ~10-20ms |
| Tiempo de respuesta API | < 200ms | ~50-100ms |
| Tasa de actualización GNSS | 5 Hz | 5 Hz |

---

## 🔐 Seguridad

### Red Local (configuración actual)

- ✅ HTTP sin HTTPS (para simplificar en red local)
- ✅ BLE sin pairing (para facilitar descubrimiento)
- ✅ API sin autenticación (asume red confiable)

### Para Producción (mejoras recomendadas)

- 🔒 HTTPS con certificados SSL
- 🔒 BLE pairing con PIN
- 🔒 API Keys o JWT tokens
- 🔒 Firewall iptables
- 🔒 VPN (WireGuard)

Ejemplo de firewall:

```bash
# Permitir solo red local
sudo iptables -A INPUT -i wlan0 -s 192.168.1.0/24 -p tcp --dport 8080 -j ACCEPT
sudo iptables -A INPUT -i wlan0 -p tcp --dport 8080 -j DROP
```

---

## 📝 Desarrollo

### Entorno de desarrollo

```bash
# Crear venv
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r backend/requirements.txt

# Ejecutar con reload automático
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### Testing

```bash
# Instalar pytest
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest backend/

# Con coverage
pytest --cov=backend backend/
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea Pull Request

---

## 📄 Licencia

MIT License

---

## 📧 Soporte

- **Issues**: GitHub Issues
- **Documentación**: Ver `ARQUITECTURA.md`
- **API**: Ver `CONTRATOS_JSON.md`

---

**Made with ❤️ for IoT + GNSS**
