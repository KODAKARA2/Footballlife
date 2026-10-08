// Eight additional drills use distinct player actions; shared lifecycle only.
(function() {
  if (!window.U) return;
  var H=U._mini, C=U._drillCore;
  // Newly generated artwork explicitly approved after the original transfer failed.
  var VOLLEY_IMPACT_IMAGE='images/minigames/volley-impact-generated.png';
  function field(extra) { return '<div class="drill-pitch">'+extra+'</div>'; }
  function actor(cls,file,x,y) { return '<span class="drill-actor '+cls+'" style="left:'+x+'%;top:'+y+'%"><span class="drill-fallback" aria-hidden="true">●</span><img src="images/minigames/'+file+'.png" alt="" onload="this.parentElement.classList.add(\'art-ready\')" onerror="this.hidden=true;this.parentElement.classList.remove(\'art-ready\')"></span>'; }
  function buttons(labels) { return '<div class="drill-controls">'+labels.map(function(x,i){return '<button data-input="'+i+'">'+(i+1)+' · '+x+'</button>';}).join('')+'</div>'; }
  function start(title,help,html,stat,cb) {
    var s=C.session(title,help,field(html),stat,cb), base=s.cancel;
    function cleanup(){document.removeEventListener('visibilitychange',hide);window.removeEventListener('resize',interrupt);}
    function interrupt(){if(!s.m.isConnected)return;cleanup();base();cb({취소:true});}
    function hide(){if(document.hidden)interrupt();}
    document.addEventListener('visibilitychange',hide);window.addEventListener('resize',interrupt);
    var watch=new MutationObserver(function(){if(!s.m.isConnected){cleanup();watch.disconnect();}});watch.observe(document.body,{childList:true,subtree:true});
    s.cancel=function(){cleanup();watch.disconnect();base();}; s.abort=interrupt;
    var box=s.m.querySelector('.mg');box.tabIndex=0;box.focus();
    s.controls=function(fn) {
      s.m.querySelectorAll('[data-input]').forEach(function(b){b.onclick=function(){if(s.active())fn(+b.dataset.input);};});
      box.addEventListener('keydown',function(e){if(/^[123]$/.test(e.key)&&!e.repeat){e.preventDefault();if(s.active())fn(+e.key-1);}});
    };
    s.text=function(text){s.m.querySelector('.drill-status').textContent=text;};
    return s;
  }
  // Cosmetic resolution only: the existing rule computes its grade first.
  function motion(s,name) {
    var pitch=s.m.querySelector('.drill-pitch'),finish=s.finish,settled=false,contact=false;
    pitch.classList.add('motion-'+name);
    var badge=document.createElement('div');badge.className='drill-outcome';badge.hidden=true;badge.setAttribute('aria-live','polite');pitch.appendChild(badge);
    function put(el,x,y,turn,scale){if(!el)return;el.style.left=x+'%';el.style.top=y+'%';var svg=el.querySelector('svg');if(svg)svg.style.transform='rotate('+(turn||0)+'deg) scale('+(scale||1)+')';}
    function orb(){var b=pitch.querySelector('.drill-ball');if(!b){pitch.insertAdjacentHTML('beforeend',ball(50,76));b=pitch.querySelector('.drill-ball');}return b;}
    if(name==='rhythm')pitch.insertAdjacentHTML('beforeend','<div class="drill-running-track"></div>');
    if(name==='line')pitch.insertAdjacentHTML('beforeend',actor('line-mate line-mate-a','defender_ready',50,35)+actor('line-mate line-mate-b','defender_ready',50,52)+'<div class="drill-formation-link"></div>');
    if(name==='angle')pitch.insertAdjacentHTML('beforeend','<svg class="drill-angle-guide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path/><path/></svg>');
    s.finish=function(level,text,kind){
      if(settled||!s.active())return;settled=true;s.hold();pitch.classList.add('drill-resolving');
      var good=level>=2,b=orb(),x=parseFloat(b.style.left)||50,y=parseFloat(b.style.top)||70,began=performance.now(),duration=560;
      var labels={run:['돌파 성공!','수비에 막혔어요'],scan:['나이스 패스!','패스 길이 막혔어요'],rhythm:['리듬 유지!','호흡을 고르세요'],intercept:['패스 차단!','공이 통과했어요'],line:['라인 유지!','라인이 벌어졌어요'],claim:[s.punch?'펀칭 성공!':'안전한 포획!','크로스를 놓쳤어요'],angle:['슈팅 각도 차단!','빈 공간을 허용했어요']};
      if(name==='scan'||name==='angle')Feedback.play('kick');
      if(name==='scan'){
        var lanes=pitch.querySelector('.drill-lanes');lanes.innerHTML=[0,1,2].map(function(n){return '<div>'+actor('receiver','player_receive',50,50)+(n===s.openLane?'자유':'마크됨')+'</div>';}).join('');
        put(b,50,80);x=50;y=80;
      }
      if(name==='angle'){var attacker=pitch.querySelector('.attacker');x=parseFloat(attacker.style.left);y=28;put(b,x,y);}
      function paint(u,quiet){
        var target=s.choice==null?50:20+s.choice*30,runner=pitch.querySelector('.runner');
        if(name==='run'){put(runner,parseFloat(runner.style.left)||50,54-(good?29:5)*u);b.hidden=true;}
        if(name==='scan')put(b,50+(target-50)*u,80-35*u,quiet?0:400*u,1-.3*u);
        if(name==='rhythm'){runner.style.translate=quiet?'none':(Math.sin(u*Math.PI*4)*4)+'px '+(-12*u)+'px';b.hidden=true;}
        if(name==='intercept')put(b,x,good?78:78+26*u,quiet?0:240*u,1);
        if(name==='line'){pitch.querySelectorAll('.line-mate,.line-player').forEach(function(el){el.style.translate=quiet?'none':'0 '+(-10*u)+'px';});b.hidden=true;}
        if(name==='claim'){
          var keeper=pitch.querySelector('.claim-keeper'),jump=s.punch?28:12;keeper.style.translate=quiet?'none':'0 '+(-jump*Math.sin(Math.PI*u))+'px';
          if(good&&s.punch)put(b,x+(38-x)*u,y+(18-y)*u-(quiet?0:10*Math.sin(Math.PI*u)),quiet?0:400*u,1-.35*u);
          else if(good)put(b,x+(78-x)*u,y+(58-y)*u,0,1-.25*u);
          else put(b,x+(96-x)*u,y+(87-y)*u,quiet?0:300*u,1);
        }
        if(name==='angle'){
          var k=pitch.querySelector('.angle-keeper'),kx=parseFloat(k.style.left),endX=good?kx:50;
          put(b,x+(endX-x)*u,y+((good?65:81)-y)*u,quiet?0:420*u,1-.35*u);
        }
      }
      function step(now){
        if(!s.m.isConnected)return;var quiet=document.documentElement.dataset.reducedMotion==='true',u=quiet?1:Math.min(1,(now-began)/duration);paint(u,quiet);
        if(u===1){if(!contact){contact=true;if(good&&['scan','intercept','claim','angle'].indexOf(name)>=0)Feedback.play(name==='intercept'?'tackle':'catch');}badge.hidden=false;badge.textContent=/시간 초과|놓쳤어요/.test(text)&&!good?text:labels[name][good?0:1];badge.dataset.grade=level;s.m.dataset.presentation='complete';finish(level,text,kind);return;}
        Feedback.frame(s.m,step);
      }
      s.m.dataset.presentation='resolving';step(began);
    };
  }
  function ball(x,y){return '<div class="drill-ball" style="left:'+x+'%;top:'+y+'%">'+H.ball+'</div>';}
  U.miniVolley=function(cb){
    var html=actor('volley-player','player_run',35,75)+ball(76,24)+'<img class="volley-net" src="images/minigames/goal_net.png" alt="골문"><div class="drill-charge"><span class="volley-band"></span><i></i><b>0.7초</b></div><p class="drill-status">누른 뒤 0.7초에 놓기</p><div class="volley-impact" hidden><img alt="오버헤드 킥"><strong>퍽!</strong></div><div class="volley-outcome" hidden></div>';
    var s=start('⚽ 발리 파워','공중볼에 맞춰 <b>누르고 있다가 놓으세요</b>. 0.7초 충전이 정확한 발리입니다. 키보드: 스페이스 누름·뗌.',html,'슈팅',cb),held=null,input=null,box=s.m.querySelector('.mg'),pitch=s.m.querySelector('.drill-pitch');
    pitch.classList.add('volley-pitch');
    var orb=pitch.querySelector('.drill-ball'),spin=orb.querySelector('svg'),player=pitch.querySelector('.volley-player'),impact=pitch.querySelector('.volley-impact'),outcome=pitch.querySelector('.volley-outcome'),flightStart,level,resolved=false,frame;
    // Keep an unloaded or failed image out of the panel; scoring never waits for art.
    var art=impact.querySelector('img');art.src=VOLLEY_IMPACT_IMAGE;art.draggable=false;
    function reduced(){return document.documentElement.dataset.reducedMotion==='true';}
    function place(x,y,turn,scale){orb.style.left=x+'%';orb.style.top=y+'%';spin.style.transform='rotate('+turn+'deg) scale('+scale+')';}
    function finish(){if(resolved||!s.m.isConnected)return;resolved=true;impact.hidden=true;outcome.hidden=false;outcome.textContent=level>=2?'GOAL!':'파워 조절 실패';s.text('발리 판정 · 카드의 최종 결과는 별도');s.finish(level,level>=2?'발리 슛 GOAL!':'파워 조절 실패',level>=2?'great':'bad');}
    function fly(now){
      if(!s.m.isConnected)return;
      var t=now-flightStart,quiet=reduced(),u=quiet?1:Math.max(0,Math.min(1,(t-280)/620));
      impact.hidden=quiet||t>=280||!art.complete||!art.naturalWidth;
      orb.style.visibility=!impact.hidden?'hidden':'visible';
      if(quiet||t>=280){place(43+(level>=2?7:43)*u,65-45*u-16*Math.sin(Math.PI*u),quiet?0:720*u,1-.64*u);player.style.rotate=quiet?'0deg':(12*(1-u))+'deg';}
      if(u===1){finish();return;}frame=Feedback.frame(s.m,fly);
    }
    function down(e){if(!s.active()||held!==null||e.target.closest('button,input'))return;if(e.type==='keydown'&&(e.code!=='Space'||e.repeat))return;e.preventDefault();input=e.type==='keydown'?'key':e.pointerId;held=performance.now();s.text('충전 중 · 밝은 띠에서 놓으세요');}
    function up(e){if(!s.active()||held===null)return;if(e.type==='keyup'?(e.code!=='Space'||input!=='key'):input!==e.pointerId)return;e.preventDefault();var d=(performance.now()-held)/1000;level=C.grade(Math.abs(d-.7),.1,.22,.4);s.hold();Feedback.play('kick');flightStart=performance.now();s.text('발리 슛!');fly(flightStart);}
    box.addEventListener('pointerdown',function(e){if(e.button!==0||!s.active()||held!==null||e.target.closest('button,input'))return;box.setPointerCapture(e.pointerId);down(e);});box.addEventListener('pointerup',up);box.addEventListener('pointercancel',s.abort);box.addEventListener('keydown',down);box.addEventListener('keyup',up);
    s.run(function(now){var charging=held!==null,t=charging?(now-held)/700:Math.min(1,(now-s.start)/900);s.bar(1-(now-s.start)/6000);if(charging)pitch.querySelector('.drill-charge i').style.width=Math.min(100,(now-held)/14)+'%';if(!reduced()){var u=Math.min(1,t);place(76-33*u,24+41*u-12*Math.sin(Math.PI*u),-120*u,1);player.style.rotate=charging?(-18*u)+'deg':'0deg';}else place(43,65,0,1);if(now-s.start>6000)s.finish(0,'발리 타이밍을 놓쳤어요');});
    var cancel=s.cancel;return function(){cancelAnimationFrame(frame);cancel();};
  };
  U.miniRun=function(cb){
    var targets=[0,0,0].map(function(){return Math.floor(Math.random()*3);}),round=0,correct=0,last=-Infinity;
    var s=start('⚡ 침투 경로','열린 레인을 선택해 <b>세 번 침투</b>하세요. 수비수 두 명이 없는 길로! 숫자 1·2·3.',actor('runner','player_run',50,80)+'<div class="drill-lanes"></div><p class="drill-status"></p>'+buttons(['왼쪽','중앙','오른쪽']),'스피드',cb);motion(s,'run');
    function paint(){s.m.querySelector('.drill-lanes').innerHTML=[0,1,2].map(function(n){return '<div>'+(n===targets[round]?'<span class="lane-open">빈 공간</span>':actor('lane-defender','defender_ready',50,45)+'<span>수비</span>')+'</div>';}).join('');s.text((round+1)+'/3 · 빈 레인으로 침투');}
    s.controls(function(n){if(n>2||performance.now()-last<200)return;last=performance.now();if(n===targets[round])correct++;round++;Feedback.play('select');s.m.querySelector('.runner').style.top=(78-round*8)+'%';s.m.querySelector('.runner').style.left=(20+n*30)+'%';if(round===3)s.finish(correct,correct+'/3 침투 성공');else paint();});paint();s.run(function(now){s.bar(1-(now-s.start)/6500);if(now-s.start>6500)s.finish(0,'침투 시간 초과');});return s.cancel;
  };
  U.miniScan=function(cb){
    var open=Math.floor(Math.random()*3),ready=false;
    var s=start('👀 패스 시야','1.4초 동안 <b>마크되지 않은 동료</b>를 확인하세요. 가려진 뒤 그 동료 번호를 골라 패스합니다.', '<div class="drill-lanes">'+[0,1,2].map(function(n){return '<div>'+actor('receiver','player_receive',50,50)+(n===open?'자유':'마크됨')+'</div>';}).join('')+'</div><p class="drill-status">동료의 위치를 스캔하세요</p>'+buttons(['동료 A','동료 B','동료 C']),'패스',cb);motion(s,'scan');s.openLane=open;
    s.controls(function(n){if(!ready||n>2)return;s.choice=n;var speed=performance.now()-s.start-1400;s.finish(n===open?(speed<1400?3:2):0,n===open?'시야 확보 · 나이스 패스!':'마크된 동료에게 패스했어요');});
    s.run(function(now){var t=now-s.start;s.bar(1-t/5500);if(t>=1400&&!ready){ready=true;s.m.querySelector('.drill-lanes').textContent='?     ?     ?';s.text('마크되지 않았던 동료는 누구인가요?');}if(t>5500)s.finish(0,'패스 판단 시간 초과');});return s.cancel;
  };
  U.miniRhythm=function(cb){
    var taps=0,errors=0,last=null;
    var s=start('🏃 왕복 체력','왼발·오른발을 번갈아 <b>0.5초 간격으로 6번</b> 누르세요. 숫자 1·2.',actor('runner','player_run',50,55)+'<p class="drill-status">왼발부터 시작 · 0/6</p>'+buttons(['왼발','오른발']),'체력',cb);motion(s,'rhythm');
    s.controls(function(n){if(n>1)return;var now=performance.now();if(last!==null&&now-last<120)return;if(n!==taps%2)errors+=.5;if(last!==null)errors+=Math.abs((now-last)/1000-.5);last=now;taps++;Feedback.play('select');s.text(taps+'/6 · 다음 '+(taps%2?'오른발':'왼발'));s.m.querySelector('.runner').style.left=(taps%2?35:65)+'%';if(taps===6)s.finish(C.grade(errors,.5,1.2,2),'왕복 6회 · 리듬 오차 '+errors.toFixed(1)+'초');});s.run(function(now){s.bar(1-(now-s.start)/7000);if(now-s.start>7000)s.finish(0,'체력 훈련 시간 초과');});return s.cancel;
  };
  U.miniIntercept=function(cb){
    var lane=Math.floor(Math.random()*3),chosen=null;
    var s=start('🛡 패스 차단','공의 진행 방향을 읽고 <b>도착할 레인</b>으로 이동하세요. 2초 후 차단 판정. 숫자 1·2·3.',ball(50,18)+actor('interceptor','defender_ready',50,78)+'<p class="drill-status">공의 궤적을 읽으세요</p>'+buttons(['왼쪽','중앙','오른쪽']),'수비',cb);motion(s,'intercept');
    s.controls(function(n){if(n>2)return;chosen=n;Feedback.play('select');s.m.querySelector('.interceptor').style.left=(20+n*30)+'%';});s.run(function(now){var t=(now-s.start)/2000,u=Math.min(1,t);s.bar(1-u);var b=s.m.querySelector('.drill-ball');b.style.left=(50+(lane-1)*30*u)+'%';b.style.top=(18+60*u)+'%';if(t>=1)s.finish(chosen===lane?3:0,chosen===lane?'패스 길을 차단했어요!':'패스가 수비를 통과했어요');});return s.cancel;
  };
  U.miniLine=function(cb){
    var x=50,score=0,frames=0,held=0,last;
    var s=start('📏 수비 라인','동료의 노란 라인을 <b>좌우 이동하며 4초간 유지</b>하세요. 버튼을 누르거나 화살표 키를 길게 누르세요.', '<div class="drill-line"></div>'+actor('line-player','defender_ready',50,70)+'<p class="drill-status">노란 라인과 거리 줄이기</p>'+buttons(['← 이동','이동 →']),'위치선정',cb);motion(s,'line');
    s.controls(function(n){if(n<2){x=Math.max(10,Math.min(90,x+(n===0?-8:8)));Feedback.play('select');}});var box=s.m.querySelector('.mg');box.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();held=e.key==='ArrowLeft'?-1:1;}});box.addEventListener('keyup',function(){held=0;});
    s.run(function(now){var t=(now-s.start)/1000,dt=last==null?0:(now-last)/1000;last=now;var target=50+25*Math.sin(t*2);x=Math.max(10,Math.min(90,x+held*dt*65));score+=Math.abs(target-x);frames++;s.m.querySelector('.drill-line').style.left=target+'%';s.m.querySelector('.line-player').style.left=x+'%';s.m.querySelectorAll('.line-mate').forEach(function(el,i){el.style.left=(target+(i?7:-7))+'%';});s.m.querySelector('.drill-formation-link').style.left=target+'%';s.bar(1-t/4);if(t>=4)s.finish(C.grade(score/frames,7,15,23),'라인 평균 거리 '+Math.round(score/frames));});return s.cancel;
  };
  U.miniClaim=function(cb){
    var high=Math.random()<.5,ready=false;
    var s=start('🧤 크로스 판단','공이 페널티 구역에 도착할 때 <b>낮은 공은 잡기, 높은 공은 펀칭</b>을 선택하세요. 숫자 1·2.',ball(15,high?22:60)+actor('claim-keeper','keeper_ready',78,70)+'<p class="drill-status">'+(high?'높은 크로스':'낮은 크로스')+'</p>'+buttons(['잡기','펀칭']),'선방',cb);motion(s,'claim');s.punch=high;
    s.controls(function(n){if(n>1)return;s.punch=n===1;var t=performance.now()-s.start,err=Math.abs(t-1800);s.finish(n===(high?1:0)?C.grade(err,220,420,650):0,n===(high?1:0)?(high?'펀칭으로 걷어냈어요':'안전하게 잡았어요'):'크로스 처리 판단 실패');});s.run(function(now){var t=now-s.start,u=Math.min(1,t/1800),b=s.m.querySelector('.drill-ball');b.style.left=(15+63*u)+'%';s.bar(1-t/3500);if(t>3500)s.finish(0,'크로스를 놓쳤어요');});return s.cancel;
  };
  U.miniAngle=function(cb){
    var attacker=Math.floor(Math.random()*3),x=50;
    var s=start('🥅 슈팅 각도 좁히기','공과 골문 중앙을 잇는 <b>각도 이등분선</b>으로 이동하고 준비 완료를 누르세요. 숫자 1·2로 이동, 3으로 확정.',actor('attacker','player_run',20+attacker*30,20)+'<div class="drill-goal">골문</div>'+actor('angle-keeper','keeper_ready',50,65)+'<p class="drill-status">골문과 공격수 사이의 중앙으로</p>'+buttons(['← 이동','이동 →','준비 완료']),'위치선정',cb);motion(s,'angle');var guides=s.m.querySelectorAll('.drill-angle-guide path');guides[0].setAttribute('d','M'+(20+attacker*30)+' 20 L30 81 L70 81 Z');guides[1].setAttribute('d','M'+(20+attacker*30)+' 20 L50 81');
    s.controls(function(n){if(n===2){var target=(20+attacker*30+50)/2;s.finish(C.grade(Math.abs(x-target),5,10,18),'각도 거리 '+Math.round(Math.abs(x-target)));}else if(n<2){x=Math.max(10,Math.min(90,x+(n===0?-5:5)));s.m.querySelector('.angle-keeper').style.left=x+'%';Feedback.play('select');}});s.run(function(now){s.bar(1-(now-s.start)/6000);if(now-s.start>6000)s.finish(0,'위치선정 시간 초과');});return s.cancel;
  };
  U.drillAbilities={miniBat:'슈팅',miniPitch:'선방',miniTimer:'수비',miniSteal:'드리블',miniThrow:'패스',miniSigns:'위치선정',miniVolley:'슈팅',miniRun:'스피드',miniScan:'패스',miniRhythm:'체력',miniIntercept:'수비',miniLine:'위치선정',miniClaim:'선방',miniAngle:'위치선정'};
  U.roleDrills={공격수:['miniBat','miniSteal','miniThrow','miniVolley','miniRun'],미드필더:['miniThrow','miniSigns','miniSteal','miniScan','miniRhythm'],수비수:['miniTimer','miniIntercept','miniLine','miniSigns','miniThrow'],골키퍼:['miniPitch','miniClaim','miniAngle','miniThrow','miniSigns']};
  var old=U.extraPracticeGames;
  U.extraPracticeGames=function(){var games=old(),extra={volley:['발리 파워','miniVolley','누름·뗌으로 충전 시간 조절'],run:['침투 경로','miniRun','세 번 연속 빈 레인 선택'],scan:['패스 시야','miniScan','가려지기 전 자유로운 동료 확인'],rhythm:['왕복 체력','miniRhythm','두 발을 번갈아 일정한 리듬 유지'],intercept:['패스 차단','miniIntercept','공의 궤적을 읽고 도착 레인 선택'],line:['수비 라인','miniLine','움직이는 동료와 라인 유지'],claim:['크로스 판단','miniClaim','공 높이에 맞춰 잡기·펀칭 결정'],angle:['슈팅 각도','miniAngle','공격수와 골문 사이 각도 좁히기']};Object.keys(extra).forEach(function(k){var d=extra[k];games[k]={title:d[0],icon:'⚽',play:U[d[1]],help:d[2],levels:'최고 95% · 좋음 70% · 보통 30% · 실패 5%',keys:'게임별 안내 참고 · 터치 또는 키보드'};});return games;};
})();
