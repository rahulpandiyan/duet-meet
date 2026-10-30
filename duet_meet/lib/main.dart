import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:chottu_link/chottu_link.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'theme.dart';
import 'screens/home_screen.dart';
import 'screens/join_meeting_screen.dart';

// Exports for consumers
export 'screens/home_screen.dart';
export 'screens/join_meeting_screen.dart';
export 'screens/create_meeting_screen.dart';
export 'screens/meeting_screen.dart';

const defaultWebAppUrl = 'https://duetxmeet.vercel.app';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize ChottuLink for duetxmeet.chottu.link dynamic links
  try {
    await ChottuLink.init(
      apiKey: 'c_app_RpZOcbcgk9tRPWPi30DSRKrdIc8QbI6A',
      allowedDomains: ['duetxmeet.chottu.link'],
    );
  } catch (e) {
    debugPrint('ChottuLink init: $e');
  }

  runApp(const DuetApp());
}

class DuetApp extends StatefulWidget {
  const DuetApp({super.key});

  @override
  State<DuetApp> createState() => _DuetAppState();
}

class _DuetAppState extends State<DuetApp> with WidgetsBindingObserver {
  String _serverUrl = defaultWebAppUrl;
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  StreamSubscription<String>? _linkSubscription;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadSavedServerUrl();
    _listenToChottuLinks();
  }

  Future<void> _loadSavedServerUrl() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString('duet_server_url');
      if (saved != null && saved.isNotEmpty) {
        setState(() => _serverUrl = saved);
      }
    } catch (e) {
      debugPrint('Error loading saved server url: $e');
    }
  }

  @override
  void dispose() {
    _linkSubscription?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  void _listenToChottuLinks() {
    try {
      _linkSubscription = ChottuLink.onLinkReceived.listen((String link) {
        debugPrint('Dynamic link received from ChottuLink: $link');
        final uri = Uri.tryParse(link);
        if (uri != null) {
          final code = _extractCodeFromUri(uri);
          if (code != null) {
            _navigatorKey.currentState?.push(
              MaterialPageRoute(
                builder: (_) => JoinMeetingScreen(
                  serverUrl: _serverUrl,
                  initialCode: code,
                ),
              ),
            );
          }
        }
      }, onError: (err) {
        debugPrint('ChottuLink onLinkReceived error: $err');
      });
    } catch (e) {
      debugPrint('ChottuLink stream setup: $e');
    }
  }

  String? _extractCodeFromUri(Uri uri) {
    // 1. Check path: e.g. /ABC-DEF-GHI or /room/ABC-DEF-GHI or /bsOPHP
    final segments = uri.pathSegments.where((s) => s.isNotEmpty).toList();
    if (segments.isNotEmpty) {
      final last = segments.last.toUpperCase();
      // Match 3-segment code (e.g. ABC-DEF-GHI)
      final regex3 = RegExp(r'^[A-Z0-9]{3}-[A-Z0-9]{3,4}-[A-Z0-9]{3}$');
      if (regex3.hasMatch(last)) return last;
      // Match raw short code or path
      if (last.length >= 4 && last.length <= 16) {
        return last;
      }
    }

    // 2. Check query param: ?code=ABC-DEF-GHI
    final qCode = uri.queryParameters['code'];
    if (qCode != null && qCode.trim().isNotEmpty) {
      return qCode.trim().toUpperCase();
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'Duet Meet',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: DuetColors.appBg,
        fontFamily: 'Outfit',
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
        colorScheme: const ColorScheme.dark(
          primary: DuetColors.primary,
          surface: DuetColors.surface,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: DuetColors.surfaceElevated,
          hintStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: DuetColors.textTertiary,
          ),
          prefixIconColor: DuetColors.textSecondary,
          suffixIconColor: DuetColors.textSecondary,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.border, width: 1.2),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.border, width: 1.2),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.primary, width: 1.6),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.danger, width: 1.4),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.danger, width: 1.6),
          ),
        ),
      ),
      home: HomeScreen(
        serverUrl: _serverUrl,
        onServerUrlChanged: (url) {
          setState(() => _serverUrl = url);
        },
      ),
    );
  }
}
