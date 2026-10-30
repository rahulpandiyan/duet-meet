import 'package:flutter/material.dart';
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
        child: Stack(
          children: [
            // Subtle, faint ambient background decoration circles near bottom
            Positioned(
              bottom: -60,
              right: -50,
              child: IgnorePointer(
                child: Container(
                  width: 240,
                  height: 240,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: DuetColors.primaryBorder.withValues(alpha: 0.35),
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 80,
              left: -40,
              child: IgnorePointer(
                child: Container(
                  width: 180,
                  height: 180,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: DuetColors.primaryTint.withValues(alpha: 0.5),
                  ),
                ),
              ),
            ),

            // Main Content Layout
            LayoutBuilder(
              builder: (context, constraints) {
                return SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight - 24,
                    ),
                    child: Center(
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 480),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // 3.A Header
                            _buildHeader(),

                            const SizedBox(height: 36),

                            // 3.B Hero Section
                            _buildHeroSection(),

                            const SizedBox(height: 36),

                            // 3.C Exactly TWO Primary Action Cards
                            _buildActionCard(
                              index: 0,
                              icon: Icons.link_rounded,
                              title: 'Create link',
                              description: 'Start an instant call.',
                              onTap: _navigateToCreate,
                            ),

                            const SizedBox(height: 16),

                            _buildActionCard(
                              index: 1,
                              icon: Icons.login_rounded,
                              title: 'Join a call',
                              description: 'Enter a code or link.',
                              onTap: _navigateToJoin,
                            ),

                            const SizedBox(height: 32),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  /// 3.A Header: Logo + Duet + Tagline on left, Settings on right
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.only(top: 6, bottom: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Left: Logo + Wordmark + Tagline
          Row(
            children: [
              // Duet Logo Mark
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: DuetColors.border, width: 1),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x0A0F172A),
                      offset: Offset(0, 2),
                      blurRadius: 4,
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(5),
                child: Image.asset(
                  'assets/logo.png',
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.devices_rounded,
                    size: 20,
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
                      fontSize: 19,
                      fontWeight: FontWeight.w800,
                      color: DuetColors.textPrimary,
                      letterSpacing: -0.4,
                      height: 1.1,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Call. Share. Do together.',
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w500,
                      color: DuetColors.textSecondary,
                      letterSpacing: -0.1,
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Right: Small Settings icon button
          Material(
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
              side: const BorderSide(color: DuetColors.border, width: 1),
            ),
            elevation: 0,
            child: InkWell(
              borderRadius: BorderRadius.circular(10),
              onTap: _openSettings,
              child: const SizedBox(
                width: 38,
                height: 38,
                child: Center(
                  child: Icon(
                    Icons.settings_outlined,
                    size: 19,
                    color: DuetColors.textSecondary,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// 3.B Hero Section: "Meet without limits" + supporting text
  Widget _buildHeroSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        Text(
          'Meet without limits',
          style: TextStyle(
            fontSize: 27,
            fontWeight: FontWeight.w800,
            color: DuetColors.textPrimary,
            letterSpacing: -0.6,
            height: 1.2,
          ),
        ),
        SizedBox(height: 10),
        Text(
          'No account needed. Start or join a call instantly.',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: DuetColors.textSecondary,
            height: 1.45,
          ),
        ),
      ],
    );
  }

  /// 3.C Primary Action Card with 58px soft clay icon container and far-right aligned arrow
  Widget _buildActionCard({
    required int index,
    required IconData icon,
    required String title,
    required String description,
    required VoidCallback onTap,
  }) {
    final isPressed = _pressedIndex == index;

    return AnimatedScale(
      scale: isPressed ? 0.985 : 1.0,
      duration: const Duration(milliseconds: 100),
      curve: Curves.easeOutCubic,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTapDown: (_) => setState(() => _pressedIndex = index),
          onTapUp: (_) => setState(() => _pressedIndex = null),
          onTapCancel: () => setState(() => _pressedIndex = null),
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            decoration: DuetMorphism.cardDecoration(isPressed: isPressed),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // 3.D Soft Claymorphic Icon Container (58px)
                Container(
                  width: 58,
                  height: 58,
                  decoration: DuetMorphism.iconContainer,
                  child: Center(
                    child: Icon(
                      icon,
                      color: DuetColors.primary,
                      size: 27,
                    ),
                  ),
                ),

                const SizedBox(width: 18),

                // Card Title & Description
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w700,
                          color: DuetColors.textPrimary,
                          letterSpacing: -0.2,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                          color: DuetColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(width: 12),

                // 3.E Exactly aligned far-right arrow
                const Icon(
                  Icons.arrow_forward_rounded,
                  color: DuetColors.textTertiary,
                  size: 22,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
