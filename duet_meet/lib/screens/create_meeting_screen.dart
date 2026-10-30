import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../theme.dart';
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
      appBar: AppBar(
        backgroundColor: DuetColors.appBg,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: DuetColors.textPrimary),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Create a meeting',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: DuetColors.textPrimary,
          ),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: _createdRoom == null ? _buildCreateForm() : _buildSuccessCard(),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCreateForm() {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: DuetMorphism.cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: DuetMorphism.iconContainer,
                child: const Icon(Icons.add_link_rounded, color: DuetColors.primary, size: 24),
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
                        fontWeight: FontWeight.bold,
                        color: DuetColors.textPrimary,
                        letterSpacing: -0.2,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Multi-screen sharing enabled',
                      style: TextStyle(
                        fontSize: 12,
                        color: DuetColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Host Name Input
          const Text(
            'YOUR DISPLAY NAME',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: DuetColors.textSecondary,
              letterSpacing: 0.8,
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _nameController,
            style: const TextStyle(fontSize: 14, color: DuetColors.textPrimary),
            decoration: const InputDecoration(
              hintText: 'e.g. Alex (Host)',
              prefixIcon: Icon(Icons.person_outline_rounded, size: 18, color: DuetColors.textTertiary),
            ),
          ),

          if (_error != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: DuetColors.danger.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: DuetColors.danger.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline_rounded, size: 18, color: DuetColors.danger),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      _error!,
                      style: const TextStyle(fontSize: 12, color: DuetColors.danger),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 24),

          // Submit CTA
          ElevatedButton(
            onPressed: _loading ? null : _createMeeting,
            child: _loading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  )
                : const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Start instant meeting'),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, size: 18),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuccessCard() {
    final code = _createdRoom!['code'] as String;
    final inviteLink = '${widget.serverUrl.replaceAll(RegExp(r'/+$'), '')}/join?code=$code';

    return Container(
      padding: const EdgeInsets.all(28),
      decoration: DuetMorphism.cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Green Success Icon
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
                fontWeight: FontWeight.bold,
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
                fontSize: 13,
                color: DuetColors.textSecondary,
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Monospace Code Box
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
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
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

          const SizedBox(height: 14),

          // Copy Link Button
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 13),
              side: const BorderSide(color: DuetColors.border),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            icon: const Icon(Icons.link_rounded, size: 18, color: DuetColors.textSecondary),
            label: const Text(
              'Copy invitation link',
              style: TextStyle(fontSize: 13, color: DuetColors.textSecondary, fontWeight: FontWeight.w600),
            ),
            onPressed: () => _copyToClipboard(inviteLink, 'Invitation link copied to clipboard'),
          ),

          const SizedBox(height: 24),

          // Enter Meeting CTA
          ElevatedButton(
            onPressed: _enterMeeting,
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Enter meeting room'),
                SizedBox(width: 8),
                Icon(Icons.arrow_forward_rounded, size: 18),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
