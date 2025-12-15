package com.gnss.minicontrol

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

/**
 * MainActivity - Pantalla principal
 *
 * Muestra un botón "Buscar" para iniciar el escaneo BLE
 */
class MainActivity : AppCompatActivity() {

    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Configurar botón Buscar
        val btnSearch = findViewById<Button>(R.id.btn_search)
        btnSearch.setOnClickListener {
            checkPermissionsAndStartScan()
        }

        // Verificar soporte BLE
        if (!packageManager.hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            Toast.makeText(this, "BLE no soportado en este dispositivo", Toast.LENGTH_LONG).show()
            finish()
        }
    }

    /**
     * Verificar permisos y comenzar escaneo BLE
     */
    private fun checkPermissionsAndStartScan() {
        val permissionsNeeded = mutableListOf<String>()

        // Permisos según versión de Android
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // Android 12+
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_SCAN)
                != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.BLUETOOTH_SCAN)
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT)
                != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.BLUETOOTH_CONNECT)
            }
        } else {
            // Android < 12
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
                permissionsNeeded.add(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }

        if (permissionsNeeded.isNotEmpty()) {
            // Solicitar permisos
            ActivityCompat.requestPermissions(
                this,
                permissionsNeeded.toTypedArray(),
                PERMISSION_REQUEST_CODE
            )
        } else {
            // Ya tenemos permisos, iniciar escaneo
            startScanActivity()
        }
    }

    /**
     * Resultado de solicitud de permisos
     */
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }) {
                // Todos los permisos concedidos
                startScanActivity()
            } else {
                // Permisos denegados
                Toast.makeText(
                    this,
                    "Permisos requeridos para escanear dispositivos BLE",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }

    /**
     * Iniciar ScanActivity
     */
    private fun startScanActivity() {
        val intent = Intent(this, ScanActivity::class.java)
        startActivity(intent)
    }
}
