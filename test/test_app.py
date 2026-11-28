import json
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
URL = "http://localhost:8765/index.html"
res = []
errs = []
def ok(name, cond, info=""):
    res.append((name, bool(cond), info))
    print(("PASS " if cond else "FAIL ") + name, info)
with sync_playwright() as p:
    b = p.chromium.launch()
    dev = dict(p.devices["iPhone 13"])
    dev["device_scale_factor"] = 2
    ctx = b.new_context(**dev)
    pg = ctx.new_page()
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    pg.goto(URL + "?heute=2026-11-20")
    pg.wait_for_timeout(600)
    txt = pg.inner_text("#app")
    ok("Laden ohne Konsolenfehler", not errs, "; ".join(errs))
    ok("Tag 1 zeigt Start 20.11.2026", "Tag 1 / Start 20.11.2026" in txt)
    ok("Tag 1 ist Einheit A", "Heute: Einheit A" in txt)
    ok("Woche 1 hat 7 Übungen A", pg.locator(".ex").count() == 7, str(pg.locator(".ex").count()))
    ok("Erste Übung ist Kurzhantel Bankdrücken", "Kurzhantel Bankdrücken flach" in txt)
    ok("Ersatz Chest Press steht dabei", "Insignia Series Chest Press" in txt)
    names = pg.evaluate("() => [...document.querySelectorAll('.exn')].map(e => e.textContent)")
    ok("Reihenfolge Einheit A", names == [
        "1. Kurzhantel Bankdrücken flach", "2. Schrägpresse scheibenbeladen", "3. Latzug",
        "4. Einarmiges Kurzhantelrudern", "5. Goblet Squat", "6. Bizepscurl Kurzhanteln", "7. Trizepsdrücken mit Seil"], " | ".join(names))
    pg.fill('[data-in="1:0|kh_bank|0|kg"]', "20")
    pg.fill('[data-in="1:0|kh_bank|0|r"]', "10")
    pg.click('[data-set^="1:0|kh_bank|0"]')
    pg.wait_for_timeout(400)
    st = pg.evaluate("JSON.parse(localStorage.getItem('franz-fitness-app-v1'))")
    ok("Satz gespeichert unter altem Schlüssel", st["logs"]["1:0"]["kh_bank"][0]["kg"] == 20 and st["logs"]["1:0"]["kh_bank"][0]["done"] is True)
    ok("Pausentimer läuft", "on" in pg.get_attribute("#timer", "class"), pg.inner_text("#tt"))
    ok("Timer zeigt Pause", pg.inner_text("#tl").strip() == "PAUSE")
    num_px = pg.evaluate("() => parseFloat(getComputedStyle(document.querySelector('#tt')).fontSize)")
    ok("Timer Zahl füllt die Breite", num_px >= 90, str(num_px))
    ok("Timer Knöpfe Start Stopp Weiter", all(x in pg.inner_text("#timer") for x in ("Start", "Stopp", "Weiter")))
    ok("XP für Satz", pg.evaluate("FF.xpInfo().xp") == 5, str(pg.evaluate("FF.xpInfo().xp")))
    pg.locator('[data-act="1:co4"]').first.click()
    pg.wait_for_timeout(200)
    ok("Core Tag gibt 20 XP", pg.evaluate("FF.xpInfo().xp") == 25, str(pg.evaluate("FF.xpInfo().xp")))
    ok("Core Karte ohne Gedankenstrich", "–" not in pg.inner_text("#corecard") and "—" not in pg.inner_text("#corecard") and "Core Training" in pg.inner_text("#corecard"))
    bonus = pg.evaluate("""() => {
      const s = FF.S();
      s.act['1:co5'] = true;
      const zwei = FF.xpInfo().xp;
      s.act['1:co6'] = true;
      return {zwei, drei: FF.xpInfo().xp, goal: FF.coreGoal(1)};
    }""")
    ok("Core Woche 1: Bonus ab 2 Tagen, Extra am dritten", bonus["goal"] == 2 and bonus["zwei"] == 95 and bonus["drei"] == 135, str(bonus))
    pg.reload()
    pg.wait_for_timeout(500)
    ok("Neuladen behält Gewicht", pg.input_value('[data-in="1:0|kh_bank|0|kg"]') == "20")
    pg.click('[data-guide="kh_bank"]')
    pg.wait_for_timeout(200)
    sheet = pg.inner_text("#sheet")
    ok("Anleitung mit Bild und Ersatz", "Typische Fehler" in sheet and "Insignia Series Chest Press" in sheet and pg.locator("#sheet img.fig").count() == 1)
    ok("Anleitung groß und mit Stichwort", "An der Brust" in sheet and "Rot zeigt den Zielmuskel" in sheet)
    ok("Jede Übung hat eine eigene Skizze", pg.evaluate("() => FF.exerciseIds().every(id => FF.hasFig(id))"))
    pg.click("[data-close]")
    links = pg.evaluate("""() => [...document.querySelectorAll('a.vlink')].map(a => ({t: a.textContent, h: a.href, target: a.target, rel: a.rel}))""")
    ok("Video ansehen öffnet in neuem Tab", bool(links) and all(x["t"] == "Video ansehen" and x["target"] == "_blank" and "noopener" in x["rel"] and "https://www.youtube.com/watch?v=" in x["h"] for x in links), str(len(links)))
    ok("Bankdrücken hat ein geprüftes Video", any("Y0K5vP19d-w" in x["h"] for x in links))
    ok("Ohne passendes Video kein Link", pg.evaluate("""() => {
      const row = [...document.querySelectorAll('.ex')].find(b => b.textContent.includes('Schrägpresse scheibenbeladen'));
      const rud = [...document.querySelectorAll('.ex')].find(b => b.textContent.includes('Kurzhantelrudern'));
      return !!row && !!rud && row.querySelectorAll('a.vlink').length === 0 && rud.querySelectorAll('a.vlink').length === 0;
    }"""))
    ok("Woche 1 Freitag und Sonntag", pg.evaluate("""() => {
      const a = FF.sess(1,0), b = FF.sess(1,1);
      return a.date.getFullYear()===2026 && a.date.getMonth()===10 && a.date.getDate()===20 && a.date.getDay()===5 && a.unit==="A"
        && b.date.getDate()===22 && b.date.getDay()===0 && b.unit==="B" && FF.sess(1,2)===null;
    }"""))
    ok("Woche 2 Montag A, Mittwoch B, Samstag A", pg.evaluate("""() => {
      const a = FF.sess(2,0), b = FF.sess(2,1), c = FF.sess(2,2);
      return a.date.getDate()===23 && a.date.getMonth()===10 && a.date.getDay()===1 && a.unit==="A"
        && b.date.getDate()===25 && b.date.getDay()===3 && b.unit==="B"
        && c.date.getDate()===28 && c.date.getDay()===6 && c.unit==="A";
    }"""))
    ok("Sonntag als dritter Tag ab Woche 2", pg.evaluate("() => { FF.S().set.we='so'; const d = FF.sess(2,2); FF.S().set.we='sa'; return d.date.getDay()===0 && d.date.getDate()===29; }"))
    ok("Deload Woche 12 beginnt Mo 1.2.2027 mit 2 Sätzen", pg.evaluate("""() => {
      const d = FF.sess(12,0);
      return d.date.getFullYear()===2027 && d.date.getMonth()===1 && d.date.getDate()===1 && FF.setsFor(12,0,0,'A')===2 && FF.setsFor(12,0,2,'A')===2;
    }"""))
    ok("Ab Woche 4 hat Bankdrücken 3 Sätze, auch in Einheit 3", pg.evaluate("[FF.setsFor(4,0,0,'A'), FF.setsFor(4,2,0,'A'), FF.setsFor(3,0,0,'A')]") == [3, 3, 2])
    ok("Woche 21 endet So 11.4.2027", pg.evaluate("""() => {
      const end = new Date(2026,10,16); end.setDate(end.getDate()+20*7+6);
      const mon = FF.sess(21,0).date;
      return end.getFullYear()===2027 && end.getMonth()===3 && end.getDate()===11 && mon.getDate()===5 && mon.getMonth()===3;
    }"""))
    pg.click('[data-tab="fort"]')
    pg.wait_for_timeout(200)
    ok("Checkwochen bleiben 4, 8, 12, 16, 20, 21", "Woche 4, 8, 12, 16, 20 und 21" in pg.inner_text("#app"))
    pg.click('[data-tab="heute"]')
    pg.goto(URL + "?heute=2026-11-19")
    pg.wait_for_timeout(300)
    pre = pg.inner_text("#app")
    ok("19.11. zeigt Countdown auf Tag 1", "Tag 1 / Start 20.11.2026" in pre and "Noch 1 Tag bis zum Start" in pre and "Heute: Einheit A" not in pre)
    pg.goto(URL + "?heute=2027-02-01")
    pg.wait_for_timeout(300)
    ok("1.2.2027 zeigt Deload", "Deload" in pg.inner_text("#app") and "Woche 12 von 21" in pg.inner_text("#app"))
    pg.goto(URL + "?heute=2026-11-20")
    pg.wait_for_timeout(200)
    def ms(y, m, d):
        return int(datetime(y, m, d, 8).timestamp() * 1000)
    old = {"v":1,"set":{"we":"sa","shift":{"2:1":4}},"done":{"1:0": ms(2026,11,10), "2:1": ms(2026,11,20)},
           "logs":{"1:0":{"brustpresse":[{"kg":40,"r":10,"done":True,"t":ms(2026,11,10)}]},
                   "2:1":{"brustpresse":[{"kg":42.5,"r":8,"done":True,"t":ms(2026,11,20)}]}},
           "act":{"1:st0":True,"3:sw":True},"meas":{"0:kg":"113","1:kg":"112","2:kg":"111,5"},"seen":[],"lvl":1,"okSeen":[1]}
    pg.evaluate("s => localStorage.setItem('franz-fitness-app-v1', JSON.stringify(s))", old)
    pg.reload()
    pg.wait_for_timeout(400)
    mig = pg.evaluate("""() => {
      const s = FF.S();
      return {cal:s.cal, done:Object.keys(s.done), hasOld:!!(s.logs['1:0']&&s.logs['1:0'].brustpresse),
        remapped:!!(s.logs['1:0']&&s.logs['1:0'].brustpresse),
        archive:(s.archive.sessions||[]).length, meas1:s.meas['1:kg']||'', meas0:s.meas['0:kg']||'',
        act:!!s.act['2:sw'], total:FF.stats().total, xp:FF.xpInfo().xp};
    }""")
    ok("Migration behält den Schlüssel und setzt den Kalender", mig["cal"] == "tag1-2026-11-20", json.dumps(mig))
    ok("Eintrag vor dem 20.11. zählt nicht und liegt im Archiv", mig["archive"] >= 1 and mig["total"] == 1, json.dumps(mig))
    ok("Freitag 20.11. aus dem alten Plan liegt auf Tag 1", mig["remapped"] is True and "1:0" in mig["done"])
    ok("Messwert vor dem Start wandert nicht in Woche 1", mig["meas0"] == "113" and mig["meas1"] == "111,5", json.dumps(mig))
    pg.click('[data-tab="mehr"]')
    pg.wait_for_timeout(200)
    ok("Frühere Einträge sind sichtbar", "Frühere Einträge" in pg.inner_text("#app") and "Brustpresse" in pg.inner_text("#app"))
    # Einheit B am Sonntag der Woche 1
    pg.goto(URL + "?heute=2026-11-22")
    pg.wait_for_timeout(400)
    bt = pg.inner_text("#app")
    ok("Sonntag 22.11. ist Einheit B", "Heute: Einheit B" in bt and "Seitheben Kurzhanteln" in bt and "Trizepsstrecker" in bt)
    ok("Keine Fehler im gesamten Test", not errs, "; ".join(errs))
    b.close()
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    e2 = []
    pg.on("console", lambda m: e2.append(m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: e2.append(str(e)))
    pg.goto(ROOT.joinpath("index.html").as_uri())
    pg.wait_for_timeout(500)
    ok("Laden per file:// ohne Fehler", not e2 and "Franz Fitness" in pg.inner_text("body"), "; ".join(e2))
    b.close()

def tz_case(tz, script):
    ctx = b.new_context(timezone_id=tz, viewport={"width": 390, "height": 844}, locale="de-DE")
    pg = ctx.new_page()
    pg.goto(URL + "?heute=2026-11-24")
    pg.wait_for_timeout(400)
    out = pg.evaluate(script)
    ctx.close()
    return out

with sync_playwright() as p:
    b = p.chromium.launch()
    sao = tz_case("America/Sao_Paulo", """() => {
      const ts = new Date(2026, 10, 24, 22, 30).getTime();
      const utc = new Date(ts).toISOString().slice(0, 10);
      const day = FF.localDay(ts);
      const s = FF.S();
      s.done = {"2:1": ts};
      s.logs = {"2:1": {"hammer": [{kg: 12, r: 10, done: true, t: ts}]}};
      FF.save();
      const shown = FF.shownDate(2, 1);
      const raw = JSON.parse(localStorage.getItem("franz-fitness-app-v1"));
      return {
        utc, localDate: day.getDate(), localWd: day.getDay(),
        shownDate: shown.getDate(), shownWd: shown.getDay(),
        planWd: FF.sess(2, 1).date.getDay(), planDate: FF.sess(2, 1).date.getDate(),
        keptNumber: typeof raw.done["2:1"] === "number" && raw.done["2:1"] === ts,
        keptLog: raw.logs["2:1"].hammer[0].kg === 12
      };
    }""")
    ok("Sao Paulo: Dienstagabend ist nicht der UTC Mittwoch", sao["utc"] == "2026-11-25" and sao["localDate"] == 24 and sao["localWd"] == 2, json.dumps(sao))
    ok("Anzeige nimmt den lokalen Tag, nicht den Plan Mittwoch", sao["planWd"] == 3 and sao["planDate"] == 25 and sao["shownDate"] == 24 and sao["shownWd"] == 2, json.dumps(sao))
    ok("Alter Zahlenstempel und Satz bleiben erhalten", sao["keptNumber"] and sao["keptLog"], json.dumps(sao))
    ctx = b.new_context(timezone_id="America/Sao_Paulo", viewport={"width": 390, "height": 844}, locale="de-DE")
    pg = ctx.new_page()
    pg.goto(URL + "?heute=2026-11-24")
    pg.wait_for_timeout(300)
    pg.evaluate("""() => {
      const ts = new Date(2026, 10, 24, 22, 30).getTime();
      const s = FF.S();
      s.done = {"2:1": ts};
      s.logs = {"2:1": {"hammer": [{kg: 12, r: 10, done: true, t: ts}]}};
      FF.save();
    }""")
    pg.reload()
    pg.wait_for_timeout(400)
    pg.click('[data-tab="woche"]')
    pg.click('[data-wkopen="2"]')
    pg.wait_for_timeout(200)
    week = pg.inner_text("#app")
    ok("Wochenansicht zeigt Di 24.11. statt Mi", "Di 24.11." in week and "Plan war Mi 25.11." in week, week[week.find("Di"):week.find("Di")+80] if "Di" in week else week[:200])
    kept = pg.evaluate("""() => {
      const raw = JSON.parse(localStorage.getItem("franz-fitness-app-v1"));
      return typeof raw.done["2:1"] === "number" && raw.logs["2:1"].hammer[0].r === 10;
    }""")
    ok("Nach Neuladen sind Eintrag und Satz noch da", kept)
    ctx.close()
    ber = tz_case("Europe/Berlin", """() => {
      const early = new Date(2026, 10, 24, 0, 30).getTime();
      const utc = new Date(early).toISOString().slice(0, 10);
      const day = FF.localDay(early);
      const stamp = FF.stampDone(early);
      const stored = {t: Date.parse("2026-11-25T01:30:00.000Z"), y: 2026, m: 11, d: 24};
      const s = FF.S();
      s.done = {"2:1": stored, "2:0": early};
      s.logs = {"2:0": {"kh_bank": [{kg: 20, r: 8, done: true, t: early}]}};
      FF.save();
      const raw = JSON.parse(localStorage.getItem("franz-fitness-app-v1"));
      const earlyShown = FF.shownDate(2, 0);
      const storedShown = FF.shownDate(2, 1);
      return {
        utc, localDate: day.getDate(), localWd: day.getDay(),
        stampD: stamp.d, stampM: stamp.m, stampY: stamp.y,
        earlyDate: earlyShown.getDate(), earlyWd: earlyShown.getDay(),
        storedDate: storedShown.getDate(), storedWd: storedShown.getDay(),
        rawDay: raw.done["2:1"].d, rawLog: raw.logs["2:0"].kh_bank[0].kg
      };
    }""")
    ok("Berlin: Dienstag 0:30 bleibt Dienstag, UTC wäre Montag", ber["utc"] == "2026-11-23" and ber["localDate"] == 24 and ber["localWd"] == 2 and ber["stampD"] == 24 and ber["earlyDate"] == 24 and ber["earlyWd"] == 2, json.dumps(ber))
    ok("Gespeicherter lokaler Tag bleibt Dienstag, auch wenn der Zeitstempel in Berlin schon Mittwoch ist", ber["storedDate"] == 24 and ber["storedWd"] == 2 and ber["rawDay"] == 24 and ber["rawLog"] == 20, json.dumps(ber))
    b.close()
print("\n%d von %d bestanden" % (sum(r[1] for r in res), len(res)))
json.dump(res, open(ROOT / "test" / "ergebnis.json", "w"), ensure_ascii=False, indent=1)
if not all(r[1] for r in res):
    raise SystemExit(1)
