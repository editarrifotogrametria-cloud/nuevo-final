# 📱 APP ANDROID - MINI CONTROLADOR

Aplicación Android para descubrimiento automático del mini controlador vía BLE y visualización del panel web.

## 📋 Características

- ✅ **Escaneo BLE** con filtrado automático
- ✅ **Conexión GATT** para leer URL del panel
- ✅ **Verificación HTTP** antes de abrir WebView
- ✅ **WebView embebido** con JavaScript y WebSocket
- ✅ **Diagnóstico de errores** claro y detallado
- ✅ **Material Design 3** con UI moderna
- ✅ **Soporte Android 5.0+** (API 21-34)

---

## 🚀 Build e Instalación

### Requisitos

- **Android Studio**: Hedgehog | 2023.1.1 o superior
- **JDK**: 8 o superior
- **Gradle**: 8.2.0
- **Kotlin**: 1.9.20
- **Min SDK**: 21 (Android 5.0 Lollipop)
- **Target SDK**: 34 (Android 14)

### Pasos para Build

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd android-app

# 2. Abrir en Android Studio
# File > Open > Seleccionar carpeta android-app

# 3. Sync Gradle
# Esperar a que Gradle descargue dependencias

# 4. Build APK
# Build > Build Bundle(s) / APK(s) > Build APK(s)

# 5. Instalar en dispositivo
# Run > Run 'app' (o Shift+F10)
```

### Build desde línea de comandos

```bash
# Debug APK
./gradlew assembleDebug

# Release APK (firmado)
./gradlew assembleRelease

# Instalar en dispositivo conectado
./gradlew installDebug
```

---

## 📂 Estructura del Proyecto

```
android-app/
├── app/
│   ├── build.gradle.kts
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/gnss/minicontrol/
│           │   ├── MainActivity.kt           # Pantalla principal
│           │   ├── ScanActivity.kt          # Escaneo BLE
│           │   ├── WebViewActivity.kt       # Panel embebido
│           │   └── DevicesAdapter.kt        # Adapter RecyclerView
│           └── res/
│               ├── layout/
│               │   ├── activity_main.xml
│               │   ├── activity_scan.xml
│               │   ├── activity_webview.xml
│               │   └── item_device.xml
│               ├── values/
│               │   ├── strings.xml
│               │   ├── colors.xml
│               │   └── themes.xml
│               └── xml/
│                   ├── backup_rules.xml
│                   └── data_extraction_rules.xml
├── build.gradle.kts
├── settings.gradle.kts
└── README.md
```

---

## 🎮 Uso de la App

### Flujo Completo

1. **Abrir App**
   - Se muestra pantalla principal con botón "BUSCAR"

2. **Solicitar Permisos**
   - Se solicitan permisos BLE y ubicación automáticamente

3. **Escaneo BLE**
   - Al tocar "BUSCAR", inicia escaneo por 10 segundos
   - Filtra dispositivos que comiencen con "MINI-"
   - Muestra lista de dispositivos encontrados

4. **Seleccionar Dispositivo**
   - Usuario toca el dispositivo deseado
   - App conecta vía GATT
   - Lee característica PANEL_URL

5. **Verificación HTTP**
   - App hace GET a `/api/status` con timeout de 3s
   - Si responde, abre WebView
   - Si no responde, muestra error de conectividad

6. **Panel Web**
   - WebView carga el panel completo
   - JavaScript habilitado para interactividad
   - WebSocket funciona para datos en tiempo real

---

## 🔧 Configuración

### UUIDs BLE

Los UUIDs están hardcodeados en `ScanActivity.kt` y deben coincidir con el backend:

```kotlin
private val SERVICE_UUID = UUID.fromString("0000181A-0000-1000-8000-00805F9B34FB")
private val DEVICE_INFO_UUID = UUID.fromString("00002A29-0000-1000-8000-00805F9B34FB")
private val PANEL_URL_UUID = UUID.fromString("00002A24-0000-1000-8000-00805F9B34FB")
private val HEALTH_UUID = UUID.fromString("00002A19-0000-1000-8000-00805F9B34FB")
```

### Filtro de Dispositivos

Por defecto, filtra dispositivos cuyo nombre comience con "MINI-":

```kotlin
if (deviceName.startsWith("MINI-")) {
    // Agregar a lista
}
```

Para cambiar el filtro, editar `ScanActivity.kt` línea ~150.

### Timeout HTTP

Timeout de verificación HTTP (default: 3 segundos):

```kotlin
private const val HTTP_TIMEOUT: Long = 3000 // 3 segundos
```

---

## 🔐 Permisos

### Android 12+ (API 31+)

- `BLUETOOTH_SCAN` (sin ubicación)
- `BLUETOOTH_CONNECT`
- `INTERNET`
- `ACCESS_NETWORK_STATE`

### Android < 12 (API 21-30)

- `BLUETOOTH`
- `BLUETOOTH_ADMIN`
- `ACCESS_FINE_LOCATION`
- `INTERNET`
- `ACCESS_NETWORK_STATE`

Los permisos se solicitan automáticamente en runtime.

---

## 🐛 Solución de Problemas

### No encuentra dispositivos BLE

**Problema**: Escaneo no encuentra el mini controlador

**Soluciones**:
1. Verificar que Bluetooth está habilitado
2. Verificar permisos de ubicación (Android < 12)
3. Verificar que el nombre del dispositivo comienza con "MINI-"
4. Reiniciar Bluetooth del teléfono
5. Ver logs de Android Studio:
   ```bash
   adb logcat | grep ScanActivity
   ```

### Error de conectividad HTTP

**Problema**: BLE conecta pero HTTP falla

**Soluciones**:
1. Conectar teléfono a la misma red Wi-Fi que el Pi
2. Verificar que el backend está corriendo:
   ```bash
   curl http://IP_DEL_PI:8080/api/status
   ```
3. Verificar firewall en el Pi
4. Aumentar timeout HTTP si la red es lenta:
   ```kotlin
   private const val HTTP_TIMEOUT: Long = 5000 // 5 segundos
   ```

### WebView no carga JavaScript

**Problema**: Panel carga pero no funciona

**Soluciones**:
1. Verificar que `javaScriptEnabled = true` en `WebViewActivity.kt`
2. Verificar consola JavaScript en logs:
   ```bash
   adb logcat | grep WebView
   ```
3. Limpiar caché de WebView:
   ```kotlin
   webView.clearCache(true)
   ```

### Build errors de Gradle

**Problema**: Gradle no compila

**Soluciones**:
1. Sync Gradle:
   ```
   File > Sync Project with Gradle Files
   ```
2. Clean y Rebuild:
   ```
   Build > Clean Project
   Build > Rebuild Project
   ```
3. Invalidar caché:
   ```
   File > Invalidate Caches / Restart
   ```
4. Actualizar Gradle wrapper:
   ```bash
   ./gradlew wrapper --gradle-version 8.2
   ```

---

## 🧪 Testing

### Testing Manual

1. **BLE Scan**:
   - Abrir app
   - Tocar "BUSCAR"
   - Verificar que encuentra el dispositivo

2. **GATT Connection**:
   - Seleccionar dispositivo
   - Verificar mensaje "Conectando..."
   - Verificar mensaje "Descubriendo servicios..."
   - Verificar mensaje "Obteniendo URL del panel..."

3. **HTTP Verification**:
   - Verificar mensaje "Verificando conectividad..."
   - Verificar que abre WebView si hay conectividad
   - Verificar diálogo de error si no hay conectividad

4. **WebView**:
   - Verificar que el panel carga completamente
   - Verificar que el mapa se muestra
   - Verificar que las gráficas actualizan en tiempo real
   - Verificar que WebSocket conecta

### Logs de Debugging

```bash
# Ver todos los logs de la app
adb logcat | grep "com.gnss.minicontrol"

# Ver solo logs de ScanActivity
adb logcat | grep "ScanActivity"

# Ver logs de WebView
adb logcat | grep "WebView"

# Limpiar logs
adb logcat -c
```

---

## 📦 Dependencias

| Librería | Versión | Uso |
|----------|---------|-----|
| AndroidX Core | 1.12.0 | Compatibilidad |
| AppCompat | 1.6.1 | Componentes UI |
| Material | 1.11.0 | Material Design |
| ConstraintLayout | 2.1.4 | Layouts responsive |
| RecyclerView | 1.3.2 | Lista de dispositivos |
| Coroutines | 1.7.3 | Async/await |
| Lifecycle | 2.7.0 | ViewModel y LiveData |
| OkHttp | 4.12.0 | Cliente HTTP |

---

## 🔄 Versionado

- **1.0.0** - Versión inicial
  - Escaneo BLE
  - Conexión GATT
  - WebView embebido
  - Material Design

---

## 📝 TODO / Mejoras Futuras

- [ ] Guardar dispositivos favoritos
- [ ] Reconexión automática
- [ ] Modo offline con caché
- [ ] Notificaciones de eventos
- [ ] Widget de Android
- [ ] Soporte para múltiples dispositivos
- [ ] Configuración de NTRIP desde la app
- [ ] Export de datos a archivos

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

---

**Made with ❤️ for Android + IoT developers**
