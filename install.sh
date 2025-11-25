#!/bin/bash
###############################################################################
# GNSS Professional - Instalador Automatizado
# Para Raspberry Pi Zero 2W + ComNav K222/K902/K922
# Version: 1.0
###############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then
    print_error "Este script debe ejecutarse como root (sudo)"
    exit 1
fi

# Obtener directorio de instalación
INSTALL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
USER_HOME=$(eval echo ~${SUDO_USER})

print_header "🛰️  GNSS PROFESSIONAL - INSTALACIÓN"
echo "Directorio de instalación: $INSTALL_DIR"
echo "Usuario: ${SUDO_USER}"
echo ""

# Confirmar instalación
read -p "¿Desea continuar con la instalación? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    print_warning "Instalación cancelada"
    exit 1
fi

###############################################################################
# 1. ACTUALIZAR SISTEMA
###############################################################################
print_header "1️⃣  Actualizando sistema"
apt-get update
apt-get upgrade -y
print_success "Sistema actualizado"

###############################################################################
# 2. INSTALAR DEPENDENCIAS
###############################################################################
print_header "2️⃣  Instalando dependencias del sistema"

# Paquetes del sistema
SYSTEM_PACKAGES=(
    python3
    python3-pip
    python3-venv
    git
    bluetooth
    bluez
    libbluetooth-dev
    python3-bluetooth
    hostapd
    dnsmasq
    nginx
    gpsd
    gpsd-clients
    i2c-tools
    screen
)

for package in "${SYSTEM_PACKAGES[@]}"; do
    if dpkg -l | grep -q "^ii  $package "; then
        print_success "$package ya instalado"
    else
        print_info "Instalando $package..."
        apt-get install -y "$package"
        print_success "$package instalado"
    fi
done

###############################################################################
# 3. CONFIGURAR PUERTO SERIAL
###############################################################################
print_header "3️⃣  Configurando puerto serial"

# Deshabilitar consola serial en /boot/cmdline.txt
if grep -q "console=serial0" /boot/cmdline.txt 2>/dev/null || grep -q "console=serial0" /boot/firmware/cmdline.txt 2>/dev/null; then
    print_info "Deshabilitando consola serial..."

    # Probar ambas rutas (depende de la versión de Raspberry Pi OS)
    for cmdline_path in /boot/cmdline.txt /boot/firmware/cmdline.txt; do
        if [ -f "$cmdline_path" ]; then
            cp "$cmdline_path" "${cmdline_path}.backup"
            sed -i 's/console=serial0,[0-9]\+\s//g' "$cmdline_path"
            sed -i 's/console=ttyAMA0,[0-9]\+\s//g' "$cmdline_path"
            print_success "Consola serial deshabilitada en $cmdline_path"
        fi
    done
fi

# Habilitar UART en /boot/config.txt
CONFIG_FILE=""
if [ -f /boot/config.txt ]; then
    CONFIG_FILE=/boot/config.txt
elif [ -f /boot/firmware/config.txt ]; then
    CONFIG_FILE=/boot/firmware/config.txt
fi

if [ -n "$CONFIG_FILE" ]; then
    print_info "Configurando UART en $CONFIG_FILE..."
    cp "$CONFIG_FILE" "${CONFIG_FILE}.backup"

    if ! grep -q "^enable_uart=1" "$CONFIG_FILE"; then
        echo "enable_uart=1" >> "$CONFIG_FILE"
        print_success "UART habilitado"
    else
        print_success "UART ya estaba habilitado"
    fi

    if ! grep -q "^dtoverlay=disable-bt" "$CONFIG_FILE"; then
        echo "dtoverlay=disable-bt" >> "$CONFIG_FILE"
        print_info "Bluetooth del puerto serial deshabilitado"
    fi
fi

# Deshabilitar servicio de Bluetooth del sistema (solo el SPP manual)
systemctl disable hciuart.service 2>/dev/null || true
systemctl mask serial-getty@ttyAMA0.service 2>/dev/null || true
print_success "Puerto serial configurado para ComNav"

###############################################################################
# 4. INSTALAR DEPENDENCIAS PYTHON
###############################################################################
print_header "4️⃣  Instalando dependencias Python"

# Crear entorno virtual
VENV_DIR="$INSTALL_DIR/venv"
if [ ! -d "$VENV_DIR" ]; then
    print_info "Creando entorno virtual..."
    python3 -m venv "$VENV_DIR"
    print_success "Entorno virtual creado"
else
    print_success "Entorno virtual ya existe"
fi

# Activar entorno virtual e instalar dependencias
source "$VENV_DIR/bin/activate"

print_info "Instalando paquetes Python..."
pip install --upgrade pip setuptools wheel

# Dependencias principales
PYTHON_PACKAGES=(
    "pyserial"
    "flask"
    "flask-socketio"
    "flask-cors"
    "requests"
    "pybluez"
    "numpy"
    "python-socketio"
    "eventlet"
    "gevent"
    "gevent-websocket"
)

for package in "${PYTHON_PACKAGES[@]}"; do
    print_info "Instalando $package..."
    pip install "$package" || print_warning "Error instalando $package (puede ser opcional)"
done

print_success "Dependencias Python instaladas"

###############################################################################
# 5. CREAR ESTRUCTURA DE DIRECTORIOS
###############################################################################
print_header "5️⃣  Creando estructura de directorios"

mkdir -p "$INSTALL_DIR/data/projects"
mkdir -p "$INSTALL_DIR/data/points"
mkdir -p "$INSTALL_DIR/data/logs"
mkdir -p "$INSTALL_DIR/static"
mkdir -p "$INSTALL_DIR/templates"
mkdir -p "$INSTALL_DIR/config"

# Cambiar permisos
chown -R ${SUDO_USER}:${SUDO_USER} "$INSTALL_DIR/data"
chmod -R 755 "$INSTALL_DIR/data"

print_success "Estructura de directorios creada"

###############################################################################
# 6. CREAR SERVICIOS SYSTEMD
###############################################################################
print_header "6️⃣  Creando servicios systemd"

# Servicio principal: Smart Processor
cat > /etc/systemd/system/gnss-processor.service <<EOF
[Unit]
Description=GNSS Professional - Smart Processor
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=${SUDO_USER}
WorkingDirectory=$INSTALL_DIR
Environment="PATH=$VENV_DIR/bin"
ExecStart=$VENV_DIR/bin/python3 $INSTALL_DIR/smart_processor.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Servicio: Web Server
cat > /etc/systemd/system/gnss-web.service <<EOF
[Unit]
Description=GNSS Professional - Web Server
After=network.target gnss-processor.service
Wants=network-online.target

[Service]
Type=simple
User=${SUDO_USER}
WorkingDirectory=$INSTALL_DIR
Environment="PATH=$VENV_DIR/bin"
ExecStart=$VENV_DIR/bin/python3 $INSTALL_DIR/gps_server.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Servicio: Bluetooth SPP
cat > /etc/systemd/system/gnss-bluetooth.service <<EOF
[Unit]
Description=GNSS Professional - Bluetooth SPP Server
After=bluetooth.target gnss-processor.service
Wants=bluetooth.target

[Service]
Type=simple
User=root
WorkingDirectory=$INSTALL_DIR
Environment="PATH=$VENV_DIR/bin"
ExecStart=$VENV_DIR/bin/python3 $INSTALL_DIR/bluetooth_spp_server.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd
systemctl daemon-reload
print_success "Servicios systemd creados"

###############################################################################
# 7. CONFIGURAR WIFI ACCESS POINT (OPCIONAL)
###############################################################################
print_header "7️⃣  Configurar WiFi Access Point"

read -p "¿Desea configurar WiFi Access Point? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    read -p "Nombre de la red WiFi [GNSS-RTK]: " WIFI_SSID
    WIFI_SSID=${WIFI_SSID:-GNSS-RTK}

    read -p "Contraseña WiFi [gnss123456]: " WIFI_PASSWORD
    WIFI_PASSWORD=${WIFI_PASSWORD:-gnss123456}

    # Configurar hostapd
    cat > /etc/hostapd/hostapd.conf <<EOF
interface=wlan0
driver=nl80211
ssid=$WIFI_SSID
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=$WIFI_PASSWORD
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

    # Configurar dnsmasq
    cat > /etc/dnsmasq.conf <<EOF
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
domain=wlan
address=/gw.wlan/192.168.4.1
EOF

    # Configurar IP estática para wlan0
    cat >> /etc/dhcpcd.conf <<EOF

# GNSS Professional - WiFi AP
interface wlan0
    static ip_address=192.168.4.1/24
    nohook wpa_supplicant
EOF

    # Habilitar IP forwarding
    sed -i 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' /etc/sysctl.conf

    # Habilitar servicios
    systemctl unmask hostapd
    systemctl enable hostapd
    systemctl enable dnsmasq

    print_success "WiFi AP configurado: $WIFI_SSID"
    print_info "IP del dispositivo: 192.168.4.1"
else
    print_info "WiFi AP omitido"
fi

###############################################################################
# 8. HABILITAR SERVICIOS
###############################################################################
print_header "8️⃣  Habilitando servicios"

systemctl enable gnss-processor.service
systemctl enable gnss-web.service
systemctl enable gnss-bluetooth.service

print_success "Servicios habilitados para auto-inicio"

###############################################################################
# 9. RESUMEN Y PRÓXIMOS PASOS
###############################################################################
print_header "✅  INSTALACIÓN COMPLETADA"

echo -e "${GREEN}La instalación se ha completado exitosamente!${NC}\n"

echo "Servicios instalados:"
echo "  • gnss-processor  - Procesamiento NMEA y ML"
echo "  • gnss-web        - Servidor web (puerto 5000)"
echo "  • gnss-bluetooth  - Servidor Bluetooth SPP"
echo ""

echo "Próximos pasos:"
echo ""
echo "1. Reiniciar el sistema:"
echo "   sudo reboot"
echo ""
echo "2. Después del reinicio, verificar servicios:"
echo "   sudo systemctl status gnss-processor"
echo "   sudo systemctl status gnss-web"
echo "   sudo systemctl status gnss-bluetooth"
echo ""
echo "3. Acceder a la interfaz web:"
echo "   http://$(hostname -I | awk '{print $1}'):5000"
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo "   http://192.168.4.1:5000 (desde WiFi AP)"
fi
echo ""

echo "Comandos útiles:"
echo "  • Iniciar servicios:  sudo systemctl start gnss-processor gnss-web"
echo "  • Detener servicios:  sudo systemctl stop gnss-processor gnss-web"
echo "  • Ver logs:          sudo journalctl -u gnss-processor -f"
echo "  • Ver datos NMEA:    cat /dev/serial0"
echo ""

print_warning "IMPORTANTE: Reinicia el sistema para aplicar todos los cambios"
