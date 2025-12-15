#!/bin/bash
# ============================================================================
# MINI CONTROLADOR - SCRIPT DE INSTALACIÓN
# ============================================================================

set -e  # Exit on error

echo "============================================"
echo "  MINI CONTROLADOR - Instalación"
echo "============================================"
echo ""

# Verificar que se ejecuta como root para instalación de paquetes
if [[ $EUID -ne 0 ]]; then
   echo "Este script debe ejecutarse como root (sudo ./install.sh)"
   exit 1
fi

# Variables
INSTALL_DIR="/home/$SUDO_USER/mini-controlador"
VENV_DIR="$INSTALL_DIR/venv"
LOG_DIR="/var/log/mini-controlador"
LIB_DIR="/var/lib/mini-controlador"

echo "Directorio de instalación: $INSTALL_DIR"
echo ""

# ============================================================================
# 1. ACTUALIZAR SISTEMA
# ============================================================================
echo "[1/8] Actualizando sistema..."
apt-get update
apt-get upgrade -y

# ============================================================================
# 2. INSTALAR DEPENDENCIAS DEL SISTEMA
# ============================================================================
echo "[2/8] Instalando dependencias del sistema..."

apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    git \
    bluetooth \
    bluez \
    libbluetooth-dev \
    build-essential \
    libglib2.0-dev \
    libdbus-1-dev \
    libgirepository1.0-dev

echo "Dependencias instaladas ✓"

# ============================================================================
# 3. CONFIGURAR PUERTO SERIAL (Raspberry Pi)
# ============================================================================
echo "[3/8] Configurando puerto serial..."

# Habilitar UART en /boot/config.txt
if ! grep -q "enable_uart=1" /boot/config.txt; then
    echo "enable_uart=1" >> /boot/config.txt
    echo "UART habilitado en /boot/config.txt"
fi

# Deshabilitar Bluetooth en UART (opcional para Raspberry Pi Zero 2W)
if ! grep -q "dtoverlay=disable-bt" /boot/config.txt; then
    echo "dtoverlay=disable-bt" >> /boot/config.txt
    echo "Bluetooth en UART deshabilitado"
fi

# Agregar usuario a grupo dialout
usermod -a -G dialout $SUDO_USER
echo "Usuario $SUDO_USER agregado a grupo dialout ✓"

# ============================================================================
# 4. CREAR DIRECTORIOS
# ============================================================================
echo "[4/8] Creando directorios..."

mkdir -p $LOG_DIR
mkdir -p $LIB_DIR
chmod 755 $LOG_DIR
chmod 755 $LIB_DIR
chown -R $SUDO_USER:$SUDO_USER $LOG_DIR
chown -R $SUDO_USER:$SUDO_USER $LIB_DIR

echo "Directorios creados ✓"

# ============================================================================
# 5. COPIAR ARCHIVOS
# ============================================================================
echo "[5/8] Copiando archivos..."

# Copiar archivos del proyecto
if [ -d "backend" ]; then
    mkdir -p $INSTALL_DIR
    cp -r backend $INSTALL_DIR/
    cp -r web $INSTALL_DIR/
    cp -r config $INSTALL_DIR/
    mkdir -p $INSTALL_DIR/logs
    chown -R $SUDO_USER:$SUDO_USER $INSTALL_DIR
    echo "Archivos copiados a $INSTALL_DIR ✓"
else
    echo "ERROR: Directorio 'backend' no encontrado"
    exit 1
fi

# ============================================================================
# 6. CREAR ENTORNO VIRTUAL E INSTALAR PAQUETES PYTHON
# ============================================================================
echo "[6/8] Creando entorno virtual Python..."

# Ejecutar como usuario normal (no root)
sudo -u $SUDO_USER python3 -m venv $VENV_DIR

echo "Instalando paquetes Python..."
sudo -u $SUDO_USER $VENV_DIR/bin/pip install --upgrade pip
sudo -u $SUDO_USER $VENV_DIR/bin/pip install -r $INSTALL_DIR/backend/requirements.txt

echo "Paquetes Python instalados ✓"

# ============================================================================
# 7. CONFIGURAR SERVICIO SYSTEMD
# ============================================================================
echo "[7/8] Configurando servicio systemd..."

# Copiar service file
cp systemd/mini-controlador.service /etc/systemd/system/

# Recargar systemd
systemctl daemon-reload

# Habilitar servicio
systemctl enable mini-controlador.service

echo "Servicio systemd configurado ✓"

# ============================================================================
# 8. CONFIGURACIÓN FINAL
# ============================================================================
echo "[8/8] Configuración final..."

# Generar serial único si no existe
if [ ! -f "$INSTALL_DIR/config/config.json" ]; then
    SERIAL="MC-$(date +%Y%m%d)-$(openssl rand -hex 3)"
    sed -i "s/MC-20250101-001/$SERIAL/g" $INSTALL_DIR/config/config.json
    echo "Serial único generado: $SERIAL"
fi

# Ajustar permisos
chown -R $SUDO_USER:$SUDO_USER $INSTALL_DIR
chmod +x $INSTALL_DIR/backend/main.py

echo ""
echo "============================================"
echo "  ✓ INSTALACIÓN COMPLETADA"
echo "============================================"
echo ""
echo "Próximos pasos:"
echo ""
echo "1. Reiniciar el sistema:"
echo "   sudo reboot"
echo ""
echo "2. Después del reinicio, verificar el servicio:"
echo "   sudo systemctl status mini-controlador"
echo ""
echo "3. Ver logs:"
echo "   sudo journalctl -u mini-controlador -f"
echo ""
echo "4. Acceder al panel web:"
echo "   http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "5. Iniciar manualmente (opcional):"
echo "   sudo systemctl start mini-controlador"
echo ""
echo "============================================"
