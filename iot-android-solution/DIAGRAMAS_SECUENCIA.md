# 📊 DIAGRAMAS DE SECUENCIA DETALLADOS

## 1. Secuencia Completa de Descubrimiento y Conexión

```
┌────────┐         ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│Usuario │         │Android App  │         │Mini Ctrl BLE│         │Mini Ctrl Web│
└───┬────┘         └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
    │                     │                       │                       │
    │ Toca "Buscar"       │                       │                       │
    ├────────────────────>│                       │                       │
    │                     │                       │                       │
    │                     │ startLeScan()         │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onScanResult()        │                       │
    │                     │ <─────────────────────┤                       │
    │                     │ Name: "MINI-CONTROLADOR"                      │
    │                     │ RSSI: -55 dBm         │                       │
    │                     │                       │                       │
    │ Muestra lista       │                       │                       │
    │ <────────────────────┤                       │                       │
    │                     │                       │                       │
    │ Selecciona device   │                       │                       │
    ├────────────────────>│                       │                       │
    │                     │                       │                       │
    │                     │ connectGatt()         │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onConnectionStateChange()                     │
    │                     │ <─────────────────────┤                       │
    │                     │ STATE: CONNECTED      │                       │
    │                     │                       │                       │
    │                     │ discoverServices()    │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onServicesDiscovered()│                       │
    │                     │ <─────────────────────┤                       │
    │                     │                       │                       │
    │                     │ readCharacteristic()  │                       │
    │                     │ (DEVICE_INFO)         │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onCharacteristicRead()│                       │
    │                     │ <─────────────────────┤                       │
    │                     │ {device_name, fw_ver} │                       │
    │                     │                       │                       │
    │                     │ readCharacteristic()  │                       │
    │                     │ (PANEL_URL)           │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │ get_local_ip()        │
    │                     │                       ├──────────────────────>│
    │                     │                       │                       │
    │                     │                       │ "192.168.1.120"       │
    │                     │                       │ <─────────────────────┤
    │                     │ onCharacteristicRead()│                       │
    │                     │ <─────────────────────┤                       │
    │                     │ "http://192.168.1.120:8080/"                  │
    │                     │                       │                       │
    │                     │ disconnect()          │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ HTTP GET /api/status  │                       │
    │                     ├───────────────────────┼──────────────────────>│
    │                     │                       │                       │
    │                     │ 200 OK {"status":"ok"}│                       │
    │                     │ <─────────────────────┼───────────────────────┤
    │                     │                       │                       │
    │                     │ WebView.loadUrl()     │                       │
    │                     │ "http://192.168.1.120:8080/"                  │
    │                     ├───────────────────────┼──────────────────────>│
    │                     │                       │                       │
    │                     │ HTML + JS + CSS       │                       │
    │                     │ <─────────────────────┼───────────────────────┤
    │                     │                       │                       │
    │ Panel cargado       │                       │                       │
    │ <────────────────────┤                       │                       │
    │                     │                       │                       │
    │                     │ WebSocket Connect     │                       │
    │                     │ ws://192.168.1.120:8080/ws                    │
    │                     ├───────────────────────┼──────────────────────>│
    │                     │                       │                       │
    │                     │ WS Upgrade 101        │                       │
    │                     │ <─────────────────────┼───────────────────────┤
    │                     │                       │                       │
    │                     │ GNSS Update (5Hz)     │                       │
    │                     │ <─────────────────────┼───────────────────────┤
    │                     │ {lat,lon,alt,...}     │                       │
    │                     │                       │                       │
    │ Actualización UI    │                       │                       │
    │ <────────────────────┤                       │                       │
    │                     │                       │                       │
```

## 2. Secuencia de Error - Red No Disponible

```
┌────────┐         ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│Usuario │         │Android App  │         │Mini Ctrl BLE│         │Mini Ctrl Web│
└───┬────┘         └──────┬──────┘         └──────┬──────┘         └──────┬──────┘
    │                     │                       │                       │
    │ Toca "Buscar"       │                       │                       │
    ├────────────────────>│                       │                       │
    │                     │                       │                       │
    │                     │ startLeScan()         │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onScanResult()        │                       │
    │                     │ <─────────────────────┤                       │
    │                     │                       │                       │
    │ Selecciona device   │                       │                       │
    ├────────────────────>│                       │                       │
    │                     │                       │                       │
    │                     │ connectGatt()         │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onConnectionStateChange()                     │
    │                     │ <─────────────────────┤                       │
    │                     │ STATE: CONNECTED      │                       │
    │                     │                       │                       │
    │                     │ discoverServices()    │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onServicesDiscovered()│                       │
    │                     │ <─────────────────────┤                       │
    │                     │                       │                       │
    │                     │ readCharacteristic()  │                       │
    │                     │ (PANEL_URL)           │                       │
    │                     ├──────────────────────>│                       │
    │                     │                       │                       │
    │                     │ onCharacteristicRead()│                       │
    │                     │ <─────────────────────┤                       │
    │                     │ "http://192.168.1.120:8080/"                  │
    │                     │                       │                       │
    │                     │ HTTP GET /api/status  │                       │
    │                     ├───────────────────────┼─────X                 │
    │                     │                       │     Timeout 3s        │
    │                     │                       │                       │
    │ Muestra diálogo     │                       │                       │
    │ "Conecta a Wi-Fi"   │                       │                       │
    │ <────────────────────┤                       │                       │
    │                     │                       │                       │
    │ Toca "Reintentar"   │                       │                       │
    ├────────────────────>│                       │                       │
    │                     │                       │                       │
    │                     │ HTTP GET /api/status  │                       │
    │                     ├───────────────────────┼──────────────────────>│
    │                     │                       │                       │
    │                     │ 200 OK                │                       │
    │                     │ <─────────────────────┼───────────────────────┤
    │                     │                       │                       │
    │                     │ WebView.loadUrl()     │                       │
    │                     ├───────────────────────┼──────────────────────>│
    │                     │                       │                       │
```

## 3. Secuencia de Streaming WebSocket

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│WebView (JS) │         │Mini Ctrl WS │         │GNSS Module  │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ new WebSocket()       │                       │
       ├──────────────────────>│                       │
       │                       │                       │
       │ 101 Switching Protocols                       │
       │ <─────────────────────┤                       │
       │                       │                       │
       │                       │ read_serial()         │
       │                       ├──────────────────────>│
       │                       │                       │
       │                       │ NMEA Sentence         │
       │                       │ <─────────────────────┤
       │                       │ $GNGGA,...            │
       │                       │                       │
       │                       │ parse_nmea()          │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │ {lat, lon, alt}       │
       │                       │                       │
       │ {type: "gnss_update"} │                       │
       │ <─────────────────────┤                       │
       │ {lat, lon, alt,...}   │                       │
       │                       │                       │
       │ updateMap()           │                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
       │                       │ 200ms delay (5Hz)     │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │                       │
       │                       │ read_serial()         │
       │                       ├──────────────────────>│
       │                       │                       │
       │ {type: "gnss_update"} │                       │
       │ <─────────────────────┤                       │
       │                       │                       │
       │ (Ciclo continúa...)   │                       │
       │                       │                       │
```

## 4. Secuencia de Detección Dinámica de IP

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│Android App  │         │BLE Char     │         │Network Utils│
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ readCharacteristic()  │                       │
       │ (PANEL_URL)           │                       │
       ├──────────────────────>│                       │
       │                       │                       │
       │                       │ get_local_ip()        │
       │                       ├──────────────────────>│
       │                       │                       │
       │                       │ get_interfaces()      │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │ [eth0, wlan0, lo]     │
       │                       │                       │
       │                       │ check_eth0()          │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │ None (no cable)       │
       │                       │                       │
       │                       │ check_wlan0()         │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │ 192.168.1.120         │
       │                       │                       │
       │                       │ "192.168.1.120"       │
       │                       │ <─────────────────────┤
       │                       │                       │
       │                       │ format_url()          │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │ "http://192.168.1.120:8080/"
       │                       │                       │
       │ onCharacteristicRead()│                       │
       │ <─────────────────────┤                       │
       │ "http://192.168.1.120:8080/"                  │
       │                       │                       │
```

## 5. Secuencia de Inicio del Sistema (Boot)

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│systemd      │  │Backend      │  │BLE Server   │  │GNSS Module  │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       │ boot sequence  │                │                │
       │ ─┐             │                │                │
       │  │             │                │                │
       │ <┘             │                │                │
       │                │                │                │
       │ start mini-controlador.service  │                │
       ├───────────────>│                │                │
       │                │                │                │
       │                │ load_config()  │                │
       │                │ ─┐             │                │
       │                │  │             │                │
       │                │ <┘             │                │
       │                │                │                │
       │                │ init_serial()  │                │
       │                ├───────────────────────────────>│
       │                │                │                │
       │                │ serial_open()  │                │
       │                │ <──────────────────────────────┤
       │                │                │                │
       │                │ start_ble()    │                │
       │                ├───────────────>│                │
       │                │                │                │
       │                │ register_service()              │
       │                │ ─┐             │                │
       │                │  │             │                │
       │                │ <┘             │                │
       │                │                │                │
       │                │ start_advertising()             │
       │                │                ├────┐           │
       │                │                │    │           │
       │                │                │<───┘           │
       │                │                │                │
       │                │ start_fastapi()│                │
       │                │ ─┐             │                │
       │                │  │             │                │
       │                │ <┘             │                │
       │                │ Uvicorn running on 0.0.0.0:8080│
       │                │                │                │
       │ service active │                │                │
       │ <──────────────┤                │                │
       │                │                │                │
       │                │ start_gnss_reader()            │
       │                │ ─┐             │                │
       │                │  │             │                │
       │                │ <┘             │                │
       │                │                │                │
       │                │ read_loop()    │                │
       │                ├───────────────────────────────>│
       │                │                │                │
       │                │ NMEA stream    │                │
       │                │ <──────────────────────────────┤
       │                │                │                │
       │ System ready   │                │                │
       │ ─┐             │                │                │
       │  │             │                │                │
       │ <┘             │                │                │
       │                │                │                │
```

## 6. Secuencia de Actualización de Configuración

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│WebView (JS) │         │Backend API  │         │Config File  │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ POST /api/config      │                       │
       │ {gnss: {update_rate_hz: 10}}                  │
       ├──────────────────────>│                       │
       │                       │                       │
       │                       │ validate_config()     │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │ OK                    │
       │                       │                       │
       │                       │ read_current_config() │
       │                       ├──────────────────────>│
       │                       │                       │
       │                       │ current_config.json   │
       │                       │ <─────────────────────┤
       │                       │                       │
       │                       │ merge_config()        │
       │                       │ ─┐                    │
       │                       │  │                    │
       │                       │ <┘                    │
       │                       │                       │
       │                       │ write_config()        │
       │                       ├──────────────────────>│
       │                       │                       │
       │                       │ config.json saved     │
       │                       │ <─────────────────────┤
       │                       │                       │
       │ 200 OK                │                       │
       │ {restart_required: true}                      │
       │ <─────────────────────┤                       │
       │                       │                       │
       │ Muestra mensaje       │                       │
       │ "Reinicia el servicio"│                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
```

## 7. Secuencia de Manejo de Reconexión WebSocket

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│WebView (JS) │         │WS Server    │         │Network      │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ WS Connected          │                       │
       │ <─────────────────────┤                       │
       │                       │                       │
       │ Receiving data        │                       │
       │ <─────────────────────┤                       │
       │                       │                       │
       │                       │ Network issue         │
       │                       │ <─────────────────────┤
       │                       │                       │
       │ onclose event         │                       │
       │ <─────────────────────X                       │
       │                       │                       │
       │ reconnectAttempt = 1  │                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
       │ setTimeout(2000)      │                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
       │ new WebSocket()       │                       │
       ├──────────────────────>│                       │
       │                       │                       │
       │ Connection refused    │                       │
       │ <─────────────────────X                       │
       │                       │                       │
       │ reconnectAttempt = 2  │                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
       │ setTimeout(4000)      │                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
       │                       │ Network restored      │
       │                       │ <─────────────────────┤
       │                       │                       │
       │ new WebSocket()       │                       │
       ├──────────────────────>│                       │
       │                       │                       │
       │ 101 Switching Protocols                       │
       │ <─────────────────────┤                       │
       │                       │                       │
       │ reconnectAttempts = 0 │                       │
       │ ─┐                    │                       │
       │  │                    │                       │
       │ <┘                    │                       │
       │                       │                       │
       │ Resume data stream    │                       │
       │ <─────────────────────┤                       │
       │                       │                       │
```

---

**Fin de Diagramas de Secuencia**
