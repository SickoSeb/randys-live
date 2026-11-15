(function(){
"use strict";
var SHOP="SHOP.html";
var M=window.MENU||[];
function cat(k){for(var i=0;i<M.length;i++)if(M[i].key===k)return M[i];return {items:[]};}
function eur(n){return n.toFixed(2).replace(".",",")+" €";}
function esc(s){return String(s||"").replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
var ARROW='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function priceChips(p){
  if(p.x!=null) return '<div class="prices"><span><small>Preis</small><b>'+eur(p.x)+'</b></span></div>';
  return '<div class="prices">'+["20","26","32"].filter(function(s){return p[s]!=null;}).map(function(s){return '<span><small>'+s+' cm</small><b>'+eur(p[s])+'</b></span>';}).join("")+'</div>';
}
function minPrice(p){var v=Object.keys(p).map(function(k){return p[k];});return Math.min.apply(null,v);}

/* Feature: Ehrenpizza */
var eh=cat("ehren").items[0];
var feat=document.getElementById("feature");
if(eh&&feat){
  feat.innerHTML='<img src="'+eh.bild+'" alt="Oktoberfest Ehrenpizza" loading="lazy">'+
  '<div><p class="eyebrow">Ehrenpizza des Monats</p><h3 class="d">'+esc(eh.name.replace(" Pizza",""))+' <span class="pink">Pizza</span></h3>'+
  '<p>'+esc(eh.text)+'</p>'+priceChips(eh.preise)+
  '<a class="btn btn-pink" style="margin-top:18px" href="'+SHOP+'" target="_blank" rel="noopener">Jetzt probieren '+ARROW+'</a></div>';
}

/* Menüs */
var cg=document.getElementById("combo-grid");
if(cg){
  cg.innerHTML=cat("menues").items.map(function(it){
    var hot=/netflix/i.test(it.name);
    var li=it.text.split(/\s*\|\s*/).filter(Boolean).map(function(t){return "<li>"+esc(t.trim())+"</li>";}).join("");
    return '<a class="combo rv'+(hot?" hot":"")+'" href="'+SHOP+'" target="_blank" rel="noopener">'+(hot?'<span class="tag">Beliebt</span>':'')+
      (it.bild?'<img src="'+it.bild+'" alt="'+esc(it.name)+'" loading="lazy">':'')+
      '<div><h3 class="d">'+esc(it.name)+'</h3><ul>'+li+'</ul><div class="pr">'+eur(minPrice(it.preise))+'</div></div></a>';
  }).join("");
}

/* Speisekarte mit Tabs */
var TABS=[
  {id:"bestof",label:"🔥 Best of",keys:["bestof"],intro:"Randy's Lieblinge – unsere meistbestellten Pizzen."},
  {id:"classics",label:"Classics",keys:["classics"],intro:"Die Klassiker – ab 5,90 €."},
  {id:"own",label:"Selbst kreieren",keys:["own","half"],intro:"Bau Dir Deine eigene Pizza – oder nimm zwei Hälften."},
  {id:"minis",label:"Minis",keys:["minis"],intro:"Randy's Pizza-Brötchen, frisch gebacken."},
  {id:"salate",label:"Salate",keys:["salate"],intro:"Frisch und knackig."},
  {id:"dips",label:"Dips & Saucen",keys:["dips","sauce"],intro:"Der Dip macht's – je 1,90 €."},
  {id:"drinks",label:"Drinks & Snacks",keys:["drinks","snacks"],intro:"Für den Durst und die Lücke danach."}
];
var tabsEl=document.getElementById("tabs"),view=document.getElementById("cat-view");
function card(it){
  return '<article class="item">'+(it.bild?'<img class="pic" src="'+it.bild+'" alt="'+esc(it.name)+'" loading="lazy" width="560" height="560">':'<div class="pic"></div>')+
    '<div><h4>'+esc(it.name)+'</h4>'+(it.text?'<p class="ing">'+esc(it.text)+'</p>':'')+priceChips(it.preise)+
    '<a class="bestell" href="'+SHOP+'" target="_blank" rel="noopener">Bestellen '+ARROW+'</a></div></article>';
}
function mini(it){
  return '<a class="mini" href="'+SHOP+'" target="_blank" rel="noopener" style="text-decoration:none">'+(it.bild?'<img src="'+it.bild+'" alt="" loading="lazy">':'')+
    '<h4>'+esc(it.name)+'</h4><b>'+eur(minPrice(it.preise))+'</b></a>';
}
function show(id){
  var t=TABS.filter(function(x){return x.id===id;})[0]||TABS[0];
  [].forEach.call(tabsEl.children,function(b){var on=b.dataset.id===t.id;b.classList.toggle("on",on);b.setAttribute("aria-selected",on);});
  var items=[];t.keys.forEach(function(k){items=items.concat(cat(k).items);});
  var compact=/^(dips|drinks)$/.test(t.id);
  view.innerHTML='<p class="cat-intro">'+t.intro+'</p><div class="grid'+(compact?" mini-grid":"")+'">'+items.map(compact?mini:card).join("")+'</div>';
}
if(tabsEl&&view){
  tabsEl.innerHTML=TABS.map(function(t){return '<button class="tab" role="tab" data-id="'+t.id+'">'+t.label+'</button>';}).join("");
  tabsEl.addEventListener("click",function(e){
    var b=e.target.closest(".tab");if(!b)return;show(b.dataset.id);
    b.scrollIntoView({block:"nearest",inline:"center",behavior:"smooth"});
    var top=document.getElementById("karte").querySelector(".tabs").getBoundingClientRect().top;
    if(top<0||top>window.innerHeight*.6) tabsEl.scrollIntoView({behavior:"smooth"});
  });
  show("bestof");
}

/* Instagram-Grid */
var ig=document.getElementById("ig-grid");
if(ig){
  var h="";for(var i=1;i<=12;i++){var n=(i<10?"0":"")+i;
    h+='<a href="https://www.instagram.com/randys.pizza/" target="_blank" rel="noopener" aria-label="Randy\'s Pizza auf Instagram"><img src="assets/ig/ig'+n+'.webp" alt="Instagram-Post von Randy\'s Pizza" loading="lazy" width="560" height="560"></a>';}
  ig.innerHTML=h;
}

/* Reels: Klick spielt mit Ton */
[].forEach.call(document.querySelectorAll(".reel"),function(r){
  var v=r.querySelector("video"),b=r.querySelector(".play");
  b.addEventListener("click",function(){
    [].forEach.call(document.querySelectorAll(".reel video"),function(o){if(o!==v){o.pause();o.parentNode.classList.remove("playing");}});
    if(!v.src) v.src=v.dataset.src;
    v.controls=true;v.muted=false;v.play();r.classList.add("playing");
  });
  v.addEventListener("ended",function(){r.classList.remove("playing");v.controls=false;});
});

/* Countdown */
var cd=document.querySelector("[data-countdown]");
if(cd){
  var end=new Date(cd.dataset.countdown).getTime();
  var el={};["d","h","m","s"].forEach(function(k){el[k]=cd.querySelector('[data-cd="'+k+'"]');});
  var tick=function(){
    var t=Math.max(0,end-Date.now());
    var v={d:Math.floor(t/864e5),h:Math.floor(t/36e5)%24,m:Math.floor(t/6e4)%60,s:Math.floor(t/1e3)%60};
    for(var k in v) el[k].textContent=(v[k]<10?"0":"")+v[k];
    if(t<=0){clearInterval(iv);var l=document.querySelector(".cd-label");if(l)l.textContent="Aktion beendet";}
  };
  var iv=setInterval(tick,1000);tick();
}

/* Jetzt geöffnet? (Europe/Berlin) */
(function(){
  var hr;try{hr=parseInt(new Intl.DateTimeFormat("de-DE",{hour:"numeric",hour12:false,timeZone:"Europe/Berlin"}).format(new Date()),10);}catch(e){hr=new Date().getHours();}
  var open=hr>=16&&hr<21;
  [].forEach.call(document.querySelectorAll("[data-open-dot]"),function(d){d.classList.toggle("zu",!open);});
  [].forEach.call(document.querySelectorAll("[data-open-text]"),function(t){t.textContent=open?"Jetzt geöffnet · bis 21 Uhr":(hr<16?"Heute ab 16 Uhr geöffnet":"Morgen ab 16 Uhr wieder da");});
})();

/* Deal-Formular */
var form=document.getElementById("deal-form");
if(form){
  var errEl=form.querySelector(".form-err"),card=document.getElementById("deal-form-card");
  form.addEventListener("submit",function(e){
    e.preventDefault();errEl.textContent="";
    var fd=new FormData(form);
    var data={vorname:(fd.get("vorname")||"").trim(),telefon:(fd.get("telefon")||"").trim(),email:(fd.get("email")||"").trim(),einwilligung:!!fd.get("einwilligung"),website:fd.get("website")||""};
    if(data.vorname.length<2){errEl.textContent="Bitte gib Deinen Vornamen an.";return;}
    if(data.telefon.replace(/\D/g,"").length<9){errEl.textContent="Bitte gib eine gültige Handynummer an.";return;}
    if(data.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){errEl.textContent="Die E-Mail-Adresse sieht nicht richtig aus.";return;}
    if(!data.einwilligung){errEl.textContent="Bitte bestätige die Einwilligung.";return;}
    var btn=form.querySelector("button[type=submit]");btn.disabled=true;btn.textContent="Wird gesichert …";
    fetch("https://iylqztdxybyegqlnvegp.supabase.co/functions/v1/deal",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
      .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
      .then(function(res){
        if(!res.ok||!res.j.ok) throw new Error(res.j&&res.j.error||"Fehler");
        card.querySelector("[data-ok-name]").textContent=", "+data.vorname;
        card.classList.add("done");
        var p=card.querySelector(".ok-panel");p.focus({preventScroll:true});
        card.scrollIntoView({behavior:"smooth",block:"center"});
        if(window.fbq) try{fbq("track","Lead",{content_name:"2fuer1-Deal"});}catch(_){}
      })
      .catch(function(err){
        errEl.textContent=(err&&err.message&&err.message!=="Failed to fetch"?err.message:"Das hat nicht geklappt. Bitte versuch es nochmal oder ruf uns an: 05073 6753671.");
        btn.disabled=false;btn.textContent="2-für-1-Deal sichern";
      });
  });
}

/* Mobile Bestellleiste ab Scroll */
var mbar=document.getElementById("mbar");
if(mbar){var onS=function(){mbar.classList.toggle("show",window.scrollY>420);};window.addEventListener("scroll",onS,{passive:true});onS();}

/* Reveal */
var rvs=document.querySelectorAll(".rv");
if("IntersectionObserver" in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{rootMargin:"0px 0px -8% 0px"});
  [].forEach.call(rvs,function(r){io.observe(r);});
}else [].forEach.call(rvs,function(r){r.classList.add("in");});
if(/[?&]shot=1/.test(location.search)){document.documentElement.classList.add("shot");[].forEach.call(rvs,function(r){r.classList.add("in");});}
})();
