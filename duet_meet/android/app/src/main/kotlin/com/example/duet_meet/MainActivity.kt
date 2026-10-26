package com.example.duet_meet

import io.flutter.embedding.android.FlutterActivity
import android.content.Intent
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "screen_capture"
    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            when (call.method) {
                "start" -> {
                    val intent = Intent(this, ScreenCaptureService::class.java)
                    startForegroundService(intent)
                    result.success(null)
                }
                "stop" -> {
                    stopService(Intent(this, ScreenCaptureService::class.java))
                    result.success(null)
                }
                else -> result.notImplemented()
            }
        }
    }
}
