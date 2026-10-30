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
        throw Exception('Failed to create room: ${res.body}');
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
        backgroundColor: DuetColors.textPrimary,
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
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DuetColors.appBg,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Row(
                children: [
                  Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: DuetColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: DuetColors.border),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x66000000),
                          offset: Offset(6, 6),
                          blurRadius: 12,
                          spreadRadius: -6,
                        ),
                        BoxShadow(
                          color: Color(0x12FFFFFF),
                          offset: Offset(-4, -4),
                          blurRadius: 10,
                          spreadRadius: -6,
                        ),
                      ],
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
                  const SizedBox(width: 12),
                  const Text(
                    'Create a meeting',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: DuetColors.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 440),
                    child: _createdRoom == null ? _buildCreateForm() : _buildSuccessCard(),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreateForm() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: DuetColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: DuetColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x66000000),
            offset: Offset(12, 12),
            blurRadius: 28,
            spreadRadius: -12,
          ),
          BoxShadow(
            color: Color(0x12FFFFFF),
            offset: Offset(-6, -6),
            blurRadius: 18,
            spreadRadius: -12,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: DuetColors.surfaceElevated,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: DuetColors.primaryBorder),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x66000000),
                      offset: Offset(4, 4),
                      blurRadius: 10,
                      spreadRadius: -4,
                    ),
                    BoxShadow(
                      color: Color(0x0FFFFFFF),
                      offset: Offset(-2, -2),
                      blurRadius: 6,
                      spreadRadius: -2,
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.link, color: DuetColors.primaryGlow, size: 22),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Instant meeting',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: DuetColors.textPrimary,
                        letterSpacing: -0.2,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Multi-screen sharing enabled',
                      style: TextStyle(
                        fontSize: 14,
                        color: DuetColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 26),

          const Text(
            'YOUR DISPLAY NAME',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: DuetColors.textSecondary,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _nameController,
            style: const TextStyle(fontSize: 14, color: DuetColors.textPrimary),
            decoration: const InputDecoration(
              hintText: 'e.g. Alex (Host)',
              prefixIcon: Icon(LucideIcons.user, size: 18, color: DuetColors.textTertiary),
            ),
          ),

          if (_error != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: DuetColors.danger.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: DuetColors.danger.withValues(alpha: 0.4)),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.circle_alert, size: 18, color: DuetColors.danger),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _error!,
                      style: const TextStyle(fontSize: 12, color: DuetColors.textSecondary),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 24),

          // Start meeting CTA with combo of Neumorphism & Claymorphism
          DuetButton(
            text: 'Start instant meeting',
            icon: LucideIcons.arrow_right,
            loading: _loading,
            onPressed: _createMeeting,
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessCard() {
    final code = _createdRoom!['code'] as String;
    final inviteLink = '${widget.serverUrl.replaceAll(RegExp(r'/+$'), '')}/join?code=$code';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: DuetColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: DuetColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x66000000),
            offset: Offset(8, 8),
            blurRadius: 20,
            spreadRadius: -6,
          ),
          BoxShadow(
            color: Color(0x10FFFFFF),
            offset: Offset(-4, -4),
            blurRadius: 12,
            spreadRadius: -6,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Success Icon
          Center(
            child: Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: DuetColors.success.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle_rounded, color: DuetColors.success, size: 30),
            ),
          ),

          const SizedBox(height: 16),
          const Center(
            child: Text(
              'Your meeting is ready',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: DuetColors.textPrimary,
                letterSpacing: -0.3,
              ),
            ),
          ),
          const SizedBox(height: 4),
          const Center(
            child: Text(
              'Share this code or link with others to join.',
              style: TextStyle(
                fontSize: 14,
                color: DuetColors.textSecondary,
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Code Box
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: DuetColors.appBg,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: DuetColors.border),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  code,
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 2,
                    color: DuetColors.textPrimary,
                  ),
                ),
                IconButton(
                  icon: Icon(
                    _copied ? Icons.check_rounded : Icons.copy_rounded,
                    color: _copied ? DuetColors.success : DuetColors.primary,
                    size: 20,
                  ),
                  onPressed: () => _copyToClipboard(code, 'Meeting code copied to clipboard'),
                  tooltip: 'Copy code',
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Copy Link Button with subtle secondary Neumorphic + Claymorphic depth
          DuetButton(
            text: 'Copy invitation link',
            icon: Icons.link_rounded,
            variant: DuetButtonVariant.secondary,
            onPressed: () => _copyToClipboard(inviteLink, 'Invitation link copied to clipboard'),
          ),

          const SizedBox(height: 14),

          // Enter Meeting CTA with primary Neumorphic + Claymorphic styling
          DuetButton(
            text: 'Enter meeting room',
            icon: LucideIcons.arrow_right,
            onPressed: _enterMeeting,
          ),
        ],
      ),
    );
  }
}
