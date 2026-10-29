import json, sys
from playwright.sync_api import sync_playwright
URL = "http://localhost:8765/index.html"
res = []; errs = []
def ok(name, cond, info=""):
    res.append((name, bool(cond), info)); print(("PASS " if cond else "FAIL ") + name, info)
with sync_playwright() as p:
    b = p.chromium.launch()
    dev = p.devices["iPhone 13"]; dev = dict(dev); dev["device_scale_factor"] = 2
    ctx = b.new_context(**dev)
    pg = ctx.new_page()
    pg.on("console", lambda m: errs.append(m.type + ": " + m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    pg.goto(URL + "?heute=2026-11-02"); pg.wait_for_timeout(600)
    ok("Laden ohne Konsolenfehler", not errs, "; ".join(errs))
    ok("Heute zeigt Einheit A am Mo 2.11.", "Heute: Einheit A" in pg.inner_text("#app"))
    ok("Woche 1 Übungen A", pg.locator(".ex").count() == 6, str(pg.locator(".ex").count()))
    # Satz eintragen
    pg.fill('[data-in="1:0|brustpresse|0|kg"]', "40"); pg.fill('[data-in="1:0|brustpresse|0|r"]', "10")
    pg.click('[data-set^="1:0|brustpresse|0"]'); pg.wait_for_timeout(400)
    st = pg.evaluate("JSON.parse(localStorage.getItem('franz-fitness-app-v1'))")
    ok("Satz gespeichert", st["logs"]["1:0"]["brustpresse"][0] == {**st["logs"]["1:0"]["brustpresse"][0], "kg": 40, "r": 10, "done": True})
    ok("Pausentimer läuft", "on" in pg.get_attribute("#timer", "class"), pg.inner_text("#tt"))
    ok("XP für Satz (5 XP)", pg.evaluate("FF.xpInfo().xp") == 5, str(pg.evaluate("FF.xpInfo().xp")))
    pg.reload(); pg.wait_for_timeout(500)
    ok("Neuladen behält Gewicht", pg.input_value('[data-in="1:0|brustpresse|0|kg"]') == "40")
    ok("Neuladen behält Haken", "on" in pg.get_attribute('[data-set^="1:0|brustpresse|0"]', "class"))
    # Anleitung oeffnen
    pg.click('[data-guide="brustpresse"]'); pg.wait_for_timeout(200)
    ok("Anleitung öffnet", "Typische Fehler" in pg.inner_text("#sheet"))
    pg.click("[data-close]")
    # Beispieldaten fuer XP und Streak
    sample = {"v":1,"set":{"we":"sa","shift":{}},"done":{"1:0":1,"1:1":1,"1:2":1,"2:0":1,"2:1":1,"3:0":1,"4:0":1,"4:2":1},"logs":{},"act":{"3:hw":True},"meas":{},"seen":[],"lvl":1,"okSeen":[]}
    pg.goto(URL + "?heute=2026-11-29"); pg.evaluate("s=>localStorage.setItem('franz-fitness-app-v1', JSON.stringify(s))", sample); pg.reload(); pg.wait_for_timeout(400)
    st = pg.evaluate("FF.stats()"); xp = pg.evaluate("FF.xpInfo()"); bd = pg.evaluate("FF.badges().filter(b=>b.on).map(b=>b.id)")
    ok("Streak 4 Wochen (Reisewoche 3 mit 1 Einheit plus Hotel)", st["weekStreak"] == 4 and st["bestWeek"] == 4, json.dumps(st))
    ok("Krafteinheiten 9 (8 plus Hotel Bonus)", st["total"] == 9)
    ok("XP 640 = 8x50 + 40 Hotel + 4x50 Streakwochen", xp["xp"] == 640, str(xp["xp"]))
    ok("Level 3 Kabelzug Flüsterer", xp["lvl"] == 3 and xp["name"] == "Kabelzug Flüsterer", xp["name"])
    ok("Abzeichen b1 b2 b3 b5 b17", set(["b1","b2","b3","b5","b17"]) <= set(bd) and "b4" not in bd, ",".join(bd))
    # Woche 6 nur 1 Einheit (keine Reisewoche) zaehlt nicht
    pg.evaluate("()=>{const s=FF.S(); s.done['6:0']=1; s.act['6:hw']=true; FF.save();}")
    ok("Woche 6: 1 Einheit plus Hotel zählt nicht (keine Reisewoche)", pg.evaluate("FF.okWeek(6)") is False)
    ok("Woche 3 zählt (Reisewoche)", pg.evaluate("FF.okWeek(3)") is True)
    # Plan Logik
    ok("Wo 3 Einheit 2 am Fr 20.11.", pg.evaluate("FF.sess(3,1).date.getDate()") == 20)
    ok("Wo 7 Einheit 2 ist Hotel Workout", pg.evaluate("FF.sess(7,1).unit") == "H")
    ok("Wo 7 Einheit 3 am So 20.12.", pg.evaluate("FF.sess(7,2).date.getDate()") == 20)
    ok("Wo 21 Einheit 3 am Sa 27.3.", pg.evaluate("FF.sess(21,2).date.getDate()") == 27)
    ok("Wo 2 beginnt mit Einheit B", pg.evaluate("FF.sess(2,0).unit") == "B")
    ok("Deload Wo 12 Brustpresse 2 Sätze", pg.evaluate("FF.setsFor(12,0,0,'A')") == 2)
    ok("Wo 4 Brustpresse 3 Sätze, 3. Einheit 2", pg.evaluate("[FF.setsFor(4,0,0,'A'),FF.setsFor(4,2,0,'A')]") == [3, 2])
    # Bestleistung
    pg.evaluate("""()=>{const s=FF.S(); s.logs['1:0']={brustpresse:[{kg:40,r:10,done:true}]}; s.logs["1:2"]={brustpresse:[{kg:42.5,r:10,done:true}]}; FF.save();}""")
    ok("Bestleistung erkannt", pg.evaluate("FF.records().prs.length") == 1)
    # Sa/So Umschaltung und Verschieben
    pg.evaluate("()=>{FF.S().set.we='so'; FF.S().set.shift['10:1']=3;}")
    ok("Sonntag als 3. Tag", pg.evaluate("FF.sess(10,2).d") == 6)
    ok("Einheit verschieben auf Do", pg.evaluate("FF.sess(10,1).d") == 3)
    # Export, Import, Reset
    pg.goto(URL + "?heute=2026-11-29"); pg.wait_for_timeout(300); pg.click('[data-tab="mehr"]')
    with pg.expect_download() as dl: pg.click("[data-export]")
    path = dl.value.path(); exp = json.load(open(path))
    ok("Export liefert JSON mit Daten", exp.get("v") == 1 and "3:0" in exp["done"], dl.value.suggested_filename)
    pg.on("dialog", lambda d: d.accept())
    pg.click("[data-reset]"); pg.wait_for_timeout(300)
    ok("Zurücksetzen mit Bestätigung leert Daten", pg.evaluate("Object.keys(FF.S().done).length") == 0)
    pg.set_input_files("[data-import]", path); pg.wait_for_timeout(500)
    ok("Import stellt Daten wieder her", pg.evaluate("Object.keys(FF.S().done).length") == len(exp["done"]))
    pg.reload(); pg.wait_for_timeout(300)
    ok("Import bleibt nach Neuladen", pg.evaluate("Object.keys(FF.S().done).length") == len(exp["done"]))
    # Hotel Workout Einheit Wo 7 abschliessen zaehlt
    pg.goto(URL + "?heute=2026-12-16"); pg.wait_for_timeout(300)
    ok("Mi 16.12. zeigt Hotel Workout", "Heute: Hotel Workout" in pg.inner_text("#app"))
    pg.evaluate("()=>{FF.S().done['7:0']=1;FF.save();}"); pg.reload(); pg.wait_for_timeout(300)
    pg.click('[data-finish="7:1"]'); pg.wait_for_timeout(300)
    ok("Wo 7: 1 Einheit plus Hotel Workout zählt", pg.evaluate("FF.okWeek(7)") is True)
    ok("Keine Fehler im gesamten Test", not errs, "; ".join(errs))
    b.close()
# file:// Test
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); e2 = []
    pg.on("console", lambda m: e2.append(m.text) if m.type == "error" else None); pg.on("pageerror", lambda e: e2.append(str(e)))
    pg.goto("file:///workspace/fitness/app/index.html"); pg.wait_for_timeout(500)
    ok("Laden per file:// ohne Fehler", not e2 and "Franz Fitness" in pg.inner_text("body"), "; ".join(e2))
    b.close()
print("\n%d von %d bestanden" % (sum(r[1] for r in res), len(res)))
json.dump(res, open("/workspace/fitness/app/test/ergebnis.json", "w"), ensure_ascii=False, indent=1)
