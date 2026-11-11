/* Utilidades compartidas: navegación, formato colombiano, animaciones seguras. */
(function(){
  var S = window.SITE;
  var Q = new URLSearchParams(location.search);
  window.esc = function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};
  /* 1234567.8 -> "1.234.567,8" (siempre con punto de miles) */
  window.fmtCO = function(v,dec){
    dec=dec||0; var s=Math.abs(v).toFixed(dec).split(".");
    s[0]=s[0].replace(/\B(?=(\d{3})+(?!\d))/g,".");
    return (v<0?"−":"")+s.join(",");
  };
  window.isAvailable = function(b,m){return S.available.indexOf(b+"/"+m)>-1;};
  window.reportUrl = function(b,m){return "informe.html?marca="+encodeURIComponent(b)+"&mes="+encodeURIComponent(m||S.defaultMonth);};
  window.currentBrand = Q.get("marca"); window.currentMonth = Q.get("mes") || S.defaultMonth;

  window.renderNav = function(){
    var b=window.currentBrand, m=window.currentMonth;
    var pills=S.brands.map(function(x){
      var on=isAvailable(x.slug,m);
      if(!on) return '<span class="pill soon" title="Próximamente">'+esc(x.name.replace("Wake ",""))+'</span>';
      return '<a class="pill'+(x.slug===b?' active':'')+'" href="'+reportUrl(x.slug,m)+'">'+esc(x.name.replace("Wake ",""))+'</a>';
    }).join("");
    var opts=S.months.map(function(x){
      var any=S.available.some(function(k){return k.split("/")[1]===x.slug;});
      return '<option value="'+x.slug+'"'+(x.slug===m?' selected':'')+(any?'':' disabled')+'>'+esc(x.label)+(any?'':' · Próximamente')+'</option>';
    }).join("");
    var mob=S.brands.map(function(x){
      return isAvailable(x.slug,m)?'<a href="'+reportUrl(x.slug,m)+'">'+esc(x.name)+'</a>':'<span class="soon">'+esc(x.name)+'<small>Próximamente</small></span>';
    }).join("");
    var html='<nav class="nav"><div class="in"><a class="brandmark" href="index.html">Stay Group · <i>Informes</i></a>'+
      '<div class="pills">'+pills+'</div>'+
      '<select class="month" aria-label="Mes del informe">'+opts+'</select>'+
      '<button class="burger" aria-label="Menú" aria-expanded="false">☰</button></div></nav>'+
      '<div class="mobile-menu" id="mm"><a href="index.html">Portada</a>'+mob+'<select class="month" aria-label="Mes del informe">'+opts+'</select></div>';
    document.body.insertAdjacentHTML("afterbegin",html);
    var burger=document.querySelector(".burger"), mm=document.getElementById("mm");
    burger.addEventListener("click",function(){var o=mm.classList.toggle("open");burger.textContent=o?"✕":"☰";burger.setAttribute("aria-expanded",o);});
    document.querySelectorAll("select.month").forEach(function(sel){sel.addEventListener("change",function(){
      var mm2=sel.value, br=window.currentBrand;
      location.href = br ? reportUrl(br,mm2) : "index.html?mes="+mm2;
    });});
  };

  /* Animaciones: si algo falla, el contenido queda visible (nunca se oculta sin JS). */
  window.initMotion = function(){
    try{
      var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if(!("IntersectionObserver" in window) || reduce){ return; }
      document.documentElement.classList.add("js-anim");
      var io=new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in"); runInside(e.target); io.unobserve(e.target);} });},{threshold:.12,rootMargin:"0px 0px -5% 0px"});
      document.querySelectorAll(".reveal").forEach(function(el){
        var r=el.getBoundingClientRect(); if(r.top<innerHeight){el.classList.add("in");runInside(el);} else io.observe(el);
      });
      /* Respaldo: a los 4 s se muestra todo lo que falte */
      setTimeout(function(){document.querySelectorAll(".reveal:not(.in)").forEach(function(el){el.classList.add("in");runInside(el);});},4000);
      parallax();
    }catch(err){ document.documentElement.classList.remove("js-anim"); console.warn("Animación desactivada:",err); }
  };
  function runInside(root){
    root.querySelectorAll("[data-count]").forEach(countUp);
  }
  function countUp(el){
    if(el.dataset.done) return; el.dataset.done=1;
    var to=parseFloat(el.dataset.count), dec=+el.dataset.dec||0, pre=el.dataset.pre||"", suf=el.dataset.suf||"", final=el.textContent;
    var t0=null, D=1600;
    function step(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/D), e=1-Math.pow(1-p,3);
      el.textContent = p<1 ? pre+fmtCO(to*e,dec)+suf : final; if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  /* Parallax por transform: la imagen mide 130% del marco y se mueve como máximo ±15%, así nunca aparecen franjas. */
  function parallax(){
    var els=[].slice.call(document.querySelectorAll(".divider img"));
    if(!els.length) return;
    var tick=false;
    function upd(){ tick=false; els.forEach(function(img){
      var f=img.parentNode.getBoundingClientRect(); if(f.bottom<0||f.top>innerHeight) return;
      var p=(f.top+f.height/2-innerHeight/2)/(innerHeight/2+f.height/2); p=Math.max(-1,Math.min(1,p));
      img.style.transform="translate3d(0,"+(p*f.height*0.13).toFixed(1)+"px,0)"; }); }
    addEventListener("scroll",function(){ if(!tick){tick=true;requestAnimationFrame(upd);} },{passive:true});
    addEventListener("resize",upd); upd();
  }

  window.initLightbox = function(){
    var lb=document.createElement("div"); lb.className="lb"; lb.innerHTML='<button type="button">Cerrar ✕</button><img alt="">';
    document.body.appendChild(lb);
    lb.addEventListener("click",function(){lb.classList.remove("open");});
    document.addEventListener("keydown",function(e){if(e.key==="Escape")lb.classList.remove("open");});
    document.querySelectorAll(".shot").forEach(function(s){s.addEventListener("click",function(){
      var i=s.querySelector("img"); lb.querySelector("img").src=i.src; lb.querySelector("img").alt=i.alt; lb.classList.add("open"); lb.scrollTop=0;});});
  };
})();
/* Carga data/<marca>-<mes>.js. cb(ok) */
window.loadReport = function(key, cb){
  if(window.REPORTS && window.REPORTS[key]) return cb(true);
  var s=document.createElement("script"); s.src="data/"+key.replace("/","-")+".js"+(window.SITE&&SITE.version?"?v="+SITE.version:"");
  s.onload=function(){cb(!!(window.REPORTS&&window.REPORTS[key]));}; s.onerror=function(){cb(false);};
  document.head.appendChild(s);
};
/* Grupo por propiedad de una marca */
window.groupOf = function(slug){ return ((window.SITE&&SITE.groups)||[]).filter(function(g){return g.brands.indexOf(slug)>-1;})[0]; };
window.loadAll = function(keys, cb){ var n=keys.length; if(!n) return cb(); keys.forEach(function(k){loadReport(k,function(){ if(--n===0) cb(); });}); };
