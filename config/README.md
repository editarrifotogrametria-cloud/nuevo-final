# Configuración - GNSS Professional

Este directorio contiene los archivos de configuración del sistema.

## Archivos

### ntrip.json
Configuración del cliente NTRIP para recibir correcciones RTK.

**Parámetros**:
- `enabled`: Habilitar/deshabilitar cliente NTRIP
- `host`: Hostname del caster NTRIP
- `port`: Puerto del caster (típicamente 2101)
- `mountpoint`: Punto de montaje de tu región
- `username`: Usuario (típicamente email)
- `password`: Contraseña (vacío para servicios públicos)
- `gga_interval`: Intervalo de envío de GGA en segundos
- `serial_port`: Puerto serial del receptor
- `serial_baud`: Velocidad del puerto
- `reconnect_delay`: Tiempo de espera para reconexión

**Casters NTRIP públicos**:

#### RTK2GO (Gratuito)
```json
{
  "host": "rtk2go.com",
  "port": 2101,
  "username": "your_email@example.com"
}
```

Lista de mountpoints: http://rtk2go.com:2101

#### EUREF
```json
{
  "host": "www.euref-ip.net",
  "port": 2101,
  "username": "anonymous",
  "password": "guest"
}
```

#### IGS
```json
{
  "host": "products.igs-ip.net",
  "port": 2101
}
```

### app_config.json
Configuración general de la aplicación.

Edita este archivo para personalizar:
- Puertos y hosts
- Características habilitadas
- Parámetros GNSS
- Configuración de logging

## Uso

1. **Copiar archivos de ejemplo**:
```bash
cp config/ntrip.json.example config/ntrip.json
cp config/app_config.json.example config/app_config.json
```

2. **Editar configuración**:
```bash
nano config/ntrip.json
nano config/app_config.json
```

3. **Aplicar cambios**:
```bash
sudo systemctl restart gnss-processor
sudo systemctl restart gnss-web
```

## Seguridad

- **NO** commits archivos de configuración con credenciales reales
- Usa variables de entorno para datos sensibles
- Los archivos de configuración están en `.gitignore`
