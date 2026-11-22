import json
EX = json.loads(r'''[
 {
  "id": "brustpresse",
  "name": "Brustpresse Maschine (flach)",
  "grp": "brust",
  "plan": "Ersatz für Kurzhantel Bankdrücken flach",
  "saetze": "2 → 3",
  "wdh": "8 bis 12",
  "pause": "90 bis 120 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Griffe auf Brusthöhe, Ellbogen gebeugt",
  "ende": "Arme vorn, Ellbogen nicht durchgestreckt",
  "punkte": [
   "Sitz so einstellen, dass die Griffe auf Brusthöhe sind",
   "Schulterblätter zurück und runter, Rücken am Polster",
   "Kraftvoll nach vorn drücken, Ellbogen bleiben leicht gebeugt",
   "2 bis 3 Sekunden kontrolliert zurück"
  ],
  "fehler": [
   "Schultern ziehen beim Drücken nach vorn oder oben",
   "Gewicht knallt zurück in den Stapel"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "fdelt",
   "triceps"
  ],
  "ziel": "Brust, dazu vordere Schulter und Trizeps",
  "ersatz": "Das ist die Maschinen Variante, wenn die Bank belegt ist"
 },
 {
  "id": "schraegbank",
  "name": "Schrägbankdrücken Kurzhanteln",
  "grp": "brust",
  "plan": "Einheit B1",
  "saetze": "2 → 3",
  "wdh": "8 bis 12",
  "pause": "90 bis 120 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Hanteln auf Höhe der oberen Brust, Lehne 30 bis 45 Grad",
  "ende": "Hanteln über der oberen Brust, Arme fast gestreckt",
  "punkte": [
   "Lehne auf 30 bis 45 Grad, Füße fest am Boden",
   "Hanteln über der oberen Brust zusammenführen",
   "Kontrolliert absenken, Ellbogen bleiben unter der Hantel",
   "Hochdrücken, oben nicht hart durchstrecken"
  ],
  "fehler": [
   "Bank zu steil, dann arbeitet vor allem die Schulter",
   "Ellbogen weit abgespreizt auf 90 Grad"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "fdelt",
   "triceps"
  ],
  "ziel": "Obere Brust, dazu vordere Schulter und Trizeps",
  "ersatz": "Hammer Strength Iso Lateral Incline Press, wenn die Bank belegt ist"
 },
 {
  "id": "multipresse",
  "name": "Flachbankdrücken Multipresse",
  "grp": "brust",
  "plan": "Einheit B1",
  "saetze": "2 → 3",
  "wdh": "8 bis 12",
  "pause": "90 bis 120 s",
  "rir": "2 bis 3",
  "start": "Stange an der unteren Brust",
  "ende": "Stange über der Brust, Arme fast gestreckt",
  "punkte": [
   "Bank so stellen, dass die Stange über der unteren Brust läuft",
   "Sicherungshaken knapp über Brusthöhe einstellen",
   "Schulterblätter zusammen, Füße fest am Boden",
   "Stange zur unteren Brust, Unterarme senkrecht, dann hochdrücken"
  ],
  "fehler": [
   "Stange läuft über Hals oder Gesicht",
   "Gesäß hebt beim Drücken von der Bank ab"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "fdelt",
   "triceps"
  ],
  "ziel": "Brust, dazu vordere Schulter und Trizeps"
 },
 {
  "id": "fliegende",
  "name": "Butterfly",
  "grp": "brust",
  "plan": "Einheit B2",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 bis 90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Griffe seitlich auf Schulterhöhe, Arme leicht gebeugt",
  "ende": "Griffe treffen sich vor der Brust",
  "punkte": [
   "Sitz so einstellen, dass die Griffe auf Schulterhöhe liegen",
   "Arme leicht gebeugt lassen",
   "Vor der Brust zusammenführen und kurz halten",
   "Langsam öffnen, Schultern bleiben unten"
  ],
  "fehler": [
   "Zu schwer, dann wird daraus ein Drücken",
   "Schultern rollen nach vorn"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "fdelt"
  ],
  "ziel": "Brust, dazu vordere Schulter",
  "ersatz": "Fliegende an der Kabelstation oder mit Kurzhanteln auf der Flachbank"
 },
 {
  "id": "latzug",
  "name": "Latzug",
  "grp": "ruecken",
  "plan": "Einheit A3",
  "saetze": "2 → 3",
  "wdh": "8 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Arme gestreckt über dem Kopf",
  "ende": "Stange vor dem Gesicht zur oberen Brust",
  "punkte": [
   "Knie fest unter das Polster",
   "Brust raus, nicht ins Hohlkreuz fallen",
   "Stange zur oberen Brust ziehen, Ellbogen nach unten",
   "Langsam nach oben zurück, oben strecken"
  ],
  "fehler": [
   "Stange hinter den Kopf ziehen",
   "Schwung aus dem Oberkörper holen"
  ],
  "prim": [
   "lats"
  ],
  "sek": [
   "biceps",
   "traps"
  ],
  "ziel": "Breiter Rückenmuskel, dazu Bizeps und oberer Rücken",
  "ersatz": "Latzug an der Kabelstation (Dual Adjustable Pulley)"
 },
 {
  "id": "rudern",
  "name": "Rudern sitzend",
  "grp": "ruecken",
  "plan": "Einheit B3",
  "saetze": "2 → 3",
  "wdh": "8 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Arme lang zum Griff, Brust am Polster",
  "ende": "Griffe an den Hüften, Ellbogen hinten",
  "punkte": [
   "Brustpolster so einstellen, dass du die Griffe mit langen Armen erreichst",
   "Fest zu den Hüften ziehen",
   "Kurz halten, Schultern bleiben unten",
   "Kontrolliert nach vorn, Oberkörper bleibt ruhig"
  ],
  "fehler": [
   "Mit dem Oberkörper vor und zurück schwingen",
   "Schultern zu den Ohren hochziehen"
  ],
  "prim": [
   "lats",
   "traps"
  ],
  "sek": [
   "biceps"
  ],
  "ziel": "Mittlerer und breiter Rücken, dazu Bizeps",
  "ersatz": "Einarmiges Kurzhantelrudern, wenn die Maschine belegt ist"
 },
 {
  "id": "deadbug",
  "name": "Dead Bug (Option, Bauch)",
  "grp": "ruecken",
  "plan": "Core Training und optional nach Einheit A",
  "saetze": "1",
  "wdh": "6 bis 8 je Seite",
  "pause": "45 s",
  "rir": "sauber",
  "start": "Rückenlage, Arme hoch, Beine im 90 Grad Winkel",
  "ende": "Arm nach hinten, Gegenbein nach vorn strecken",
  "punkte": [
   "Unteren Rücken flach auf die Matte drücken",
   "Arm und Gegenbein langsam strecken",
   "Ausatmen, Bauch bleibt fest",
   "Zurück in die Mitte, Seite wechseln"
  ],
  "fehler": [
   "Hohlkreuz, der untere Rücken hebt ab",
   "Zu schnell, ohne Kontrolle"
  ],
  "prim": [
   "abs"
  ],
  "sek": [],
  "ziel": "Gerader und tiefer Bauch (Rumpfstabilität)"
 },
 {
  "id": "bizeps",
  "name": "Bizepscurl Kurzhanteln",
  "grp": "arme",
  "plan": "Einheit A6",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Arme hängen gestreckt",
  "ende": "Hanteln auf Schulterhöhe",
  "punkte": [
   "Aufrecht stehen oder sitzen, Ellbogen fest am Körper",
   "Nicht schwingen",
   "Oben kurz halten",
   "Hanteln langsam ablassen"
  ],
  "fehler": [
   "Schwung mit dem Oberkörper",
   "Ellbogen wandern nach vorn"
  ],
  "prim": [
   "biceps"
  ],
  "sek": [],
  "ziel": "Bizeps",
  "ersatz": "Insignia Series Biceps Curl"
 },
 {
  "id": "hammer",
  "name": "Hammercurl Kurzhanteln",
  "grp": "arme",
  "plan": "Einheit B6",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Neutralgriff, Daumen nach vorn",
  "ende": "Hanteln auf Schulterhöhe, Daumen oben",
  "punkte": [
   "Daumen zeigen nach oben",
   "Ellbogen fest am Körper",
   "Hanteln wie einen Hammer führen, nicht schwingen",
   "Langsam ablassen"
  ],
  "fehler": [
   "Handgelenk knickt ab",
   "Zu schwer, dann schwingt der Rücken mit"
  ],
  "prim": [
   "biceps"
  ],
  "sek": [],
  "ziel": "Bizeps und Unterarm (Brachialis)",
  "ersatz": "Hammercurl mit Seil an der Kabelstation"
 },
 {
  "id": "trizeps_seil",
  "name": "Trizepsdrücken mit Seil",
  "grp": "arme",
  "plan": "Einheit A7",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Seil auf Brusthöhe, Ellbogen 90 Grad",
  "ende": "Arme unten gestreckt, Seil auseinander",
  "punkte": [
   "Rolle ganz oben, Seil einhängen",
   "Ellbogen fest am Körper",
   "Nur die Unterarme strecken",
   "Langsam zurück, Schultern bleiben unten"
  ],
  "fehler": [
   "Ellbogen wandern nach vorn und hinten",
   "Mit dem Körpergewicht runterdrücken"
  ],
  "prim": [
   "triceps"
  ],
  "sek": [],
  "ziel": "Trizeps",
  "ersatz": "Insignia Series Triceps Press, oder Trizeps über Kopf mit Kurzhantel"
 },
 {
  "id": "trizeps_ueberkopf",
  "name": "Trizeps Überkopf am Kabel",
  "grp": "arme",
  "plan": "Einheit B7",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 s",
  "rir": "2 bis 3",
  "start": "Rücken zum Kabel, Seil hinter dem Kopf",
  "ende": "Arme nach vorn oben gestreckt",
  "punkte": [
   "Rücken zum Kabelturm, Ausfallschritt",
   "Ellbogen zeigen nach vorn und bleiben fix",
   "Unterarme nach vorn oben strecken",
   "Rippen unten halten, langsam zurück"
  ],
  "fehler": [
   "Hohlkreuz statt fester Rumpf",
   "Oberarme bewegen sich mit"
  ],
  "prim": [
   "triceps"
  ],
  "sek": [],
  "ziel": "Trizeps, vor allem langer Kopf"
 },
 {
  "id": "beinpresse",
  "name": "Beinpresse",
  "grp": "beine",
  "plan": "Einheit A4",
  "saetze": "2",
  "wdh": "10 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3",
  "start": "Knie ca. 90 Grad, Rücken am Polster",
  "ende": "Beine gestreckt, Knie locker",
  "punkte": [
   "Füße schulterbreit mittig auf der Platte",
   "Knie folgen den Fußspitzen",
   "Nur so tief, wie der untere Rücken am Polster bleibt",
   "Oben Knie nicht durchschlagen"
  ],
  "fehler": [
   "Zu tief, das Becken rollt ein",
   "Knie fallen nach innen"
  ],
  "prim": [
   "quads",
   "glutes"
  ],
  "sek": [
   "hams"
  ],
  "ziel": "Vorderer Oberschenkel und Gesäß"
 },
 {
  "id": "goblet",
  "name": "Goblet Squat",
  "grp": "beine",
  "plan": "Einheit A5",
  "saetze": "2",
  "wdh": "8 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Aufrecht, Hantel vor der Brust",
  "ende": "Oberschenkel etwa waagrecht",
  "punkte": [
   "Hantel fest vor der Brust",
   "Fersen am Boden, Knie in Fußrichtung",
   "Kontrolliert tief und wieder hoch",
   "Rücken bleibt neutral"
  ],
  "fehler": [
   "Fersen heben ab",
   "Rücken rundet sich unten"
  ],
  "prim": [
   "quads",
   "glutes"
  ],
  "sek": [
   "abs"
  ],
  "ziel": "Vorderer Oberschenkel und Gesäß",
  "ersatz": "Insignia Series Arc Leg Press"
 },
 {
  "id": "rdl",
  "name": "Rumänisches Kreuzheben",
  "grp": "beine",
  "plan": "Einheit B5",
  "saetze": "2",
  "wdh": "8 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "start": "Aufrecht, Hanteln vor den Oberschenkeln",
  "ende": "Hüfte hinten, Rücken gerade, Hanteln unter dem Knie",
  "punkte": [
   "Knie leicht gebeugt",
   "Hanteln eng an den Beinen",
   "Hüfte nach hinten, Rücken gerade",
   "Dehnung hinten in den Oberschenkeln, dann Hüfte nach vorn"
  ],
  "fehler": [
   "Runder Rücken",
   "Daraus wird eine Kniebeuge"
  ],
  "prim": [
   "hams",
   "glutes"
  ],
  "sek": [
   "traps"
  ],
  "ziel": "Hinterer Oberschenkel und Gesäß",
  "ersatz": "Insignia Series Seated Leg Curl"
 },
 {
  "id": "hipthrust",
  "name": "Hip Thrust (Option statt RDL)",
  "grp": "beine",
  "plan": "Option, nicht im Standardplan",
  "saetze": "2",
  "wdh": "10 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3",
  "start": "Gesäß unten, Schulterblätter an der Bank",
  "ende": "Hüfte oben, Körper wie ein Tisch",
  "punkte": [
   "Schulterblätter an der Bankkante, Füße hüftbreit",
   "Stange mit Polster auf der Hüfte",
   "Hüfte hochdrücken, Schienbeine oben senkrecht",
   "Oben Gesäß anspannen, Kinn leicht zur Brust"
  ],
  "fehler": [
   "Hohlkreuz oben statt Gesäß",
   "Füße zu weit weg, dann zieht es hinten am Oberschenkel"
  ],
  "prim": [
   "glutes"
  ],
  "sek": [
   "hams"
  ],
  "ziel": "Gesäß, dazu hinterer Oberschenkel"
 },
 {
  "id": "liegestuetz",
  "name": "Liegestütze",
  "grp": "hotel",
  "plan": "Hotel Workout",
  "saetze": "3 Runden",
  "wdh": "8 bis 15",
  "pause": "45 bis 60 s",
  "rir": "1 bis 2",
  "start": "Arme gestreckt, Körper in einer Linie",
  "ende": "Brust knapp über dem Boden",
  "punkte": [
   "Hände etwas breiter als die Schultern",
   "Bauch und Gesäß fest, Körper bleibt gerade",
   "Ellbogen ca. 45 Grad nach hinten",
   "Zu schwer: Hände auf Bett oder Tisch"
  ],
  "fehler": [
   "Hüfte hängt durch",
   "Nur halbe Bewegung oben"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "triceps",
   "fdelt"
  ],
  "ziel": "Brust, dazu Trizeps und Schulter"
 },
 {
  "id": "bandrudern",
  "name": "Rudern mit Band oder Handtuch",
  "grp": "hotel",
  "plan": "Hotel Workout",
  "saetze": "3 Runden",
  "wdh": "10 bis 15",
  "pause": "45 bis 60 s",
  "rir": "1 bis 2",
  "start": "Arme vorn gestreckt",
  "ende": "Hände an den unteren Rippen",
  "punkte": [
   "Band sicher in der geschlossenen Tür oder am Pfosten",
   "Aufrecht stehen, Knie leicht gebeugt",
   "Ellbogen nach hinten, Schulterblätter zusammen",
   "Handtuch Variante: um Türgriff, nach hinten lehnen und heranziehen"
  ],
  "fehler": [
   "Band an einer Tür, die aufgehen kann",
   "Schultern ziehen hoch"
  ],
  "prim": [
   "lats",
   "traps"
  ],
  "sek": [
   "biceps"
  ],
  "ziel": "Oberer und breiter Rücken"
 },
 {
  "id": "kniebeuge",
  "name": "Kniebeugen",
  "grp": "hotel",
  "plan": "Hotel Workout",
  "saetze": "3 Runden",
  "wdh": "12 bis 15",
  "pause": "45 bis 60 s",
  "rir": "1 bis 2",
  "start": "Aufrecht, Füße schulterbreit",
  "ende": "Oberschenkel etwa waagrecht, Arme vorn",
  "punkte": [
   "Fersen bleiben am Boden",
   "Hüfte nach hinten unten, Brust bleibt oben",
   "Knie in Zehenrichtung",
   "Optional Kurzhantel vor der Brust (wie Goblet Squat)"
  ],
  "fehler": [
   "Knie fallen nach innen",
   "Rücken rundet sich"
  ],
  "prim": [
   "quads",
   "glutes"
  ],
  "sek": [],
  "ziel": "Oberschenkel und Gesäß"
 },
 {
  "id": "plank",
  "name": "Plank (Unterarmstütz)",
  "grp": "hotel",
  "plan": "Core Training, Hotel und optional nach Einheit A",
  "saetze": "1",
  "wdh": "20 bis 40 s",
  "wl": "Halten",
  "pause": "45 bis 60 s",
  "rir": "sauber",
  "start": "Einstieg auf Knien und Unterarmen",
  "ende": "Körper eine Linie von Kopf bis Ferse",
  "punkte": [
   "Ellbogen unter den Schultern",
   "Bauch und Gesäß anspannen",
   "Ruhig weiteratmen",
   "Halten, solange die Linie sauber bleibt"
  ],
  "fehler": [
   "Hüfte hängt durch oder ragt hoch"
  ],
  "prim": [
   "abs"
  ],
  "sek": [
   "fdelt"
  ],
  "ziel": "Bauch und Rumpf"
 },
 {
  "id": "kh_bank",
  "name": "Kurzhantel Bankdrücken flach",
  "grp": "brust",
  "plan": "Einheit A1",
  "saetze": "2 → 3",
  "wdh": "8 bis 12",
  "pause": "90 bis 120 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "ersatz": "Insignia Series Chest Press, wenn die Bank belegt ist",
  "start": "Auf der Flachbank, Hanteln auf Brusthöhe, Ellbogen gebeugt",
  "ende": "Hanteln über der Brust, Ellbogen nicht durchgestreckt",
  "punkte": [
   "Schulterblätter fest auf der Bank",
   "Hanteln kontrolliert auf Brusthöhe senken",
   "Handgelenke fest, nicht abfedern",
   "Gleichmäßig nach oben drücken"
  ],
  "fehler": [
   "Hanteln knallen auf die Brust",
   "Ellbogen auf 90 Grad abgespreizt, Schultern rollen nach vorn"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "fdelt",
   "triceps"
  ],
  "ziel": "Brust, dazu vordere Schulter und Trizeps"
 },
 {
  "id": "hs_schraeg",
  "name": "Schrägpresse scheibenbeladen",
  "grp": "brust",
  "plan": "Einheit A2",
  "saetze": "2",
  "wdh": "8 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "ersatz": "Schrägbankdrücken mit Kurzhanteln",
  "start": "Sitz und Griffe auf Höhe der oberen Brust, Ellbogen gebeugt",
  "ende": "Arme nach oben vorn, beide Seiten gleich hoch",
  "punkte": [
   "Mit wenig Scheiben starten",
   "Sitz und Griffe auf Höhe der oberen Brust",
   "Beide Arme gleichmäßig drücken",
   "Kontrolliert zurück, nicht fallen lassen"
  ],
  "fehler": [
   "Eine Seite zieht deutlich stärker",
   "Schultern heben zu den Ohren"
  ],
  "prim": [
   "chest"
  ],
  "sek": [
   "fdelt",
   "triceps"
  ],
  "ziel": "Obere Brust an der Hammer Strength Schrägpresse, dazu vordere Schulter und Trizeps"
 },
 {
  "id": "kh_rudern",
  "name": "Einarmiges Kurzhantelrudern",
  "grp": "ruecken",
  "plan": "Einheit A4",
  "saetze": "2",
  "wdh": "8 bis 12",
  "pause": "90 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "ersatz": "Insignia Series Row, wenn die Bank belegt ist",
  "start": "Eine Hand und ein Knie auf der Bank, Hantel hängt nach unten",
  "ende": "Hantel am Hüftknochen, Ellbogen hinten, Schulter unten",
  "punkte": [
   "Rücken gerade, nicht rund",
   "Hantel zum Hüftknochen ziehen",
   "Schulter unten lassen",
   "Langsam ablassen, Seite wechseln"
  ],
  "fehler": [
   "Oberkörper dreht mit",
   "Schulter zieht nach oben zum Ohr"
  ],
  "prim": [
   "lats"
  ],
  "sek": [
   "biceps",
   "traps"
  ],
  "ziel": "Breiter Rückenmuskel, dazu Bizeps und oberer Rücken"
 },
 {
  "id": "seitheben",
  "name": "Seitheben Kurzhanteln",
  "grp": "schulter",
  "plan": "Einheit B4",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "ersatz": "Seitheben an der Kabelstation (Dual Adjustable Pulley)",
  "start": "Aufrecht, Hanteln seitlich an den Oberschenkeln",
  "ende": "Arme seitlich auf Schulterhöhe, Ellbogen leicht gebeugt",
  "punkte": [
   "Arme leicht gebeugt",
   "Nur bis Schulterhöhe heben",
   "Kein Schwung aus dem Oberkörper",
   "Langsam ablassen"
  ],
  "fehler": [
   "Zu hoch über die Schulter",
   "Schwung aus der Hüfte oder den Knien"
  ],
  "prim": [
   "mdelt"
  ],
  "sek": [],
  "ziel": "Seitliche Schulter"
 },
 {
  "id": "trizeps_strecker",
  "name": "Trizepsstrecker",
  "grp": "arme",
  "plan": "Einheit B7",
  "saetze": "2",
  "wdh": "10 bis 15",
  "pause": "60 s",
  "rir": "2 bis 3, ab Woche 4: 1 bis 2, Deload Woche 12: 3",
  "ersatz": "Trizeps über Kopf an der Kabelstation",
  "start": "Oberarme auf dem Polster, Unterarme angewinkelt",
  "ende": "Unterarme gestreckt, Oberarme bleiben liegen",
  "punkte": [
   "Ellbogen auf Höhe der Drehachse",
   "Oberarme fest auf dem Polster",
   "Nur die Unterarme strecken",
   "Langsam zurückbeugen"
  ],
  "fehler": [
   "Oberarme heben vom Polster ab",
   "Mit dem Oberkörper nachhelfen"
  ],
  "prim": [
   "triceps"
  ],
  "sek": [],
  "ziel": "Trizeps an der Insignia Series Triceps Extension"
 },
 {
  "id": "seitstutz",
  "name": "Seitstütz",
  "grp": "core",
  "plan": "Core Training",
  "saetze": "1",
  "wdh": "15 bis 30 s je Seite",
  "wl": "Halten",
  "pause": "kurz",
  "rir": "sauber",
  "start": "Unterarm unter der Schulter, Knie oder Füße am Boden",
  "ende": "Hüfte hoch, Körper eine Linie, Bauch fest",
  "punkte": [
   "Ellbogen unter der Schulter",
   "Hüfte hochschieben, nicht hängen lassen",
   "Oben ruhig atmen",
   "Seite wechseln"
  ],
  "fehler": [
   "Hüfte sackt nach unten",
   "Kopf hängt in den Nacken"
  ],
  "prim": ["obliques", "abs"],
  "sek": [],
  "ziel": "Seitliche Bauchmuskeln und Rumpf"
 },
 {
  "id": "birddog",
  "name": "Bird Dog",
  "grp": "core",
  "plan": "Core Training",
  "saetze": "1",
  "wdh": "6 bis 8 je Seite",
  "pause": "kurz",
  "rir": "sauber",
  "start": "Auf Händen und Knien, Rücken gerade",
  "ende": "Ein Arm nach vorn, das Gegenbein nach hinten",
  "punkte": [
   "Hände unter den Schultern, Knie unter der Hüfte",
   "Bauch fest, Becken bleibt ruhig",
   "Arm und Gegenbein langsam strecken",
   "Kurz halten, dann Seite wechseln"
  ],
  "fehler": [
   "Das Becken kippt zur Seite",
   "Hohlkreuz, statt den Bauch festzuhalten"
  ],
  "prim": ["abs", "erectors", "glutes"],
  "sek": [],
  "ziel": "Tiefer Bauch, Rücken und Gesäß"
 },
 {
  "id": "crunch",
  "name": "Crunch",
  "grp": "core",
  "plan": "Core Training",
  "saetze": "1",
  "wdh": "8 bis 12",
  "pause": "kurz",
  "rir": "sauber",
  "start": "Rücken liegt, Knie gebeugt, Füße am Boden",
  "ende": "Schultern heben ein Stück vom Boden ab",
  "punkte": [
   "Unteren Rücken am Boden lassen",
   "Nur die Schultern anheben, nicht aufrichten",
   "Ausatmen beim Hochgehen",
   "Langsam wieder ablegen"
  ],
  "fehler": [
   "Am Kopf ziehen",
   "Schwung aus der Hüfte"
  ],
  "prim": ["abs"],
  "sek": [],
  "ziel": "Gerader Bauchmuskel"
 },
 {
  "id": "revcrunch",
  "name": "Reverse Crunch",
  "grp": "core",
  "plan": "Core Training",
  "saetze": "1",
  "wdh": "8 bis 12",
  "pause": "kurz",
  "rir": "sauber",
  "start": "Rücken liegt, Beine oben angewinkelt",
  "ende": "Hüfte hebt leicht vom Boden, Knie zur Brust",
  "punkte": [
   "Hände neben dem Körper oder leicht unter dem Becken",
   "Knie bleiben gebeugt",
   "Nur die Hüfte einrollen, nicht schwingen",
   "Langsam wieder ablassen, Rücken bleibt flach"
  ],
  "fehler": [
   "Beine schwingen weit hoch",
   "Der untere Rücken hebt unkontrolliert ab"
  ],
  "prim": ["abs"],
  "sek": [],
  "ziel": "Unterer Anteil des geraden Bauchmuskels"
 },
 {
  "id": "pallof",
  "name": "Pallof Press",
  "grp": "core",
  "plan": "Core Training",
  "saetze": "1",
  "wdh": "8 bis 12 je Seite",
  "pause": "kurz",
  "rir": "sauber",
  "start": "Seitlich zum Kabel oder Band, Hände an der Brust",
  "ende": "Arme nach vorn strecken, Rumpf dreht nicht mit",
  "punkte": [
   "Kabel oder Band etwa auf Brusthöhe",
   "Zu Hause geht ein Band in der Tür",
   "Bauch fest, Knie leicht gebeugt",
   "Arme strecken und langsam zurück, Seite wechseln"
  ],
  "fehler": [
   "Der Oberkörper dreht zum Zug hin",
   "Die Schultern ziehen hoch"
  ],
  "prim": ["abs", "obliques"],
  "sek": [],
  "ziel": "Bauch und seitliche Rumpfmuskeln, ohne sich zu drehen",
  "ersatz": "Band in der Tür, wenn kein Kabel da ist"
 }
]''')
FALLBACK = ["deadbug", "multipresse"]
