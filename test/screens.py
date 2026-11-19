"""Screenshots der v3 App. Server: python3 -m http.server 8765 im Repository Root."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "screenshots"
S = {"v": 1, "cal": "tag1-2026-11-20", "set": {"we": "sa", "shift": {}}, "done": {"1:0": 1},
     "logs": {"1:0": {"kh_bank": [{"kg": 22.5, "r": 10, "done": True}, {"kg": 22.5, "r": 8, "done": True}]}},
     "act": {}, "meas": {"0:kg": "113", "0:bf": "29,2"}, "seen": [], "lvl": 1, "okSeen": []}
with sync_playwright() as p:
    b = p.chromium.launch()
    dev = dict(p.devices["iPhone 13"])
    dev["device_scale_factor"] = 2
    ctx = b.new_context(**dev)
    pg = ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://localhost:8765/index.html?heute=2026-11-20")
    pg.evaluate("s=>{localStorage.setItem('franz-fitness-app-v1', JSON.stringify(s))}", S)
    pg.reload()
    pg.wait_for_timeout(500)
    pg.evaluate("scrollTo(0,0)")
    pg.screenshot(path=str(OUT / "01-heute.png"))
    pg.evaluate("document.querySelector('#sess').scrollIntoView()")
    pg.wait_for_timeout(200)
    pg.screenshot(path=str(OUT / "02-satz-logger.png"))
    pg.click('[data-guide="kh_bank"]')
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT / "03-anleitung.png"))
    pg.click("[data-close]")
    pg.click('[data-tab="fort"]')
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT / "04-fortschritt.png"))
    pg.click('[data-tab="erfolge"]')
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT / "05-erfolge.png"))
    pg.click('[data-tab="woche"]')
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(OUT / "06-woche.png"))
    print("errors", errs)
    b.close()
