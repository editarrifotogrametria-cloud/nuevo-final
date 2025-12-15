# 🚀 SOLUCIÓN IoT COMPLETA: MINI CONTROLADOR + ANDROID

## 📋 Descripción

Sistema completo de descubrimiento y control IoT que integra:
- **Mini Controlador** (Raspberry Pi con Linux embebido)
- **App Android** (Kotlin nativo)
- **Panel Web** (SPA responsive)

### Flujo de Uso (Opción 1 - Sin configuración Wi-Fi)

1. Usuario abre app Android
2. Toca "Buscar" → Escaneo BLE automático
3. Selecciona "MINI-CONTROLADOR" de la lista
4. App obtiene URL del panel vía BLE GATT
5. App abre panel web en WebView embebido
6. **Sin escribir IP ni configurar nada**

---

## 📂 Estructura del Proyecto

```
iot-android-solution/
│
├── ARQUITECTURA.md              # Diseño completo del sistema
├── DIAGRAMAS_SECUENCIA.md       # Diagramas de flujo detallados
├── CONTRATOS_JSON.md            # Especificación de APIs y mensajes
├── README.md                    # Este archivo
│
├── mini-controlador/            # FASE 2: Backend Linux
│   ├── backend/                 # FastAPI + BLE + GNSS
│   ├── web/                     # Panel SPA
│   ├── systemd/                 # Servicios systemd
│   ├── config/                  # Configuración
│   ├── install.sh               # Instalador automático
│   └── README.md
│
└── android-app/                 # FASE 3: App Android
    ├── app/                     # Código Kotlin
    ├── build.gradle.kts
    └── README.md
```

---

## 🎯 Características Principales

### Mini Controlador
- ✅ **BLE GATT Server** con advertising automático
- ✅ **Detección dinámica de IP** (Ethernet > Wi-Fi > otras)
- ✅ **FastAPI REST API** con endpoints completos
- ✅ **WebSocket 5Hz** para streaming GNSS en tiempo real
- ✅ **Panel Web responsive** con mapa Leaflet + gráficas Chart.js
- ✅ **Integración GNSS** (ComNav K222/K902/K922)
- ✅ **Cliente NTRIP** para correcciones RTK
- ✅ **Servicios systemd** con auto-start

### App Android
- ✅ **Escaneo BLE** con filtrado inteligente
- ✅ **GATT Client** para lectura de características
- ✅ **Verificación HTTP** con timeout y diagnóstico
- ✅ **WebView embebido** con soporte WebSocket
- ✅ **Manejo de errores** con mensajes claros
- ✅ **Material Design 3**

---

## 🔧 Tecnologías

### Backend (Mini Controlador)
- **Python 3.9+**
- **FastAPI** (ASGI web framework)
- **Uvicorn** (ASGI server)
- **BlueZ** (BLE stack)
- **python-bluez / bleak** (BLE Python bindings)
- **pyserial** (Comunicación serial GNSS)
- **psutil** (Métricas de sistema)

### Frontend (Panel Web)
- **HTML5 + CSS3 + JavaScript (Vanilla)**
- **Leaflet.js** (Mapas interactivos)
- **Chart.js** (Gráficas en tiempo real)
- **WebSocket API** (Streaming de datos)

### Android
- **Kotlin 1.9+**
- **Android SDK 21-34**
- **BLE API** (android.bluetooth)
- **OkHttp / Retrofit** (HTTP client)
- **WebView** (Embedded browser)
- **Material Design 3**

---

## 📦 Fases de Desarrollo

### ✅ FASE 1: Arquitectura (COMPLETA)
- [x] Diseño de arquitectura completa
- [x] Definición de UUIDs BLE
- [x] Especificación REST API
- [x] Especificación WebSocket
- [x] Contratos JSON
- [x] Diagramas de secuencia

### 🔄 FASE 2: Mini Controlador (EN PROGRESO)
- [ ] Backend FastAPI completo
- [ ] BLE GATT Server
- [ ] Detección dinámica de IP
- [ ] GNSS reader integration
- [ ] Panel Web SPA
- [ ] WebSocket streaming
- [ ] Servicios systemd
- [ ] Script de instalación

### ⏳ FASE 3: App Android (PENDIENTE)
- [ ] Proyecto Android Studio
- [ ] BLE Scanner + GATT
- [ ] HTTP verification
- [ ] WebView integration
- [ ] UI Material Design
- [ ] Permisos y manifiestos

---

## 🚀 Instalación Rápida

### Mini Controlador (Raspberry Pi)

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd iot-android-solution/mini-controlador

# 2. Ejecutar instalador
chmod +x install.sh
sudo ./install.sh

# 3. Reiniciar
sudo reboot

# 4. Verificar servicios
sudo systemctl status mini-controlador
sudo systemctl status mini-controlador-ble
```

### App Android

```bash
# 1. Abrir en Android Studio
cd android-app
# Abrir carpeta en Android Studio

# 2. Sync Gradle

# 3. Build & Run
```

---

## 📊 Especificaciones Técnicas

### BLE GATT Profile

| Característica | UUID | Propiedades | Descripción |
|----------------|------|-------------|-------------|
| **Service** | `0000181A-0000-1000-8000-00805F9B34FB` | - | Servicio principal |
| **DEVICE_INFO** | `00002A29-0000-1000-8000-00805F9B34FB` | READ | Info del dispositivo (JSON) |
| **PANEL_URL** | `00002A24-0000-1000-8000-00805F9B34FB` | READ | URL del panel web |
| **HEALTH** | `00002A19-0000-1000-8000-00805F9B34FB` | READ, NOTIFY | Estado del sistema (JSON) |

### REST API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/status` | Estado completo del sistema |
| GET | `/api/config` | Configuración actual |
| POST | `/api/config` | Actualizar configuración |
| GET | `/api/satellites` | Lista de satélites |
| GET | `/api/position/history` | Historial de posiciones |
| POST | `/api/restart` | Reiniciar servicio |
| GET | `/api/logs` | Logs del sistema |

### WebSocket Protocol

| Mensaje | Frecuencia | Descripción |
|---------|------------|-------------|
| `gnss_update` | 5 Hz | Datos GNSS en tiempo real |
| `satellites_update` | 1 Hz | Estado de satélites |
| `system_update` | 0.2 Hz | Métricas del sistema |
| `ntrip_status` | 0.2 Hz | Estado NTRIP |

---

## 🎨 Capturas de Pantalla

### Panel Web
```
┌─────────────────────────────────────────┐
│  🛰️ MINI CONTROLADOR - GNSS PANEL     │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  RTK FIXED                        │ │
│  │  Lat: -33.4489°  Sat: 18/24      │ │
│  │  Lon: -70.6693°  HDOP: 0.7       │ │
│  │  Alt: 570.5m     Acc: ±1.4cm     │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │        [Mapa Leaflet]            │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐ │
│  │ Gráfica SNR │  │  Sky Plot       │ │
│  │             │  │                 │ │
│  └─────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
```

### App Android
```
┌─────────────────────┐
│   MINI CONTROLADOR  │
├─────────────────────┤
│                     │
│   🔍 BUSCAR         │
│                     │
│   Dispositivos:     │
│                     │
│ 📡 MINI-CONTROLADOR│
│    MC-20250101-001  │
│    RSSI: -55 dBm    │
│    [CONECTAR]       │
│                     │
└─────────────────────┘
```

---

## 📖 Documentación

- **[ARQUITECTURA.md](ARQUITECTURA.md)**: Diseño completo del sistema
- **[DIAGRAMAS_SECUENCIA.md](DIAGRAMAS_SECUENCIA.md)**: Flujos detallados
- **[CONTRATOS_JSON.md](CONTRATOS_JSON.md)**: Especificación de APIs

### Por Componente

- **[mini-controlador/README.md](mini-controlador/README.md)**: Instalación y uso del backend
- **[android-app/README.md](android-app/README.md)**: Build y deployment Android

---

## 🔐 Seguridad

### Red Local (sin autenticación)
- BLE sin pairing (para facilitar descubrimiento)
- HTTP sin HTTPS (red local confiable)
- API sin tokens (red local)

### Para Producción (considerar)
- BLE pairing con PIN
- HTTPS con certificados
- API Keys o JWT
- Firewall iptables

---

## 📈 Performance

| Métrica | Objetivo | Real |
|---------|----------|------|
| BLE Discovery | < 2s | TBD |
| GATT Connection | < 1s | TBD |
| HTTP Response | < 200ms | TBD |
| WebSocket Latency | < 50ms | TBD |
| Panel Load Time | < 2s | TBD |
| Memory Usage | < 200MB | TBD |
| CPU Usage | < 30% | TBD |

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

---

## 📝 Licencia

MIT License - Ver archivo LICENSE

---

## 🙏 Créditos

- **Raspberry Pi Foundation**: Hardware accesible
- **Bluetooth SIG**: Especificaciones BLE
- **FastAPI**: Framework web moderno
- **Leaflet**: Mapas interactivos
- **Chart.js**: Gráficas responsive

---

## 📧 Soporte

- **Issues**: GitHub Issues
- **Docs**: Ver carpeta `/docs`
- **Email**: soporte@example.com

---

**Made with ❤️ for IoT + Android developers**
