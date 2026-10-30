import 'package:flutter/material.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import '../theme.dart';
import '../widgets/settings_sheet.dart';
import 'create_meeting_screen.dart';
import 'join_meeting_screen.dart';

class HomeScreen extends StatefulWidget {
  final String serverUrl;
  final ValueChanged<String> onServerUrlChanged;

  const HomeScreen({
    super.key,
    required this.serverUrl,
    required this.onServerUrlChanged,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int? _pressedIndex;

  void _openSettings() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => SettingsSheet(
        currentServerUrl: widget.serverUrl,
        onServerUrlChanged: widget.onServerUrlChanged,
      ),
    );
  }

  void _navigateToCreate() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => CreateMeetingScreen(serverUrl: widget.serverUrl),
      ),
    );
  }

  void _navigateToJoin([String? code]) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => JoinMeetingScreen(
          serverUrl: widget.serverUrl,
          initialCode: code,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: DuetColors.appBg,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: constraints.maxHeight,
                ),
                child: Align(
                  alignment: Alignment.topCenter,
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 480),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const SizedBox(height: 16),
                        _buildHeader(),
                        const SizedBox(height: 52),
                        _buildHeroSection(),
                        const SizedBox(height: 40),
                        _buildActionCard(
                          index: 0,
                          icon: LucideIcons.link,
                          title: 'Create link',
                          description: 'Start an instant call',
                          onTap: _navigateToCreate,
                        ),
                        const SizedBox(height: 14),
                        _buildActionCard(
                          index: 1,
                          icon: LucideIcons.log_in,
                          title: 'Join a call',
                          description: 'Enter a code or link',
                          onTap: _navigateToJoin,
                        ),
                        const SizedBox(height: 48),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  /// Header
  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: DuetColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: DuetColors.border),
              ),
              padding: const EdgeInsets.all(6),
              child: Image.asset(
                'assets/logo.png',
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => const Icon(
                  LucideIcons.video,
                  size: 22,
                  color: DuetColors.primary,
                ),
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Duet',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: DuetColors.textPrimary,
                    letterSpacing: -0.3,
                    height: 1.1,
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  'Call. Share. Do together.',
                  style: TextStyle(
                    fontSize: 12,
                    color: DuetColors.textTertiary,
                  ),
                ),
              ],
            ),
          ],
        ),
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: const Color(0xFF151B2C),
            borderRadius: BorderRadius.circular(14),
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
              borderRadius: BorderRadius.circular(14),
              onTap: _openSettings,
              child: const Center(
                child: Icon(
                  LucideIcons.settings,
                  size: 20,
                  color: DuetColors.textSecondary,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// Hero Section
  Widget _buildHeroSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: DuetColors.surface,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: DuetColors.border),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(LucideIcons.sparkles, size: 14, color: DuetColors.primaryGlow),
                  SizedBox(width: 6),
                  Text(
                    'Multi-screen sharing',
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
        const SizedBox(height: 18),
        const Text(
          'Meet without\nlimits',
          style: TextStyle(
            fontSize: 38,
            fontWeight: FontWeight.w600,
            color: DuetColors.textPrimary,
            letterSpacing: -1.4,
            height: 1.05,
          ),
        ),
        const SizedBox(height: 14),
        const Text(
          'No account needed. Start or join a call instantly with a clean, modern space built for sharing.',
          style: TextStyle(
            fontSize: 16,
            color: DuetColors.textSecondary,
            height: 1.8,
          ),
        ),
      ],
    );
  }

  /// Action Card
  Widget _buildActionCard({
    required int index,
    required IconData icon,
    required String title,
    required String description,
    required VoidCallback onTap,
  }) {
    final isPressed = _pressedIndex == index;

    return AnimatedScale(
      scale: isPressed ? 0.99 : 1.0,
      duration: const Duration(milliseconds: 140),
      curve: Curves.easeOutCubic,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTapDown: (_) => setState(() => _pressedIndex = index),
          onTapUp: (_) => setState(() => _pressedIndex = null),
          onTapCancel: () => setState(() => _pressedIndex = null),
          onTap: onTap,
          child: Container(
            height: 112,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              color: const Color(0xFF151B2C),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: DuetColors.border),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x66000000),
                  offset: Offset(10, 10),
                  blurRadius: 24,
                  spreadRadius: -10,
                ),
                BoxShadow(
                  color: Color(0x12FFFFFF),
                  offset: Offset(-6, -6),
                  blurRadius: 16,
                  spreadRadius: -10,
                ),
              ],
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1C2235),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: DuetColors.primaryBorder),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x663B82F6),
                        offset: Offset(6, 6),
                        blurRadius: 14,
                        spreadRadius: -8,
                      ),
                      BoxShadow(
                        color: Color(0x10FFFFFF),
                        offset: Offset(-4, -4),
                        blurRadius: 10,
                        spreadRadius: -8,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      icon,
                      color: DuetColors.primaryGlow,
                      size: 22,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w600,
                          color: DuetColors.textPrimary,
                          letterSpacing: -0.2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: const TextStyle(
                          fontSize: 14,
                          color: DuetColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                const Icon(
                  LucideIcons.arrow_right,
                  color: DuetColors.textTertiary,
                  size: 18,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
