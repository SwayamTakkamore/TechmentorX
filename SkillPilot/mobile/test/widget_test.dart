import 'package:flutter_test/flutter_test.dart';

import 'package:skillpilot_mobile/main.dart';

void main() {
  testWidgets('SkillPilot app renders splash screen', (WidgetTester tester) async {
    await tester.pumpWidget(const SkillPilotApp());

    // Verify the app renders with the brand name
    expect(find.text('SkillPilot'), findsOneWidget);
  });
}
