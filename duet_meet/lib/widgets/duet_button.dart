import 'package:flutter/material.dart';
import '../theme.dart';

enum DuetButtonVariant {
  primary,
  secondary,
  danger,
}

/// A tactile Neumorphism + Claymorphism button
/// Features subtle clay-like volume, specular gradient, ambient dual shadows,
/// and smooth tactile pressed depression.
class DuetButton extends StatefulWidget {
  final String text;
  final IconData? icon;
  final VoidCallback? onPressed;
  final bool loading;
  final DuetButtonVariant variant;
  final double height;
  final BorderRadius? borderRadius;

  const DuetButton({
    super.key,
    required this.text,
    this.icon,
    this.onPressed,
    this.loading = false,
    this.variant = DuetButtonVariant.primary,
    this.height = 52.0,
    this.borderRadius,
  });

  @override
  State<DuetButton> createState() => _DuetButtonState();
}

class _DuetButtonState extends State<DuetButton> {
  bool _isPressed = false;

  bool get _isEnabled => widget.onPressed != null && !widget.loading;

  @override
  Widget build(BuildContext context) {
    final radius = widget.borderRadius ?? BorderRadius.circular(16);

    // Color definitions based on variant
    final List<Color> gradientColors;
    final Color topBorderColor;
    final List<BoxShadow> shadows;
    final Color textColor;
    final Color iconColor;

    switch (widget.variant) {
      case DuetButtonVariant.primary:
        gradientColors = _isPressed
            ? const [Color(0xFF2563EB), Color(0xFF1D4ED8)]
            : const [Color(0xFF3B82F6), Color(0xFF1D4ED8)];
        topBorderColor = const Color(0x6693C5FD);
        textColor = Colors.white;
        iconColor = Colors.white;
        shadows = _isPressed
            ? const [
                BoxShadow(
                  color: Color(0x401D4ED8),
                  offset: Offset(0, 3),
                  blurRadius: 8,
                ),
                BoxShadow(
                  color: Color(0x66000000),
                  offset: Offset(2, 3),
                  blurRadius: 6,
                ),
              ]
            : const [
                // Soft blue clay glow
                BoxShadow(
                  color: Color(0x662563EB),
                  offset: Offset(0, 8),
                  blurRadius: 20,
                  spreadRadius: -2,
                ),
                // Dark neumorphic base shadow
                BoxShadow(
                  color: Color(0x80000000),
                  offset: Offset(6, 8),
                  blurRadius: 16,
                  spreadRadius: -4,
                ),
                // Top-left soft specular glow
                BoxShadow(
                  color: Color(0x2660A5FA),
                  offset: Offset(-2, -2),
                  blurRadius: 6,
                  spreadRadius: 0,
                ),
              ];
        break;

      case DuetButtonVariant.secondary:
        gradientColors = _isPressed
            ? const [Color(0xFF1E1E20), Color(0xFF18181A)]
            : const [Color(0xFF26262A), Color(0xFF1E1E20)];
        topBorderColor = const Color(0x33FFFFFF);
        textColor = DuetColors.textPrimary;
        iconColor = DuetColors.primaryGlow;
        shadows = _isPressed
            ? const [
                BoxShadow(
                  color: Color(0x66000000),
                  offset: Offset(2, 2),
                  blurRadius: 6,
                ),
              ]
            : const [
                BoxShadow(
                  color: Color(0x80000000),
                  offset: Offset(6, 6),
                  blurRadius: 16,
                  spreadRadius: -4,
                ),
                BoxShadow(
                  color: Color(0x0FFFFFFF),
                  offset: Offset(-2, -2),
                  blurRadius: 8,
                  spreadRadius: -2,
                ),
              ];
        break;

      case DuetButtonVariant.danger:
        gradientColors = _isPressed
            ? const [Color(0xFFDC2626), Color(0xFFB91C1C)]
            : const [Color(0xFFEF4444), Color(0xFFDC2626)];
        topBorderColor = const Color(0x66FCA5A5);
        textColor = Colors.white;
        iconColor = Colors.white;
        shadows = _isPressed
            ? const [
                BoxShadow(
                  color: Color(0x40DC2626),
                  offset: Offset(0, 3),
                  blurRadius: 8,
                ),
              ]
            : const [
                BoxShadow(
                  color: Color(0x66EF4444),
                  offset: Offset(0, 8),
                  blurRadius: 18,
                  spreadRadius: -2,
                ),
                BoxShadow(
                  color: Color(0x80000000),
                  offset: Offset(4, 6),
                  blurRadius: 14,
                  spreadRadius: -4,
                ),
              ];
        break;
    }

    return AnimatedScale(
      scale: _isPressed && _isEnabled ? 0.98 : 1.0,
      duration: const Duration(milliseconds: 100),
      curve: Curves.easeOutCubic,
      child: Opacity(
        opacity: _isEnabled ? 1.0 : 0.6,
        child: Container(
          height: widget.height,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: gradientColors,
            ),
            borderRadius: radius,
            border: Border.all(
              color: topBorderColor,
              width: 1.2,
            ),
            boxShadow: shadows,
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: radius,
              onTapDown: _isEnabled ? (_) => setState(() => _isPressed = true) : null,
              onTapUp: _isEnabled ? (_) => setState(() => _isPressed = false) : null,
              onTapCancel: _isEnabled ? () => setState(() => _isPressed = false) : null,
              onTap: widget.onPressed,
              child: Center(
                child: widget.loading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2.2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            widget.text,
                            style: TextStyle(
                              color: textColor,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              letterSpacing: -0.1,
                            ),
                          ),
                          if (widget.icon != null) ...[
                            const SizedBox(width: 8),
                            Icon(
                              widget.icon,
                              size: 18,
                              color: iconColor,
                            ),
                          ],
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
