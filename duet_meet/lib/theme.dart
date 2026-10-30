import 'package:flutter/material.dart';

/// Pure Neutral Dark Design Tokens (Zero blue tint in dark mode)
class DuetColors {
  // Pure Neutral Dark Canvas (Deep charcoal / true dark)
  static const appBg = Color(0xFF121214);
  static const surface = Color(0xFF1E1E20);
  static const surfaceElevated = Color(0xFF26262A);
  static const surfaceGlass = Color(0xCC1E1E20);
  static const border = Color(0xFF2D2D32);
  static const borderLight = Color(0xFF38383E);

  // Pure Text Hierarchy (Neutral white to zinc)
  static const textPrimary = Color(0xFFFFFFFF);
  static const textSecondary = Color(0xFFA1A1AA);
  static const textTertiary = Color(0xFF71717A);

  // Brand Accents
  static const primary = Color(0xFF3B82F6);
  static const primaryHover = Color(0xFF2563EB);
  static const primaryGlow = Color(0xFF60A5FA);
  static const primaryTint = Color(0xFF26262A);
  static const primaryBorder = Color(0xFF3F3F46);
  static const accent = Color(0xFF22D3EE);

  // Semantic
  static const success = Color(0xFF22C55E);
  static const warning = Color(0xFFF59E0B);
  static const danger = Color(0xFFEF4444);

  // In-call Pure Neutral Dark Surfaces
  static const inCallBg = Color(0xFF121214);
  static const inCallTile = Color(0xFF1E1E20);
  static const inCallDock = Color(0xFF18181A);
}

/// Modern Neumorphism & Claymorphism Styles (Neutral Dark)
class DuetMorphism {
  /// Pure black ambient dual shadow
  static List<BoxShadow> get cardShadow => const [
        BoxShadow(
          color: Color(0x80000000),
          offset: Offset(8, 8),
          blurRadius: 20,
          spreadRadius: -6,
        ),
        BoxShadow(
          color: Color(0x0AFFFFFF),
          offset: Offset(-4, -4),
          blurRadius: 12,
          spreadRadius: -6,
        ),
      ];

  /// Soft clay-like icon container decoration (neutral dark)
  static BoxDecoration get iconContainer => BoxDecoration(
        color: DuetColors.surfaceElevated,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: DuetColors.primaryBorder, width: 1.2),
        boxShadow: const [
          BoxShadow(
            color: Color(0x66000000),
            offset: Offset(4, 4),
            blurRadius: 12,
            spreadRadius: -4,
          ),
          BoxShadow(
            color: Color(0x0FFFFFFF),
            offset: Offset(-2, -2),
            blurRadius: 6,
            spreadRadius: -2,
          ),
        ],
      );

  /// Subtle interactive card decoration
  static BoxDecoration cardDecoration({bool isPressed = false}) => BoxDecoration(
        color: DuetColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: DuetColors.border, width: 1),
        boxShadow: isPressed
            ? const [
                BoxShadow(
                  color: Color(0x40000000),
                  offset: Offset(2, 2),
                  blurRadius: 8,
                ),
              ]
            : cardShadow,
      );

  /// Neumorphic + Claymorphic primary button decoration
  static BoxDecoration clayButtonDecoration({bool isPressed = false}) => BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: isPressed
              ? const [Color(0xFF2563EB), Color(0xFF1D4ED8)]
              : const [Color(0xFF3B82F6), Color(0xFF1D4ED8)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0x6693C5FD), width: 1.2),
        boxShadow: isPressed
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
                BoxShadow(
                  color: Color(0x662563EB),
                  offset: Offset(0, 8),
                  blurRadius: 20,
                  spreadRadius: -2,
                ),
                BoxShadow(
                  color: Color(0x80000000),
                  offset: Offset(6, 8),
                  blurRadius: 16,
                  spreadRadius: -4,
                ),
                BoxShadow(
                  color: Color(0x2660A5FA),
                  offset: Offset(-2, -2),
                  blurRadius: 6,
                ),
              ],
      );

  /// Neumorphic + Claymorphic secondary button decoration (neutral dark)
  static BoxDecoration claySecondaryDecoration({bool isPressed = false}) => BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: isPressed
              ? const [Color(0xFF1E1E20), Color(0xFF18181A)]
              : const [Color(0xFF26262A), Color(0xFF1E1E20)],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0x26FFFFFF), width: 1.2),
        boxShadow: isPressed
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
              ],
      );
}
