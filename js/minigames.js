// Six football drills. Legacy method names are stable API identifiers, not rules.
(function () {
  if (!window.U) return;
  var U = window.U, H = U._mini;
  function probability(level) { var M = GD.설정.미니게임 || {}; return [M.최저확률 || .05, .3, .7, M.최고확률 || .95][level]; }
  function grade(error, a, b, c) { return error <= a ? 3 : error <= b ? 2 : error <= c ? 1 : 0; }
  // Presentation only: anchors stay on the existing rule elements. Failed
  // downloads retain the original field/markers, and never delay the clock.
  function decorate(m, stat) {
    var field=m.querySelector('.football-field');field.dataset.drill=stat;
    function image(parent, name, cls) {
      var img=document.createElement('img');img.className='mg-art-image '+(cls||'');img.alt='';img.setAttribute('aria-hidden','true');img.draggable=false;img.decoding='async';
      img.onload=function(){parent.classList.add('art-ready');};
      img.onerror=function(){img.hidden=true;parent.classList.remove('art-ready');};
      parent.appendChild(img);img.src='images/minigames/'+name+'.png';return img;
    }
    var backdrop=document.createElement('div');backdrop.className='mg-art-backdrop';field.prepend(backdrop);
    image(backdrop,stat==='위치선정'?'tactics_background':stat==='슈팅'||stat==='선방'?'field_goal':'field_topdown');
    function actor(el,name,cls){if(!el)return;var fallback=document.createElement('span');fallback.className='mg-art-fallback';while(el.firstChild)fallback.appendChild(el.firstChild);el.appendChild(fallback);image(el,name,'mg-sprite '+(cls||''));}
    m.querySelectorAll('.football-goal').forEach(function(el){actor(el,'goal_net','goal-net-art');});
    if(stat==='슈팅') {var shooter=document.createElement('div');shooter.className='football-shooter';shooter.setAttribute('aria-hidden','true');field.appendChild(shooter);image(shooter,'player_run','mg-sprite');}
    if(stat==='선방') {
      actor(m.querySelector('.keeper-gloves'),'keeper_ready','keeper-art');
      m.querySelector('.keeper-target').innerHTML=H.ball;
    }
    if(stat==='수비') {
      var opponent=m.querySelector('.defend-player');opponent.textContent='●';actor(opponent,'defender_ready');
      var ball=document.createElement('i');ball.className='defend-ball';ball.innerHTML=H.ball;opponent.appendChild(ball);
      var home=document.createElement('div');home.className='defend-home';home.setAttribute('aria-hidden','true');field.appendChild(home);image(home,'player_run','mg-sprite');
    }
    if(stat==='드리블') {
      // The ball stays outside the fallback wrapper so a loaded athlete does not hide it.
      var runner=m.querySelector('.dribble-runner'),ball=runner.querySelector('.runner-ball');ball.remove();actor(runner,'player_run');runner.appendChild(ball);
      m.querySelectorAll('.dribble-defender').forEach(function(el){actor(el,'defender_ready');});
    }
    if(stat==='패스')actor(m.querySelector('.throw-target'),'player_receive');
  }
  function session(title, help, field, stat, cb) {
    var m = H.open(title, help, field + '<div class="pf-time"><i></i></div>', 'football-field'), done = false, held = false, raf, timeout;
    if (!m.querySelector('.drill-pitch')) decorate(m,stat);
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', title);
    var start = performance.now(), resultArt = window.DrillResultArt ? DrillResultArt.prepare(m,title) : function(){};
    return {
      m: m, start: start,
      active: function () { return !done && !held && m.isConnected; },
      hold: function () { held = true; cancelAnimationFrame(raf); },
      run: function (fn) { function frame() { if (done || held || !m.isConnected) return; fn(performance.now()); if (!done && !held) raf = Feedback.frame(m, frame); } frame(); },
      bar: function (ratio) { m.querySelector('.pf-time i').style.width = Math.max(0, Math.min(1, ratio)) * 100 + '%'; },
      finish: function (level, text, feedbackKind) { if (done || !m.isConnected) return; done = true; cancelAnimationFrame(raf); resultArt(level,text); Feedback.cue(feedbackKind || (level >= 3 ? 'great' : level >= 2 ? 'good' : 'bad'), m.querySelector('.mg'), level >= 3); var p = probability(level); m.querySelector('.mg-result').textContent = text + ' · ' + stat + ' 판정 · 성공 확률 ' + Math.round(p * 100) + '%'; timeout = Feedback.later(m, function () { if (!m.isConnected) return; m.remove(); cb({확률:p, 표시:text, 능력:stat, 등급:level}); }, 1100); },
      cancel: function () { done = true; cancelAnimationFrame(raf); clearTimeout(timeout); Feedback.clear(m); m.remove(); }
    };
  }
  // One presentation per resolved input; interruption settles without a second award.
  function action(s, milliseconds, paint, finish) {
    s.hold(); var ended=false, frame, began=performance.now();
    function clear(){cancelAnimationFrame(frame);watch.disconnect();window.removeEventListener('resize',end);document.removeEventListener('visibilitychange',hide);}
    function cancel(){if(ended)return;ended=true;clear();}
    function end(){if(ended)return;ended=true;clear();if(s.m.isConnected){paint(1);finish();}}
    function hide(){if(document.hidden)end();}
    var watch=new MutationObserver(function(){if(!s.m.isConnected)cancel();else if(document.documentElement.dataset.reducedMotion==='true')end();});
    watch.observe(document.body,{childList:true,subtree:true});
    watch.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduced-motion']});
    window.addEventListener('resize',end);document.addEventListener('visibilitychange',hide);
    function step(now){var u=Math.min(1,(now-began)/milliseconds);if(u>=1){end();return;}paint(u);frame=Feedback.frame(s.m,step);}
    if(document.hidden||document.documentElement.dataset.reducedMotion==='true')end();else {paint(0);frame=Feedback.frame(s.m,step);}
    return cancel;
  }
  function praise(s,target,tx,ty) {
    if(document.hidden)return;
    var bubble=document.createElement('div');bubble.className='football-pass-praise';bubble.textContent='나이스 패스!';
    bubble.style.left='clamp(70px, '+tx*100+'%, calc(100% - 70px))';bubble.style.top='calc('+ty*100+'% '+(ty<.35?'+ 46px':'- 62px')+')';
    target.parentNode.appendChild(bubble);
    function remove(){bubble.remove();watch.disconnect();window.removeEventListener('resize',remove);document.removeEventListener('visibilitychange',remove);}
    var watch=new MutationObserver(function(){if(!s.m.isConnected)remove();});watch.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('resize',remove);document.addEventListener('visibilitychange',remove);Feedback.later(s.m,remove,900);
  }
  // Shoot a moving ball when it reaches the contact line; the goal and goalkeeper
  // make the striking direction explicit without using the old baseball art.
  U.miniBat = function (cb) {
    var s = session('⚽ 슈팅', '패스가 <b>노란 슈팅 선</b>에 닿을 때 눌러 골문으로 슛하세요.', '<div class="football-goal">골문</div><div class="football-contact">슈팅 선</div><div class="football-ball"><span class="football-ball-spin">' + H.ball + '</span></div><div class="football-status">패스를 기다리세요</div>', '슈팅', cb);
    var launch = s.start + 750, duration = 1000 + Math.random() * 700, ball = s.m.querySelector('.football-ball');
    function put(now) { var u = Math.max(0, (now - launch) / duration); ball.style.left = (15 + 60 * u) + '%'; ball.style.top = '70%'; s.bar(1 - (now - s.start) / (duration + 1300)); if (now >= launch) s.m.querySelector('.football-status').textContent = '공을 보고 슈팅!'; }
    s.run(function (now) { put(now); if (now > launch + duration + 500) s.finish(0, '슈팅 기회를 놓쳤어요'); });
    var stopFlight = function () {};
    function fly(level) {
      s.hold(); var success=level>=2;
      var field = s.m.querySelector('.football-field'), goal = s.m.querySelector('.football-goal');
      var startX = parseFloat(ball.style.left) / 100, startY = .7, frame, ended = false;
      var status = s.m.querySelector('.football-status');
      status.textContent = success?'감아차기…':'빗나가는 슛…'; ball.style.transition = 'none';
      // Parent-verified screenshot samples, not Bezier control points. Map its
      // goal rectangle to this field, preserving the outside-left-post hook.
      var samples = success ? [[.813,.692],[.583,.547],[.422,.456],[.325,.381],
        [.275,.317],[.267,.266],[.282,.187],[.303,.106]] :
        [[.732,.724],[.649,.676],[.557,.620],[.490,.571],[.459,.537],[.459,.508],
         [.477,.478],[.515,.441],[.566,.404],[.631,.363],[.696,.327],[.756,.290]];
      function target() {
        if(!success)return {x:.3+(.756-.291)*.4/.376,y:.06+(.290-.294)*.22/.147};
        // The natural 2:1 canvas has padding; aim inside its 3.4:1 mouth.
        // This point also lies inside the original rectangle if artwork fails.
        return {x:(goal.offsetLeft + goal.clientLeft + goal.clientWidth*.075 + 8) / field.clientWidth,
          y:(goal.offsetTop + goal.clientTop + goal.clientWidth*.5*.305 + 8) / field.clientHeight};
      }
      var aim = target(), mappedStartX = success?.3+(.813-.277)*.4/.403:.3+(.732-.291)*.4/.376;
      var points = samples.map(function (p, i) {
        if(!success){var f=1-i/(samples.length-1);return {x:Math.max(.065,.3+(p[0]-.291)*.4/.376+(startX-mappedStartX)*f),y:.06+(p[1]-.294)*.22/.147+(startY-(.06+(.724-.294)*.22/.147))*f};}
        var fade = [1,.6,.35,.18,.07,0,0,0][i];
        return {x:.3+(p[0]-.277)*.4/.403+(startX-mappedStartX)*fade,
          y:.06+(p[1]-.048)*.22/.224+(startY-(.06+(.692-.048)*.22/.224))*fade};
      });
      points[0] = {x:startX,y:startY}; points[points.length-1] = aim;
      // Interpolating Catmull-Rom passes through the samples; a length table
      // gives even travel speed despite their deliberately uneven spacing.
      var route = [points[0]], lengths = [0], total = 0;
      for (var i=0;i<points.length-1;i++) {
        var a=points[Math.max(0,i-1)], b=points[i], c=points[i+1], d=points[Math.min(points.length-1,i+2)];
        for(var j=1;j<=24;j++) {
          var t=j/24, t2=t*t, t3=t2*t;
          function axis(k) { return .5*((2*b[k])+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3); }
          var p={x:axis('x'),y:axis('y')}, last=route[route.length-1];
          total+=Math.hypot((p.x-last.x)*field.clientWidth,(p.y-last.y)*field.clientHeight);
          route.push(p); lengths.push(total);
        }
      }
      function position(p, progress) {
        ball.style.left=p.x*100+'%'; ball.style.top=p.y*100+'%';
        ball.querySelector('.football-ball-spin').style.transform='rotate('+(-540*progress)+'deg) scale('+(1-.58*progress)+')';
      }
      function cleanup() {
        cancelAnimationFrame(frame); observer.disconnect();
        window.removeEventListener('resize',arrive); document.removeEventListener('visibilitychange',hide);
      }
      function celebrate() {
        if(document.hidden)return;
        var cutin=document.createElement('div');cutin.className=success?'football-goal-cutin':'football-miss-cutin';cutin.setAttribute('aria-hidden','true');
        cutin.innerHTML=success?'<span class="crowd crowd-left">와아아!!</span><strong>GOAL!!!!</strong><span class="crowd crowd-right">우와아!</span>':'<strong>어디로 차는거야!</strong>';
        field.appendChild(cutin);
        function remove(){cutin.remove();watch.disconnect();window.removeEventListener('resize',remove);document.removeEventListener('visibilitychange',remove);}
        var watch=new MutationObserver(function(){if(!s.m.isConnected)remove();});
        watch.observe(document.body,{childList:true,subtree:true});
        window.addEventListener('resize',remove);document.addEventListener('visibilitychange',remove);
        Feedback.later(s.m,remove,850);
      }
      function arrive() {
        if(ended)return; ended=true; cleanup();
        if(!s.m.isConnected)return;
        position(target(),1); status.textContent=success?'골!':'골문 밖으로!'; celebrate();
        s.finish(level,['골문 밖으로!', '옆으로 크게 빗나갔어요', '좋은 슈팅!', '완벽한 득점!'][level]);
      }
      function hide(){if(document.hidden)arrive();}
      var observer=new MutationObserver(function(){
        if(!s.m.isConnected){stopFlight();return;}
        if(document.documentElement.dataset.reducedMotion==='true')arrive();
      });
      observer.observe(document.body,{childList:true,subtree:true});
      observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduced-motion']});
      stopFlight=function(){if(ended)return;ended=true;cleanup();};
      window.addEventListener('resize',arrive); document.addEventListener('visibilitychange',hide);
      if(document.hidden || document.documentElement.dataset.reducedMotion==='true'){arrive();return;}
      var began=performance.now();
      function travel(now) {
        var u=Math.min(1,(now-began)/620), distance=total*u, k=1;
        if(u>=1){arrive();return;}
        while(k<lengths.length-1 && lengths[k]<distance)k++;
        var ratio=(distance-lengths[k-1])/(lengths[k]-lengths[k-1]||1), a=route[k-1], b=route[k];
        position({x:a.x+(b.x-a.x)*ratio,y:a.y+(b.y-a.y)*ratio},u);
        frame=Feedback.frame(s.m,travel);
      }
      frame=Feedback.frame(s.m,travel);
    }
    H.input(s.m, function (e) {
      if (!s.active()) return;
      var now=H.time(e), error=Math.abs(now-launch-duration)/1000, level=grade(error,.07,.16,.3);
      put(now); Feedback.play('kick');
      fly(level);
    });
    return function(){stopFlight();s.cancel();};
  };
  // Goalkeeper tracks the shot landing point with a moving pair of gloves.
  U.miniPitch = function (cb) {
    var s = session('🧤 골키퍼 선방', '골키퍼의 <b>파란 포구 표식</b>이 공과 겹칠 때 눌러 잡으세요.', '<div class="football-goal large"></div><div class="keeper-target">⚽</div><div class="keeper-gloves">🧤</div>', '선방', cb);
    var tx = .25 + Math.random() * .5, ty = .25 + Math.random() * .35, phase = Math.random()*6.28;
    var target = s.m.querySelector('.keeper-target'), gloves = s.m.querySelector('.keeper-gloves'); target.style.left = tx*100+'%'; target.style.top = ty*100+'%';
    function pos(now) { var t=(now-s.start)/1000; return {x:.5+.35*Math.sin(t*2.2+phase),y:.45+.24*Math.sin(t*3+phase)}; }
    function put(now) { var p=pos(now); gloves.style.left=p.x*100+'%';gloves.style.top=p.y*100+'%';return p; }
    s.run(function(now){put(now);s.bar(1-(now-s.start)/6000);if(now-s.start>=6000)s.finish(0,'반응이 늦어 실점했어요');});
    H.input(s.m,function(e){if(!s.active())return;var p=put(H.time(e)),level=grade(Math.hypot(p.x-tx,p.y-ty),.07,.15,.25);if(level>0)Feedback.play('catch');s.finish(level,['공을 놓쳤어요','손끝에 스친 공','좋은 선방!','안정적으로 잡았어요!'][level]);});return s.cancel;
  };
  // Defend by tackling when the attacker enters the legal interception window.
  U.miniTimer = function(cb){
    var s=session('🛡 수비 타이밍','상대의 공이 <b>노란 태클 구역</b>에 들어오면 누르세요. 너무 이르면 파울입니다.','<div class="defend-zone">태클 구역</div><div class="defend-player">● ⚽</div><div class="football-status">상대의 움직임을 읽으세요</div>','수비',cb), duration=2200+Math.random()*1400, player=s.m.querySelector('.defend-player');
    function put(now){var u=(now-s.start)/duration;player.style.left=(10+75*u)+'%';s.bar(1-u);return u;}
    s.run(function(now){if(put(now)>1.15)s.finish(0,'상대가 돌파했어요');});
    H.input(s.m,function(e){if(!s.active())return;var u=put(H.time(e)),level=grade(Math.abs(u-.7),.04,.09,.17);if(level>0)Feedback.play('tackle');s.finish(level,level===0?(u<.7?'성급한 태클 · 파울':'태클이 늦었어요'):['','간신히 진로 차단','깔끔한 태클!','완벽한 볼 탈취!'][level]);});return s.cancel;
  };
  U.miniSteal=function(cb){
    var s=session('⚡ 드리블 돌파','<b>공간 열림!</b>에 누르세요. ‘압박!’에는 기다리세요.',
      '<div class="dribble-lane"><span class="dribble-runner"><i class="runner-ball">'+H.ball+'</i></span><b class="dribble-defender first"></b><b class="dribble-defender second"></b></div><div class="steal-signal" role="status">수비를 관찰하세요</div>',
      '드리블',cb),go=s.start+1800+Math.random()*1300,signal=s.m.querySelector('.steal-signal'),runner=s.m.querySelector('.dribble-runner'),defenders=s.m.querySelectorAll('.dribble-defender'),stopMotion=function(){};
    function defendersAt(gap){defenders[0].style.top=(.5-gap)*100+'%';defenders[1].style.top=(.5+gap)*100+'%';}
    function gapAt(now){var t=now-go;if(t<0)return .10*Math.sin((now-s.start)/230);if(t<=320)return .36*Math.min(1,t/100);return .36*Math.max(0,1-(t-320)/180);}
    s.run(function(now){
      var t=now-go;defendersAt(gapAt(now));
      signal.textContent=t>=0?(t<=320?'공간 열림!':'틈이 닫혀요'):now-s.start>600&&now-s.start<1150?'압박! 기다려요':'수비를 관찰하세요';
      signal.classList.toggle('go',t>=0&&t<=320);s.bar(1-(now-s.start)/(go-s.start+850));
      if(t>=850)s.finish(0,'돌파 공간이 닫혔어요');
    });
    H.input(s.m,function(e){
      if(!s.active())return;
      var now=H.time(e),reaction=(now-go)/1000,level=reaction<0?0:grade(reaction,.18,.32,.5),success=level>=2,initialGap=gapAt(now);
      signal.textContent=success?'두 수비 사이로!':'수비에게 막혔어요';signal.classList.remove('go');Feedback.play('kick');
      stopMotion=action(s,success?640:300,function(u){
        defendersAt(initialGap+((success?.36:0)-initialGap)*Math.min(1,u*4));
        runner.style.left=(.207+((success?1.04:.49)-.207)*u)*100+'%';
        runner.querySelector('.runner-ball').style.rotate=(-360*u)+'deg';
      },function(){
        if(!success)Feedback.play('tackle');
        s.finish(level,reaction<0?'압박 속에서 공을 잃었어요':['수비에게 막혔어요','간신히 공을 지켰어요','드리블 돌파!','완벽하게 수비를 제쳤어요!'][level]);
      });
    });return function(){stopMotion();s.cancel();};
  };
  U.miniThrow=function(cb){
    var s=session('🎯 패스','동료에게 패스하세요. <b>두 번</b> 눌러 가로 → 세로 방향을 정합니다.','<div class="throw-target">동료</div><div class="throw-x"></div><div class="throw-y"></div><div class="throw-dot"></div><div class="football-pass-ball">' + H.ball + '</div><div class="mg-pitch">1 / 2 · 가로 방향</div>','패스',cb),tx=.25+Math.random()*.5,ty=.25+Math.random()*.45,phase=0,phaseStart=s.start,x=.5,y=.5;
    var m=s.m,target=m.querySelector('.throw-target'),ball=m.querySelector('.football-pass-ball'),stopMotion=function(){};ball.hidden=true;target.style.left=tx*100+'%';target.style.top=ty*100+'%';
    function put(now){var p=.5+.37*Math.sin((now-phaseStart)/1000*3.2);if(!phase)x=p;else y=p;m.querySelector('.throw-x').style.left=x*100+'%';m.querySelector('.throw-y').style.top=y*100+'%';m.querySelector('.throw-y').hidden=!phase;m.querySelector('.throw-dot').style.left=x*100+'%';m.querySelector('.throw-dot').style.top=y*100+'%';}
    s.run(function(now){put(now);s.bar(1-(now-s.start)/6000);if(now-s.start>=6000)s.finish(0,'패스 길이 막혔어요');});
    H.input(m,function(e){
      if(!s.active())return;var now=H.time(e);if(phase&&now-phaseStart<180)return;put(now);
      if(!phase){phase=1;phaseStart=now;m.querySelector('.mg-pitch').textContent='2 / 2 · 세로 방향';return;}
      var level=grade(Math.hypot(x-tx,y-ty),.06,.14,.25),endX=level>=2?tx:x,endY=level>=2?ty:y;
      Feedback.play('kick');ball.hidden=false;m.querySelector('.mg-pitch').textContent='패스 중…';
      stopMotion=action(s,420,function(u){ball.style.left=(.5+(endX-.5)*u)*100+'%';ball.style.top=(.86+(endY-.86)*u)*100+'%';ball.style.transform='translate(-50%,-50%) rotate('+(-240*u)+'deg)';},function(){
        if(level>=2){Feedback.play('catch');praise(s,target,tx,ty);}
        m.querySelector('.mg-pitch').textContent=level>=2?'동료가 받았어요':'패스가 빗나갔어요';
        s.finish(level,['패스가 끊겼어요','동료가 간신히 받았어요','정확한 패스!','완벽한 전진 패스!'][level]);
      });
    });return function(){stopMotion();s.cancel();};
  };
  U.miniSigns=function(cb){
    var names=['압박','전환','침투'],sequence=[0,0,0].map(function(){return Math.floor(Math.random()*3);});
    var s=session('🧠 전술 기억','감독의 전술 <b>3개를 순서대로</b> 기억하고 같은 순서로 고르세요.','<div class="sign-display" role="status"></div><div class="sign-progress">전술을 기억하세요</div><div class="sign-answers">'+names.map(function(n,i){return '<button disabled data-sign="'+i+'"><small>'+(i+1)+'</small>'+n+'</button>';}).join('')+'</div><div class="sign-slots">○ ○ ○</div>','위치선정',cb),reveal=s.start+2400,answers=[],correct=0,last=-Infinity;
    var m=s.m,buttons=m.querySelectorAll('[data-sign]'),box=m.querySelector('.mg'),display=m.querySelector('.sign-display');box.tabIndex=0;box.setAttribute('aria-label','전술 기억. 숫자 1, 2, 3으로 선택');box.focus();
    function resolve(timeout) {
      if(!s.active())return;
      buttons.forEach(function(b){b.disabled=true;});
      if(!document.hidden){
        var cutin=document.createElement('div'),exact=correct===3;
        cutin.className='coach-tactics-cutin';cutin.dataset.emotion=exact?'success':'failure';
        cutin.innerHTML='<img src="images/coach_tactics_'+(exact?'success':'failure')+'.png" alt="'+(exact?'웃는 감독':'화난 감독')+'"><div><strong>'+(exact?'완벽하게 기억했어!':'다시 집중하자!')+'</strong><p>'+correct+'/3 '+(exact?'완전 일치':correct?'부분 일치':'불일치')+(timeout?'<br>시간 초과':'')+'</p></div>';
        m.querySelector('.football-field').appendChild(cutin);m.classList.add('tactics-resolved');
        function remove(){cutin.remove();watch.disconnect();window.removeEventListener('resize',remove);document.removeEventListener('visibilitychange',remove);}
        var watch=new MutationObserver(function(){if(!m.isConnected)remove();});watch.observe(document.body,{childList:true,subtree:true});
        window.addEventListener('resize',remove);document.addEventListener('visibilitychange',remove);Feedback.later(m,remove,950);
      }
      s.finish(correct,timeout?'전술 입력 시간 초과 · '+correct+'개 일치':'전술 '+correct+'/3개 일치',correct===3?'great':'bad');
    }
    function answer(n){var now=performance.now();if(!s.active()||now<reveal||now-last<180)return;last=now;if(now>reveal+5000)return resolve(true);if(sequence[answers.length]===n)correct++;answers.push(n);m.querySelector('.sign-slots').textContent=answers.map(function(i){return names[i];}).concat(Array(3-answers.length).fill('○')).join(' · ');if(answers.length===3){buttons.forEach(function(b){b.disabled=true;});resolve(false);}}
    buttons.forEach(function(b){b.onclick=function(){answer(Number(b.dataset.sign));};});box.addEventListener('keydown',function(e){if(/^[123]$/.test(e.key)&&!e.repeat){e.preventDefault();answer(Number(e.key)-1);}});
    var ready=false;s.run(function(now){if(now<reveal){var i=Math.min(2,Math.floor((now-s.start)/800));display.textContent=(now-s.start)%800<650?(i+1)+'. '+names[sequence[i]]:'· · ·';s.bar(1-(now-s.start)/2400);}else{if(!ready){ready=true;display.textContent='기억한 순서는?';buttons.forEach(function(b){b.disabled=false;});buttons[0].focus();}s.bar(1-(now-reveal)/5000);if(now>=reveal+5000)resolve(true);}});return s.cancel;
  };
  U.extraPracticeGames=function(){var levels='최고 95% · 좋음 70% · 보통 30% · 실패 5%';return {
    bat:{title:'슈팅',icon:'⚽',play:U.miniBat,help:'공이 노란 슈팅 선에 닿는 순간 누르세요.',levels:levels},
    pitch:{title:'골키퍼',icon:'🧤',play:U.miniPitch,help:'골키퍼의 파란 포구 표식이 공과 겹칠 때 눌러 선방하세요.',levels:levels},
    timer:{title:'수비',icon:'🛡',play:U.miniTimer,help:'상대가 노란 태클 구역에 들어오면 누르세요. 이른 태클은 파울입니다.',levels:levels},
    steal:{title:'돌파',icon:'⚡',play:U.miniSteal,help:'압박에는 기다리고 공간 열림 신호에 빠르게 누르세요.',levels:levels},
    throw:{title:'패스',icon:'🎯',play:U.miniThrow,help:'동료 위치에 맞춰 가로와 세로 방향을 차례로 멈추세요.',levels:levels},
    signs:{title:'전술 기억',icon:'🧠',play:U.miniSigns,help:'압박·전환·침투의 순서를 기억한 뒤 입력하세요.',levels:levels,keys:'터치·클릭 또는 숫자 1·2·3'}
  };};
  U._drillCore={session:session,grade:grade,probability:probability};
})();
