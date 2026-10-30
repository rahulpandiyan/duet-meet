import 'package:flutter/material.dart';

/// Design tokens matching Duet's Tailwind design system
class DuetColors {
  // App Background & Surface
  static const appBg = Color(0xFFF8FAFC);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFE2E8F0);

  // Text Colors
  static const textPrimary = Color(0xFF0F172A);
  static const textSecondary = Color(0xFF475569);
  static const textTertiary = Color(0xFF94A3B8);

  // Brand Accents
  static const primary = Color(0xFF2563EB);
  static const primaryHover = Color(0xFF1D4ED8);
  static const primaryGlow = Color(0xFF60A5FA);
  static const primaryTint = Color(0xFFEFF6FF); // Soft clay tint
  static const primaryBorder = Color(0xFFDBEAFE);

  // Semantic
  static const success = Color(0xFF10B981);
  static const warning = Color(0xFFF59E0B);
  static const danger = Color(0xFFEF4444);

  // In-call Dark Surface Tokens
  static const inCallBg = Color(0xFF202124);
  static const inCallTile = Color(0xFF3C4043);
  static const inCallDock = Color(0xFF1E1F20);
}

/// Soft Neumorphism & Subtle Claymorphism Styles
class DuetMorphism {
  /// Subtle card shadow (90% flat, 10% soft ambient morphism)
  static List<BoxShadow> get cardShadow => const [
        BoxShadow(
          color: Color(0x080F172A),
          offset: Offset(0, 4),
          blurRadius: 16,
          spreadRadius: 0,
        ),
        BoxShadow(
          color: Color(0x040F172A),
          offset: Offset(0, 1),
          blurRadius: 4,
          spreadRadius: 0,
        ),
      ];

  /// Soft clay-like icon container decoration
  static BoxDecoration get iconContainer => BoxDecoration(
        color: DuetColors.primaryTint,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: DuetColors.primaryBorder, width: 1.2),
        boxShadow: const [
          BoxShadow(
            color: Colors.white,
            offset: Offset(-2, -2),
            blurRadius: 4,
          ),
          BoxShadow(
            color: Color(0x102563EB),
            offset: Offset(2, 3),
            blurRadius: 6,
          ),
        ],
      );

  /// Subtle pressed / interactive card decoration
  static BoxDecoration cardDecoration({bool isPressed = false}) => BoxDecoration(
        color: DuetColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: DuetColors.border, width: 1),
        boxShadow: isPressed
            ? const [
                BoxShadow(
                  color: Color(0x050F172A),
                  offset: Offset(0, 1),
                  blurRadius: 4,
                ),
              ]
            : cardShadow,
      );
}
