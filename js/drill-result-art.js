// Presentation only. No RNG, scoring, storage or additional sound playback.
(function(){
  var scenes={
    '⚽ 슈팅':['goal','득점!'],
    '🧤 골키퍼 선방':['catch','선방!'],
    '🛡 수비 타이밍':['steal','볼 탈취!'],
    '⚡ 드리블 돌파':['dribble','돌파!'],
    '🎯 패스':['pass','나이스 패스!'],
    '⚡ 침투 경로':['run','침투 성공!'],
    '👀 패스 시야':['scan','동료 발견!'],
    '🏃 왕복 체력':['sprint','리듬 유지!'],
    '🛡 패스 차단':['steal','패스 차단!'],
    '📏 수비 라인':['line','라인 유지!'],
    '🧤 크로스 판단':['catch','안전한 포획!'],
    '🥅 슈팅 각도 좁히기':['catch','각도 차단!']
  };
  function select(title,level,text){
    if(!scenes[title])return null; // Preserve the existing volley/coach panels.
    if(level<2)return title==='⚽ 슈팅'&&/^(골문 밖으로!|옆으로 크게 빗나갔어요)$/.test(text)?['miss','아쉬운 슈팅!']:null;
    if(title==='🧤 크로스 판단'&&text==='펀칭으로 걷어냈어요')return ['punch','펀칭!'];
    return scenes[title];
  }
  function prepare(m,title){
    if(!scenes[title])return function(){};
    var images={},used=false,names=[scenes[title][0]];
    if(title==='⚽ 슈팅')names.push('miss');if(title==='🧤 크로스 판단')names.push('punch');
    names.forEach(function(name){var img=new Image();img.alt='';img.draggable=false;img.src='images/minigames/result-'+name+'.png';images[name]=img;});
    return function(level,text){
      if(used)return;used=true;
      var scene=select(title,level,text),img=scene&&images[scene[0]];
      if(!img||!img.complete||!img.naturalWidth||!m.isConnected||document.hidden||document.documentElement.dataset.reducedMotion==='true')return;
      var panel=document.createElement('div');panel.className='action-result-art';panel.dataset.scene=scene[0];panel.setAttribute('aria-hidden','true');
      var label=document.createElement('strong');label.textContent=scene[1];panel.append(img,label);m.querySelector('.football-field').appendChild(panel);
      function remove(){panel.remove();m.classList.remove('showing-result-art');watch.disconnect();document.removeEventListener('visibilitychange',remove);window.removeEventListener('resize',remove);}
      var watch=new MutationObserver(function(){if(!m.isConnected||document.documentElement.dataset.reducedMotion==='true')remove();});
      watch.observe(document.body,{childList:true,subtree:true});watch.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduced-motion']});
      document.addEventListener('visibilitychange',remove);window.addEventListener('resize',remove);m.classList.add('showing-result-art');Feedback.later(m,remove,320);
    };
  }
  window.DrillResultArt={prepare:prepare,select:select};
})();
