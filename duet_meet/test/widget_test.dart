import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:duet_meet/main.dart';

void main() {
  testWidgets('HomeScreen renders header, hero section and two action cards', (WidgetTester tester) async {
    await tester.pumpWidget(const DuetApp());
    await tester.pumpAndSettle();

    // 1. Header elements
    expect(find.text('Duet'), findsOneWidget);
    expect(find.text('Call. Share. Do together.'), findsOneWidget);
    expect(find.byIcon(Icons.settings_outlined), findsOneWidget);

    // 2. Hero Section
    expect(find.text('Meet without limits'), findsOneWidget);
    expect(find.text('No account needed. Start or join a call instantly.'), findsOneWidget);

    // 3. Exactly TWO Primary Action Cards
    expect(find.text('Create link'), findsOneWidget);
    expect(find.text('Start an instant call.'), findsOneWidget);
    expect(find.byIcon(Icons.link_rounded), findsOneWidget);

    expect(find.text('Join a call'), findsOneWidget);
    expect(find.text('Enter a code or link.'), findsOneWidget);
    expect(find.byIcon(Icons.login_rounded), findsOneWidget);

    // Far-right arrow icons
    expect(find.byIcon(Icons.arrow_forward_rounded), findsNWidgets(2));
  });

  testWidgets('Navigation to Join a call works correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const DuetApp());
    await tester.pumpAndSettle();

    // Tap Join a call card
    await tester.tap(find.text('Join a call'));
    await tester.pumpAndSettle();

    expect(find.text('Enter call details'), findsOneWidget);
    expect(find.text('MEETING CODE OR LINK'), findsOneWidget);
    expect(find.text('YOUR DISPLAY NAME'), findsOneWidget);
  });

  testWidgets('Navigation to Create link works correctly', (WidgetTester tester) async {
    await tester.pumpWidget(const DuetApp());
    await tester.pumpAndSettle();

    // Tap Create link card
    await tester.tap(find.text('Create link'));
    await tester.pumpAndSettle();

    expect(find.text('Instant meeting'), findsOneWidget);
    expect(find.text('YOUR DISPLAY NAME'), findsOneWidget);
  });
}
