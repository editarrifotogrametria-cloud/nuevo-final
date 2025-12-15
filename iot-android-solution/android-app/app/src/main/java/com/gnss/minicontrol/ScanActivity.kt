package com.gnss.minicontrol

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.*
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.UUID
import java.util.concurrent.TimeUnit

/**
 * ScanActivity - Escaneo BLE y selección de dispositivo
 */
@SuppressLint("MissingPermission")
class ScanActivity : AppCompatActivity() {

    companion object {
        private const val TAG = "ScanActivity"
        private const val SCAN_PERIOD: Long = 10000 // 10 segundos
        private const val HTTP_TIMEOUT: Long = 3000 // 3 segundos

        // UUIDs (deben coincidir con el backend)
        private val SERVICE_UUID = UUID.fromString("0000181A-0000-1000-8000-00805F9B34FB")
        private val DEVICE_INFO_UUID = UUID.fromString("00002A29-0000-1000-8000-00805F9B34FB")
        private val PANEL_URL_UUID = UUID.fromString("00002A24-0000-1000-8000-00805F9B34FB")
        private val HEALTH_UUID = UUID.fromString("00002A19-0000-1000-8000-00805F9B34FB")
    }

    // UI
    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvStatus: TextView
    private lateinit var btnRescan: Button

    // BLE
    private var bluetoothAdapter: BluetoothAdapter? = null
    private var bluetoothLeScanner: BluetoothLeScanner? = null
    private var scanning = false
    private val handler = Handler(Looper.getMainLooper())

    // Dispositivos encontrados
    private val devicesList = mutableListOf<BluetoothDevice>()
    private lateinit var devicesAdapter: DevicesAdapter

    // GATT
    private var bluetoothGatt: BluetoothGatt? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scan)

        // Inicializar UI
        recyclerView = findViewById(R.id.recycler_devices)
        progressBar = findViewById(R.id.progress_scanning)
        tvStatus = findViewById(R.id.tv_status)
        btnRescan = findViewById(R.id.btn_rescan)

        // Configurar RecyclerView
        recyclerView.layoutManager = LinearLayoutManager(this)
        devicesAdapter = DevicesAdapter(devicesList) { device ->
            onDeviceSelected(device)
        }
        recyclerView.adapter = devicesAdapter

        // Botón rescanear
        btnRescan.setOnClickListener {
            devicesList.clear()
            devicesAdapter.notifyDataSetChanged()
            startBleScan()
        }

        // Inicializar Bluetooth
        val bluetoothManager = getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        bluetoothAdapter = bluetoothManager.adapter

        if (bluetoothAdapter == null || !bluetoothAdapter!!.isEnabled) {
            Toast.makeText(this, "Bluetooth deshabilitado", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        bluetoothLeScanner = bluetoothAdapter!!.bluetoothLeScanner

        // Iniciar escaneo automático
        startBleScan()
    }

    /**
     * Iniciar escaneo BLE
     */
    private fun startBleScan() {
        if (scanning) return

        Log.d(TAG, "Iniciando escaneo BLE...")
        tvStatus.text = "Buscando dispositivos..."
        progressBar.visibility = View.VISIBLE
        btnRescan.isEnabled = false

        scanning = true

        // Detener escaneo después de SCAN_PERIOD
        handler.postDelayed({
            stopBleScan()
        }, SCAN_PERIOD)

        bluetoothLeScanner?.startScan(scanCallback)
    }

    /**
     * Detener escaneo BLE
     */
    private fun stopBleScan() {
        if (!scanning) return

        Log.d(TAG, "Deteniendo escaneo BLE...")
        scanning = false
        bluetoothLeScanner?.stopScan(scanCallback)

        progressBar.visibility = View.GONE
        btnRescan.isEnabled = true

        if (devicesList.isEmpty()) {
            tvStatus.text = "No se encontraron dispositivos"
        } else {
            tvStatus.text = "Dispositivos encontrados: ${devicesList.size}"
        }
    }

    /**
     * Callback de escaneo BLE
     */
    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            val device = result.device
            val deviceName = device.name ?: "Desconocido"

            // Filtrar por nombre que comience con "MINI-CONTROLADOR" o "MINI-"
            if (deviceName.startsWith("MINI-")) {
                // Verificar si ya está en la lista
                if (!devicesList.any { it.address == device.address }) {
                    Log.d(TAG, "Dispositivo encontrado: $deviceName (${device.address})")
                    devicesList.add(device)
                    runOnUiThread {
                        devicesAdapter.notifyItemInserted(devicesList.size - 1)
                        tvStatus.text = "Dispositivos encontrados: ${devicesList.size}"
                    }
                }
            }
        }

        override fun onScanFailed(errorCode: Int) {
            Log.e(TAG, "Escaneo BLE falló: $errorCode")
            runOnUiThread {
                Toast.makeText(this@ScanActivity, "Error en escaneo BLE", Toast.LENGTH_SHORT).show()
                stopBleScan()
            }
        }
    }

    /**
     * Dispositivo seleccionado por el usuario
     */
    private fun onDeviceSelected(device: BluetoothDevice) {
        Log.d(TAG, "Dispositivo seleccionado: ${device.name} (${device.address})")

        // Detener escaneo
        stopBleScan()

        // Mostrar progreso
        tvStatus.text = "Conectando a ${device.name}..."
        progressBar.visibility = View.VISIBLE

        // Conectar GATT
        connectToDevice(device)
    }

    /**
     * Conectar al dispositivo BLE y leer características
     */
    private fun connectToDevice(device: BluetoothDevice) {
        bluetoothGatt = device.connectGatt(this, false, gattCallback)
    }

    /**
     * Callback GATT
     */
    private val gattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt, status: Int, newState: Int) {
            when (newState) {
                BluetoothProfile.STATE_CONNECTED -> {
                    Log.d(TAG, "Conectado a GATT server")
                    runOnUiThread {
                        tvStatus.text = "Conectado. Descubriendo servicios..."
                    }
                    // Descubrir servicios
                    gatt.discoverServices()
                }
                BluetoothProfile.STATE_DISCONNECTED -> {
                    Log.d(TAG, "Desconectado de GATT server")
                    runOnUiThread {
                        progressBar.visibility = View.GONE
                        Toast.makeText(this@ScanActivity, "Dispositivo desconectado", Toast.LENGTH_SHORT).show()
                    }
                    gatt.close()
                }
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt, status: Int) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.d(TAG, "Servicios descubiertos")

                // Buscar servicio principal
                val service = gatt.getService(SERVICE_UUID)
                if (service != null) {
                    Log.d(TAG, "Servicio encontrado: $SERVICE_UUID")

                    // Leer característica PANEL_URL
                    val panelUrlChar = service.getCharacteristic(PANEL_URL_UUID)
                    if (panelUrlChar != null) {
                        runOnUiThread {
                            tvStatus.text = "Obteniendo URL del panel..."
                        }
                        gatt.readCharacteristic(panelUrlChar)
                    } else {
                        Log.e(TAG, "Característica PANEL_URL no encontrada")
                        runOnUiThread {
                            showError("Característica PANEL_URL no encontrada")
                        }
                    }
                } else {
                    Log.e(TAG, "Servicio no encontrado: $SERVICE_UUID")
                    runOnUiThread {
                        showError("Servicio BLE no encontrado")
                    }
                }
            } else {
                Log.e(TAG, "Error descubriendo servicios: $status")
                runOnUiThread {
                    showError("Error descubriendo servicios BLE")
                }
            }
        }

        override fun onCharacteristicRead(
            gatt: BluetoothGatt,
            characteristic: BluetoothGattCharacteristic,
            status: Int
        ) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                when (characteristic.uuid) {
                    PANEL_URL_UUID -> {
                        val url = characteristic.getStringValue(0)
                        Log.d(TAG, "PANEL_URL leída: $url")

                        if (url.startsWith("ERROR:")) {
                            runOnUiThread {
                                showError("Error: $url")
                            }
                        } else {
                            // Verificar conectividad HTTP
                            verifyConnectivity(url)
                        }
                    }
                    DEVICE_INFO_UUID -> {
                        val deviceInfo = characteristic.getStringValue(0)
                        Log.d(TAG, "DEVICE_INFO: $deviceInfo")
                    }
                    HEALTH_UUID -> {
                        val health = characteristic.getStringValue(0)
                        Log.d(TAG, "HEALTH: $health")
                    }
                }
            } else {
                Log.e(TAG, "Error leyendo característica: $status")
                runOnUiThread {
                    showError("Error leyendo datos BLE")
                }
            }
        }
    }

    /**
     * Verificar conectividad HTTP antes de abrir WebView
     */
    private fun verifyConnectivity(url: String) {
        runOnUiThread {
            tvStatus.text = "Verificando conectividad..."
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val client = OkHttpClient.Builder()
                    .connectTimeout(HTTP_TIMEOUT, TimeUnit.MILLISECONDS)
                    .readTimeout(HTTP_TIMEOUT, TimeUnit.MILLISECONDS)
                    .build()

                val request = Request.Builder()
                    .url("$url/api/status")
                    .build()

                val response = client.newCall(request).execute()

                if (response.isSuccessful) {
                    Log.d(TAG, "HTTP check OK: ${response.code}")
                    // Conectividad OK, abrir WebView
                    withContext(Dispatchers.Main) {
                        openWebView(url)
                    }
                } else {
                    Log.e(TAG, "HTTP check failed: ${response.code}")
                    withContext(Dispatchers.Main) {
                        showConnectivityError(url)
                    }
                }
                response.close()

            } catch (e: Exception) {
                Log.e(TAG, "HTTP check error: ${e.message}")
                withContext(Dispatchers.Main) {
                    showConnectivityError(url)
                }
            } finally {
                // Desconectar GATT
                bluetoothGatt?.close()
                bluetoothGatt = null
            }
        }
    }

    /**
     * Abrir WebViewActivity
     */
    private fun openWebView(url: String) {
        progressBar.visibility = View.GONE
        tvStatus.text = "Abriendo panel..."

        val intent = Intent(this, WebViewActivity::class.java)
        intent.putExtra("url", url)
        startActivity(intent)
    }

    /**
     * Mostrar error de conectividad
     */
    private fun showConnectivityError(url: String) {
        progressBar.visibility = View.GONE
        tvStatus.text = "Error de conectividad"

        val message = """
            No se pudo conectar al panel web.

            Conecta tu teléfono a la misma red Wi-Fi que el mini controlador.

            URL: $url
        """.trimIndent()

        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("⚠️ Error de Conectividad")
            .setMessage(message)
            .setPositiveButton("Reintentar") { _, _ ->
                verifyConnectivity(url)
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    /**
     * Mostrar error genérico
     */
    private fun showError(message: String) {
        progressBar.visibility = View.GONE
        tvStatus.text = "Error"
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        bluetoothGatt?.close()
        bluetoothGatt = null
    }

    override fun onDestroy() {
        super.onDestroy()
        stopBleScan()
        bluetoothGatt?.close()
        bluetoothGatt = null
    }
}
