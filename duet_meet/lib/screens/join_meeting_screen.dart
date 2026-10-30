import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
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

  @override
  void initState() {
    super.initState();
    _codeController = TextEditingController(text: widget.initialCode ?? '');
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

  Future<void> _join() async {
    final rawInput = _codeController.text;
    final code = _parseMeetingCode(rawInput);

    if (code.isEmpty) {
      setState(() => _error = 'Please enter a valid meeting code or link.');
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
          'Join a call',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: DuetColors.textPrimary,
          ),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: DuetColors.surface,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: DuetColors.border),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x080F172A),
                      offset: Offset(0, 6),
                      blurRadius: 18,
                    ),
                    BoxShadow(
                      color: Color(0x030F172A),
                      offset: Offset(0, 1),
                      blurRadius: 4,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Icon & Header
                    Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: DuetColors.primaryTint,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: DuetColors.primaryBorder),
                          ),
                          child: const Icon(Icons.login_rounded, color: DuetColors.primary, size: 24),
                        ),
                        const SizedBox(width: 14),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Enter call details',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: DuetColors.textPrimary,
                                  letterSpacing: -0.2,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                'Join with code or pasted invite link',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: DuetColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Meeting Code / Link Input
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
                    TextField(
                      controller: _codeController,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        fontFamily: 'monospace',
                        color: DuetColors.textPrimary,
                      ),
                      textCapitalization: TextCapitalization.characters,
                      decoration: const InputDecoration(
                        hintText: 'e.g. ABC-DEF-GHI or paste link',
                        prefixIcon: Icon(Icons.tag_rounded, size: 18, color: DuetColors.textTertiary),
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

                    const SizedBox(height: 18),

                    // Display Name Input
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
                      style: const TextStyle(fontSize: 14, color: DuetColors.textPrimary),
                      decoration: const InputDecoration(
                        hintText: 'e.g. Alex',
                        prefixIcon: Icon(Icons.person_outline_rounded, size: 18, color: DuetColors.textTertiary),
                      ),
                    ),

                    if (_error != null) ...[
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: DuetColors.danger.withValues(alpha: 0.08),
                          borderRadius: BorderRadius.circular(12),
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

                    // Join Button with combo of Neumorphism & Claymorphism
                    DuetButton(
                      text: 'Join call',
                      icon: Icons.arrow_forward_rounded,
                      loading: _loading,
                      onPressed: _join,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
