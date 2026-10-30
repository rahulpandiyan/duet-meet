import 'package:flutter/material.dart';
import '../theme.dart';

class SettingsSheet extends StatefulWidget {
  final String currentServerUrl;
  final ValueChanged<String> onServerUrlChanged;

  const SettingsSheet({
    super.key,
    required this.currentServerUrl,
    required this.onServerUrlChanged,
  });

  @override
  State<SettingsSheet> createState() => _SettingsSheetState();
}

class _SettingsSheetState extends State<SettingsSheet> {
  late final TextEditingController _urlController;
  bool _startWithMic = true;
  bool _startWithCam = false;

  @override
  void initState() {
    super.initState();
    _urlController = TextEditingController(text: widget.currentServerUrl);
  }

  @override
  void dispose() {
    _urlController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        left: 24,
        right: 24,
        top: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 28,
      ),
      decoration: const BoxDecoration(
        color: DuetColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 36,
              height: 4,
              decoration: BoxDecoration(
                color: DuetColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 18),

          // Title
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Settings',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: DuetColors.textPrimary,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded, size: 20, color: DuetColors.textSecondary),
                onPressed: () => Navigator.of(context).pop(),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Server URL setting
          const Text(
            'Server endpoint',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: DuetColors.textSecondary,
              letterSpacing: 0.2,
            ),
          ),
          const SizedBox(height: 6),
          TextField(
            controller: _urlController,
            style: const TextStyle(fontSize: 13, color: DuetColors.textPrimary),
            decoration: InputDecoration(
              hintText: 'https://duetxmeet.vercel.app',
              prefixIcon: const Icon(Icons.dns_rounded, size: 18, color: DuetColors.primary),
              suffixIcon: IconButton(
                icon: const Icon(Icons.check_rounded, size: 18, color: DuetColors.primary),
                onPressed: () {
                  widget.onServerUrlChanged(_urlController.text.trim());
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Server endpoint updated'),
                      duration: Duration(seconds: 2),
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Use http://10.0.2.2:3000 for Android emulator or your deployed URL',
            style: TextStyle(fontSize: 11, color: DuetColors.textTertiary),
          ),

          const SizedBox(height: 16),

          // Audio / video toggles
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text('Start with microphone on', style: TextStyle(fontSize: 13, color: DuetColors.textPrimary)),
            value: _startWithMic,
            activeTrackColor: DuetColors.primary,
            onChanged: (val) => setState(() => _startWithMic = val),
          ),
          SwitchListTile.adaptive(
            contentPadding: EdgeInsets.zero,
            title: const Text('Start with camera on', style: TextStyle(fontSize: 13, color: DuetColors.textPrimary)),
            value: _startWithCam,
            activeTrackColor: DuetColors.primary,
            onChanged: (val) => setState(() => _startWithCam = val),
          ),

          const SizedBox(height: 16),
          Center(
            child: Text(
              'Duet Meet Mobile v2.5 • WebRTC Engine',
              style: TextStyle(fontSize: 11, color: DuetColors.textTertiary),
            ),
          ),
        ],
      ),
    );
  }
}
