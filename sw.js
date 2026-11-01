// Gestión Clínica: siempre intenta la versión más nueva (red primero); sin conexión usa la última guardada.
const V='clinica-v1';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return; // Firebase, Claude, etc.: siempre directo a la red
  if(/version\.json$/.test(u.pathname))return;
  e.respondWith(fetch(r,{cache:'no-cache'}).then(x=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(ca=>ca.put(r,c))}return x}).catch(()=>caches.match(r,{ignoreSearch:true})));
});
