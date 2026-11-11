/* Tablero orgánico RRSS. Los datos viven en data/rrss.js (window.RRSS). */
(function(){
  var DATA = window.RRSS;
  if(!DATA){
    document.getElementById("app").innerHTML = '<p class="wrap" style="padding:140px 0">No se pudieron cargar los datos del informe.</p>';
    return;
  }
  var STATUS = {
    "Completed":"Completado",
    "Not started":"Sin iniciar",
    "In progress":"En proceso",
    "Cancelled":"Cancelado",
    "Under review":"En revisión",
    "Delay":"Retrasado",
    "Programado":"Programado"
  };
  var Q = new URLSearchParams(location.search);
  function bySlug(s){ return DATA.brands.filter(function(b){ return b.slug===s || b.id===s; })[0]; }
  var current = bySlug(Q.get("marca")||"") || DATA.brands[0];
  var filters = { creatives: "all", upcoming: "all" };

  function setBrand(b, push){
    current = b;
    if(push !== false){
      var u = new URL(location.href);
      u.searchParams.set("marca", b.slug);
      history.replaceState(null, "", u.pathname + u.search + "#marca");
    }
    document.querySelectorAll(".brandbar .pill, table.rrss tbody tr").forEach(function(el){
      var id = el.getAttribute("data-brand");
      var on = id===b.id;
      el.classList.toggle("on", on);
      el.classList.toggle("active", on);
      if(el.classList.contains("pill")){
        var br = DATA.brands.filter(function(x){return x.id===id;})[0];
        if(on && br){ el.style.background=br.color; el.style.borderColor=br.color; el.style.color="#fff"; }
        else { el.style.background=""; el.style.borderColor=""; el.style.color=""; }
      }
    });
    var root = document.getElementById("brand-panel");
    if(root){ root.innerHTML = brandPanel(b); bindBrand(root, b); initMotion(); initLightbox(); }
    var bar = document.querySelector(".brandbar .pill[data-brand='"+b.id+"']");
    if(bar && push !== false){ /* stay */ }
  }

  function inter(p){ return (p.likes||0)+(p.comments||0)+(p.shares||0); }
  function tot(m, key){
    if(!m) return 0;
    if(key==="inter") return inter(m.facebook)+inter(m.instagram);
    return (m.facebook[key]||0)+(m.instagram[key]||0);
  }
  function pct(v){
    if(v==null || v==="") return "";
    var n = Number(v), sign = n>0?"+":(n<0?"−":"");
    return sign + fmtCO(Math.abs(n), 1) + " %";
  }
  function deltaClass(v){ return v<0?"down":(v===0?"flat":""); }
  function kpi(lab, val, chg, note){
    var d = chg==null?"":('<div class="delta '+deltaClass(chg)+'">'+esc(pct(chg))+(note?(" · "+esc(note)):"")+"</div>");
    return '<div class="kpi reveal"><div class="lab">'+esc(lab)+'</div><div class="val" data-count="'+val+'" data-dec="0">'+fmtCO(val,0)+'</div>'+d+"</div>";
  }
  function dateLabel(s){
    if(!s) return "Sin fecha";
    var p = s.split("-"); if(p.length<3) return s;
    var meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    return parseInt(p[2],10)+" "+meses[parseInt(p[1],10)-1];
  }
  function statusLabel(s){ return STATUS[s]||s||""; }
  function isStory(it){ return /historia/i.test(it.format||""); }
  function passFilter(it, f){
    if(f==="all") return true;
    if(f==="stories") return isStory(it);
    return !isStory(it);
  }
  function fmtTitle(){ return (DATA.meta && DATA.meta.title) || "Informe orgánico RRSS"; }

  function summaryTable(){
    var rows = DATA.brands.map(function(b){
      var m=b.metrics, pending=!m;
      var varR = pending? "Pendiente" : pct(m.totalReachChangePct);
      var cls = pending? "" : (m.totalReachChangePct<0?"dn":"up");
      return '<tr data-brand="'+esc(b.id)+'" class="'+(b.id===current.id?"on":"")+'">'+
        '<td class="brandcell"><span class="dot" style="background:'+esc(b.color)+'"></span>'+esc(b.name)+"</td>"+
        "<td>"+(pending?"Pendiente":fmtCO(tot(m,"impressions"),0))+"</td>"+
        "<td>"+(pending?"Pendiente":fmtCO(tot(m,"reach"),0))+"</td>"+
        '<td class="'+cls+'">'+esc(varR)+"</td>"+
        "<td>"+(pending?"Pendiente":fmtCO(tot(m,"inter"),0))+"</td>"+
        "<td>"+(pending?"Pendiente":fmtCO(tot(m,"followersGained"),0))+"</td>"+
        "<td>"+(pending?"Pendiente":fmtCO(tot(m,"posts"),0))+"</td>"+
        "<td>"+b.creatives.length+"</td>"+
        "<td>"+b.upcoming.length+"</td></tr>";
    }).join("");
    return '<div class="tblwrap reveal"><table class="rrss"><thead><tr>'+
      "<th>Marca</th><th>Impresiones (FB+IG)</th><th>Alcance (FB+IG)</th><th>Var. alcance</th>"+
      "<th>Interacciones</th><th>Seguidores ganados</th><th>Publicaciones</th>"+
      "<th>Piezas del mes</th>"+
      "<th>Lo que viene</th>"+
      "</tr></thead><tbody>"+rows+"</tbody></table></div>"+
      '<p class="caption">'+esc(DATA.meta.source||"")+"</p>";
  }

  function diagnosis(){
    var d=DATA.diagnosis||{}, blocks=d.blocks||[];
    var html = blocks.map(function(b){
      if(b.type==="callout") return '<article class="callout reveal"><div class="lead">'+esc(b.lead)+'</div><p>'+esc(b.text)+"</p></article>";
      if(b.type==="text") return '<p class="diag-text reveal">'+esc(b.text)+"</p>";
      if(b.type==="table"){
        var th=b.columns.map(function(c){return "<th>"+esc(c)+"</th>";}).join("");
        var tr=b.rows.map(function(r){return "<tr>"+r.map(function(c){return "<td>"+esc(c)+"</td>";}).join("")+"</tr>";}).join("");
        return '<div class="tblwrap reveal"><table class="rrss"><thead><tr>'+th+"</tr></thead><tbody>"+tr+"</tbody></table></div>"+
          (d.caption?'<p class="caption">'+esc(d.caption)+"</p>":"");
      }
      return "";
    }).join("");
    return html;
  }

  function platformCard(name, p){
    if(!p) return "";
    var items = [
      ["Publicaciones", p.posts, null],
      ["Impresiones", p.impressions, p.impressionsChangePct],
      ["Alcance", p.reach, p.reachChangePct],
      ["Me gusta", p.likes, null],
      ["Comentarios", p.comments, null],
      ["Compartidos", p.shares, null],
      ["Seguidores ganados", p.followersGained, null],
      ["Interacciones", inter(p), p.interactionsChangePct]
    ];
    var mets = items.map(function(it){
      return "<div><span>"+esc(it[0])+"</span><strong"+(it[2]!=null?' class="'+deltaClass(it[2])+'"':"")+">"+fmtCO(it[1],0)+"</strong>"+
        (it[2]!=null?"<small> "+esc(pct(it[2]))+"</small>":"")+"</div>";
    }).join("");
    return '<div class="card reveal"><div class="eyebrow">'+esc(name)+'</div><h3>'+esc(name)+'</h3>'+
      '<div class="acct">'+esc(p.account||"")+"</div>"+
      '<div class="metrics">'+mets+"</div></div>";
  }

  function weekChart(b){
    var m=b.metrics; if(!m) return "";
    var weeks=DATA.meta.weeks||[];
    var fb=m.facebook.weeklyImpressions||[], ig=m.instagram.weeklyImpressions||[];
    var n=Math.max(weeks.length, fb.length, ig.length);
    if(!n) return "";
    var max=1;
    for(var i=0;i<n;i++){ max=Math.max(max, fb[i]||0, ig[i]||0); }
    var W=640, H=220, L=36, R=16, T=16, B=36, cw=(W-L-R)/n, bw=Math.max(10, cw*0.28);
    var bars="", labels="", rows="";
    for(i=0;i<n;i++){
      var x=L+cw*i+cw/2;
      var h1=((fb[i]||0)/max)*(H-T-B), h2=((ig[i]||0)/max)*(H-T-B);
      bars += '<rect class="bar bar-y" x="'+(x-bw-2)+'" y="'+(H-B-h1)+'" width="'+bw+'" height="'+h1+'" fill="#A9744F"></rect>';
      bars += '<rect class="bar bar-y" x="'+(x+2)+'" y="'+(H-B-h2)+'" width="'+bw+'" height="'+h2+'" fill="'+esc(b.color)+'"></rect>';
      labels += '<text x="'+x+'" y="'+(H-12)+'" text-anchor="middle">'+esc(weeks[i]||("Sem. "+(i+1)))+"</text>";
      rows += "<tr><td>"+esc(weeks[i]||("Sem. "+(i+1)))+"</td><td>"+fmtCO(fb[i]||0,0)+"</td><td>"+fmtCO(ig[i]||0,0)+"</td><td>"+fmtCO((fb[i]||0)+(ig[i]||0),0)+"</td></tr>";
    }
    return '<div class="weekchart reveal"><h3>Desglose semanal <em>impresiones</em></h3>'+
      '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Impresiones por semana">'+bars+labels+"</svg>"+
      '<div class="legend"><span><i style="background:#A9744F"></i>Facebook</span><span><i style="background:'+esc(b.color)+'"></i>Instagram</span></div>'+
      (DATA.meta.weeksNote?'<p class="smallnote">'+esc(DATA.meta.weeksNote)+"</p>":"")+
      '<div class="tblwrap" style="margin-top:16px;border:0"><table class="rrss" style="min-width:0"><thead><tr><th>Semana</th><th>Facebook</th><th>Instagram</th><th>Total</th></tr></thead><tbody>'+rows+"</tbody></table></div></div>";
  }

  function creativeCard(it, brand, fullCopy){
    var img = (it.images&&it.images[0]) || null;
    var more = it.images && it.images.length>1 ? '<span class="more">+'+ (it.images.length-1)+"</span>" : "";
    var pic;
    if(img){
      pic = '<div class="pic shot"><img src="'+esc(img.src)+'" alt="'+esc(it.title)+'" loading="lazy">'+more+"</div>";
    } else {
      var hint = (it.links&&it.links.length) ? "Vista previa en el enlace" : "Pieza sin archivo cargado en Notion";
      pic = '<div class="pic"><div class="ph" style="background:'+esc(brand.color)+'"><span>'+esc(it.format||"Pieza")+"</span>"+esc(hint)+"</div></div>";
    }
    var st = statusLabel(it.status);
    var tags = '<span class="tag">'+esc(it.format||"")+"</span>"+(st?'<span class="tag'+(it.status==="Completed"?" fill":(it.status==="Under review"||it.status==="Delay"?" wood":""))+'">'+esc(st)+"</span>":"");
    var copy = it.copy ? '<div class="copy'+(fullCopy?"":" clip")+'">'+esc(it.copy)+"</div>"+(fullCopy||(it.copy||"").split("\n").length<=5?"":'<button type="button" class="morecopy">Ver más</button>') : "";
    var links = (it.links||[]).map(function(l){ return '<a href="'+esc(l.url)+'" target="_blank" rel="noopener">'+esc(l.label)+" ↗</a>"; }).join("");
    if(it.notion) links += '<a href="'+esc(it.notion)+'" target="_blank" rel="noopener">Notion ↗</a>';
    return '<article class="creative reveal"><div class="visual">'+pic+'</div><div class="body"><div class="meta"><span class="when">'+esc(dateLabel(it.date))+"</span>"+tags+"</div>"+
      "<h3>"+esc(it.title)+"</h3>"+copy+'<div class="links">'+links+"</div></div></article>";
  }

  function gallery(items, key, brand, fullCopy){
    var f = filters[key]||"all";
    var vis = items.filter(function(it){ return passFilter(it,f); });
    var empty = vis.length? vis.map(function(it){ return creativeCard(it, brand, fullCopy); }).join("") :
      '<p class="diag-text">No hay piezas en este filtro.</p>';
    return '<div class="filters" data-gal="'+key+'">'+
      '<button type="button" data-f="all" class="'+(f==="all"?"on":"")+'">Todas</button>'+
      '<button type="button" data-f="feed" class="'+(f==="feed"?"on":"")+'">Posts, reels y carruseles</button>'+
      '<button type="button" data-f="stories" class="'+(f==="stories"?"on":"")+'">Historias</button>'+
      '<span class="count">'+vis.length+" de "+items.length+"</span></div>"+
      '<div class="gallery">'+empty+"</div>";
  }

  function brandPanel(b){
    var m=b.metrics, meta=DATA.meta;
    var metricsBlock;
    if(!m){
      metricsBlock = '<div class="pending reveal"><h3>Métricas pendientes de conexión</h3><p>'+esc(b.metricsNote||"Aún no hay métricas para esta marca.")+"</p></div>";
    } else {
      var impr=tot(m,"impressions"), reach=tot(m,"reach"), interT=tot(m,"inter"), fol=tot(m,"followersGained");
      metricsBlock = '<div class="cells c4">'+
        kpi("Impresiones", impr, m.totalImpressionsChangePct, "vs "+(meta.comparePeriod||""))+
        kpi("Alcance", reach, m.totalReachChangePct, "vs "+(meta.comparePeriod||""))+
        kpi("Interacciones", interT, null, "Me gusta + comentarios + compartidos")+
        kpi("Seguidores ganados", fol, null, "")+
        "</div>"+
        '<div class="plat">'+platformCard("Facebook", m.facebook)+platformCard("Instagram", m.instagram)+"</div>"+
        weekChart(b);
    }
    var diag = b.diagnosis ? '<div class="callout reveal"><div class="lead">Diagnóstico de la marca</div><p>'+esc(b.diagnosis)+"</p></div>" : "";
    var parr = '<div class="parrillas">'+
      (b.parrillaCurrent?'<a class="btn ghost" href="'+esc(b.parrillaCurrent)+'" target="_blank" rel="noopener">Parrilla '+esc(meta.currentMonth||"")+' en Notion ↗</a>':"")+
      (b.parrillaUpcoming && b.parrillaUpcoming!==b.parrillaCurrent?'<a class="btn ghost" href="'+esc(b.parrillaUpcoming)+'" target="_blank" rel="noopener">Parrilla '+esc(meta.nextMonth||"")+' en Notion ↗</a>':"")+
      "</div>";
    return '<section class="block" id="metricas"><div class="sh"><div class="eyebrow">'+esc(b.name)+'</div><div><h2 class="reveal">'+esc(meta.metricsTitle||("Métricas de la semana "+(meta.period||"")))+'</h2>'+
      (meta.comparePeriod?'<p class="intro">Frente a '+esc(meta.comparePeriod)+".</p>":"")+"</div></div>"+metricsBlock+"</section>"+
      (diag?'<section class="block" id="diagnostico-marca"><div class="sh"><div class="eyebrow">'+esc(b.name)+'</div><div><h2 class="reveal">Diagnóstico</h2></div></div>'+diag+"</section>":"")+
      '<section class="block" id="creatividades"><div class="sh"><div class="eyebrow">'+esc(b.name)+'</div><div><h2 class="reveal">'+esc(meta.creativesTitle||("Creatividades de "+(meta.currentMonth||"")))+'</h2></div></div>'+
      '<div id="gal-creatives">'+gallery(b.creatives,"creatives",b,false)+"</div></section>"+
      '<section class="block" id="lo-que-viene"><div class="sh"><div class="eyebrow">'+esc(b.name)+'</div><div><h2 class="reveal">'+esc(meta.upcomingTitle||("Lo que viene en "+(meta.nextMonth||"")))+'</h2></div></div>'+
      '<div id="gal-upcoming">'+gallery(b.upcoming,"upcoming",b,true)+"</div>"+parr+"</section>";
  }

  function bindBrand(root, b){
    root.querySelectorAll(".filters").forEach(function(bar){
      bar.addEventListener("click", function(e){
        var btn=e.target.closest("button[data-f]"); if(!btn) return;
        var key=bar.getAttribute("data-gal");
        filters[key]=btn.getAttribute("data-f");
        var full = key==="upcoming";
        var hold=document.getElementById(key==="upcoming"?"gal-upcoming":"gal-creatives");
        hold.innerHTML = gallery(b[key], key, b, full);
        bindGallery(hold);
        initLightbox();
      });
    });
    bindGallery(root);
    root.querySelectorAll(".morecopy").forEach(function(btn){
      btn.addEventListener("click", function(){
        var c=btn.previousElementSibling; if(c) c.classList.remove("clip");
        btn.remove();
      });
    });
  }
  function bindGallery(root){
    root.querySelectorAll(".morecopy").forEach(function(btn){
      btn.addEventListener("click", function(){
        var c=btn.previousElementSibling; if(c) c.classList.remove("clip");
        btn.remove();
      });
    });
  }

  function brandBar(){
    return '<div class="brandbar"><div class="wrap"><div class="in">'+DATA.brands.map(function(b){
      var on=b.id===current.id, st=on?(' style="background:'+esc(b.color)+';border-color:'+esc(b.color)+';color:#fff"'):"";
      return '<a class="pill'+(on?" active":"")+'" data-brand="'+esc(b.id)+'" href="rrss.html?marca='+encodeURIComponent(b.slug)+'#marca"'+st+">"+esc(b.name)+"</a>";
    }).join("")+"</div></div></div>";
  }

  renderNav();
  document.title = fmtTitle() + " · Stay Group";
  var meta=DATA.meta;
  document.getElementById("app").innerHTML =
    '<header class="rrss-hero wrap">'+
      '<div class="eyebrow reveal">Stay Group · Informe orgánico de redes</div>'+
      '<h1 class="reveal">Redes<br>sociales</h1>'+
      '<div class="sub reveal">'+esc(meta.period ? ("Semana del "+meta.period) : (meta.title||""))+"</div>"+
      (meta.subtitle?'<p class="lede reveal">'+esc(meta.subtitle)+"</p>":"")+
      '<div class="rrss-meta reveal">'+
        (meta.comparePeriod?'<span class="chip">vs '+esc(meta.comparePeriod)+"</span>":"")+
        (meta.currentMonth?'<span class="chip">Creatividades de '+esc(meta.currentMonth)+"</span>":"")+
        (meta.updatedAt?'<span class="chip">Actualizado: '+esc(meta.updatedAt)+"</span>":"")+
      "</div></header>"+
    '<main>'+
      '<section class="block wrap" id="resumen"><div class="sh"><div class="eyebrow">Grupo</div><div><h2 class="reveal">Resumen por marca</h2></div></div>'+summaryTable()+"</section>"+
      '<section class="block wrap" id="diagnostico"><div class="sh"><div class="eyebrow">Semana</div><div><h2 class="reveal">'+esc((DATA.diagnosis&&DATA.diagnosis.title)||"Diagnóstico y recomendaciones")+'</h2></div></div>'+diagnosis()+"</section>"+
      brandBar()+
      '<div class="wrap" id="marca"><div id="brand-panel">'+brandPanel(current)+"</div></div>"+
    "</main>"+
    '<footer class="sources"><div class="wrap"><div class="cols"><div><h5>Fuente</h5><p>HighLevel (Social Planner) y parrillas de Notion. Interacciones = me gusta + comentarios + compartidos. HighLevel no da métricas por publicación ni cuenta historias.</p></div>'+
      '<div><h5>Periodo</h5><p class="pend">'+esc(meta.title||"")+(meta.updatedAt?" · "+esc(meta.updatedAt):"")+"</p></div></div>"+
      '<div class="bottom">Stay Group · Mercadeo · RRSS orgánicas</div></div></footer>';

  document.querySelectorAll("table.rrss tbody tr[data-brand]").forEach(function(tr){
    tr.addEventListener("click", function(){
      var b=DATA.brands.filter(function(x){return x.id===tr.getAttribute("data-brand");})[0];
      if(b){ setBrand(b); document.getElementById("marca").scrollIntoView({behavior:"smooth",block:"start"}); }
    });
  });
  document.querySelectorAll(".brandbar .pill").forEach(function(a){
    a.addEventListener("click", function(e){
      e.preventDefault();
      var b=DATA.brands.filter(function(x){return x.id===a.getAttribute("data-brand");})[0];
      if(b) setBrand(b, true);
    });
  });
  bindBrand(document.getElementById("brand-panel"), current);
  initMotion();
  initLightbox();
})();
