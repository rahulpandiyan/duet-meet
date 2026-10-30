import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../theme.dart';
import '../widgets/duet_button.dart';
import 'meeting_screen.dart';

class CreateMeetingScreen extends StatefulWidget {
  final String serverUrl;

  const CreateMeetingScreen({
    super.key,
    required this.serverUrl,
  });

  @override
  State<CreateMeetingScreen> createState() => _CreateMeetingScreenState();
}

class _CreateMeetingScreenState extends State<CreateMeetingScreen> {
  final _nameController = TextEditingController(text: 'Host');
  bool _loading = false;
  String? _error;

  // Zoom & Google Meet options
  bool _startWithMic = true;
  bool _startWithCam = true;

  // Created room data
  Map<String, dynamic>? _createdRoom;
  bool _copied = false;

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  Future<void> _createMeeting() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final base = widget.serverUrl.replaceAll(RegExp(r'/+$'), '');
      final res = await http.post(
        Uri.parse('$base/api/rooms'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'hostName': _nameController.text.trim().isEmpty ? 'Host' : _nameController.text.trim(),
        }),
      );

      if (res.statusCode != 200) {
        throw Exception('Failed to create room (${res.statusCode}): ${res.body}');
      }

      final data = jsonDecode(res.body) as Map<String, dynamic>;
      if (!mounted) return;

      setState(() {
        _createdRoom = data;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _copyToClipboard(String text, String message) {
    Clipboard.setData(ClipboardData(text: text));
    setState(() => _copied = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: const Duration(seconds: 2),
        backgroundColor: DuetColors.surfaceElevated,
      ),
    );
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  void _enterMeeting() {
    if (_createdRoom == null) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => MeetingPage(
          code: _createdRoom!['code'] as String,
          url: _createdRoom!['url'] as String,
          token: _createdRoom!['token'] as String,
          name: _nameController.text.trim().isEmpty ? 'Host' : _nameController.text.trim(),
          isHost: true,
          hostToken: _createdRoom!['hostToken'] as String?,
          initialMicOn: _startWithMic,
          initialCamOn: _startWithCam,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DuetColors.appBg,
      appBar: AppBar(
        backgroundColor: DuetColors.appBg,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.only(left: 16),
          child: Center(
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: DuetColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: DuetColors.border),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(12),
                  onTap: () => Navigator.of(context).pop(),
                  child: const Icon(LucideIcons.arrow_left, color: DuetColors.textPrimary, size: 20),
                ),
              ),
            ),
          ),
        ),
        title: Text(
          _createdRoom == null ? 'New meeting' : 'Meeting ready',
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: DuetColors.textPrimary,
          ),
        ),
        actions: [
          if (_createdRoom == null)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: TextButton(
                onPressed: !_loading ? _createMeeting : null,
                style: TextButton.styleFrom(
                  foregroundColor: DuetColors.primaryGlow,
                  disabledForegroundColor: DuetColors.textTertiary.withValues(alpha: 0.5),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                ),
                child: _loading
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2, color: DuetColors.primary),
                      )
                    : const Text(
                        'Start',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                      ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: _createdRoom == null ? _buildFormView() : _buildReadyView(),
      ),
    );
  }

  Widget _buildFormView() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Google Meet / Zoom style guidance subtitle
                const Text(
                  'Start an instant meeting with multi-screen sharing and live WebRTC streaming.',
                  style: TextStyle(
                    fontSize: 14,
                    color: DuetColors.textSecondary,
                    height: 1.45,
                  ),
                ),

                const SizedBox(height: 24),

                // Host Display Name Input
                const Text(
                  'YOUR DISPLAY NAME',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: DuetColors.textSecondary,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _nameController,
                  style: const TextStyle(fontSize: 15, color: DuetColors.textPrimary, fontWeight: FontWeight.w500),
                  decoration: const InputDecoration(
                    hintText: 'e.g. Alex (Host)',
                    hintStyle: TextStyle(
                      fontSize: 14,
                      color: DuetColors.textTertiary,
                    ),
                    prefixIcon: Icon(LucideIcons.user, size: 19, color: DuetColors.textSecondary),
                  ),
                ),

                if (_error != null) ...[
                  const SizedBox(height: 18),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: DuetColors.danger.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: DuetColors.danger.withValues(alpha: 0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(LucideIcons.circle_alert, size: 20, color: DuetColors.danger),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            _error!,
                            style: const TextStyle(fontSize: 13, color: Colors.white, height: 1.3),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

                const SizedBox(height: 32),

                // Zoom & Google Meet Style "MEETING OPTIONS" Section
                const Text(
                  'MEETING OPTIONS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: DuetColors.textSecondary,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 10),
                Material(
                  color: DuetColors.surface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                    side: const BorderSide(color: DuetColors.border),
                  ),
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    children: [
                      SwitchListTile.adaptive(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        title: const Text(
                          'Start with microphone on',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: DuetColors.textPrimary),
                        ),
                        subtitle: const Text(
                          'You can mute anytime during the call',
                          style: TextStyle(fontSize: 12, color: DuetColors.textSecondary),
                        ),
                        value: _startWithMic,
                        activeTrackColor: DuetColors.primary,
                        onChanged: (val) => setState(() => _startWithMic = val),
                      ),
                      Divider(height: 1, color: DuetColors.border.withValues(alpha: 0.5)),
                      SwitchListTile.adaptive(
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        title: const Text(
                          'Start with video on',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: DuetColors.textPrimary),
                        ),
                        subtitle: const Text(
                          'You can toggle camera anytime during the call',
                          style: TextStyle(fontSize: 12, color: DuetColors.textSecondary),
                        ),
                        value: _startWithCam,
                        activeTrackColor: DuetColors.primary,
                        onChanged: (val) => setState(() => _startWithCam = val),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
              ],
            ),
          ),
        ),

        // Bottom CTA with tactile Neumorphism + Claymorphism combo
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 20),
          child: DuetButton(
            text: 'Start instant meeting',
            icon: LucideIcons.video,
            loading: _loading,
            onPressed: _createMeeting,
          ),
        ),
      ],
    );
  }

  Widget _buildReadyView() {
    final code = _createdRoom!['code'] as String;
    final inviteLink = '${widget.serverUrl.replaceAll(RegExp(r'/+$'), '')}/join?code=$code';

    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Top Google Meet Style Heading
                const Text(
                  "Here's the link to your meeting",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    color: DuetColors.textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Copy this link and send it to people you want to meet with. Be sure to save it so you can use it later, too.',
                  style: TextStyle(
                    fontSize: 14,
                    color: DuetColors.textSecondary,
                    height: 1.45,
                  ),
                ),

                const SizedBox(height: 28),

                // Meeting Code Display Box
                const Text(
                  'MEETING CODE',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: DuetColors.textSecondary,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: DuetColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: DuetColors.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.hash, size: 20, color: DuetColors.primaryGlow),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          code,
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.5,
                            color: DuetColors.textPrimary,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          _copied ? LucideIcons.check : LucideIcons.copy,
                          color: _copied ? DuetColors.success : DuetColors.primaryGlow,
                          size: 19,
                        ),
                        onPressed: () => _copyToClipboard(code, 'Meeting code copied to clipboard'),
                        tooltip: 'Copy code',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 18),

                // Full Link Box
                const Text(
                  'INVITATION LINK',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: DuetColors.textSecondary,
                    letterSpacing: 0.8,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: DuetColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: DuetColors.border),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.link, size: 18, color: DuetColors.textSecondary),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          inviteLink,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 13,
                            color: DuetColors.textSecondary,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          _copied ? LucideIcons.check : LucideIcons.copy,
                          color: _copied ? DuetColors.success : DuetColors.primaryGlow,
                          size: 19,
                        ),
                        onPressed: () => _copyToClipboard(inviteLink, 'Invitation link copied to clipboard'),
                        tooltip: 'Copy link',
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // Secondary CTA: Copy Link
                DuetButton(
                  text: 'Copy invitation link',
                  icon: LucideIcons.copy,
                  variant: DuetButtonVariant.secondary,
                  onPressed: () => _copyToClipboard(inviteLink, 'Invitation link copied to clipboard'),
                ),

                const SizedBox(height: 36),

                // Security Note
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(LucideIcons.shield_check, size: 15, color: DuetColors.textTertiary.withValues(alpha: 0.8)),
                    const SizedBox(width: 6),
                    const Text(
                      'Secured with WebRTC peer-to-peer encryption',
                      style: TextStyle(
                        fontSize: 12,
                        color: DuetColors.textTertiary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        // Bottom CTA: Enter Meeting Room
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 20),
          child: DuetButton(
            text: 'Enter meeting room',
            icon: LucideIcons.arrow_right,
            onPressed: _enterMeeting,
          ),
        ),
      ],
    );
  }
}
