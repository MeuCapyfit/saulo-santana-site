(function(){
  var root=document.documentElement,body=document.body;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  /* ---------- ABERTURA ---------- */
  var intro=$('#intro'),nEl=$('#introN'),logo=$('.intro__logo');
  var opened=false;
  function open(){
    if(opened)return;opened=true;
    intro.classList.add('out');
    setTimeout(function(){
      root.classList.remove('lock');body.classList.add('ready');
      setTimeout(function(){intro.style.display='none'},1100);
    },650);
  }
  function runIntro(){
    var start=performance.now(),dur=2200,imgReady=false;
    var hero=$('.hero__photo img');
    function ok(){imgReady=true}
    if(hero.complete)ok();else{hero.addEventListener('load',ok);hero.addEventListener('error',ok)}
    (function tick(t){
      var p=Math.min(1,(t-start)/dur);
      var e=1-Math.pow(1-p,3);
      var v=Math.round(e*100);
      if(!imgReady&&v>92)v=92;
      nEl.textContent=v;
      logo.style.setProperty('--p',v+'%');
      if(v>=100){setTimeout(open,350)}
      else requestAnimationFrame(tick);
    })(start);
    setTimeout(open,6000); // trava de segurança
  }
  if(reduce||!intro){root.classList.remove('lock');body.classList.add('ready')}
  else runIntro();

  /* ---------- reveal ---------- */
  var els=$$('.reveal,.steps li');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
    },{threshold:.14,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el)});
    var fr=$('#aboutFrame');
    if(fr){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fr.classList.add('in');io2.disconnect()}})},{threshold:.2});io2.observe(fr)}
  }else{els.forEach(function(el){el.classList.add('in')});var f=$('#aboutFrame');if(f)f.classList.add('in')}

  /* ---------- manifesto: palavras acendem no scroll ---------- */
  var mt=$('#manifestoText');
  var words=[];
  if(mt){
    var hl=['individual','corpo','rotina','perto','resultado'];
    mt.innerHTML=mt.textContent.trim().split(/\s+/).map(function(w){
      var clean=w.toLowerCase().replace(/[^a-zà-ú]/g,'');
      return '<span class="w'+(hl.indexOf(clean)>-1?' hl':'')+'">'+w+'</span>';
    }).join(' ');
    words=$$('.w',mt);
  }

  /* ---------- scroll loop ---------- */
  var top=$('#top'),fab=$('#fab'),giant=$('#giant'),steps=$('#steps'),fill=$('#stepsFill');
  var heroPhoto=$('.hero__photo'),heroWords=$$('.hero__word'),hero=$('.hero'),aboutImg=$('.about__frame img');
  var ticking=false;
  function frame(){
    ticking=false;
    var y=window.scrollY,vh=window.innerHeight;
    top.classList.toggle('solid',y>40);
    fab.classList.toggle('on',y>vh*.8);
    // hero parallax
    if(y<vh*1.2&&!reduce){
      heroPhoto.style.setProperty('--py',(y*.12)+'px');
      if(body.classList.contains('ready'))heroPhoto.style.transform='translate(-50%,'+(y*.12)+'px) scale(1)';
      heroWords.forEach(function(w){var s=parseFloat(w.dataset.speed)||0;w.style.transform='translateX(-50%) translateY('+(y*s)+'px)'});
    }
    // manifesto
    if(words.length){
      var r=mt.getBoundingClientRect();
      var p=(vh*.85-r.top)/(r.height+vh*.35);
      p=Math.max(0,Math.min(1,p));
      var n=Math.round(p*words.length);
      for(var i=0;i<words.length;i++)words[i].classList.toggle('on',i<n);
    }
    // texto gigante
    if(giant&&!reduce){
      var gr=giant.parentNode.getBoundingClientRect();
      giant.style.transform='translateX('+(-(vh-gr.top)*.35)+'px)';
    }
    // linha dos passos
    if(steps&&fill){
      var sr=steps.getBoundingClientRect();
      var sp=(vh*.6-sr.top)/sr.height;
      steps.style.setProperty('--f',Math.max(0,Math.min(1,sp))*100+'%');
    }
    // sobre: parallax da foto
    if(aboutImg&&!reduce){
      var ar=aboutImg.parentNode.getBoundingClientRect();
      aboutImg.style.setProperty('--ty',((ar.top+ar.height/2-vh/2)*-.06)+'px');
    }
  }
  function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  frame();

  /* ---------- carrossel de depoimentos ---------- */
  var track=$('#qTrack'),cards=$$('.q',track),cnt=$('#qCount'),cur=0;
  function pad(n){return (n<10?'0':'')+n}
  function setActive(i){
    cur=i;cards.forEach(function(c,k){c.classList.toggle('act',k===i)});
    cnt.textContent=pad(i+1)+' / '+pad(cards.length);
  }
  function go(i){
    i=Math.max(0,Math.min(cards.length-1,i));
    track.scrollTo({left:cards[i].offsetLeft-track.offsetLeft-parseFloat(getComputedStyle(track).paddingLeft),behavior:'smooth'});
  }
  $('#qPrev').addEventListener('click',function(){go(cur-1)});
  $('#qNext').addEventListener('click',function(){go(cur+1)});
  var st;
  track.addEventListener('scroll',function(){
    clearTimeout(st);
    st=setTimeout(function(){
      var pl=parseFloat(getComputedStyle(track).paddingLeft),best=0,d=1e9;
      cards.forEach(function(c,k){var dd=Math.abs(c.offsetLeft-track.offsetLeft-pl-track.scrollLeft);if(dd<d){d=dd;best=k}});
      setActive(best);
    },60);
  },{passive:true});
  setActive(0);

  /* ---------- botões magnéticos (desktop) ---------- */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
    $$('.btn:not(.btn--block)').forEach(function(b){
      b.addEventListener('mousemove',function(e){
        var r=b.getBoundingClientRect();
        b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.2)+'px,'+((e.clientY-r.top-r.height/2)*.3)+'px)';
      });
      b.addEventListener('mouseleave',function(){b.style.transform=''});
    });
  }
})();
