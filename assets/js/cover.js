(function(){
  var S=window.SITE; renderNav();
  loadAll(S.available.filter(function(k){return k.split('/')[1]===currentMonth;}), render);
  function render(){
  var m=currentMonth, label=(S.months.filter(function(x){return x.slug===m;})[0]||{}).label||m;
  var first=S.available.filter(function(k){return k.split("/")[1]===m;})[0];
  var cards=S.brands.map(function(b){
    var k=b.slug+"/"+m, rep=window.REPORTS&&window.REPORTS[k];
    if(isAvailable(b.slug,m)&&rep){
      return '<a class="bcard reveal" href="'+reportUrl(b.slug,m)+'"><img src="'+esc(rep.photos.card)+'" alt="'+esc(b.name)+'" loading="lazy"><div class="nm">'+esc(b.name)+'</div><div class="st">Ver informe →</div></a>';
    }
    return '<div class="bcard soon reveal" style="background:'+esc(b.color)+'"><div class="nm">'+esc(b.name)+'</div><div class="st">Próximamente</div></div>';
  }).join("");
  document.getElementById("app").innerHTML=
    '<header class="cover wrap"><div class="eyebrow reveal">Stay Group · Informe mensual</div>'+
    '<h1 class="reveal">Informes de<br>Mercadeo</h1><div class="sub reveal">'+esc(label)+'</div>'+
    '<div class="row reveal"><p style="max-width:420px">Resultados del mes por marca: pauta, sitio web, redes, reputación, email e influencers.</p>'+
    (first?'<a class="btn" href="'+reportUrl(first.split("/")[0],m)+'">Ver informe '+esc((S.brands.filter(function(b){return b.slug===first.split("/")[0];})[0]||{}).name)+' →</a>':'')+'</div></header>'+
    '<main class="wrap"><div class="bcards">'+cards+'</div></main>'+
    '<footer class="sources"><div class="wrap"><div class="bottom" style="border:0;margin:0;padding:0">Stay Group · Mercadeo</div></div></footer>';
  initMotion();
  }
})();
