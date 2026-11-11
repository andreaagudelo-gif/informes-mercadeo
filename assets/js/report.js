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
  function trendOf(it){ if(it.trend) return it.trend; var d=it.delta||""; return /^[−-]/.test(d)?"down":(/^Igual|^Sept\./.test(d)?"flat":"up"); }
  /* Valor con count-up solo si el texto final coincide exactamente con el formato animado */
  function val(it,cls){
    var pre=it.prefix||"", suf=it.suffix||"", dec=it.decimals||0, disp=it.display;
    if(typeof it.value==="number" && disp===pre+fmtCO(it.value,dec)+suf)
      return '<div class="'+(cls||"val")+'" data-count="'+it.value+'" data-dec="'+dec+'" data-pre="'+esc(pre)+'" data-suf="'+esc(suf)+'">'+esc(disp)+'</div>';
    if(typeof it.value==="number" && disp==="+"+fmtCO(it.value,0))
      return '<div class="'+(cls||"val")+'" data-count="'+it.value+'" data-pre="+">'+esc(disp)+'</div>';
    return '<div class="'+(cls||"val")+'">'+esc(disp)+'</div>';
  }
  function kpi(it){
    return '<div class="kpi"><div class="lab">'+esc(it.label)+'</div>'+val(it)+
      (it.delta?'<div class="delta '+trendOf(it)+'">'+esc(it.delta)+'</div>':'')+(it.note?'<div class="note">'+esc(it.note)+'</div>':'')+'</div>';
  }
  function sh(n,eyebrow,title,intro){
    return '<div class="sh reveal"><div class="eyebrow">'+n+' — '+esc(eyebrow)+'</div><div><h2>'+title+'</h2>'+(intro?'<p class="intro">'+esc(intro)+'</p>':'')+'</div></div>';
  }
  function divider(d){ return d?'<div class="divider"><img src="'+esc(d.src)+'" alt="'+esc(d.alt)+'" loading="lazy">'+(d.caption?'<div class="cap">'+esc(d.caption)+'</div>':'')+'</div>':''; }

  function spendChart(ch){
    var W=560,H=200,L=90,R=20,max=12e6,row=H/ch.length,cols=["#616652","#A9744F","#BDB8AA"];
    var s='<svg viewBox="0 0 '+W+' '+(H+30)+'" role="img" aria-label="Inversión por canal">';
    for(var g=0;g<=4;g++){var x=L+(W-L-R)*g/4; s+='<line x1="'+x+'" x2="'+x+'" y1="0" y2="'+H+'" stroke="rgba(97,102,82,.15)"/><text x="'+x+'" y="'+(H+20)+'" text-anchor="middle">$'+fmtCO(g*3,0)+' M</text>';}
    ch.forEach(function(c,i){var w=(W-L-R)*c.spend/max, y=i*row+row*.28;
      s+='<text x="'+(L-10)+'" y="'+(y+row*.24)+'" text-anchor="end" dominant-baseline="middle">'+esc(c.name)+'</text>'+
         '<g class="bar bar-x"><rect x="'+L+'" y="'+y+'" width="'+w.toFixed(1)+'" height="'+(row*.44).toFixed(1)+'" fill="'+cols[i%3]+'"><title>'+esc(c.name+": "+c.spendDisplay)+'</title></rect>'+
         '<text x="'+(L+w+8)+'" y="'+(y+row*.24)+'" dominant-baseline="middle" style="fill:#1B1C17;font-size:12px">'+esc(c.spendDisplay)+'</text></g>';});
    return s+'</svg>';
  }
  function sessChart(ch){
    var W=560,H=210,L=50,B=30,max=16000,gw=(W-L)/ch.length,bw=gw*.22;
    var s='<svg viewBox="0 0 '+W+' '+(H+B)+'" role="img" aria-label="Sesiones GA4 por canal, octubre vs. septiembre">';
    for(var g=0;g<=4;g++){var y=H-H*g/4; s+='<line x1="'+L+'" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="rgba(97,102,82,.15)"/><text x="'+(L-8)+'" y="'+y+'" text-anchor="end" dominant-baseline="middle">'+fmtCO(g*4000)+'</text>';}
    ch.forEach(function(c,i){var cx=L+gw*i+gw/2;
      [[c.sessionsOct,"#616652",-bw-3,"Octubre"],[c.sessionsSep,"#BDB8AA",3,"Septiembre"]].forEach(function(v){
        var h=H*v[0]/max; s+='<g class="bar bar-y"><rect x="'+(cx+v[2]).toFixed(1)+'" y="'+(H-h).toFixed(1)+'" width="'+bw.toFixed(1)+'" height="'+h.toFixed(1)+'" fill="'+v[1]+'"><title>'+esc(c.name+" · "+v[3]+": "+fmtCO(v[0]))+'</title></rect>'+
        '<text x="'+(cx+v[2]+bw/2).toFixed(1)+'" y="'+(H-h-6).toFixed(1)+'" text-anchor="middle" style="font-size:10px">'+fmtCO(v[0])+'</text></g>';});
      s+='<text x="'+cx+'" y="'+(H+20)+'" text-anchor="middle">'+esc(c.name)+'</text>';});
    return s+'</svg>';
  }

  function render(r){
    document.title=r.brand+" · "+r.month+" · Informe de Mercadeo";
    var P=r.photos, D=P.dividers||[], A=r.ads, h="";
    h+='<header class="hero"><img class="bg" src="'+esc(P.hero)+'" alt="Vista aérea de '+esc(r.brand)+'" fetchpriority="high"><div class="content">'+
       (P.logo?'<img class="logo" src="'+esc(P.logo)+'" alt="Logo '+esc(r.brand)+'">':'')+
       '<div class="eyebrow">Informe mensual de Mercadeo</div><h1>'+esc(r.brand)+'</h1><div class="sub">'+esc(r.month)+'</div><div class="line">'+esc(r.period)+'</div></div><div class="scrollcue" aria-hidden="true"></div></header>';
    // 01 KPIs
    h+='<section class="block wrap">'+sh("01","Cifras del mes","Lo esencial de <em>"+esc(r.month.split(" ")[0].toLowerCase())+"</em>",r.bookingsNote)+
       '<div class="grid g3 headline reveal">'+r.headline.map(kpi).join("")+'</div></section>';
    h+=divider(D[0]);
    // 02 Web
    h+='<section class="block wrap">'+sh("02","Sitio web y SEO","Más reservas con <em>menos tráfico</em>")+
       '<div class="cells reveal">'+r.web.map(kpi).join("")+'</div></section>';
    // 03 Ads
    h+='<section class="block wrap" style="padding-top:0">'+sh("03","Pauta por canal","Inversión y <em>retorno</em>")+
       '<div class="adtop reveal">'+
         '<div class="kpi dark"><div class="lab">Inversión total</div>'+val({value:A.total.value,display:A.total.display,prefix:"$",suffix:" M",decimals:2})+'<div class="note">COP · Google, Meta y TikTok</div></div>'+
         '<div class="kpi"><div class="lab">ROI</div>'+val({value:A.roi.value,display:A.roi.display,suffix:"x",decimals:1})+'<div class="note">Ingresos sitio web / inversión en pauta · sin fee</div></div>'+
         '<div class="kpi"><div class="lab">Sesiones desde pauta</div>'+val({value:16415,display:A.paidSessions.display})+'<div class="delta down">'+esc(A.paidSessions.delta)+'</div></div>'+
       '</div>'+
       '<div class="charts reveal"><div class="chart"><h3>Inversión por canal · <em>COP</em></h3>'+spendChart(A.channels)+'<p class="smallnote">'+esc(A.chartNote)+'</p></div>'+
       '<div class="chart"><h3>Sesiones GA4 · <em>octubre vs. septiembre</em></h3>'+sessChart(A.channels)+'<div class="legend"><span><i style="background:#616652"></i>Octubre</span><span><i style="background:#BDB8AA"></i>Septiembre</span></div></div></div>'+
       '<div class="cards3 reveal">'+A.channels.map(function(c){return '<div class="card"><span class="tag">'+esc(c.name)+'</span><div class="mini">Inversión</div><div class="big">'+esc(c.spendDisplay)+'</div><div class="mini">Sesiones octubre</div><div class="big">'+fmtCO(c.sessionsOct)+'</div><div class="txt">'+esc(c.delta)+'</div><div class="txt muted">'+esc(c.note)+'</div></div>';}).join("")+'</div>'+
       '<div class="criterio reveal"><b>Criterio del ROI</b>'+esc(A.roiNote)+'</div></section>';
    h+=divider(D[1]);
    // 04 Social
    var so=r.social;
    function sblock(name,o){return '<div class="social reveal"><div class="head"><h3>'+name+'</h3><span class="tag fill">'+esc(o.handle)+'</span></div><div class="grid g5">'+o.items.map(kpi).join("")+'</div>'+(o.note?'<p class="smallnote">'+esc(o.note)+'</p>':'')+'</div>';}
    h+='<section class="block wrap">'+sh("04","Redes sociales","Comunidad <em>orgánica</em>")+sblock("Instagram",so.instagram)+sblock("Facebook",so.facebook)+sblock("TikTok orgánico",so.tiktok)+'</section>';
    // 05 Reputation
    var rp=r.reputation, ta=rp.tripadvisor;
    h+='<section class="block wrap" style="padding-top:0">'+sh("05","Reputación","Lo que dicen <em>los huéspedes</em>",rp.snapshot)+
       '<div class="rep reveal"><div class="ta"><div class="eyebrow">Tripadvisor</div><div class="score" data-count="4.6" data-dec="1">'+esc(ta.score)+'</div><div style="font-family:var(--serif);font-size:24px;color:var(--muted);margin-top:-6px">'+esc(ta.scale)+' · '+esc(ta.reviews)+'</div><div class="kpi" style="border:0;padding:0"><div class="delta up">'+esc(ta.delta)+'</div><div class="note">'+esc(ta.note)+'</div></div></div>'+
       '<div class="others">'+rp.others.map(function(o){return '<div class="kpi"><div class="lab">'+esc(o.name)+'</div><div class="val">'+esc(o.score)+'<small>'+esc(o.scale)+'</small></div><div class="note">'+esc(o.reviews)+'</div><div class="delta '+trendOf(o)+'">'+esc(o.delta)+'</div></div>';}).join("")+'</div></div>'+
       '<div class="quotes reveal">'+rp.quotes.map(function(q){return '<blockquote>“'+esc(q.text)+'”<cite>— '+esc(q.author)+'</cite></blockquote>';}).join("")+'</div><p class="smallnote">'+esc(rp.quotesNote)+'</p></section>';
    // 06 Email
    var c=r.crm;
    h+='<section class="block wrap" style="padding-top:0">'+sh("06","Email marketing","La base, <em>cuidada</em>")+
       '<div class="grid g3 reveal">'+c.kpis.map(kpi).join("")+'</div>'+
       c.emails.map(function(e){return '<article class="email reveal"><div class="shot" title="Ampliar"><span class="zoom">Ampliar</span><img src="'+esc(e.image)+'" alt="Captura del email '+esc(e.subject)+'" loading="lazy"></div><div>'+
         '<span class="tag fill">'+esc(e.tag)+'</span><h3>'+esc(e.subject)+'</h3><div class="date">'+esc(e.date)+'</div><p class="aud"><b>Audiencia</b>'+esc(e.audience)+'</p>'+
         '<div class="metrics"><div><span>Enviados</span><strong>'+esc(e.sent)+'</strong></div><div><span>Entregados</span><strong>'+esc(e.delivered)+'</strong></div><div><span>Apertura</span><strong>'+esc(e.open)+'</strong><small>'+esc(e.opens)+'</small></div>'+
         '<div><span>CTR</span><strong>'+esc(e.ctr)+'</strong><small>'+esc(e.clicks)+' clics</small></div><div><span>Rebotes</span><strong>'+esc(e.bounce)+'</strong><small>'+esc(e.bounces)+'</small></div><div><span>Bajas</span><strong>'+esc(e.unsubs)+'</strong></div></div>'+
         (e.note?'<p class="smallnote">'+esc(e.note)+'</p>':'')+'</div></article>';}).join("")+
       '<p class="smallnote">'+esc(c.footnote)+'</p></section>';
    // 07 Influencers
    h+='<section class="block wrap" style="padding-top:0">'+sh("07","Influencers","Miradas <em>externas</em>")+
       r.influencers.map(function(i){return '<article class="infl reveal"><div class="shot" title="Ampliar"><span class="zoom">Ampliar</span><img src="'+esc(i.image)+'" alt="Captura de la publicación de '+esc(i.handle)+'" loading="lazy"></div><div>'+
         '<span class="tag wood">'+esc(i.format)+'</span><h3>'+esc(i.handle)+'</h3><div>'+esc(i.name)+' · '+esc(i.bio)+'</div><blockquote>'+esc(i.caption)+'</blockquote>'+
         '<div class="metrics"><div><span>Seguidores</span><strong>'+esc(i.followers.replace(" seguidores",""))+'</strong></div><div><span>Me gusta</span><strong>'+esc(i.likes)+'</strong></div><div><span>Comentarios</span><strong>'+esc(i.comments)+'</strong></div></div>'+
         '<p class="meta"><b>Publicado</b>'+esc(i.date)+'</p><p class="meta"><a href="'+esc(i.url)+'" target="_blank" rel="noopener">Ver publicación ↗</a></p><p class="smallnote">Fuente: '+esc(i.source)+'</p></div></article>';}).join("")+'</section>';
    h+=divider(D[2]);
    // 08 Milestones
    h+='<section class="block wrap">'+sh("08","Hitos del mes","Lo que <em>marcó</em> "+esc(r.month.split(" ")[0].toLowerCase()))+
       '<ol class="miles reveal">'+r.milestones.map(function(t,i){return '<li><span>'+String(i+1).padStart(2,"0")+'</span><div>'+esc(t)+'</div></li>';}).join("")+'</ol></section>';
    // 09 Aprendizaje -> acción
    h+='<section class="block wrap" style="padding-top:0">'+sh("09","Aprendizajes y próximos pasos","De lo aprendido <em>a la acción</em>")+
       '<div class="insights reveal"><div class="ins-head" aria-hidden="true"><span></span><span>Aprendizaje</span><span></span><span>Próximo paso</span></div>'+
       (r.insights||[]).map(function(x){return '<article class="ins"><div class="n">'+esc(x.n)+'</div>'+
         '<div class="l"><span class="tag '+(x.tag==="A potenciar"?'fill':'wood')+'">'+esc(x.tag)+'</span><h4>'+esc(x.learning.title)+'</h4><p>'+esc(x.learning.text)+'</p></div>'+
         '<div class="arrow" aria-hidden="true">→</div>'+
         '<div class="a"><span class="mlab">Próximo paso</span><h4>'+esc(x.action.title)+'</h4><p>'+esc(x.action.text)+'</p></div></article>';}).join("")+'</div></section>';
    // Footer
    h+='<footer class="sources"><div class="wrap cols"><div><h5>Pendientes</h5>'+r.pending.map(function(p){return '<p class="pend">'+esc(p)+'</p>';}).join("")+'</div><div><h5>Fuentes</h5><p>'+esc(r.sources)+'</p></div></div>'+
       '<div class="wrap"><div class="bottom">Stay Group · Mercadeo · '+esc(r.brand)+' · '+esc(r.month)+'</div></div></footer>';
    app.innerHTML=h;
    initLightbox(); initMotion();
  }
})();
