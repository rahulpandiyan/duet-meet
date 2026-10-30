import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:duet_meet/main.dart';

void main() {
  testWidgets('HomeScreen renders header, hero section and two action cards', (WidgetTester tester) async {
    await tester.pumpWidget(const DuetApp());
    await tester.pumpAndSettle();

    // 1. Header elements
    expect(find.text('Duet'), findsOneWidget);
    expect(find.text('Call. Share. Do together.'), findsOneWidget);
    expect(find.byIcon(LucideIcons.settings), findsOneWidget);

    // 2. Hero Section
    expect(find.textContaining('Meet without'), findsOneWidget);
    expect(find.textContaining('No account needed.'), findsOneWidget);

    // 3. Exactly TWO Primary Action Cards
    expect(find.text('Create link'), findsOneWidget);
    expect(find.text('Start an instant call'), findsOneWidget);
    expect(find.byIcon(LucideIcons.link), findsOneWidget);

    expect(find.text('Join a call'), findsOneWidget);
    expect(find.text('Enter a code or link'), findsOneWidget);
    expect(find.byIcon(LucideIcons.log_in), findsOneWidget);

    // Far-right arrow icons
    expect(find.byIcon(LucideIcons.arrow_right), findsWidgets);
  });

  testWidgets('Navigation to Join a call works correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const DuetApp());
    await tester.pumpAndSettle();

    // Tap Join a call card
    await tester.tap(find.text('Join a call'));
    await tester.pumpAndSettle();

    expect(find.text('Join a meeting'), findsOneWidget);
    expect(find.text('MEETING CODE OR LINK'), findsOneWidget);
    expect(find.text('YOUR NAME'), findsOneWidget);
    expect(find.text('JOIN OPTIONS'), findsOneWidget);
    expect(find.text("Don't connect to audio"), findsOneWidget);
    expect(find.text('Turn off my video'), findsOneWidget);
    expect(find.text('Join meeting'), findsOneWidget);
  });

  testWidgets('Navigation to Create link works correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const DuetApp());
    await tester.pumpAndSettle();

    // Tap Create link card
    await tester.tap(find.text('Create link'));
    await tester.pumpAndSettle();

    expect(find.text('New meeting'), findsOneWidget);
    expect(find.text('YOUR DISPLAY NAME'), findsOneWidget);
    expect(find.text('MEETING OPTIONS'), findsOneWidget);
    expect(find.text('Start with microphone on'), findsOneWidget);
    expect(find.text('Start with video on'), findsOneWidget);
    expect(find.text('Start instant meeting'), findsOneWidget);
  });
}
