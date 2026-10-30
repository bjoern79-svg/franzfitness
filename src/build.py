import json, base64, sys, os, re
sys.path.insert(0,'/workspace/fitness/src')
from uebdata import EX, FALLBACK
D='/workspace/fitness/app/'
img={e['id']:'data:image/jpeg;base64,'+base64.b64encode(open(D+'src/img/'+e['id']+'.jpg','rb').read()).decode() for e in EX}
data='const EXDATA='+json.dumps(EX,ensure_ascii=False)+';\nconst FALLBACK='+json.dumps(sorted(FALLBACK))+';\nconst IMG='+json.dumps(img)+';'
h=open(D+'src/shell.html').read().replace('/*CSS*/',open(D+'src/app.css').read()).replace('/*DATA*/',data).replace('/*JS*/',open(D+'src/app.js').read())
open(D+'index.html','w').write(h)
json.dump({"name":"Franz Fitness","short_name":"Franz Fitness","description":"Trainingsplan Woche 1 bis 21 mit Satz-Logger und Gamification","lang":"de","start_url":"./index.html","scope":"./","display":"standalone","orientation":"portrait","background_color":"#0e1218","theme_color":"#0e1218",
 "icons":[{"src":"icons/icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icons/icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icons/icon-512-maskable.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},open(D+'manifest.json','w'),ensure_ascii=False,indent=1)
open(D+'sw.js','w').write('''// Franz Fitness Service Worker: speichert die App fuer Offline Nutzung (nur bei https oder localhost aktiv)
const C="franz-fitness-v2";const F=["./","./index.html","./manifest.json","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n;})))});
''')
print('index.html', os.path.getsize(D+'index.html')//1024,'KB')
