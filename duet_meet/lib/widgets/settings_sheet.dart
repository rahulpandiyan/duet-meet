import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
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
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _startWithMic = prefs.getBool('duet_start_with_mic') ?? true;
      _startWithCam = prefs.getBool('duet_start_with_cam') ?? false;
      final savedUrl = prefs.getString('duet_server_url');
      if (savedUrl != null && savedUrl.isNotEmpty) {
        _urlController.text = savedUrl;
      }
    });
  }

  Future<void> _setMicPreference(bool value) async {
    setState(() => _startWithMic = value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('duet_start_with_mic', value);
  }

  Future<void> _setCamPreference(bool value) async {
    setState(() => _startWithCam = value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('duet_start_with_cam', value);
  }

  Future<void> _saveServerUrl() async {
    final text = _urlController.text.trim();
    if (text.isEmpty) return;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('duet_server_url', text);
    widget.onServerUrlChanged(text);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Server endpoint saved'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  Future<void> _openLegalUrl(String path) async {
    final base = _urlController.text.trim().replaceAll(RegExp(r'/+$'), '');
    final effectiveBase = base.isNotEmpty ? base : 'https://duetxmeet.vercel.app';
    final uri = Uri.parse('$effectiveBase$path');
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      }
    } catch (e) {
      debugPrint('Failed to launch URL: $e');
    }
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
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      decoration: const BoxDecoration(
        color: DuetColors.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SingleChildScrollView(
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
            const SizedBox(height: 16),

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

            const SizedBox(height: 14),

            // Server URL setting (Production)
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
                  onPressed: _saveServerUrl,
                ),
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Connected to production signaling & WebRTC mesh',
              style: TextStyle(fontSize: 11, color: DuetColors.textTertiary),
            ),

            const SizedBox(height: 14),

            // Audio / video toggles with persistence
            SwitchListTile.adaptive(
              contentPadding: EdgeInsets.zero,
              title: const Text('Start with microphone on', style: TextStyle(fontSize: 13, color: DuetColors.textPrimary)),
              value: _startWithMic,
              activeTrackColor: DuetColors.primary,
              onChanged: _setMicPreference,
            ),
            SwitchListTile.adaptive(
              contentPadding: EdgeInsets.zero,
              title: const Text('Start with camera on', style: TextStyle(fontSize: 13, color: DuetColors.textPrimary)),
              value: _startWithCam,
              activeTrackColor: DuetColors.primary,
              onChanged: _setCamPreference,
            ),

            const SizedBox(height: 16),
            const Divider(color: DuetColors.border, height: 1),
            const SizedBox(height: 14),

            // Legal Pages Links
            const Text(
              'Legal & Policies',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: DuetColors.textSecondary,
                letterSpacing: 0.2,
              ),
            ),
            const SizedBox(height: 8),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                _buildLegalPill('Terms of Service', '/terms'),
                _buildLegalPill('Privacy Policy', '/privacy'),
                _buildLegalPill('Acceptable Use', '/acceptable-use'),
                _buildLegalPill('Security', '/security'),
                _buildLegalPill('Cookie Policy', '/cookies'),
              ],
            ),

            const SizedBox(height: 20),

            // Made with love by Rahul Pandiyan
            Center(
              child: Column(
                children: const [
                  Text(
                    'Made with ❤️ by Rahul Pandiyan',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: DuetColors.textSecondary,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Duet Meet Mobile v2.5 • WebRTC Engine',
                    style: TextStyle(fontSize: 10, color: DuetColors.textTertiary),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLegalPill(String title, String path) {
    return InkWell(
      onTap: () => _openLegalUrl(path),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: DuetColors.surfaceElevated,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: DuetColors.border, width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: DuetColors.textPrimary,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(Icons.arrow_outward_rounded, size: 11, color: DuetColors.primary),
          ],
        ),
      ),
    );
  }
}
