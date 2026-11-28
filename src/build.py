import json, sys, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from uebdata import EX, FALLBACK
data = "const EXDATA=" + json.dumps(EX, ensure_ascii=False) + ";\nconst FALLBACK=" + json.dumps(sorted(FALLBACK)) + ";"
js = open(os.path.join(HERE, "app.js"), encoding="utf-8").read()
h = open(os.path.join(HERE, "shell.html"), encoding="utf-8").read().replace("/*CSS*/", open(os.path.join(HERE, "app.css"), encoding="utf-8").read()).replace("/*DATA*/", data).replace("/*JS*/", js)
open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8").write(h)
json.dump({"name": "Franz Fitness", "short_name": "Franz Fitness", "description": "Trainingsplan Woche 1 bis 21 mit Satz-Logger und Gamification", "lang": "de", "start_url": "./index.html", "scope": "./", "display": "standalone", "orientation": "portrait", "background_color": "#0e1218", "theme_color": "#0e1218",
 "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"}, {"src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}, open(os.path.join(ROOT, "manifest.json"), "w"), ensure_ascii=False, indent=1)
ill_dir = os.path.join(ROOT, "illustrations")
pics = sorted(n for n in os.listdir(ill_dir) if n.endswith(".webp")) if os.path.isdir(ill_dir) else []
files = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"] + ["./illustrations/" + n for n in pics]
open(os.path.join(ROOT, "sw.js"), "w", encoding="utf-8").write('''// Franz Fitness Service Worker: speichert die App fuer Offline Nutzung (nur bei https oder localhost aktiv)
const C="franz-fitness-v7";const F=%s;
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n;})))});
''' % json.dumps(files, ensure_ascii=False))
print("index.html", os.path.getsize(os.path.join(ROOT, "index.html")) // 1024, "KB")
