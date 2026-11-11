/* Render genérico de un informe mensual. Cada sección aparece solo si el archivo de datos la trae. */
(function(){
  var S=window.SITE; renderNav();
  var b=currentBrand, m=currentMonth, key=b+"/"+m;
  var brand=S.brands.filter(function(x){return x.slug===b;})[0], month=S.months.filter(function(x){return x.slug===m;})[0];
  var app=document.getElementById("app");
  if(!brand){ location.replace("index.html"); return; }
  if(!isAvailable(b,m)) return soon();
  loadReport(key,function(ok){ ok ? render(window.REPORTS[key]) : soon(); });

  function soon(){
    document.title=brand.name+" · Próximamente";
    app.innerHTML='<section class="soonpage" style="background:'+esc(brand.color)+'"><div class="wrap"><div class="eyebrow" style="color:rgba(255,255,255,.8)">'+esc(month?month.label:m)+'</div><h1>'+esc(brand.name)+'</h1><p class="serif" style="font-size:32px;font-style:italic;margin-top:10px">Próximamente</p><p style="margin-top:30px"><a class="btn" style="background:rgba(0,0,0,.25)" href="index.html">← Volver a la portada</a></p></div></section>';
  }
  /* ---------- tema por marca ---------- */
  function rgba(hex,a){ var h=hex.replace("#",""); return "rgba("+parseInt(h.substr(0,2),16)+","+parseInt(h.substr(2,2),16)+","+parseInt(h.substr(4,2),16)+","+a+")"; }
  function applyTheme(t){
    if(!t) return; var st=document.documentElement.style;
    if(t.primary){ st.setProperty("--olive",t.primary); st.setProperty("--olive-25",rgba(t.primary,.25)); st.setProperty("--olive-10",rgba(t.primary,.1)); }
    if(t.accent) st.setProperty("--wood",t.accent);
    if(t.light) st.setProperty("--light",t.light);
  }
  /* ---------- piezas ---------- */
  function trendOf(it){ if(it.trend) return it.trend; var d=it.delta||""; return /^[−-]/.test(d)?"down":(/^(Igual|Sept\.|Septiembre|Sin )/.test(d)?"flat":"up"); }
  /* Count-up solo si el texto mostrado se puede reconstruir exactamente con el formato animado */
  function val(it,cls){
    var disp=String(it.display), c=cls||"val";
    var mm=disp.match(/^([^\d−-]*?)(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d+))?(.*)$/);
    if(mm && !/\d/.test(mm[4])){
      var dec=mm[3]?mm[3].length:0, num=parseFloat(mm[2].replace(/\./g,"")+(mm[3]?"."+mm[3]:""));
      if(mm[1]+fmtCO(num,dec)+mm[4]===disp)
        return '<div class="'+c+'" data-count="'+num+'" data-dec="'+dec+'" data-pre="'+esc(mm[1])+'" data-suf="'+esc(mm[4])+'">'+esc(disp)+'</div>';
    }
    return '<div class="'+c+'">'+esc(disp)+'</div>';
  }
  function kpi(it,extra){
    return '<div class="kpi'+(extra?" "+extra:"")+'"><div class="lab">'+esc(it.label)+'</div>'+val(it)+
      (it.delta?'<div class="delta '+trendOf(it)+'">'+esc(it.delta)+'</div>':'')+(it.note?'<div class="note">'+esc(it.note)+'</div>':'')+'</div>';
  }
  function ccls(n){ return (n%3===1&&n>4)?" c4":""; }
  function gcls(n){ return n<=3?"g3":(n===4?"g4":(n===5?"g5":"g3")); }
  var N=0;
  function sh(eyebrow,title,intro){
    N++; return '<div class="sh reveal"><div class="eyebrow">'+String(N).padStart(2,"0")+' — '+esc(eyebrow)+'</div><div><h2>'+title+'</h2>'+(intro?'<p class="intro">'+esc(intro)+'</p>':'')+'</div></div>';
  }
  function divider(d){ return d?'<div class="divider"><img src="'+esc(d.src)+'" alt="'+esc(d.alt)+'" loading="lazy">'+(d.caption?'<div class="cap">'+esc(d.caption)+'</div>':'')+'</div>':''; }
  function note(t){ return t?'<p class="smallnote">'+esc(t)+'</p>':''; }

  /* ---------- gráficas (escala dinámica) ---------- */
  /* Escala "bonita": 3 a 5 divisiones con paso 1, 2, 2,5 o 5 × 10^k; se elige el tope más cercano al máximo */
  function scale(v){
    if(v<=0) return {max:1,n:4};
    var best=null;
    [4,5,3].forEach(function(n){
      var raw=v/n, p=Math.pow(10,Math.floor(Math.log10(raw))), st=[1,2,2.5,5,10].map(function(f){return f*p;}).filter(function(x){return x>=raw;})[0], mx=st*n;
      if(!best||mx<best.max-1e-9) best={max:mx,n:n};
    });
    return best;
  }
  function tick(v,money,max){
    if(v===0) return money?"$0":"0";
    if(!money) return fmtCO(v,(v%1)?1:0);
    if(max>=1e6){ var mv=v/1e6; return "$"+fmtCO(mv,(Math.round(mv*100)%100)?((Math.round(mv*100)%10)?2:1):0)+" M"; }
    return "$"+fmtCO(v/1e3,0)+" mil";
  }
  /* Ancho del lienzo: más angosto en móvil para que el texto de la gráfica no se vea diminuto */
  function CW(){ return (window.innerWidth||1024)<700?380:560; }
  var COLS=["var(--olive)","var(--wood)","var(--light)"];
  function hbar(data,o){
    o=o||{}; var longest=Math.max.apply(null,data.map(function(d){return d.label.length;}));
    var W=CW(),L=Math.min(W<500?150:190,Math.max(70,longest*6.4+14)),R=70,row=data.length>4?34:46,H=row*data.length;
    var sc=scale(Math.max.apply(null,data.map(function(d){return d.value;}))), max=sc.max;
    var s='<svg viewBox="0 0 '+W+' '+(H+30)+'" role="img" aria-label="'+esc(o.aria||"Gráfica de barras")+'">';
    for(var g=0;g<=sc.n;g++){var x=L+(W-L-R)*g/sc.n; s+='<line x1="'+x+'" x2="'+x+'" y1="0" y2="'+H+'" style="stroke:var(--olive-25)"/><text x="'+x+'" y="'+(H+20)+'" text-anchor="middle">'+tick(max*g/sc.n,o.money,max)+'</text>';}
    data.forEach(function(d,i){var w=Math.max(2,(W-L-R)*d.value/max), bh=row*.5, y=i*row+(row-bh)/2, col=o.single?COLS[0]:COLS[i%3];
      s+='<text x="'+(L-10)+'" y="'+(y+bh/2)+'" text-anchor="end" dominant-baseline="middle">'+esc(d.label)+'</text>'+
         '<g class="bar bar-x"><rect x="'+L+'" y="'+y.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+bh.toFixed(1)+'" style="fill:'+col+'"><title>'+esc(d.label+": "+d.display)+'</title></rect>'+
         '<text x="'+(L+w+8).toFixed(1)+'" y="'+(y+bh/2)+'" dominant-baseline="middle" style="fill:var(--ink);font-size:12px">'+esc(d.display)+'</text></g>';});
    return s+'</svg>';
  }
  function vbar(data,o){
    o=o||{}; var W=CW(),H=210,L=50,B=30,gw=(W-L)/data.length,bw=Math.min(46,gw*.22);
    var sc=scale(Math.max.apply(null,data.map(function(d){return Math.max(d.oct,d.sep||0);}))), max=sc.max;
    var s='<svg viewBox="0 0 '+W+' '+(H+B)+'" role="img" aria-label="'+esc(o.aria||"Octubre vs. septiembre")+'">';
    for(var g=0;g<=sc.n;g++){var y=H-H*g/sc.n; s+='<line x1="'+L+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" style="stroke:var(--olive-25)"/><text x="'+(L-8)+'" y="'+y+'" text-anchor="end" dominant-baseline="middle">'+fmtCO(max*g/sc.n)+'</text>';}
    data.forEach(function(d,i){var cx=L+gw*i+gw/2;
      [[d.oct,COLS[0],-bw-3,"Octubre"],[d.sep,COLS[2],3,"Septiembre"]].forEach(function(v){
        if(v[0]==null) return; var h=Math.max(1,H*v[0]/max);
        s+='<g class="bar bar-y"><rect x="'+(cx+v[2]).toFixed(1)+'" y="'+(H-h).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" style="fill:'+v[1]+'"><title>'+esc(d.label+" · "+v[3]+": "+fmtCO(v[0]))+'</title></rect>'+
        '<text x="'+(cx+v[2]+bw/2).toFixed(1)+'" y="'+(H-h-6).toFixed(1)+'" text-anchor="middle" style="font-size:10px">'+fmtCO(v[0])+'</text></g>';});
      s+='<text x="'+cx+'" y="'+(H+20)+'" text-anchor="middle">'+esc(d.label)+'</text>';});
    return s+'</svg>';
  }
  function chartBox(c){
    var body=c.type==="vbar"?vbar(c.data,{aria:c.title})+'<div class="legend"><span><i style="background:var(--olive)"></i>Octubre</span><span><i style="background:var(--light)"></i>Septiembre</span></div>'
                            :hbar(c.data,{money:c.money,single:c.single,aria:c.title});
    return '<div class="chart"><h3>'+c.title+'</h3>'+body+note(c.note)+'</div>';
  }
  function charts(list){ return list&&list.length?'<div class="charts reveal'+(list.length===1?' one':'')+'">'+list.map(chartBox).join("")+'</div>':''; }
  function cards(list){
    if(!list||!list.length) return '';
    return '<div class="cards3 n'+Math.min(list.length,3)+' reveal">'+list.map(function(c){return '<div class="card"><span class="tag">'+esc(c.name)+'</span>'+
      (c.rows||[]).map(function(r){return '<div class="mini">'+esc(r.label)+'</div><div class="big">'+esc(r.display)+'</div>';}).join("")+
      (c.delta?'<div class="txt">'+esc(c.delta)+'</div>':'')+(c.note?'<div class="txt muted">'+esc(c.note)+'</div>':'')+'</div>';}).join("")+'</div>';
  }
  function block(x){
    return '<section class="block wrap"'+(x.tight?' style="padding-top:0"':'')+'>'+sh(x.eyebrow,x.title,x.intro)+
      (x.items&&x.items.length?'<div class="cells'+ccls(x.items.length)+' reveal">'+x.items.map(function(i){return kpi(i);}).join("")+'</div>':'')+
      (x.charts?'<div style="height:28px"></div>'+charts(x.charts):'')+cards(x.cards)+note(x.note)+'</section>';
  }
  function emailCard(e){
    return '<article class="email reveal"><div class="shot" title="Ampliar"><span class="zoom">Ampliar</span><img src="'+esc(e.image)+'" alt="Captura del email '+esc(e.subject)+'" loading="lazy"></div><div>'+
      '<span class="tag fill">'+esc(e.tag)+'</span><h3>'+esc(e.subject)+'</h3><div class="date">'+esc(e.date)+'</div><p class="aud"><b>Audiencia</b>'+esc(e.audience)+'</p>'+
      '<div class="metrics"><div><span>Enviados</span><strong>'+esc(e.sent)+'</strong></div><div><span>Entregados</span><strong>'+esc(e.delivered)+'</strong></div><div><span>Apertura</span><strong>'+esc(e.open)+'</strong><small>'+esc(e.opens)+'</small></div>'+
      '<div><span>CTR</span><strong>'+esc(e.ctr)+'</strong><small>'+esc(e.clicks)+' clics</small></div><div><span>Rebotes</span><strong>'+esc(e.bounce)+'</strong><small>'+esc(e.bounces)+'</small></div><div><span>Bajas</span><strong>'+esc(e.unsubs)+'</strong></div></div>'+
      note(e.note)+'</div></article>';
  }
  function post(i){
    return '<article class="infl reveal"><div class="shot" title="Ampliar"><span class="zoom">Ampliar</span><img src="'+esc(i.image)+'" alt="Captura de la publicación de '+esc(i.handle)+'" loading="lazy"></div><div>'+
      '<span class="tag wood">'+esc(i.format)+'</span><h3>'+esc(i.handle)+'</h3>'+(i.name||i.bio?'<div>'+esc([i.name,i.bio].filter(Boolean).join(" · "))+'</div>':'')+
      (i.caption?'<blockquote>'+esc(i.caption)+'</blockquote>':'')+
      '<div class="metrics">'+(i.metrics||[]).map(function(x){return '<div><span>'+esc(x.label)+'</span><strong>'+esc(x.display)+'</strong></div>';}).join("")+'</div>'+
      '<p class="meta"><b>Publicado</b>'+esc(i.date)+'</p>'+(i.url?'<p class="meta"><a href="'+esc(i.url)+'" target="_blank" rel="noopener">Ver publicación ↗</a></p>':'')+note(i.source?"Fuente: "+i.source:"")+'</div></article>';
  }
  function stories(s){
    return '<article class="stories reveal"><div class="txt"><span class="tag wood">'+esc(s.format||"Historias en Instagram")+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.text)+'</p>'+note(s.source)+'</div>'+
      '<div class="pics">'+(s.images||[]).map(function(im){return '<div class="shot wide" title="Ampliar"><span class="zoom">Ampliar</span><img src="'+esc(im.src)+'" alt="'+esc(im.alt)+'" loading="lazy"></div>';}).join("")+'</div></article>';
  }
  function blocksAfter(r,where){ return (r.blocks||[]).filter(function(x){return x.after===where;}).map(block).join(""); }

  /* ---------- página ---------- */
  function render(r){
    applyTheme(r.theme);
    document.title=r.brand+" · "+r.month+" · Informe de Mercadeo";
    var P=r.photos, D=P.dividers||[], T=r.titles||{}, mes=r.month.split(" ")[0].toLowerCase(), h="";
    h+='<header class="hero"><img class="bg" src="'+esc(P.hero)+'" alt="'+esc(P.heroAlt||r.brand)+'" fetchpriority="high"'+(P.heroPos?' style="object-position:'+esc(P.heroPos)+'"':'')+'><div class="content">'+
       (P.logo?'<img class="logo" src="'+esc(P.logo)+'" alt="Logo '+esc(r.brand)+'">':'')+
       '<div class="eyebrow">Informe mensual de Mercadeo</div><h1>'+esc(r.brand)+'</h1><div class="sub">'+esc(r.month)+'</div><div class="line">'+esc(r.period)+'</div></div><div class="scrollcue" aria-hidden="true"></div></header>';
    // Otras marcas del mismo grupo (propiedad)
    var grp=window.groupOf?groupOf(b):null, sib=grp?grp.brands.filter(function(x){return x!==b;}):[];
    if(sib.length){
      h+='<div class="siblings wrap"><span class="eyebrow">También en este grupo</span><span class="links">'+sib.map(function(x){var bb=S.brands.filter(function(y){return y.slug===x;})[0]; if(!bb) return "";
        return isAvailable(x,m)?'<a href="'+reportUrl(x,m)+'">'+esc(bb.name)+'</a>':'<span>'+esc(bb.name)+'</span>';}).join('<i>·</i>')+'</span></div>';
    }
    // Cifras del mes
    h+='<section class="block wrap">'+sh("Cifras del mes",T.kpis||"Lo esencial de <em>"+esc(mes)+"</em>",r.intro)+
       '<div class="grid g3 headline reveal">'+r.headline.map(function(i){return kpi(i);}).join("")+'</div></section>';
    h+=divider(D[0]);
    // Sitio web
    if(r.web){ h+='<section class="block wrap">'+sh(r.web.eyebrow||"Sitio web y SEO",T.web||"Sitio web <em>y SEO</em>",r.web.intro)+
       '<div class="cells'+ccls(r.web.items.length)+' reveal">'+r.web.items.map(function(i){return kpi(i);}).join("")+'</div>'+note(r.web.note)+'</section>'; }
    h+=blocksAfter(r,"web");
    // Pauta
    var A=r.ads;
    if(A){
      h+='<section class="block wrap"'+(r.web?' style="padding-top:0"':'')+'>'+sh("Pauta por canal",T.ads||"Inversión y <em>retorno</em>",A.intro)+
         '<div class="adtop n'+A.top.length+' reveal">'+A.top.map(function(i,k){return kpi(i,k===0?"dark":"");}).join("")+'</div>'+
         charts(A.charts)+cards(A.cards)+
         (A.roiNote?'<div class="criterio reveal"><b>'+esc(A.roiLabel||"Criterio del ROI")+'</b>'+esc(A.roiNote)+'</div>':'')+'</section>';
    }
    h+=blocksAfter(r,"ads");
    h+=divider(D[1]);
    // Redes
    var so=r.social;
    if(so){
      var sblock=function(name,o){return o?'<div class="social reveal"><div class="head"><h3>'+name+'</h3><span class="tag fill">'+esc(o.handle)+'</span></div><div class="grid '+gcls(o.items.length)+'">'+o.items.map(function(i){return kpi(i);}).join("")+'</div>'+note(o.note)+'</div>':'';};
      h+='<section class="block wrap">'+sh("Redes sociales",T.social||"Comunidad <em>orgánica</em>",so.intro)+sblock("Instagram",so.instagram)+sblock("Facebook",so.facebook)+sblock("TikTok orgánico",so.tiktok)+note(so.note)+'</section>';
    }
    h+=blocksAfter(r,"social");
    // Reputación
    var rp=r.reputation;
    if(rp){
      var mn=rp.main, ot=rp.others||[];
      h+='<section class="block wrap" style="padding-top:0">'+sh("Reputación",T.reputation||"Lo que dicen <em>los huéspedes</em>",rp.snapshot)+
         '<div class="rep reveal'+(ot.length?'':' solo')+'"><div class="ta"><div class="eyebrow">'+esc(mn.name)+'</div>'+val({display:mn.score},"score")+'<div style="font-family:var(--serif);font-size:24px;color:var(--muted);margin-top:14px">'+esc(mn.scale)+' · '+esc(mn.reviews)+'</div><div class="kpi" style="border:0;padding:0">'+(mn.delta?'<div class="delta '+trendOf(mn)+'">'+esc(mn.delta)+'</div>':'')+(mn.note?'<div class="note">'+esc(mn.note)+'</div>':'')+'</div></div>'+
         (ot.length?'<div class="others n'+ot.length+'">'+ot.map(function(o){return '<div class="kpi"><div class="lab">'+esc(o.name)+'</div><div class="val">'+esc(o.score)+'<small>'+esc(o.scale)+'</small></div><div class="note">'+esc(o.reviews)+'</div>'+(o.delta?'<div class="delta '+trendOf(o)+'">'+esc(o.delta)+'</div>':'')+'</div>';}).join("")+'</div>':'')+'</div>'+
         (rp.quotes&&rp.quotes.length?'<div class="quotes reveal'+(rp.quotes.length===1?' one':'')+'">'+rp.quotes.map(function(q){return '<blockquote>“'+esc(q.text)+'”<cite>— '+esc(q.author)+'</cite></blockquote>';}).join("")+'</div>':'')+note(rp.quotesNote)+'</section>';
    }
    // Email
    var c=r.crm;
    if(c){
      h+='<section class="block wrap" style="padding-top:0">'+sh("Email marketing",T.email||"La base, <em>cuidada</em>",c.intro)+
         '<div class="grid '+gcls(c.kpis.length)+' reveal">'+c.kpis.map(function(i){return kpi(i);}).join("")+'</div>'+
         c.emails.map(emailCard).join("")+note(c.footnote)+'</section>';
    }
    h+=blocksAfter(r,"email");
    // Influencers
    var inf=r.influencers;
    if(inf&&((inf.posts&&inf.posts.length)||(inf.stories&&inf.stories.length))){
      h+='<section class="block wrap" style="padding-top:0">'+sh(inf.eyebrow||"Influencers",T.influencers||"Miradas <em>externas</em>",inf.intro)+
         (inf.posts||[]).map(post).join("")+(inf.stories||[]).map(stories).join("")+note(inf.note)+'</section>';
    }
    h+=divider(D[2]);
    // Hitos
    if(r.milestones&&r.milestones.length){
      h+='<section class="block wrap">'+sh("Hitos del mes",T.milestones||"Lo que <em>marcó</em> "+esc(mes))+
         '<ol class="miles reveal">'+r.milestones.map(function(t,i){return '<li><span>'+String(i+1).padStart(2,"0")+'</span><div>'+esc(t)+'</div></li>';}).join("")+'</ol></section>';
    }
    // Aprendizaje -> acción
    if(r.insights&&r.insights.length){
      h+='<section class="block wrap"'+(r.milestones&&r.milestones.length?' style="padding-top:0"':'')+'>'+sh("Aprendizajes y próximos pasos",T.insights||"De lo aprendido <em>a la acción</em>")+
         '<div class="insights reveal"><div class="ins-head" aria-hidden="true"><span></span><span>Aprendizaje</span><span></span><span>Próximo paso</span></div>'+
         r.insights.map(function(x){return '<article class="ins"><div class="n">'+esc(x.n)+'</div>'+
           '<div class="l"><span class="tag '+(x.tag==="A potenciar"?'fill':'wood')+'">'+esc(x.tag)+'</span><h4>'+esc(x.learning.title)+'</h4><p>'+esc(x.learning.text)+'</p></div>'+
           '<div class="arrow" aria-hidden="true">→</div>'+
           '<div class="a"><span class="mlab">Próximo paso</span><h4>'+esc(x.action.title)+'</h4><p>'+esc(x.action.text)+'</p></div></article>';}).join("")+'</div></section>';
    }
    // Pie
    h+='<footer class="sources"><div class="wrap cols"><div><h5>Pendientes</h5>'+(r.pending&&r.pending.length?r.pending.map(function(p){return '<p class="pend">'+esc(p)+'</p>';}).join(""):'<p class="pend">Sin pendientes.</p>')+'</div><div><h5>Fuentes</h5><p>'+esc(r.sources)+'</p>'+(P.credit?'<p style="margin-top:8px">'+esc(P.credit)+'</p>':'')+'</div></div>'+
       '<div class="wrap"><div class="bottom">Stay Group · Mercadeo · '+esc(r.brand)+' · '+esc(r.month)+'</div></div></footer>';
    app.innerHTML=h;
    initLightbox(); initMotion();
  }
})();
