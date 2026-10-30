import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../theme.dart';
import '../widgets/duet_button.dart';
import 'meeting_screen.dart';

class JoinMeetingScreen extends StatefulWidget {
  final String serverUrl;
  final String? initialCode;

  const JoinMeetingScreen({
    super.key,
    required this.serverUrl,
    this.initialCode,
  });

  @override
  State<JoinMeetingScreen> createState() => _JoinMeetingScreenState();
}

class _JoinMeetingScreenState extends State<JoinMeetingScreen> {
  late final TextEditingController _codeController;
  final _nameController = TextEditingController(text: 'Guest');
  bool _loading = false;
  String? _error;

  // Zoom & Google Meet Join Options
  bool _muteMicOnJoin = false;
  bool _turnOffVideoOnJoin = true;

  @override
  void initState() {
    super.initState();
    _codeController = TextEditingController(text: widget.initialCode ?? '');
    _codeController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _codeController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  /// Extracts meeting code from pasted URL, deep-link, or raw code string
  String _parseMeetingCode(String input) {
    final trimmed = input.trim();
    if (trimmed.isEmpty) return '';

    // Handle full URLs with query parameter e.g. https://duetxmeet.vercel.app/join?code=ABC-DEF-GHI
    try {
      final uri = Uri.parse(trimmed);
      if (uri.queryParameters.containsKey('code')) {
        return uri.queryParameters['code']!.toUpperCase();
      }
      // Handle duet://meet/ABC-DEF-GHI or duet://join?code=...
      if (uri.scheme == 'duet') {
        if (uri.pathSegments.isNotEmpty) {
          return uri.pathSegments.last.toUpperCase();
        }
      }
      // Handle path /room/ABC-DEF-GHI
      if (uri.pathSegments.contains('room') || uri.pathSegments.contains('lobby')) {
        return uri.pathSegments.last.toUpperCase();
      }
    } catch (_) {}

    // Check regex pattern for XXX-XXXX-XXX or XXX-XXX-XXX
    final match = RegExp(r'[A-Za-z0-9]{3,4}-[A-Za-z0-9]{3,4}-[A-Za-z0-9]{3,4}').firstMatch(trimmed);
    if (match != null) {
      return match.group(0)!.toUpperCase();
    }

    return trimmed.toUpperCase();
  }

  Future<void> _pasteFromClipboard() async {
    final data = await Clipboard.getData('text/plain');
    if (data?.text != null && data!.text!.isNotEmpty) {
      final parsed = _parseMeetingCode(data.text!);
      _codeController.text = parsed;
      _codeController.selection = TextSelection.fromPosition(
        TextPosition(offset: parsed.length),
      );
    }
  }

  Future<void> _join() async {
    final rawInput = _codeController.text;
    final code = _parseMeetingCode(rawInput);

    if (code.isEmpty) {
      setState(() => _error = 'Please enter a meeting code or invitation link.');
      return;
    }

    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final base = widget.serverUrl.replaceAll(RegExp(r'/+$'), '');
      final name = _nameController.text.trim().isEmpty ? 'Guest' : _nameController.text.trim();

      final res = await http.post(
        Uri.parse('$base/api/token'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'code': code,
          'name': name,
        }),
      );

      if (res.statusCode != 200) {
        throw Exception('Meeting not found or unable to join (${res.statusCode}).');
      }

      final data = jsonDecode(res.body) as Map<String, dynamic>;
      if (!mounted) return;

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => MeetingPage(
            code: code,
            url: data['url'] as String,
            token: data['token'] as String,
            name: name,
            isHost: data['isHost'] == true,
            hostToken: data['hostToken'] as String?,
            initialMicOn: !_muteMicOnJoin,
            initialCamOn: !_turnOffVideoOnJoin,
          ),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasCode = _codeController.text.trim().isNotEmpty;

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
        title: const Text(
          'Join a meeting',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: DuetColors.textPrimary,
          ),
        ),
        actions: [
          // Google Meet Style Top-Right Instant Join Action
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: TextButton(
              onPressed: hasCode && !_loading ? _join : null,
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
                      'Join',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                    ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Guidance text (Google Meet style)
                    const Text(
                      'Enter the code or link provided by the meeting organizer',
                      style: TextStyle(
                        fontSize: 14,
                        color: DuetColors.textSecondary,
                        height: 1.45,
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Meeting Code or Link Input
                    const Text(
                      'MEETING CODE OR LINK',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: DuetColors.textSecondary,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: DuetColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: DuetColors.border),
                      ),
                      child: TextField(
                        controller: _codeController,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          fontFamily: 'monospace',
                          color: DuetColors.textPrimary,
                          letterSpacing: 1.5,
                        ),
                        textCapitalization: TextCapitalization.characters,
                        decoration: InputDecoration(
                          hintText: 'e.g. ABC-DEF-GHI or paste link',
                          hintStyle: const TextStyle(
                            fontSize: 14,
                            fontFamily: 'Outfit',
                            letterSpacing: 0,
                            color: DuetColors.textTertiary,
                          ),
                          prefixIcon: const Icon(LucideIcons.keyboard, size: 20, color: DuetColors.textSecondary),
                          suffixIcon: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              if (hasCode)
                                IconButton(
                                  icon: const Icon(LucideIcons.x, size: 16, color: DuetColors.textTertiary),
                                  onPressed: () => _codeController.clear(),
                                  tooltip: 'Clear',
                                ),
                              IconButton(
                                icon: const Icon(LucideIcons.clipboard, size: 18, color: DuetColors.primaryGlow),
                                onPressed: _pasteFromClipboard,
                                tooltip: 'Paste from clipboard',
                              ),
                              const SizedBox(width: 4),
                            ],
                          ),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                        onChanged: (val) {
                          if (val.contains('http') || val.contains('duet://') || val.contains('?code=')) {
                            final parsed = _parseMeetingCode(val);
                            if (parsed.isNotEmpty && parsed != val) {
                              _codeController.text = parsed;
                              _codeController.selection = TextSelection.fromPosition(
                                TextPosition(offset: parsed.length),
                              );
                            }
                          }
                        },
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Your Display Name Input
                    const Text(
                      'YOUR NAME',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: DuetColors.textSecondary,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: DuetColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: DuetColors.border),
                      ),
                      child: TextField(
                        controller: _nameController,
                        style: const TextStyle(fontSize: 15, color: DuetColors.textPrimary, fontWeight: FontWeight.w500),
                        decoration: const InputDecoration(
                          hintText: 'e.g. Alex',
                          prefixIcon: Icon(LucideIcons.user, size: 20, color: DuetColors.textSecondary),
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
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

                    // Zoom & Google Meet Style "JOIN OPTIONS" Section
                    const Text(
                      'JOIN OPTIONS',
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
                              "Don't connect to audio",
                              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: DuetColors.textPrimary),
                            ),
                            subtitle: const Text(
                              'Microphone will be muted upon joining',
                              style: TextStyle(fontSize: 12, color: DuetColors.textSecondary),
                            ),
                            value: _muteMicOnJoin,
                            activeTrackColor: DuetColors.primary,
                            onChanged: (val) => setState(() => _muteMicOnJoin = val),
                          ),
                          Divider(height: 1, color: DuetColors.border.withValues(alpha: 0.5)),
                          SwitchListTile.adaptive(
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            title: const Text(
                              'Turn off my video',
                              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: DuetColors.textPrimary),
                            ),
                            subtitle: const Text(
                              'Camera will be off upon joining',
                              style: TextStyle(fontSize: 12, color: DuetColors.textSecondary),
                            ),
                            value: _turnOffVideoOnJoin,
                            activeTrackColor: DuetColors.primary,
                            onChanged: (val) => setState(() => _turnOffVideoOnJoin = val),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),

            // Full-Width Bottom CTA Action
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 8, 24, 20),
              child: DuetButton(
                text: 'Join meeting',
                icon: LucideIcons.video,
                loading: _loading,
                onPressed: _join,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
