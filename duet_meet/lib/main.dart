import 'package:flutter/material.dart';
import 'theme.dart';
import 'screens/home_screen.dart';
import 'screens/join_meeting_screen.dart';

// Exports for consumers
export 'screens/home_screen.dart';
export 'screens/join_meeting_screen.dart';
export 'screens/create_meeting_screen.dart';
export 'screens/meeting_screen.dart';

const defaultWebAppUrl = 'https://duetxmeet.vercel.app';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  void _updateServerUrl(String url) {
    setState(() {
      _serverUrl = url;
    });
  }

  /// Parses deep link URLs like duet://meet/ABC-DEF-GHI or https://duetxmeet.vercel.app/join?code=ABC-DEF-GHI
  String? _extractCodeFromUri(Uri uri) {
    if (uri.queryParameters.containsKey('code')) {
      return uri.queryParameters['code']?.toUpperCase();
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
        brightness: Brightness.light,
        scaffoldBackgroundColor: DuetColors.appBg,
        colorScheme: ColorScheme.fromSeed(
          seedColor: DuetColors.primary,
          brightness: Brightness.light,
          surface: DuetColors.surface,
        ),
        fontFamily: 'Inter',
        appBarTheme: const AppBarTheme(
          elevation: 0,
          backgroundColor: DuetColors.appBg,
          foregroundColor: DuetColors.textPrimary,
          scrolledUnderElevation: 0,
          centerTitle: false,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: DuetColors.border, width: 1),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: DuetColors.border, width: 1),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: DuetColors.primary, width: 1.5),
          ),
          labelStyle: const TextStyle(fontSize: 13, color: DuetColors.textSecondary),
          hintStyle: const TextStyle(fontSize: 13, color: DuetColors.textTertiary),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            backgroundColor: DuetColors.primary,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
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
