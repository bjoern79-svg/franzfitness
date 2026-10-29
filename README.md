# Franz Fitness App v1

Offline Web App (PWA) zum Trainingsplan Woche 1 bis 21 (Mo 2.11.2026 bis So 28.3.2027). Eine Datei `index.html` mit HTML, CSS, JS und eingebetteten Übungsbildern. Keine externen Abhängigkeiten, keine Requests, kein Konto, keine Tracker.

## Funktionen
1. **Heute**: welche Einheit heute dran ist (Mo, Mi, Sa oder So, A und B im Wechsel, Woche 1: A B A, Woche 2: B A B), Ersatztermine aus Karte 09 (Fr 20.11., Hotel Workout Mi 16.12., So 20.12., Sa 27.3. usw.), Deload Woche 12 (1 Satz weniger), Wochenhinweise zu Reisen und Feiertagen, Spruch der Woche.
2. **Satz Logger**: Gewicht und Wiederholungen je Satz, letzter Wert wird angezeigt und vorgeschlagen, Doppelprogression ("Obergrenze erreicht, nächstes Mal +2,5 kg"), Pausentimer mit Ton (+15 s, Stopp). Antippen von Bild oder Name öffnet die Anleitung (Start, Ende, Ausführung, Fehler, Zielmuskel).
3. **Aktivitäten**: Schritte und Eiweiß pro Tag, Schwimmen, Joggen, Hotel Workout pro Woche.
4. **Gamification**: XP (Satz 5, Einheit 50, Hotel 40, Schwimmen und Joggen 30, Schritt oder Eiweiß Tag 10, Gewicht 15, Körperfett 25, Bestleistung 25, Streak Woche 50), 11 Level mit Namen, Streak wie im Dashboard (Woche zählt mit 2 von 3 Einheiten, Reisewochen 3, 5, 7 mit 1 Einheit plus Hotel Workout), 21 Abzeichen, persönliche Rekorde, Konfetti.
5. **Fortschritt**: Gewicht, Taille, Körperfett je Woche, Kurven gegen Zielkorridor (±1 kg bzw. ±1 Prozentpunkt), Kraftverlauf je Übung (e1RM), Wochenübersicht 1 bis 21.
6. **Mehr**: Sa oder So als dritter Tag, Einheiten verschieben, Export (JSON Datei), Import, Zurücksetzen mit doppelter Bestätigung.

## Daten
Alles liegt im `localStorage` des Browsers auf dem Gerät (Schlüssel `franz-fitness-app-v1`). Daten sind pro Browser und pro Adresse getrennt. Regelmäßig exportieren, z.B. nach jedem 4 Wochen Check.

## Öffnen und Installieren
- **PC oder Mac**: `index.html` per Doppelklick im Browser öffnen, funktioniert ohne Server (getestet in Chromium per file://).
- **iPhone als App (Zum Home-Bildschirm)**: in Safari öffnen: https://bjoern79-svg.github.io/franzfitness/ dann Teilen, "Zum Home-Bildschirm". Manifest, Icons und Service Worker (Offline Cache) sind dafür enthalten und werden nur über http(s) aktiv. GitHub Pages dafür auf den Branch `main` und den Ordner root (`/`) stellen.
- Test Parameter: `index.html?heute=2026-11-04` simuliert ein Datum.

## Neu bauen
```bash
python3 src/build.py         # baut index.html, manifest.json, sw.js aus src/
python3 test/test_app.py     # Headless Test (Playwright, Server auf Port 8765 nötig: python3 -m http.server 8765)
python3 test/screens.py      # Screenshots
```
Übungsdaten: `/workspace/fitness/src/uebdata.py` (gemeinsam mit den Anleitungskarten 10 bis 14).
