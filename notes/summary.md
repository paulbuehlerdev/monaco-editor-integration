# POC Summary

## Basisfunktionalität
- Monaco bietet über seine API viele Funktionalitäten an
- Setzen und Herauslesen von Text an beliebigen Positionen
- Auslesen und Setzen von Selektierung
- Erweiterung des Context Menus
- Listener für text oder selection changes
- Erstellen von custom highlighting, linting, suggestions etc.
- Über die API kann der Editor stark angepasst werden, fast alles ist möglich

## Visual Studio Code Extensions
- Standardmäßig nicht kompatibel mit Monaco editor: https://github.com/microsoft/monaco-editor?tab=readme-ov-file#faq
- In Einzelfällen ist es eventuell Möglich, eine ganze extension oder Teile davon zu benutzen.

## Copilot für Monaco
- Möglich über https://www.npmjs.com/package/monacopilot/v/0.9.30
- Standardmäßig nur kompatibel mit Mistral AI. Das ist in der Dokumentation nicht ersichtlich. Benutzt man allerdings andere Provider wirft es einen Fehler.
- Andere Provider (Bsp. OpenAI) benötigen einen custom connector.
- Eigenimplementierung theoretisch auch möglich, aber monacopilot nimmt Aufwand ab.

## Language Support
- Für populäre Sprachen wie HTML, Javascript, CSS gibt es Language services.
- Ein Language service bringt code highlighting, linting, suggestions etc.
- Sprachen wie Markdown werden nur rudimentär supported: Highlighting aber kein linting oder suggestions
- Auch wird immer nur ein Language service verwendet. Eine Kombination von 2 Services ist nicht möglich.
- Für einzelne Features kann ein anderer Language service manuell aufgerufen werden. Das muss aber für jedes Feature einzeln gemacht werden.

## Cramdown Support
- Es gibt keine out-of-the-box cramdown Unterstützung
- Auch kein npm modul
- Features wie suggestions, highlighting, linting etc können aber mit eigenem code hinzugefügt werden.