/* Speisekarte live aus MASTERS GASTRO (Supabase). Preise und Artikel kommen aus derselben Karte wie Kasse, Shop und Kiosk.
   Bilder und Beschreibungen bleiben die der Seite (assets/menu), zugeordnet ueber den Namen. Ohne Netz bleibt die eingebaute Karte stehen. */
(function(){
"use strict";
var URL="https://iylqztdxybyegqlnvegp.supabase.co/rest/v1/rpc/mg_karte", ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5bHF6dGR4eWJ5ZWdxbG52ZWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NzgwMTMsImV4cCI6MjEwODI1NDAxM30.EmbariA2jXs6_VzSQ_ZLrcGoRtYB58--ErN_0CL6Zw0";
var STAT=window.MENU||[];
function norm(s){return String(s||"").toLowerCase().replace(/[’´']/g,"").replace(/randys|pizza|brötchen|brotchen|pizzabrötchen|coca|funny-frisch|\(|\)|-|,|\./g," ").replace(/\b(\d+)\s*(l|g|ml)\b/g,"$1$2").replace(/\s+/g," ").trim();}
function tokens(s){return norm(s).split(" ").filter(function(t){return t.length>1&&!/^(0|6|und|and|mit|der|die|das|energy)$/.test(t);});}
var alle=[];STAT.forEach(function(c){c.items.forEach(function(i){alle.push(i);});});
function passend(name){
  var t=tokens(name),best=null,bs=0;
  alle.forEach(function(i){var u=tokens(i.name),g=0;t.forEach(function(x){if(u.indexOf(x)>=0)g++;});var sc=g/Math.max(t.length,u.length);if(sc>bs){bs=sc;best=i;}});
  return bs>=0.5?best:null;
}
function item(a,textVorgabe){
  var st=passend(a.name)||{};
  var preise=a.preise&&a.preise["26"]!=null?{"20":a.preise["20"],"26":a.preise["26"],"32":a.preise["32"]}:{x:a.preis};
  return {name:a.name,preise:preise,text:textVorgabe||a.text||st.text||"",bild:st.bild||""};
}
function bauen(k){
  var A=(k.artikel||[]).filter(function(a){return a.aktiv!==false;});
  function wo(f){return A.filter(f).map(function(a){return item(a);});}
  var stat=function(key){for(var i=0;i<STAT.length;i++)if(STAT[i].key===key)return STAT[i];return null;};
  var men=A.filter(function(a){return a.gruppe==="Menüs"&&a.name!=="Mittagsmenü";}).map(function(a){var s=passend(a.name)||{};return {name:a.name,preise:{x:a.preis},text:s.text||a.text||"",bild:s.bild||""};});
  var m=k.betrieb&&k.betrieb.mittag;
  if(m&&m.an!==false&&m.stufen&&m.stufen.length) men.unshift({name:"Mittagsmenü",preise:{x:m.stufen[0].preis},text:(m.stufen[0].text||"20er Pizza + Getränk 0,33 l")+" | Mo–Fr "+(m.von||"11:00")+"–"+(m.bis||"14:00")+" Uhr | Classic Capo, Salami Blaze, Hog Wild, Shroom Town, Hawaii",bild:""});
  var out=[
    {key:"menues",label:"Menüs",items:men},
    {key:"bestof",label:"Best of",items:wo(function(a){return a.unter==="Best of Randy's";})},
    {key:"classics",label:"Classics",items:wo(function(a){return a.unter==="Randy's Classics";})},
    {key:"minis",label:"Minis",items:wo(function(a){return a.gruppe==="Minis";})},
    {key:"dips",label:"Dips",items:wo(function(a){return a.gruppe==="Dips";})},
    {key:"drinks",label:"Drinks",items:wo(function(a){return a.gruppe==="Getränke";})},
    {key:"salate",label:"Salate",items:wo(function(a){return a.gruppe==="Salate";})},
    {key:"snacks",label:"Snacks",items:wo(function(a){return a.unter==="Randy's Snacks";})},
    {key:"sauce",label:"Hot Sauces",items:wo(function(a){return a.unter==="Randy's Hot Sauce";})}
  ];
  ["own","half"].forEach(function(key){var c=stat(key);if(c)out.push(c);});
  return out.filter(function(c){return c.items.length;});
}
try{
  fetch(URL,{method:"POST",headers:{"Content-Type":"application/json","apikey":ANON,"Authorization":"Bearer "+ANON},body:JSON.stringify({p_filiale:"lindwedel"})})
  .then(function(r){return r.ok?r.json():null;})
  .then(function(k){if(!k||!k.artikel||!k.artikel.length)return;window.MENU=bauen(k);window.MENU_LIVE=true;if(window.__renderMenu)window.__renderMenu();})
  .catch(function(){});
}catch(e){}
})();
