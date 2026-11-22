# Franz Fitness App v3

Offline Web App (PWA) zum Trainingsplan Woche 1 bis 21. Tag 1 ist Freitag 20.11.2026 mit Einheit A, Ende Sonntag 11.4.2027. Eine Datei `index.html` mit HTML, CSS, JS und eingebetteten Übungsbildern. Keine externen Abhängigkeiten, keine Requests, kein Konto, keine Tracker.

## Plan
Karte 15, Life Fitness Geräte plus Freihantel, Ganzkörper A und B.

1. **Woche 1** (Mo 16.11. bis So 22.11.2026) ist kurz: Freitag 20.11. Einheit A, Sonntag 22.11. Einheit B.
2. **Ab Woche 2**: Montag, Mittwoch und Samstag oder Sonntag, A und B im Wechsel.
3. **Deload** in Woche 12, 1.2. bis 7.2.2027: nur 2 Sätze, etwas leichter, RIR 3.
4. **Körperfett** alle 4 Wochen, in den Wochen 4, 8, 12, 16, 20 und 21.
5. Einheit A: Kurzhantel Bankdrücken flach, Schrägpresse scheibenbeladen, Latzug, einarmiges Kurzhantelrudern, Goblet Squat, Bizepscurl, Trizepsdrücken mit Seil.
6. Einheit B: Schrägbankdrücken Kurzhanteln, Butterfly, Rudern sitzend, Seitheben, rumänisches Kreuzheben, Hammercurl, Trizepsstrecker.
7. Zu jeder Übung gibt es die Ersatzvariante aus der Karte, falls der Platz belegt ist oder das Gerät fehlt.

## Funktionen
1. **Heute**: Tag 1 am 20.11.2026, die Einheit des Tages, Satz Logger, Anleitung mit Bild.
2. **Satz Logger**: Gewicht und Wiederholungen je Satz, letzter Wert wird vorgeschlagen, Doppelprogression, Pausentimer.
3. **Aktivitäten**: Schritte und Eiweiß pro Tag, Schwimmen, Joggen, freiwilliges Hotel Workout.
4. **Gamification**: XP, Level, Streak (Woche 1 mit beiden Einheiten, ab Woche 2 mindestens 2 von 3), Abzeichen.
5. **Fortschritt**: Gewicht, Taille, Körperfett, Kraftverlauf.
6. **Mehr**: Samstag oder Sonntag als dritter Tag ab Woche 2, Einheiten verschieben, Export, Import, Zurücksetzen.

## Daten
Alles liegt im `localStorage` des Browsers (Schlüssel `franz-fitness-app-v1`, unverändert, damit vorhandene Einträge erhalten bleiben). Einträge vor dem 20.11.2026 bleiben unter Frühere Einträge und zählen nicht als Programmtage. Der Offline Cache heißt `franz-fitness-v5`.

Übungsbilder sind eigene Abbildungen (Start und Ende, Zielmuskel rot) und liegen als WebP im Offline Cache. Core Training gibt 20 XP pro Tag, 50 XP ab dem Wochenziel (Woche 1: 2 Tage, danach 4) und 20 XP extra am Strecktag. Der Pausentimer zeigt große Ziffern, mit Vollbild und Wachhalten, wenn der Browser das kann.

## Öffnen und Installieren
- **PC oder Mac**: `index.html` per Doppelklick im Browser öffnen.
- **iPhone als App (Zum Home Bildschirm)**: in Safari öffnen: https://bjoern79-svg.github.io/franzfitness/ dann Teilen, "Zum Home Bildschirm". GitHub Pages auf den Branch `main` und den Ordner root (`/`) stellen.
- Test Parameter: `index.html?heute=2026-11-20` zeigt Tag 1.

## Neu bauen
```bash
python3 src/build.py
python3 test/test_app.py
```
Der Test erwartet einen statischen Server auf Port 8765 im Repository Root: `python3 -m http.server 8765`.
