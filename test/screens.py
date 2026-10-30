import json
from playwright.sync_api import sync_playwright
A=["brustpresse","schraegbank","latzug","beinpresse","bizeps","trizeps_seil"]; B=["multipresse","fliegende","rudern","goblet","rdl","hammer","trizeps_ueberkopf"]
base={"brustpresse":45,"schraegbank":14,"latzug":45,"beinpresse":100,"bizeps":10,"trizeps_seil":20,"multipresse":40,"fliegende":10,"rudern":45,"goblet":16,"rdl":14,"hammer":10,"trizeps_ueberkopf":15}
S={"v":1,"set":{"we":"sa","shift":{}},"done":{},"logs":{},"act":{},"meas":{},"seen":[],"lvl":1,"okSeen":[]}
cnt={}
for w in range(1,6):
    for s in range(3):
        if w==5 and s>=1: continue
        if w==3 and s==0: continue
        k=f"{w}:{s}"; u="A" if ((w-1)*3+s)%2==0 else "B"
        S["done"][k]=1; S["logs"][k]={}
        for ex in (A if u=="A" else B):
            n=cnt.get(ex,0); cnt[ex]=n+1
            kg=base[ex]+ (2.5 if n>=2 else 0)+(2.5 if n>=4 else 0); reps=[min(12,9+n%3+1),min(12,9+n%3),min(12,8+n%3)]
            ns=3 if (w>=4 and ex in ("brustpresse","latzug","multipresse","rudern") and not (s==2 and ex in ("brustpresse","multipresse"))) else 2
            S["logs"][k][ex]=[{"kg":kg,"r":r,"done":True} for r in reps[:ns]]
    S["act"][f"{w}:sw"]= w!=5 or False
    for d in range(7):
        if w<5 or d<2: S["act"][f"{w}:st{d}"]= d%3!=2; S["act"][f"{w}:pr{d}"]= d!=4
S["act"]["3:hw"]=True; S["act"]["2:jo"]=True; S["act"]["4:jo"]=True
for w,kg,wa in [(0,"113","112"),(1,"112,6","111,5"),(2,"112,1","111"),(3,"111,9","110,5"),(4,"111,2","110"),(5,"110,6","109,5")]:
    S["meas"][f"{w}:kg"]=kg; S["meas"][f"{w}:wa"]=wa
S["meas"]["0:bf"]="29,2"; S["meas"]["4:bf"]="28,1"
S["logs"]["4:2"]["multipresse"]=[{"kg":45,"r":12,"done":True},{"kg":45,"r":12,"done":True}]
S["logs"]["4:2"]["fliegende"]=[{"kg":15,"r":15,"done":True},{"kg":15,"r":15,"done":True}]
# heutige Einheit Wo 5 Mi (B) teilweise
S["logs"]["5:1"]={"multipresse":[{"kg":47.5,"r":10,"done":True},{"kg":47.5,"r":9,"done":True},{}],"fliegende":[]}
out="/workspace/fitness/app/screenshots/"
with sync_playwright() as p:
    b=p.chromium.launch(); dev=dict(p.devices["iPhone 13"]); dev["device_scale_factor"]=2
    ctx=b.new_context(**dev); pg=ctx.new_page(); errs=[]
    pg.on("pageerror",lambda e: errs.append(str(e)))
    pg.goto("http://localhost:8765/index.html?heute=2026-12-09")
    pg.evaluate("s=>{localStorage.setItem('franz-fitness-app-v1',JSON.stringify(s))}",S); pg.reload(); pg.wait_for_timeout(500)
    pg.evaluate("()=>{FF.S().seen=FF.badges().filter(b=>b.on).map(b=>b.id);FF.S().lvl=FF.xpInfo().lvl;FF.S().okSeen=[1,2,3,4,5];FF.save()}")
    pg.reload(); pg.wait_for_timeout(500)
    pg.screenshot(path=out+"01-heute.png")
    pg.evaluate("document.querySelector('#sess').scrollIntoView()"); pg.evaluate("scrollBy(0,-10)")
    pg.click('[data-set^="5:1|multipresse|2"]') if False else None
    pg.fill('[data-in="5:1|multipresse|2|r"]',"9"); pg.click('[data-set^="5:1|multipresse|2"]'); pg.wait_for_timeout(3400)
    pg.evaluate("document.querySelector('#sess').scrollIntoView()"); pg.evaluate("scrollBy(0,90)")
    pg.screenshot(path=out+"02-satz-logger.png")
    pg.click('[data-guide="fliegende"]'); pg.wait_for_timeout(300)
    pg.evaluate("document.getElementById('tstop').click()"); pg.screenshot(path=out+"03-anleitung.png"); pg.click("[data-close]")
    pg.click('[data-tab="fort"]'); pg.wait_for_timeout(300); pg.evaluate("scrollTo(0,0)")
    pg.screenshot(path=out+"04-fortschritt.png")
    pg.click('[data-tab="erfolge"]'); pg.wait_for_timeout(300)
    pg.screenshot(path=out+"05-erfolge.png")
    pg.click('[data-tab="woche"]'); pg.wait_for_timeout(300)
    pg.screenshot(path=out+"06-woche.png")
    pg.click('[data-tab="mehr"]'); pg.wait_for_timeout(300); pg.screenshot(path="/tmp/mehr.png")
    print("errors",errs, pg.evaluate("FF.xpInfo()"), pg.evaluate("FF.stats()"))
    b.close()
