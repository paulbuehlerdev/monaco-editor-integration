# POC Fine Tuning
- html in markdown code: completion, closing tag, highlighting etc...
    - wenn man html mit language: markdown schreibt, sollte es die gleichen features haben, die es aktuell bei html hat

    - Keine out of the box möglichkeit
    - Mann kann einzelne Features händisch hinzufügen
    - Eventuell könnte man auch 2 language service workers miteinander kombinieren. Also immer wenn man sich in einem html block befindet, den html worker benutzen. Aber das muss vermutlich auch je feature gemacht werden.
    - Fazit: grundsätzlich möglich, aber mit gewissem Aufwand und eigenimplementation verbunden
- layout und class von cramdown zum laufen bringen
    - füge mehr callbacks hinzu. Für cramdown allgemein, für classes, für layout etc
    - schaue das das gut erweiterbar ist. also gewissermaßen generisch

    - hab nichts gefunden zu {: layout=...} in cramdown. ist das eine custom implementation?
    -  {: layout=} gibt jetzt vorschläge von tags die man im testbed definiert hat
- mehrere sprachen supporten: markdown, typescript, html etc...
    - wieder markdown ist hauptsprache, aber möglichst support von anderen sprachen gleichzeitig

    - möglich, aber mit custom implementations. Nur eine sprache standardmäßig möglich
    - eventuell macht es sinn eine "schwierigere" sprache als hauptsprache zu nehmen und dann mit markdown features zu ergänzen. dann muss man weniger selbst implementieren
- style vorschläge -> code completions
    - also sowas wie margin-bottom etc
    - done
- javascript vorschläge
    - variablen, standard functions, class etc
    - done
- custom style-md attribut --> soll gleiche vorschläge bekommen wie style
    - das ist ein custom attribut das aber von den suggestions gleich wie style sein sollte
    - done

## Fragen
- Anleitung für Yubikey



