"use strict";
/* Franz Fitness App v1: Daten nur lokal (localStorage), keine externen Requests */
const KEY = "franz-fitness-app-v1";
const START = new Date(2026, 10, 9); // Mo 9.11.2026 (Start um 1 Woche verschoben, vorher 2.11.)
const TOTAL = 21;
const EXD = {}; EXDATA.forEach(e => EXD[e.id] = e);
const DAYN = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const DAYL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const KG_T = [[0, 113], [4, 111], [8, 109], [12, 107], [16, 104.5], [20, 102.5], [21, 102]];
const BF_T = [[0, 29.2], [4, 27.5], [8, 26], [12, 24.5], [16, 22.5], [20, 20.5], [21, 19.8]];
const CHECKW = [4, 8, 12, 16, 20, 21];
const TRAVEL = [2, 4, 6], HOLI = [7, 8, 20, 21];
// Plan laut Karte 02: s = [Saetze Wo 1 bis 3, ab Wo 4], p = Pause in s, inc = Steigerung
const UNITS = {
  A: [{ id: "brustpresse", s: [2, 3], p: 120, inc: "+2,5 kg" }, { id: "schraegbank", s: [2, 2], p: 90, inc: "nächste Hantel (ca. +2 kg)" },
      { id: "latzug", s: [2, 3], p: 90, inc: "+2,5 kg" }, { id: "beinpresse", s: [2, 2], p: 90, inc: "+5 kg" },
      { id: "bizeps", s: [2, 2], p: 60, inc: "nächste Hantel (ca. +1 bis 2 kg)" }, { id: "trizeps_seil", s: [2, 2], p: 60, inc: "+2,5 kg" }],
  B: [{ id: "multipresse", s: [2, 3], p: 120, inc: "+2,5 kg" }, { id: "fliegende", s: [2, 2], p: 75, inc: "+2,5 kg" },
      { id: "rudern", s: [2, 3], p: 90, inc: "+2,5 kg" }, { id: "goblet", s: [2, 2], p: 90, inc: "nächste Hantel (ca. +2 kg)" },
      { id: "rdl", s: [2, 2], p: 90, inc: "nächste Hantel (ca. +2 kg)" }, { id: "hammer", s: [2, 2], p: 60, inc: "nächste Hantel (ca. +1 bis 2 kg)" },
      { id: "trizeps_ueberkopf", s: [2, 2], p: 60, inc: "+2,5 kg" }],
  H: [{ id: "liegestuetz", s: [3, 3], p: 50 }, { id: "bandrudern", s: [3, 3], p: 50 }, { id: "kniebeuge", s: [3, 3], p: 50 }, { id: "plank", s: [3, 3], p: 50, sec: true }]
};
const OPTIONAL_A = ["plank", "deadbug"];
// Ersatztermine laut Karte 09 (d = Tag in der Woche, 0 = Mo)
const OVR = {
  "2:0": { n: "Dienstreise Feldkirch ab 13:00: nur trainieren, wenn die Abreise wirklich erst mittags ist, sonst Hotel Workout." },
  "2:1": { d: 4, n: "Ersatz für Mi 18.11. (Reise, Buß und Bettag)." },
  "2:2": { d: 6, n: "So 22.11. empfohlen, damit nach Fr ein Ruhetag liegt (Sa 21.11. Kabarett)." },
  "6:1": { hotel: true, n: "Reise: Mi 16.12. nur Hotel Workout, 20 bis 30 Minuten." },
  "6:2": { d: 6, n: "Ersatz für Sa 19.12. (Rückreise)." },
  "7:2": { n: "Feiertage: Sa 26. oder So 27.12., Studio Öffnung bitte vorher prüfen." },
  "8:2": { n: "Neujahr: Sa 2.1. oder So 3.1., Studio Öffnung bitte prüfen." },
  "20:2": { d: 5, n: "Sa 27.3. trainieren, So 28.3. ist Ostersonntag." },
  "21:0": { n: "Ostermontag: Studio Öffnung prüfen. Wenn zu, auf Di 30.3. verschieben und die Mi Einheit auf Fr 2.4. (Mehr, Einheit verschieben)." },
  "21:2": { n: "Letzte Einheit. Danach Abschluss Check am So 4.4." }
};
const NOTES = {
  2: "Dienstreise Feldkirch Mo 16.11. 13:00 bis Mi 18.11. (Buß und Bettag). Mi entfällt, Ersatz Fr 20.11. früh. Sa 21.11. Kabarett, besser So 22.11.",
  4: "Weihnachtsfeier Rudolstadt Do 3.12. bis Fr 4.12.: Schwimmen Do 7:45 vor der Abreise, Fr kein Training und kein Joggen. Check Woche 4 am So 6.12.",
  6: "Reise Di 15.12. bis Sa 19.12.: Mi Hotel Workout, Do kein Schwimmen, Sa entfällt, Ersatz So 20.12.",
  7: "Weihnachten: Öffnungszeiten CrunchFit und Sportbad prüfen (Do 24.12., Fr 25.12., Sa 26.12.).",
  8: "Silvester und Neujahr: Training Sa 2.1. oder So 3.1., Öffnung prüfen. Check Woche 8 am So 3.1.",
  12: "Deload Woche: je Übung 1 Satz weniger, Gewicht gleich oder bis 10 % leichter. Check am So 31.1.",
  16: "Check Woche 16 am So 28.2.",
  20: "Gründonnerstag 25.3., Karfreitag 26.3., Ostersonntag 28.3.: Training Mo, Mi, Sa 27.3. Check Woche 20 am So 28.3. Ab 28.3. Sommerzeit.",
  21: "Ostermontag 29.3.: Studio Öffnung prüfen, sonst Di 30.3. und Fr 2.4. (dann kein Joggen). Abschluss Check am So 4.4."
};
const SPRUECHE = ["Der Start zählt. Brust raus, Plan steht.", "Erst Technik, dann Tonnen.", "Kleine Schritte, große Kurve.",
  "Woche 4: Der erste Check wartet, dein Körper merkt schon mehr als die Waage.", "Konstanz schlägt Motivation.",
  "Jede Einheit ist ein Haken für dein zukünftiges Ich.", "Schwer ist nur der Weg zur Tür, drinnen läuft es.",
  "Woche 8: Zeig dem Trend, wer hier der Chef ist.", "Gewicht auf der Stange, Ruhe im Kopf.", "Du bist schon weiter, als du denkst.",
  "Halbzeit! Elf Wochen Arbeit stecken in dir.", "Deload ist kein Rückschritt, sondern Anlauf.", "Frisch erholt, jetzt wird gesteigert.",
  "Mehr Wiederholungen, dann mehr Gewicht. So einfach.", "Brust, Arme, Rücken: das Fundament steht.",
  "Woche 16: Die Kurve geht nach unten, die Kraft nach oben.", "Der Trend ist dein Freund.", "Gleich geschafft, jetzt nicht nachlassen.",
  "Du trainierst nicht für heute, sondern für die nächsten 20 Jahre.", "Woche 20: Letzter Check vor dem Ziel. Sauber bleiben.",
  "Letzte Woche. Mach sie zu deiner besten."];
const CHEERS = ["Stark, das zählt!", "Wieder einer im Sack.", "Brust raus, Haken drin.", "Sauber!", "Ein Satz mehr, ein Zweifel weniger.", "Weiter so, Bjoern!"];
const LEVELS = [[0, "Sofa Kapitän"], [200, "Hantel Neuling"], [500, "Kabelzug Flüsterer"], [900, "Brustpresse Pirat"], [1400, "Latzug Lord"],
  [2000, "Bankdrück Baron"], [2800, "Eisen Enthusiast"], [3800, "Rekomp Rakete"], [5000, "Franz der Starke"], [6500, "Legende von Leipzig"], [8500, "Olymp von Markkleeberg"]];
const XP = { set: 5, session: 50, hotel: 40, swim: 30, jog: 30, steps: 10, prot: 10, kg: 15, bf: 25, pr: 25, week: 50 };

/* ---------- Zeit und Plan ---------- */
const P = new URLSearchParams(location.search);
function today() { const q = P.get("heute"); if (q) { const [y, m, d] = q.split("-").map(Number); return new Date(y, m - 1, d); } const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
function addD(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
function weekOf(d) { return Math.floor(Math.round((d - START) / 864e5) / 7) + 1; }
function wDate(w, d) { return addD(START, 7 * (w - 1) + d); }
function fmt(d) { return d.getDate() + "." + (d.getMonth() + 1) + "."; }
function fmtL(d) { return DAYN[(d.getDay() + 6) % 7] + " " + fmt(d); }
function same(a, b) { return a.getTime() === b.getTime(); }
function phase(w) { return w <= 3 ? "Einstieg" : w <= 9 ? "Aufbau" : w <= 11 ? "Steigerung" : w === 12 ? "Deload und Check" : w <= 20 ? "Progression" : "Abschluss"; }
function stepsGoal(w) { return w <= 4 ? 8000 : w <= 12 ? 9000 : 10000; }
function unitOf(w, s) { return (((w - 1) * 3 + s) % 2 === 0) ? "A" : "B"; }
function sess(w, s) {
  const k = w + ":" + s, o = OVR[k] || {}, sh = S.set.shift[k];
  let d = s === 0 ? 0 : s === 1 ? 2 : (S.set.we === "so" ? 6 : 5);
  if (o.d !== undefined) d = o.d;
  if (sh !== undefined) d = sh;
  const hotel = !!o.hotel && !S.set.noHotel?.[k];
  return { k, w, s, d, date: wDate(w, d), unit: hotel ? "H" : unitOf(w, s), plan: unitOf(w, s), note: o.n || "", shifted: sh !== undefined };
}
function weekSess(w) { return [0, 1, 2].map(s => sess(w, s)); }
function rir(w) { return w <= 3 ? "3" : w === 12 ? "4" : "2 bis 3"; }
function setsFor(w, s, idx, u) {
  const def = UNITS[u][idx]; let n = w <= 3 ? def.s[0] : def.s[1];
  if (u !== "H" && w >= 4 && s === 2 && idx === 0) n = 2; // Karte 02: in der dritten Einheit bleibt die erste Brustübung bei 2 Saetzen
  if (w === 12 && u !== "H") n = Math.max(1, n - 1);
  return n;
}
function repRange(id) { const m = (EXD[id].wdh || "").match(/(\d+)\s*bis\s*(\d+)/); return m ? [+m[1], +m[2]] : [8, 12]; }

/* ---------- Speicher ---------- */
function blank() { return { v: 1, set: { we: "sa", shift: {} }, done: {}, logs: {}, act: {}, meas: {}, seen: [], lvl: 0, okSeen: [] }; }
let S = blank(), storageOK = true;
function load() {
  try { const r = localStorage.getItem(KEY); if (r) { const p = JSON.parse(r); S = Object.assign(blank(), p); S.set = Object.assign({ we: "sa", shift: {} }, p.set || {}); } }
  catch (e) { storageOK = false; }
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); storageOK = true; } catch (e) { storageOK = false; } }

/* ---------- Auswertung ---------- */
const act = (w, k) => S.act[w + ":" + k] === true;
const isDone = (w, s) => !!S.done[w + ":" + s];
function kraftCount(w) { const t = [0, 1, 2].filter(s => isDone(w, s) && sess(w, s).unit !== "H").length; return TRAVEL.includes(w) && act(w, "hw") && t < 3 ? t + 1 : t; }
const okWeek = w => kraftCount(w) >= 2;
function sessionsFlat() { const o = []; for (let w = 1; w <= TOTAL; w++) { let b = TRAVEL.includes(w) && act(w, "hw"); for (let s = 0; s < 3; s++) { let v = isDone(w, s) && sess(w, s).unit !== "H"; if (!v && b) { v = true; b = false; } o.push(v); } } return o; }
function curWeek() { return Math.min(TOTAL, Math.max(1, weekOf(today()))); }
function stats() {
  let last = 0; for (let w = 1; w <= TOTAL; w++) if (kraftCount(w) > 0) last = w;
  let i = Math.max(weekOf(today()) < 1 ? 0 : curWeek(), last);
  if (i >= 1 && !okWeek(i)) i--;
  let weekStreak = 0; while (i >= 1 && okWeek(i)) { weekStreak++; i--; }
  let bestWeek = 0, run = 0; for (let w = 1; w <= TOTAL; w++) { if (okWeek(w)) { run++; bestWeek = Math.max(bestWeek, run); } else run = 0; }
  const ss = sessionsFlat(); let li = -1; ss.forEach((v, j) => { if (v) li = j; });
  let sessStreak = 0; for (let j = li; j >= 0 && ss[j]; j--) sessStreak++;
  return { weekStreak, bestWeek, sessStreak, total: ss.filter(Boolean).length };
}
function e1rm(kg, r) { return kg * (1 + r / 30); }
function allLogs() { // chronologisch: [{k,w,s,date,id,sets}]
  const out = [];
  Object.keys(S.logs).forEach(k => { const [w, s] = k.split(":").map(Number); const se = sess(w, s);
    Object.keys(S.logs[k]).forEach(id => { const sets = (S.logs[k][id] || []).filter(x => x && x.done); if (sets.length) out.push({ k, w, s, date: se.date, id, sets }); }); });
  return out.sort((a, b) => a.date - b.date || a.w - b.w || a.s - b.s);
}
function records() { // Bestleistung = neues Hoechstgewicht bei mindestens unterer Wiederholungszahl, max. 1 pro Uebung und Einheit
  const best = {}, prs = []; let firstSet = false;
  allLogs().forEach(L => { const lo = repRange(L.id)[0]; let top = null;
    L.sets.forEach(x => { if (x.r > 0) firstSet = true; if (x.kg > 0 && x.r >= lo && (!top || x.kg > top.kg || (x.kg === top.kg && x.r > top.r))) top = x; });
    if (!top) return; const b = best[L.id];
    if (b && top.kg > b.kg) prs.push({ id: L.id, kg: top.kg, r: top.r, date: L.date, k: L.k });
    if (!b || top.kg > b.kg || (top.kg === b.kg && top.r > b.r)) best[L.id] = { kg: top.kg, r: top.r, date: L.date }; });
  return { best, prs, firstSet };
}
function countSets() { let n = 0; Object.values(S.logs).forEach(o => Object.values(o).forEach(a => a.forEach(x => { if (x && x.done) n++; }))); return n; }
function xpInfo() {
  let x = 0; const b = {};
  const add = (k, n) => { b[k] = (b[k] || 0) + n * XP[k]; x += n * XP[k]; };
  add("set", countSets());
  let ses = 0, hot = 0, sw = 0, jo = 0, st = 0, pr = 0, kg = 0, bf = 0, wk = 0;
  for (let w = 1; w <= TOTAL; w++) {
    for (let s = 0; s < 3; s++) if (isDone(w, s) && sess(w, s).unit !== "H") ses++;
    if (act(w, "hw")) hot++; if (act(w, "sw")) sw++; if (act(w, "jo")) jo++;
    for (let d = 0; d < 7; d++) { if (act(w, "st" + d)) st++; if (act(w, "pr" + d)) pr++; }
    if (num(S.meas[w + ":kg"]) > 0) kg++; if (num(S.meas[w + ":bf"]) > 0) bf++;
    if (okWeek(w)) wk++;
  }
  add("session", ses); add("hotel", hot); add("swim", sw); add("jog", jo); add("steps", st); add("prot", pr); add("kg", kg); add("bf", bf); add("week", wk);
  add("pr", records().prs.length);
  let li = 0; LEVELS.forEach((l, i) => { if (x >= l[0]) li = i; });
  const cur = LEVELS[li][0], nxt = LEVELS[li + 1] ? LEVELS[li + 1][0] : cur;
  return { xp: x, parts: b, lvl: li + 1, name: LEVELS[li][1], cur, nxt, pct: nxt > cur ? (x - cur) / (nxt - cur) : 1 };
}
function badges() {
  const st = stats(), R = records(), X = xpInfo();
  let hotel = false, swim = 0, jog = 0, fs = false, fp = false, fw = false, wts = 0;
  for (let w = 1; w <= TOTAL; w++) {
    if (act(w, "sw")) swim++; if (act(w, "jo")) jog++; if (TRAVEL.includes(w) && act(w, "hw")) hotel = true;
    if ([0, 1, 2, 3, 4, 5, 6].every(d => act(w, "st" + d))) fs = true;
    if ([0, 1, 2, 3, 4, 5, 6].every(d => act(w, "pr" + d))) fp = true;
    if (kraftCount(w) === 3) fw = true; if (num(S.meas[w + ":kg"]) > 0) wts++;
  }
  return [
    ["b1", "🏁", "Erste Einheit", "Die erste Krafteinheit ist abgehakt.", st.total >= 1],
    ["b18", "✍️", "Erster Satz", "Den ersten Satz im Logger eingetragen.", R.firstSet],
    ["b2", "📅", "Erste Woche", "Woche 1 mit mindestens 2 von 3 Einheiten.", okWeek(1)],
    ["b3", "💯", "Volle Woche", "Eine Woche mit allen 3 Krafteinheiten.", fw],
    ["b4", "🔟", "10 Einheiten", "10 Krafteinheiten geschafft.", st.total >= 10],
    ["b5", "🔥", "4 Wochen Streak", "4 Wochen in Folge mit mindestens 2 von 3.", st.bestWeek >= 4],
    ["b6", "⛳", "Halbzeit", "Woche 11 mit mindestens 2 von 3 geschafft.", okWeek(11)],
    ["b7", "🧘", "Deload gemeistert", "Woche 12 trotz Entlastung dabei.", okWeek(12)],
    ["b8", "🥈", "25 Einheiten", "25 Krafteinheiten geschafft.", st.total >= 25],
    ["b9", "🚀", "8 Wochen Streak", "8 Wochen in Folge mit mindestens 2 von 3.", st.bestWeek >= 8],
    ["b10", "🏊", "Schwimmer", "4 Wochen mit Schwimmen.", swim >= 4],
    ["b11", "🏃", "Läufer", "3 Wochen mit lockerem Joggen.", jog >= 3],
    ["b12", "👟", "Schrittmacher", "Eine Woche Schrittziel an allen 7 Tagen.", fs],
    ["b13", "🥚", "Eiweiß Profi", "Eine Woche Eiweißziel an allen 7 Tagen.", fp],
    ["b14", "⚖️", "Messpunkt", "In 4 Wochen das Gewicht eingetragen.", wts >= 4],
    ["b17", "🧳", "Hotel Held", "Ein Hotel Workout in einer Reisewoche.", hotel],
    ["b19", "🏆", "Neue Bestleistung", "Erste persönliche Bestleistung geknackt.", R.prs.length >= 1],
    ["b20", "💪", "5 Bestleistungen", "Fünf persönliche Rekorde.", R.prs.length >= 5],
    ["b15", "🥇", "50 Einheiten", "50 von 63 Krafteinheiten.", st.total >= 50],
    ["b16", "🎯", "Zielgerade", "Woche 21 mit mindestens 2 von 3.", okWeek(21)],
    ["b21", "⭐", "Level 5", "Level 5 erreicht: " + LEVELS[4][1] + ".", X.lvl >= 5]
  ].map(a => ({ id: a[0], i: a[1], t: a[2], d: a[3], on: !!a[4] }));
}
function num(v) { if (v === undefined || v === null || v === "") return NaN; return parseFloat(String(v).replace(",", ".")); }
function f1(v, d = 1) { return isNaN(v) ? "" : v.toFixed(d).replace(".", ","); }
function interp(pts, w) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (w <= b[0]) return a[1] + (b[1] - a[1]) * (w - a[0]) / (b[0] - a[0]); } return pts[pts.length - 1][1]; }

/* ---------- UI Helfer ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let tab = "heute", openK = null, viewWeek = null, strengthEx = "brustpresse", progWeek = null;
function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 2600); }
function lastSets(id, beforeK) { // letzte Einheit mit dieser Uebung vor beforeK
  const se = beforeK ? sess(...beforeK.split(":").map(Number)) : null;
  const L = allLogs().filter(l => l.id === id && l.k !== beforeK && (!se || l.date <= se.date));
  return L.length ? L[L.length - 1] : null;
}
function progressHint(id, sets, n) {
  const [lo, hi] = repRange(id); const def = Object.values(UNITS).flat().find(u => u.id === id) || {};
  if (sets && sets.length >= Math.min(n, 2) && sets.every(x => x.r >= hi)) return { g: true, t: "Obergrenze erreicht, nächstes Mal " + (def.inc || "+2,5 kg") + " und wieder bei " + lo + " Wdh. starten." };
  return null;
}

/* ---------- Konfetti ---------- */
function confetti(big) {
  const c = $("#fx"), x = c.getContext("2d"); c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; x.scale(devicePixelRatio, devicePixelRatio);
  const cols = ["#3ddc97", "#ff9f43", "#4da3ff", "#b99bff", "#ffd166", "#ff6b6b"], N = big ? 180 : 70, ps = [];
  for (let i = 0; i < N; i++) ps.push({ x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .35, vx: (Math.random() - .5) * (big ? 14 : 9), vy: -Math.random() * (big ? 14 : 10) - 3, r: Math.random() * 6 + 3, c: cols[i % 6], a: Math.random() * 6, va: (Math.random() - .5) * .4 });
  let t = 0; (function f() { x.clearRect(0, 0, innerWidth, innerHeight); ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.a += p.va; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.c; x.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); x.restore(); });
    if (++t < 110) requestAnimationFrame(f); else x.clearRect(0, 0, innerWidth, innerHeight); })();
}
function celebrateCheck() {
  const B = badges(), X = xpInfo(); let msg = null, big = false;
  const nb = B.filter(b => b.on && !S.seen.includes(b.id));
  if (nb.length) { S.seen.push(...nb.map(b => b.id)); msg = "Abzeichen: " + nb.map(b => b.i + " " + b.t).join(", "); big = true; }
  if (X.lvl > (S.lvl || 1)) { msg = (msg ? msg + " · " : "") + "Level " + X.lvl + ": " + X.name; big = true; }
  S.lvl = Math.max(S.lvl || 1, X.lvl);
  for (let w = 1; w <= TOTAL; w++) if (okWeek(w) && !S.okSeen.includes(w)) { S.okSeen.push(w); msg = msg || ("Woche " + w + " zählt für den Streak! +" + XP.week + " XP"); big = big || false; confetti(false); }
  if (msg) { confetti(big); toast(msg); }
  save();
}

/* ---------- Pausentimer ---------- */
let T = { end: 0, len: 0, iv: null }, AC = null;
function beep() { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = 880; o.connect(g); g.connect(AC.destination); g.gain.setValueAtTime(.25, AC.currentTime); g.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .6); o.start(); o.stop(AC.currentTime + .6); } catch (e) { } if (navigator.vibrate) navigator.vibrate([200, 100, 200]); }
function startTimer(sec) { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } T.len = sec; T.end = Date.now() + sec * 1000; clearInterval(T.iv); T.iv = setInterval(tick, 250); tick(); $("#timer").classList.add("on"); }
function tick() { const r = Math.max(0, Math.round((T.end - Date.now()) / 1000)); $("#tt").textContent = Math.floor(r / 60) + ":" + String(r % 60).padStart(2, "0"); $("#tb").style.width = (100 * (1 - r / T.len)) + "%";
  if (r <= 0) { clearInterval(T.iv); $("#tt").textContent = "Los!"; $("#tl").textContent = "Pause vorbei, nächster Satz"; beep(); setTimeout(() => $("#timer").classList.remove("on"), 4000); } else $("#tl").textContent = "Pause, durchatmen"; }

/* ---------- Render ---------- */
function header() {
  const X = xpInfo();
  return `<div class="top"><div class="brand">Franz Fitness<small>Plan Woche 1 bis 21</small></div>
  <div class="lvl"><b>Level ${X.lvl} · ${esc(X.name)}</b><div class="xpbar"><i style="width:${Math.round(X.pct * 100)}%"></i></div><span class="xs mu">${X.xp} XP${X.nxt > X.cur ? " · noch " + (X.nxt - X.xp) + " bis Lvl " + (X.lvl + 1) : ""}</span></div></div>
  ${storageOK ? "" : '<div class="note">Speichern im Browser ist gerade nicht möglich. Bitte regelmäßig exportieren.</div>'}`;
}
function render() {
  let h = header();
  if (tab === "heute") h += vHeute(); else if (tab === "woche") h += vWoche(); else if (tab === "fort") h += vFort(); else if (tab === "erfolge") h += vErfolge(); else h += vMehr();
  $("#app").innerHTML = h;
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
}
function unitBadge(u) { return `<span class="unit u${u}">${u === "H" ? "🧳" : u}</span>`; }
function unitName(u) { return u === "H" ? "Hotel Workout" : "Einheit " + u; }
function vHeute() {
  const t = today(), w0 = weekOf(t);
  let h = "";
  if (w0 < 1) h += `<div class="card hero"><div class="sm mu">Countdown</div><div class="big">Noch ${Math.round((START - t) / 864e5)} Tage bis zum Start</div><div class="sm" style="margin-top:6px">Woche 1 beginnt am Mo 9.11.2026 mit Einheit A. Du kannst dir die Übungen schon anschauen.</div></div>`;
  if (w0 > TOTAL) h += `<div class="card hero"><div class="big">Plan geschafft! 🎉</div><div class="sm">21 Wochen sind vorbei. Schau in Fortschritt und Erfolge, was du erreicht hast.</div></div>`;
  const w = Math.min(TOTAL, Math.max(1, w0));
  const ws = weekSess(w); let cur = ws.find(x => same(x.date, t));
  let next = null; if (!cur) { for (let ww = w; ww <= Math.min(TOTAL, w + 1) && !next; ww++) next = weekSess(ww).find(x => x.date >= t && !isDone(x.w, x.s)); }
  const sel = openK ? sess(...openK.split(":").map(Number)) : (cur || next || ws[0]);
  if (w0 >= 1 && w0 <= TOTAL) {
    h += `<div class="card hero"><div class="row sp"><div><div class="sm mu">${fmtL(t)} · Woche ${w} von 21 · ${phase(w)}</div>
    <div class="big">${cur ? "Heute: " + unitName(cur.unit) : "Heute trainingsfrei"}</div>
    <div class="sm" style="margin-top:4px">${cur ? (isDone(cur.w, cur.s) ? "Erledigt ✅ Stark!" : "Früh vor der Arbeit, ca. 60 bis 70 Minuten.") : next ? "Nächste Einheit: " + fmtL(next.date) + ", " + unitName(next.unit) : "Diese Woche ist durch."}</div></div>
    ${unitBadge(cur ? cur.unit : next ? next.unit : "A")}</div>
    ${NOTES[w] ? `<div class="note">${esc(NOTES[w])}</div>` : ""}<div class="quote">„${esc(SPRUECHE[w - 1])}“</div></div>`;
  }
  // Einheiten der Woche
  const wsel = sel.w;
  h += `<div class="card"><h2>Einheiten Woche ${wsel}</h2><div class="grid3">` + weekSess(wsel).map(x => `<button class="btn ${x.k === sel.k ? "" : "sec"}" data-open="${x.k}" style="flex-direction:column;gap:0;padding:8px 4px">
    <span style="font-size:13px">${fmtL(x.date)}</span><span>${unitName(x.unit).replace("Einheit ", "")}${isDone(x.w, x.s) ? " ✅" : ""}</span></button>`).join("") + `</div>
    <div class="row sp" style="margin-top:8px"><button class="btn sec" data-wk="${Math.max(1, wsel - 1)}">◀ Woche</button><span class="sm mu">${fmt(wDate(wsel, 0))} bis ${fmt(wDate(wsel, 6))}</span><button class="btn sec" data-wk="${Math.min(TOTAL, wsel + 1)}">Woche ▶</button></div></div>`;
  h += vSession(sel);
  h += vActs(Math.min(TOTAL, Math.max(1, w0 < 1 ? 1 : w0)), t);
  return h;
}
function vSession(se) {
  const u = se.unit, list = UNITS[u], lg = S.logs[se.k] || {};
  let h = `<div class="card" id="sess"><div class="row sp"><div class="row">${unitBadge(u)}<div><h2 style="margin:0">${unitName(u)}</h2><div class="sm mu">${DAYL[se.d]} ${fmt(se.date)} · RIR ${u === "H" ? "1 bis 2" : rir(se.w)}${se.w === 12 && u !== "H" ? " · Deload" : ""}</div></div></div>
  ${isDone(se.w, se.s) ? '<span class="chip g">erledigt</span>' : ""}</div>`;
  if (se.note) h += `<div class="note">${esc(se.note)}</div>`;
  if (u === "H") h += `<div class="sm mu" style="margin-top:6px">3 Runden, 45 bis 60 Sekunden Pause. Zählt in Reisewochen zusammen mit 1 Studio Einheit für den Streak.</div>`;
  if (se.w === 12 && u !== "H") h += `<div class="note">Deload: je Übung 1 Satz weniger, Gewicht gleich oder bis 10 % leichter.</div>`;
  list.forEach((def, i) => {
    const e = EXD[def.id], n = setsFor(se.w, se.s, i, u), cur = lg[def.id] || [], last = lastSets(def.id, se.k);
    const lastTxt = last ? "Letztes Mal (" + fmt(last.date) + "): " + last.sets.map(x => (x.kg ? f1(x.kg, x.kg % 1 ? 1 : 0) + " kg × " : "") + x.r).join(", ") : "Noch kein Eintrag, starte leicht und sauber.";
    const lastTop = last ? Math.max(0, ...last.sets.map(x => x.kg || 0)) : 0, raised = cur.some(x => x && x.done && x.kg > lastTop);
    const hint = u === "H" || raised ? null : progressHint(def.id, last && last.sets, n), hintNow = u === "H" ? null : progressHint(def.id, cur.filter(x => x && x.done), n);
    h += `<div class="ex"><div class="exh" data-guide="${def.id}"><img class="thumb" src="${IMG[def.id]}" alt=""><div><div class="exn">${i + 1}. ${esc(e.name)}</div>
      <div class="row wrapc" style="gap:4px;margin-top:4px"><span class="chip">${n} × ${esc(def.sec ? e.wdh : e.wdh)}</span><span class="chip">Pause ${esc(e.pause)}</span><span class="chip b">Anleitung ›</span></div></div></div>
      <div class="last">${esc(lastTxt)}</div>${hint ? `<div class="hint g">⬆️ ${esc(hint.t)}</div>` : ""}<div class="sets">`;
    const rows = Math.max(n, cur.length);
    for (let j = 0; j < rows; j++) {
      const x = cur[j] || {}, prev = j > 0 && cur[j - 1] && cur[j - 1].done ? cur[j - 1] : null, pre = prev ? prev : last && last.sets[j] ? last.sets[j] : last && last.sets.length ? last.sets[last.sets.length - 1] : null;
      h += `<div class="set"><span class="no">${j + 1}</span>
        <input inputmode="decimal" placeholder="${pre && pre.kg ? f1(pre.kg, pre.kg % 1 ? 1 : 0) : (u === "H" ? "KG opt." : "kg")}" value="${x.kg !== undefined && x.kg !== null && x.kg !== "" ? f1(x.kg, x.kg % 1 ? 1 : 0) : ""}" data-in="${se.k}|${def.id}|${j}|kg" aria-label="Gewicht Satz ${j + 1}">
        <input inputmode="numeric" placeholder="${def.sec ? "Sek." : pre ? pre.r : "Wdh."}" value="${x.r || ""}" data-in="${se.k}|${def.id}|${j}|r" aria-label="Wiederholungen Satz ${j + 1}">
        <button class="ok ${x.done ? "on" : ""}" data-set="${se.k}|${def.id}|${j}|${def.p}" aria-label="Satz ${j + 1} erledigt">✓</button></div>`;
    }
    h += `</div><div class="row sp" style="margin-top:6px"><button class="sm mu" data-add="${se.k}|${def.id}">+ Satz</button><span class="xs mu">${e.rir && u !== "H" ? "" : ""}</span></div>${hintNow && !hint ? `<div class="hint g">🎯 ${esc(hintNow.t)}</div>` : ""}</div>`;
  });
  if (u === "A") h += `<div class="sm mu" style="margin-top:6px">Optional zum Schluss: <button class="chip b" data-guide="plank">Plank</button> oder <button class="chip b" data-guide="deadbug">Dead Bug</button>, 2 Sätze à 20 bis 40 Sekunden.</div>`;
  h += `<button class="btn full" style="margin-top:12px" data-finish="${se.k}">${isDone(se.w, se.s) ? "Erledigt ✅ (nochmal tippen zum Zurücknehmen)" : u === "H" ? "Hotel Workout abschließen (+" + XP.hotel + " XP)" : "Einheit abschließen (+" + XP.session + " XP)"}</button></div>`;
  return h;
}
function tickRow(key, label, sub, on) { return `<div class="tick" data-act="${key}"><span class="box ${on ? "on" : ""}">${on ? "✓" : ""}</span><div><div style="font-weight:600">${label}</div><div class="xs mu">${sub}</div></div></div>`; }
function vActs(w, t) {
  const d = Math.min(6, Math.max(0, Math.round((t - wDate(w, 0)) / 864e5)));
  const travel = TRAVEL.includes(w);
  return `<div class="card"><h2>Heute und diese Woche</h2>
  ${tickRow(w + ":st" + d, "Schritte heute: " + stepsGoal(w).toLocaleString("de-DE"), DAYN[d] + " · +" + XP.steps + " XP", act(w, "st" + d))}
  ${tickRow(w + ":pr" + d, "Eiweiß heute: 160 bis 190 g", "3 bis 4 eiweißreiche Mahlzeiten · +" + XP.prot + " XP", act(w, "pr" + d))}
  ${tickRow(w + ":sw", "Schwimmen (meist Do 7:45)", "Locker, Zone 2 · +" + XP.swim + " XP", act(w, "sw"))}
  ${tickRow(w + ":jo", "Joggen locker", "Gehen und Joggen im Wechsel, nie am Tag nach Beinen · +" + XP.jog + " XP", act(w, "jo"))}
  ${tickRow(w + ":hw", "Hotel Workout" + (travel ? " (Reisewoche)" : ""), (travel ? "Zählt mit 1 Studio Einheit für den Streak" : "Zählt nur in Reisewochen (2, 4, 6) für den Streak") + " · +" + XP.hotel + " XP", act(w, "hw"))}
  </div>`;
}
function vWoche() {
  const cw = weekOf(today()), st = stats();
  let h = `<div class="card"><h2>🔥 Streak</h2><div class="kpi"><div><b>${st.weekStreak}</b><span>Wochen in Folge</span></div><div><b>${st.sessStreak}</b><span>Einheiten in Folge</span></div><div><b>${st.total}/63</b><span>Krafteinheiten</span></div></div>
   <div class="xs mu" style="margin-top:8px">Eine Woche zählt mit mindestens 2 von 3 Krafteinheiten. Reisewochen (2, 4, 6): 1 Einheit plus Hotel Workout reicht.</div>
   <div class="prog" style="margin-top:10px"><i style="width:${Math.round(100 * Math.min(21, Math.max(0, cw)) / 21)}%"></i></div><div class="xs mu" style="margin-top:4px">Woche ${Math.max(0, Math.min(21, cw))} von 21</div></div>`;
  h += `<div class="card"><h2>Wochenübersicht 1 bis 21</h2>`;
  for (let w = 1; w <= TOTAL; w++) {
    const ws = weekSess(w);
    h += `<div class="wk" data-wkopen="${w}"><span class="n ${okWeek(w) ? "ok" : ""} ${w === cw ? "cur" : ""}">${w}</span>
     <div><div class="sm" style="font-weight:600">${fmt(wDate(w, 0))} bis ${fmt(wDate(w, 6))} · ${phase(w)}${TRAVEL.includes(w) ? " 🧳" : ""}${HOLI.includes(w) ? " 🎄" : ""}${CHECKW.includes(w) ? " 📏" : ""}</div>
     ${NOTES[w] ? `<div class="xs mu">${esc(NOTES[w])}</div>` : ""}</div>
     <div class="dots">${ws.map(x => `<span class="dot ${x.unit} ${isDone(x.w, x.s) || (x.unit === "H" && act(w, "hw")) ? "on" : ""}">${x.unit === "H" ? "H" : x.unit}</span>`).join("")}${act(w, "sw") ? "🏊" : ""}${act(w, "jo") ? "🏃" : ""}${TRAVEL.includes(w) && act(w, "hw") && !ws.some(x => x.unit === "H") ? "🧳" : ""}</div></div>`;
    if (viewWeek === w) h += vWeekDetail(w);
  }
  return h + `</div>`;
}
function vWeekDetail(w) {
  let h = `<div class="card" style="background:var(--p2);margin:6px 0 10px"><div class="sm mu">Tippen zum Abhaken (ohne Satzdaten möglich)</div>`;
  weekSess(w).forEach(x => { h += tickRow("done:" + x.k, fmtL(x.date) + " · " + unitName(x.unit), x.note || (x.shifted ? "verschoben" : "laut Plan"), isDone(x.w, x.s)); });
  h += tickRow(w + ":sw", "Schwimmen", "Do", act(w, "sw")) + tickRow(w + ":jo", "Joggen", "locker", act(w, "jo")) + tickRow(w + ":hw", "Hotel Workout", TRAVEL.includes(w) ? "Reisewoche" : "zählt nur in Reisewochen", act(w, "hw"));
  h += `<div class="sm" style="margin-top:8px">Schritte ${stepsGoal(w).toLocaleString("de-DE")} pro Tag</div><div class="days">` + DAYN.map((d, i) => `<button class="${act(w, "st" + i) ? "on" : ""}" data-act="${w}:st${i}">${d}</button>`).join("") + `</div>
   <div class="sm" style="margin-top:8px">Eiweiß 160 bis 190 g</div><div class="days">` + DAYN.map((d, i) => `<button class="${act(w, "pr" + i) ? "on" : ""}" data-act="${w}:pr${i}">${d}</button>`).join("") + `</div>
   <button class="btn sec full" style="margin-top:10px" data-gow="${w}">Einheiten dieser Woche öffnen</button></div>`;
  return h;
}
function chart(points, tgt, ymin, ymax, band, unit, color) {
  const W = 340, H = 190, L = 34, R = 8, Tp = 10, B = 24, xw = x => L + (W - L - R) * x / 21, yh = y => Tp + (H - Tp - B) * (1 - (y - ymin) / (ymax - ymin));
  let s = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block">`;
  for (let y = Math.ceil(ymin); y <= ymax; y += (ymax - ymin > 12 ? 4 : 2)) s += `<line x1="${L}" x2="${W - R}" y1="${yh(y)}" y2="${yh(y)}" stroke="#232d3b"/><text x="${L - 4}" y="${yh(y) + 4}" fill="#8798ad" font-size="10" text-anchor="end">${y}</text>`;
  [0, 4, 8, 12, 16, 20].forEach(x => s += `<text x="${xw(x)}" y="${H - 6}" fill="#8798ad" font-size="10" text-anchor="middle">${x === 0 ? "Start" : "Wo " + x}</text>`);
  if (tgt) { let up = "", dn = ""; for (let x = 0; x <= 21; x += .5) { up += `${xw(x)},${yh(interp(tgt, x) + band)} `; dn = `${xw(x)},${yh(interp(tgt, x) - band)} ` + dn; }
    s += `<polygon points="${up}${dn}" fill="${color}" fill-opacity=".12"/>`;
    s += `<polyline points="${tgt.map(p => xw(p[0]) + "," + yh(p[1])).join(" ")}" fill="none" stroke="${color}" stroke-opacity=".55" stroke-dasharray="4 4" stroke-width="1.5"/>`; }
  if (points.length) { s += `<polyline points="${points.map(p => xw(p[0]) + "," + yh(p[1])).join(" ")}" fill="none" stroke="#eaf0f6" stroke-width="2.2"/>`;
    points.forEach(p => s += `<circle cx="${xw(p[0])}" cy="${yh(p[1])}" r="3.6" fill="#eaf0f6" stroke="${color}" stroke-width="2"/>`); }
  else s += `<text x="${W / 2}" y="${H / 2}" fill="#8798ad" font-size="12" text-anchor="middle">Noch keine Werte, trag den ersten ein.</text>`;
  return s + "</svg>";
}
function vFort() {
  const cw = Math.min(TOTAL, Math.max(1, weekOf(today()))), w = progWeek || cw;
  const kgP = [[0, 113]], bfP = [[0, 29.2]], waP = [];
  for (let i = 0; i <= TOTAL; i++) { const a = num(S.meas[i + ":kg"]), b = num(S.meas[i + ":bf"]), c = num(S.meas[i + ":wa"]); if (a > 0 && i > 0) kgP.push([i, a]); if (b > 0 && i > 0) bfP.push([i, b]); if (c > 0) waP.push([i, c]); }
  const tg = interp(KG_T, w), tb = interp(BF_T, w);
  let h = `<div class="card"><h2>📏 Messwerte eintragen</h2><div class="row sp"><button class="btn sec" data-pw="${Math.max(0, w - 1)}">◀</button><div style="text-align:center"><b>${w === 0 ? "Startwerte (Woche 0)" : "Woche " + w}</b><div class="xs mu">${w ? fmt(wDate(w, 0)) + " bis " + fmt(wDate(w, 6)) : "vor dem 9.11."}${CHECKW.includes(w) ? " · Check Woche" : ""}</div></div><button class="btn sec" data-pw="${Math.min(TOTAL, w + 1)}">▶</button></div>
  <div class="grid3" style="margin-top:10px"><div><label class="f">Gewicht kg</label><input inputmode="decimal" data-meas="${w}:kg" value="${esc(S.meas[w + ":kg"] || "")}" placeholder="${w ? "Ziel " + f1(tg) : "113"}"></div>
  <div><label class="f">Taille cm</label><input inputmode="decimal" data-meas="${w}:wa" value="${esc(S.meas[w + ":wa"] || "")}" placeholder="${w ? "Nabelhöhe" : "Startwert"}"></div>
  <div><label class="f">Körperfett %${CHECKW.includes(w) ? " ⭐" : ""}</label><input inputmode="decimal" data-meas="${w}:bf" value="${esc(S.meas[w + ":bf"] || "")}" placeholder="${w ? "Ziel " + f1(tb) : "29,2"}"></div></div>
  <div class="xs mu" style="margin-top:6px">Gewicht morgens nüchtern, wöchentlich. Körperfett alle 4 Wochen (Wo 4, 8, 12, 16, 20, 21), Withings, nur der Trend zählt. Kreatin kann 1 bis 2 kg Wasser bringen.</div></div>`;
  h += `<div class="card"><h2>⚖️ Gewicht gegen Zielkorridor</h2>${chart(kgP, KG_T, 98, 116, 1, "kg", "#3ddc97")}<div class="xs mu">Grün: Ziel ±1 kg (113 → 111 / 109 / 107 / 104,5 / 102,5 → ca. 102 kg).</div></div>`;
  h += `<div class="card"><h2>📉 Körperfett gegen Zielkorridor</h2>${chart(bfP, BF_T, 16, 32, 1, "%", "#ff9f43")}<div class="xs mu">Orange: Ziel ±1 Prozentpunkt (29,2 → 27,5 / 26 / 24,5 / 22,5 / 20,5 → unter 20 %).</div></div>`;
  if (waP.length) { const lo = Math.floor(Math.min(...waP.map(p => p[1])) - 3), hi = Math.ceil(Math.max(...waP.map(p => p[1])) + 3); h += `<div class="card"><h2>📐 Taille</h2>${chart(waP, null, lo, hi, 0, "cm", "#4da3ff")}<div class="xs mu">Kein fester Zielwert, der Trend nach unten zählt.</div></div>`; }
  // Kraftverlauf
  const ids = [...UNITS.A, ...UNITS.B].map(u => u.id), R = records();
  const L = allLogs().filter(l => l.id === strengthEx);
  const pts = L.map(l => ({ d: l.date, v: Math.max(...l.sets.filter(x => x.kg > 0 && x.r > 0).map(x => e1rm(x.kg, x.r)), 0), top: l.sets.reduce((a, x) => x.kg > a.kg ? x : a, { kg: 0, r: 0 }) })).filter(p => p.v > 0);
  h += `<div class="card"><h2>💪 Kraftverlauf je Übung</h2><select data-sx>${ids.map(i => `<option value="${i}" ${i === strengthEx ? "selected" : ""}>${esc(EXD[i].name)}</option>`).join("")}</select>`;
  if (pts.length) {
    const vs = pts.map(p => p.v), lo = Math.floor(Math.min(...vs) * .9), hi = Math.ceil(Math.max(...vs) * 1.08), W = 340, H = 160;
    const xx = i => 30 + (W - 40) * (pts.length === 1 ? .5 : i / (pts.length - 1)), yy = v => 10 + (H - 34) * (1 - (v - lo) / Math.max(1, hi - lo));
    h += `<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;margin-top:8px"><polyline points="${pts.map((p, i) => xx(i) + "," + yy(p.v)).join(" ")}" fill="none" stroke="#3ddc97" stroke-width="2.4"/>${pts.map((p, i) => `<circle cx="${xx(i)}" cy="${yy(p.v)}" r="4" fill="#3ddc97"/><text x="${xx(i)}" y="${H - 6}" font-size="10" fill="#8798ad" text-anchor="middle">${fmt(p.d)}</text>`).join("")}<text x="4" y="${yy(hi) + 10}" font-size="10" fill="#8798ad">${Math.round(hi)}</text><text x="4" y="${yy(lo)}" font-size="10" fill="#8798ad">${Math.round(lo)}</text></svg>
    <div class="xs mu">Linie: geschätztes Maximum (e1RM nach Epley) je Einheit, nur zum Vergleich mit dir selbst.</div>
    <table style="margin-top:6px"><tr><th>Datum</th><th>Bester Satz</th><th>e1RM</th></tr>${pts.slice(-5).reverse().map(p => `<tr><td>${fmt(p.d)}</td><td>${f1(p.top.kg, p.top.kg % 1 ? 1 : 0)} kg × ${p.top.r}</td><td>${f1(p.v)} kg</td></tr>`).join("")}</table>`;
  } else h += `<div class="sm mu" style="margin-top:8px">Noch keine Sätze mit Gewicht für diese Übung.</div>`;
  if (R.best[strengthEx]) h += `<div class="hint g">🏆 Bestleistung: ${f1(R.best[strengthEx].kg, R.best[strengthEx].kg % 1 ? 1 : 0)} kg × ${R.best[strengthEx].r} am ${fmt(R.best[strengthEx].date)}</div>`;
  return h + `</div>`;
}
function vErfolge() {
  const X = xpInfo(), B = badges(), st = stats(), R = records(), on = B.filter(b => b.on).length;
  const names = { set: "Sätze", session: "Einheiten", hotel: "Hotel Workouts", swim: "Schwimmen", jog: "Joggen", steps: "Schrittziel Tage", prot: "Eiweiß Tage", kg: "Gewicht eingetragen", bf: "Körperfett eingetragen", pr: "Bestleistungen", week: "Streak Wochen" };
  let h = `<div class="card hero"><div class="sm mu">Dein Level</div><div class="big">Level ${X.lvl}: ${esc(X.name)}</div><div class="prog" style="margin-top:8px"><i style="width:${Math.round(X.pct * 100)}%"></i></div>
   <div class="sm" style="margin-top:4px">${X.xp} XP${X.nxt > X.cur ? " · nächstes Level bei " + X.nxt + " XP (" + esc(LEVELS[X.lvl][1]) + ")" : " · Maximallevel!"}</div></div>`;
  h += `<div class="card"><h2>🔥 Streaks</h2><div class="kpi"><div><b>${st.weekStreak}</b><span>Wochen aktuell</span></div><div><b>${st.bestWeek}</b><span>beste Serie</span></div><div><b>${st.sessStreak}</b><span>Einheiten in Folge</span></div></div></div>`;
  h += `<div class="card"><h2>🏅 Abzeichen ${on} von ${B.length}</h2><div class="badges">${B.map(b => `<div class="bd ${b.on ? "on" : ""}"><div class="i">${b.i}</div><b>${esc(b.t)}</b><span class="xs mu">${esc(b.d)}</span></div>`).join("")}</div></div>`;
  const bl = Object.keys(R.best);
  h += `<div class="card"><h2>🏆 Persönliche Rekorde</h2>${bl.length ? `<table><tr><th>Übung</th><th>Bester Satz</th><th>Datum</th></tr>${bl.map(id => `<tr><td>${esc(EXD[id].name)}</td><td>${f1(R.best[id].kg, R.best[id].kg % 1 ? 1 : 0)} kg × ${R.best[id].r}</td><td>${fmt(R.best[id].date)}</td></tr>`).join("")}</table><div class="xs mu" style="margin-top:6px">${R.prs.length} neue Bestleistungen bisher (neues Höchstgewicht bei mindestens der unteren Wiederholungszahl).</div>` : '<div class="sm mu">Sobald du Sätze mit Gewicht einträgst, erscheinen hier deine Rekorde.</div>'}</div>`;
  h += `<div class="card"><h2>⚡ XP Herkunft</h2><table>${Object.keys(names).filter(k => X.parts[k]).map(k => `<tr><td>${names[k]}</td><td style="text-align:right">${X.parts[k]} XP</td></tr>`).join("") || '<tr><td class="mu">Noch keine XP. Erster Satz bringt 5 XP.</td></tr>'}</table>
   <div class="xs mu" style="margin-top:6px">Satz ${XP.set}, Einheit ${XP.session}, Hotel Workout ${XP.hotel}, Schwimmen und Joggen je ${XP.swim}, Schritt und Eiweiß Tag je ${XP.steps}, Gewicht ${XP.kg}, Körperfett ${XP.bf}, Bestleistung ${XP.pr}, Streak Woche ${XP.week} XP.</div></div>`;
  return h;
}
function vMehr() {
  const shifts = Object.keys(S.set.shift);
  return `<div class="card"><h2>⚙️ Einstellungen</h2><label class="f">Dritte Einheit am Wochenende</label>
  <div class="seg"><button class="${S.set.we === "sa" ? "on" : ""}" data-we="sa">Samstag</button><button class="${S.set.we === "so" ? "on" : ""}" data-we="so">Sonntag</button></div>
  <div class="xs mu" style="margin-top:6px">Ersatztermine aus Karte 09 (z.B. Fr 20.11., So 20.12., Sa 27.3.) gelten unabhängig davon.</div></div>
  <div class="card"><h2>↔️ Einheit verschieben</h2><div class="grid3"><div><label class="f">Woche</label><select id="shw">${Array.from({ length: 21 }, (_, i) => `<option ${i + 1 === curWeek() ? "selected" : ""}>${i + 1}</option>`).join("")}</select></div>
  <div><label class="f">Einheit</label><select id="shs"><option value="0">1. (Mo)</option><option value="1">2. (Mi)</option><option value="2">3. (Wochenende)</option></select></div>
  <div><label class="f">Neuer Tag</label><select id="shd">${DAYN.map((d, i) => `<option value="${i}">${d}</option>`).join("")}</select></div></div>
  <button class="btn full" style="margin-top:10px" data-shift>Verschieben</button>
  <div class="xs mu" style="margin-top:6px">Regeln: maximal 1 Nachholtermin pro Woche, nie zwei Tage hintereinander dieselben Muskeln, nie am Tag nach Beinen joggen.</div>
  ${shifts.length ? `<div style="margin-top:8px">${shifts.map(k => { const [w, s] = k.split(":").map(Number); const x = sess(w, s); return `<div class="row sp sm" style="padding:4px 0"><span>Woche ${w}, Einheit ${s + 1} → ${fmtL(x.date)}</span><button class="chip r" data-unshift="${k}">zurücksetzen</button></div>`; }).join("")}</div>` : ""}</div>
  <div class="card"><h2>💾 Daten</h2><div class="sm mu">Alles bleibt auf diesem Gerät (localStorage). Exportiere regelmäßig als Sicherung, z.B. nach jedem Check.</div>
  <div class="grid2" style="margin-top:10px"><button class="btn sec" data-export>Exportieren</button><label class="btn sec">Importieren<input type="file" accept="application/json,.json" data-import style="display:none"></label></div>
  <button class="btn warn full" style="margin-top:8px" data-reset>Alle Daten zurücksetzen</button></div>
  <div class="card"><h2>ℹ️ Über die App</h2><div class="sm">Franz Fitness v2 · Plan Woche 1 bis 21 (Mo 9.11.2026 bis So 4.4.2027). Offline, ohne Konto, ohne Tracker. Übungsbilder sind Illustrationen, keine Einweisung. Alle Zahlen sind Richtwerte, bei Beschwerden Arzt fragen.</div></div>`;
}
function guide(id) {
  const e = EXD[id];
  $("#sheet").innerHTML = `<div class="row sp" style="margin-bottom:8px"><h2 style="margin:0;font-size:19px">${esc(e.name)}</h2><button class="btn sec" data-close style="padding:6px 12px">✕</button></div>
  <img src="${IMG[id]}" alt="${esc(e.name)}: Start und Ende"><div class="grid2 sm" style="margin-top:6px"><div><b>1 Start:</b> ${esc(e.start)}</div><div><b>2 Ende:</b> ${esc(e.ende)}</div></div>
  <div class="row wrapc" style="gap:4px;margin:10px 0"><span class="chip">${esc(e.plan)}</span><span class="chip">Sätze ${esc(e.saetze)}</span><span class="chip">${esc(e.wl || "Wdh.")} ${esc(e.wdh)}</span><span class="chip">Pause ${esc(e.pause)}</span><span class="chip g">RIR ${esc(e.rir)}</span></div>
  <h3>So geht's</h3>${e.punkte.map(p => `<div class="li"><span style="color:var(--te)">✓</span><span>${esc(p)}</span></div>`).join("")}
  <h3 style="margin-top:8px;color:var(--re)">Typische Fehler</h3>${e.fehler.map(p => `<div class="li"><span>⚠️</span><span>${esc(p)}</span></div>`).join("")}
  <div class="hint" style="margin-top:10px">🎯 Zielmuskel: ${esc(e.ziel)}</div>${e.fb ? '<div class="xs mu" style="margin-top:6px">Bild: schematische Zeichnung.</div>' : ""}`;
  $("#modal").classList.add("on");
}

/* ---------- Events ---------- */
function setLog(k, id, j, field, val) { S.logs[k] = S.logs[k] || {}; const a = S.logs[k][id] = S.logs[k][id] || []; a[j] = a[j] || {}; a[j][field] = val; }
document.addEventListener("click", ev => {
  const t = ev.target.closest("[data-tab],[data-open],[data-wk],[data-guide],[data-set],[data-add],[data-finish],[data-act],[data-wkopen],[data-gow],[data-pw],[data-we],[data-shift],[data-unshift],[data-export],[data-reset],[data-close],#tstop,#tplus,#modal");
  if (!t) return;
  const d = t.dataset;
  if (t.id === "modal") { if (ev.target.id === "modal") $("#modal").classList.remove("on"); return; }
  if (d.close !== undefined) { $("#modal").classList.remove("on"); return; }
  if (t.id === "tstop") { clearInterval(T.iv); $("#timer").classList.remove("on"); return; }
  if (t.id === "tplus") { T.end += 15000; T.len += 15; return; }
  if (d.tab) { tab = d.tab; render(); scrollTo(0, 0); return; }
  if (d.open) { openK = d.open; render(); $("#sess").scrollIntoView({ behavior: "smooth" }); return; }
  if (d.wk) { openK = d.wk + ":0"; render(); return; }
  if (d.gow) { openK = d.gow + ":0"; tab = "heute"; render(); return; }
  if (d.guide) { guide(d.guide); return; }
  if (d.set) {
    const [k, id, j, p] = d.set.split("|"), jj = +j; S.logs[k] = S.logs[k] || {}; const a = S.logs[k][id] = S.logs[k][id] || []; a[jj] = a[jj] || {};
    const row = t.parentElement, ki = row.querySelector('[data-in$="|kg"]'), ri = row.querySelector('[data-in$="|r"]');
    let kg = num(ki.value), r = parseInt(ri.value, 10);
    if (isNaN(kg) && ki.placeholder && !isNaN(num(ki.placeholder))) kg = num(ki.placeholder);
    if (isNaN(r) && !isNaN(parseInt(ri.placeholder, 10))) r = parseInt(ri.placeholder, 10);
    if (a[jj].done) { a[jj].done = false; save(); render(); return; }
    if (isNaN(r) || r <= 0) { toast("Bitte Wiederholungen eintragen"); ri.focus(); return; }
    const before = records().prs.length;
    a[jj] = { kg: isNaN(kg) ? null : kg, r, done: true, t: Date.now() };
    save(); const after = records().prs.length;
    if (after > before) { confetti(true); toast("🏆 Neue Bestleistung! +" + XP.pr + " XP"); } else toast(CHEERS[Math.floor(Math.random() * CHEERS.length)] + " +" + XP.set + " XP");
    startTimer(+p); celebrateCheck(); render(); return;
  }
  if (d.add) { const [k, id] = d.add.split("|"); S.logs[k] = S.logs[k] || {}; const a = S.logs[k][id] = S.logs[k][id] || []; const se = sess(...k.split(":").map(Number)); const idx = UNITS[se.unit].findIndex(u => u.id === id); const n = Math.max(a.length, setsFor(se.w, se.s, idx, se.unit)); a[n] = {}; save(); render(); return; }
  if (d.finish) { const [w, s] = d.finish.split(":").map(Number), se = sess(w, s);
    if (S.done[d.finish]) { delete S.done[d.finish]; if (se.unit === "H") S.act[w + ":hw"] = false; save(); render(); return; }
    S.done[d.finish] = Date.now(); if (se.unit === "H") S.act[w + ":hw"] = true; save(); confetti(false); toast(se.unit === "H" ? "Hotel Held! +" + XP.hotel + " XP" : "Einheit geschafft! +" + XP.session + " XP"); celebrateCheck(); render(); return; }
  if (d.act) { const key = d.act;
    if (key.startsWith("done:")) { const k = key.slice(5), [w, s] = k.split(":").map(Number); if (S.done[k]) delete S.done[k]; else S.done[k] = Date.now(); if (sess(w, s).unit === "H") S.act[w + ":hw"] = !!S.done[k]; }
    else S.act[key] = !S.act[key];
    save(); if (S.act[key] || key.startsWith("done:")) celebrateCheck(); render(); return; }
  if (d.wkopen) { const w = +d.wkopen; viewWeek = viewWeek === w ? null : w; render(); return; }
  if (d.pw !== undefined) { progWeek = +d.pw; render(); return; }
  if (d.we) { S.set.we = d.we; save(); render(); toast("Dritte Einheit: " + (d.we === "sa" ? "Samstag" : "Sonntag")); return; }
  if (d.shift !== undefined) { const w = +$("#shw").value, s = +$("#shs").value, dd = +$("#shd").value; S.set.shift[w + ":" + s] = dd; save(); render(); toast("Woche " + w + ": Einheit " + (s + 1) + " auf " + DAYL[dd]); return; }
  if (d.unshift) { delete S.set.shift[d.unshift]; save(); render(); return; }
  if (d.export !== undefined) { exportData(); return; }
  if (d.reset !== undefined) { if (confirm("Wirklich ALLE Daten löschen? Das lässt sich nicht rückgängig machen. Tipp: vorher exportieren.") && confirm("Letzte Sicherheitsfrage: Alles löschen?")) { S = blank(); save(); render(); toast("Daten zurückgesetzt"); } return; }
});
document.addEventListener("change", ev => {
  const t = ev.target, d = t.dataset;
  if (d.in) { const [k, id, j, f] = d.in.split("|"); const v = f === "kg" ? num(t.value) : parseInt(t.value, 10); setLog(k, id, +j, f, isNaN(v) ? null : v); save(); return; }
  if (d.meas) { const v = t.value.trim().replace(".", ","); if (v === "") delete S.meas[d.meas]; else if (isNaN(num(v))) { toast("Bitte eine Zahl eingeben"); return; } else S.meas[d.meas] = v; save(); celebrateCheck(); render(); toast("Gespeichert"); return; }
  if (d.sx !== undefined) { strengthEx = t.value; render(); return; }
  if (d.import !== undefined && t.files[0]) { const r = new FileReader(); r.onload = () => { try { const p = JSON.parse(r.result); if (!p || p.v !== 1 || !p.logs) throw 0; if (confirm("Import ersetzt die aktuellen Daten auf diesem Gerät. Fortfahren?")) { S = Object.assign(blank(), p); S.set = Object.assign({ we: "sa", shift: {} }, p.set || {}); save(); render(); toast("Import erfolgreich"); } } catch (e) { toast("Datei ist kein Franz Fitness Export"); } }; r.readAsText(t.files[0]); t.value = ""; }
});
function exportData() {
  const name = "franz-fitness-" + new Date().toISOString().slice(0, 10) + ".json", blob = new Blob([JSON.stringify(Object.assign({ exportiert: new Date().toISOString(), app: "Franz Fitness v1" }, S), null, 1)], { type: "application/json" });
  try { const f = new File([blob], name, { type: "application/json" }); if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: "Franz Fitness Export" }).catch(() => dl(blob, name)); return; } } catch (e) { }
  dl(blob, name);
}
function dl(blob, name) { const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast("Export erstellt: " + name); }

/* ---------- Start ---------- */
EXDATA.forEach(e => { if (FALLBACK.includes(e.id)) e.fb = true; });
load(); if (!S.lvl) S.lvl = xpInfo().lvl;
render();
if (/^https?:/.test(location.protocol)) {
  const l = document.createElement("link"); l.rel = "manifest"; l.href = "manifest.json"; document.head.appendChild(l);
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => { });
}
window.FF = { S: () => S, stats, xpInfo, badges, records, okWeek, kraftCount, sess, setsFor, save, load, render };
