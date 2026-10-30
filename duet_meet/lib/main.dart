import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:chottu_link/chottu_link.dart';
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
    _listenToChottuLinks();
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
      debugPrint('ChottuLink listen exception: $e');
    }
  }

  void _updateServerUrl(String url) {
    setState(() {
      _serverUrl = url;
    });
  }

  /// Parses deep link URLs like duet://meet/ABC-DEF-GHI, https://duetxmeet.vercel.app/join?code=ABC-DEF-GHI, or https://duetxmeet.chottu.link/ABC-DEF-GHI
  String? _extractCodeFromUri(Uri uri) {
    if (uri.queryParameters.containsKey('code')) {
      return uri.queryParameters['code']?.toUpperCase();
    }
    // Check regex pattern for XXX-XXXX-XXX or XXX-XXX-XXX anywhere in link
    final match = RegExp(r'[A-Za-z0-9]{3,4}-[A-Za-z0-9]{3,4}-[A-Za-z0-9]{3,4}').firstMatch(uri.toString());
    if (match != null) {
      return match.group(0)!.toUpperCase();
    }
    if (uri.pathSegments.isNotEmpty) {
      final last = uri.pathSegments.last;
      if (last != 'join' && last != 'lobby' && last != 'room' && last.isNotEmpty) {
        return last.toUpperCase();
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: _navigatorKey,
      title: 'Duet',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: DuetColors.appBg,
        fontFamily: 'Outfit',
        colorScheme: ColorScheme.fromSeed(
          seedColor: DuetColors.primary,
          brightness: Brightness.dark,
          surface: DuetColors.surface,
        ),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme).apply(
          fontFamily: 'Outfit',
          bodyColor: DuetColors.textPrimary,
          displayColor: DuetColors.textPrimary,
        ),
        appBarTheme: const AppBarTheme(
          elevation: 0,
          backgroundColor: DuetColors.appBg,
          foregroundColor: DuetColors.textPrimary,
          scrolledUnderElevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: DuetColors.surface,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.border, width: 1),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.border, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: const BorderSide(color: DuetColors.primary, width: 1.5),
          ),
          prefixIconColor: DuetColors.textSecondary,
          suffixIconColor: DuetColors.textSecondary,
          labelStyle: const TextStyle(fontSize: 13, color: DuetColors.textSecondary),
          hintStyle: const TextStyle(fontSize: 14, color: DuetColors.textTertiary, fontFamily: 'Outfit'),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: DuetColors.primary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
          ),
        ),
      ),
      onGenerateRoute: (settings) {
        if (settings.name != null) {
          try {
            final uri = Uri.parse(settings.name!);
            final code = _extractCodeFromUri(uri);
            if (code != null) {
              return MaterialPageRoute(
                builder: (_) => JoinMeetingScreen(
                  serverUrl: _serverUrl,
                  initialCode: code,
                ),
              );
            }
          } catch (_) {}
        }
        return null;
      },
      home: HomeScreen(
        serverUrl: _serverUrl,
        onServerUrlChanged: _updateServerUrl,
      ),
    );
  }
}
