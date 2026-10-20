(function(){
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el,i){el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});
  }else{els.forEach(function(el){el.classList.add('in')})}
  var fab=document.getElementById('fab');
  function onScroll(){fab.classList.toggle('on',window.scrollY>520)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
