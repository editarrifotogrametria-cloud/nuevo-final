package com.gnss.minicontrol

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

/**
 * WebViewActivity - Panel web embebido
 */
class WebViewActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private var currentUrl: String? = null

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webview)

        // Obtener URL del Intent
        currentUrl = intent.getStringExtra("url")
        if (currentUrl == null) {
            Toast.makeText(this, "URL no proporcionada", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Inicializar UI
        webView = findViewById(R.id.webview)
        progressBar = findViewById(R.id.progress_loading)

        // Configurar WebView
        setupWebView()

        // Cargar URL
        webView.loadUrl(currentUrl!!)
    }

    /**
     * Configurar WebView con todas las opciones necesarias
     */
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            // JavaScript habilitado (necesario para el panel web)
            javaScriptEnabled = true

            // DOM Storage habilitado
            domStorageEnabled = true

            // Soporte para zoom
            setSupportZoom(true)
            builtInZoomControls = true
            displayZoomControls = false

            // Viewport y responsive
            useWideViewPort = true
            loadWithOverviewMode = true

            // Caché
            cacheMode = WebSettings.LOAD_DEFAULT

            // Mixed content (HTTP + HTTPS)
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // WebViewClient para manejar navegación
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Permitir navegación dentro del mismo dominio
                val url = request.url.toString()
                if (url.startsWith(currentUrl!!)) {
                    return false // Permitir carga
                }
                return true // Bloquear navegación externa
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                progressBar.visibility = View.GONE
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)
                if (request.isForMainFrame) {
                    Toast.makeText(
                        this@WebViewActivity,
                        "Error cargando página: ${error.description}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }

        // WebChromeClient para manejar JavaScript alerts, progress, etc.
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onJsAlert(
                view: WebView,
                url: String,
                message: String,
                result: JsResult
            ): Boolean {
                // Mostrar alertas JavaScript como Toast
                Toast.makeText(this@WebViewActivity, message, Toast.LENGTH_SHORT).show()
                result.confirm()
                return true
            }

            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                // Log mensajes de consola JavaScript (útil para debugging)
                android.util.Log.d(
                    "WebView",
                    "${consoleMessage.message()} -- From line ${consoleMessage.lineNumber()} of ${consoleMessage.sourceId()}"
                )
                return true
            }
        }
    }

    /**
     * Manejar botón Back para navegación del WebView
     */
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    /**
     * Guardar estado del WebView
     */
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    /**
     * Restaurar estado del WebView
     */
    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView.restoreState(savedInstanceState)
    }

    /**
     * Pausar WebView
     */
    override fun onPause() {
        super.onPause()
        webView.onPause()
        webView.pauseTimers()
    }

    /**
     * Resumir WebView
     */
    override fun onResume() {
        super.onResume()
        webView.onResume()
        webView.resumeTimers()
    }

    /**
     * Destruir WebView
     */
    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
