// Six football drills. Legacy method names are stable API identifiers, not rules.
(function () {
  if (!window.U) return;
  var U = window.U, H = U._mini;
  function probability(level) { var M = GD.설정.미니게임 || {}; return [M.최저확률 || .05, .3, .7, M.최고확률 || .95][level]; }
  function grade(error, a, b, c) { return error <= a ? 3 : error <= b ? 2 : error <= c ? 1 : 0; }
  function session(title, help, field, stat, cb) {
    var m = H.open(title, help, field + '<div class="pf-time"><i></i></div>', 'football-field'), done = false, raf, timeout;
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', title);
    var start = performance.now();
    return {
      m: m, start: start,
      active: function () { return !done && m.isConnected; },
      run: function (fn) { function frame() { if (done || !m.isConnected) return; fn(performance.now()); if (!done) raf = requestAnimationFrame(frame); } frame(); },
      bar: function (ratio) { m.querySelector('.pf-time i').style.width = Math.max(0, Math.min(1, ratio)) * 100 + '%'; },
      finish: function (level, text) { if (done || !m.isConnected) return; done = true; cancelAnimationFrame(raf); var p = probability(level); m.querySelector('.mg-result').textContent = text + ' · ' + stat + ' 판정 · 성공 확률 ' + Math.round(p * 100) + '%'; timeout = setTimeout(function () { if (!m.isConnected) return; m.remove(); cb({확률:p, 표시:text, 능력:stat, 등급:level}); }, 1100); },
      cancel: function () { done = true; cancelAnimationFrame(raf); clearTimeout(timeout); m.remove(); }
    };
  }
  // Shoot a moving ball when it reaches the contact line; the goal and goalkeeper
  // make the striking direction explicit without using the old baseball art.
  U.miniBat = function (cb) {
    var s = session('⚽ 슈팅', '패스가 <b>노란 슈팅 선</b>에 닿을 때 눌러 골문으로 슛하세요.', '<div class="football-goal">골문</div><div class="football-contact">슈팅 선</div><div class="football-ball">' + H.ball + '</div><div class="football-status">패스를 기다리세요</div>', '슈팅', cb);
    var launch = s.start + 750, duration = 1000 + Math.random() * 700, ball = s.m.querySelector('.football-ball');
    function put(now) { var u = Math.max(0, (now - launch) / duration); ball.style.left = (15 + 60 * u) + '%'; ball.style.top = '70%'; s.bar(1 - (now - s.start) / (duration + 1300)); if (now >= launch) s.m.querySelector('.football-status').textContent = '공을 보고 슈팅!'; }
    s.run(function (now) { put(now); if (now > launch + duration + 500) s.finish(0, '슈팅 기회를 놓쳤어요'); });
    H.input(s.m, function (e) { if (!s.active()) return; var now = H.time(e), error = Math.abs(now - launch - duration) / 1000, level = grade(error,.07,.16,.3); put(now); ball.style.top = '18%'; ball.style.left = level >= 2 ? '50%' : '95%'; s.finish(level, ['골문 밖으로!', '골키퍼에게 막힌 슛', '좋은 슈팅!', '완벽한 득점!'][level]); });
    return s.cancel;
  };
  // Goalkeeper tracks the shot landing point with a moving pair of gloves.
  U.miniPitch = function (cb) {
    var s = session('🧤 골키퍼 선방', '움직이는 <b>파란 장갑</b>이 공과 겹칠 때 눌러 잡으세요.', '<div class="football-goal large"></div><div class="keeper-target">⚽</div><div class="keeper-gloves">🧤</div>', '선방', cb);
    var tx = .25 + Math.random() * .5, ty = .25 + Math.random() * .35, phase = Math.random()*6.28;
    var target = s.m.querySelector('.keeper-target'), gloves = s.m.querySelector('.keeper-gloves'); target.style.left = tx*100+'%'; target.style.top = ty*100+'%';
    function pos(now) { var t=(now-s.start)/1000; return {x:.5+.35*Math.sin(t*2.2+phase),y:.45+.24*Math.sin(t*3+phase)}; }
    function put(now) { var p=pos(now); gloves.style.left=p.x*100+'%';gloves.style.top=p.y*100+'%';return p; }
    s.run(function(now){put(now);s.bar(1-(now-s.start)/6000);if(now-s.start>=6000)s.finish(0,'반응이 늦어 실점했어요');});
    H.input(s.m,function(e){if(!s.active())return;var p=put(H.time(e)),level=grade(Math.hypot(p.x-tx,p.y-ty),.07,.15,.25);s.finish(level,['공을 놓쳤어요','손끝에 스친 공','좋은 선방!','안정적으로 잡았어요!'][level]);});return s.cancel;
  };
  // Defend by tackling when the attacker enters the legal interception window.
  U.miniTimer = function(cb){
    var s=session('🛡 수비 타이밍','상대의 공이 <b>노란 태클 구역</b>에 들어오면 누르세요. 너무 이르면 파울입니다.','<div class="defend-zone">태클 구역</div><div class="defend-player">● ⚽</div><div class="football-status">상대의 움직임을 읽으세요</div>','수비',cb), duration=2200+Math.random()*1400, player=s.m.querySelector('.defend-player');
    function put(now){var u=(now-s.start)/duration;player.style.left=(10+75*u)+'%';s.bar(1-u);return u;}
    s.run(function(now){if(put(now)>1.15)s.finish(0,'상대가 돌파했어요');});
    H.input(s.m,function(e){if(!s.active())return;var u=put(H.time(e)),level=grade(Math.abs(u-.7),.04,.09,.17);s.finish(level,level===0?(u<.7?'성급한 태클 · 파울':'태클이 늦었어요'):['','간신히 진로 차단','깔끔한 태클!','완벽한 볼 탈취!'][level]);});return s.cancel;
  };
  U.miniSteal=function(cb){
    var s=session('⚡ 드리블 돌파','<b>공간 열림!</b>에 누르세요. ‘압박!’에는 기다리세요.','<div class="dribble-lane"><span>●</span><b>● ●</b></div><div class="steal-signal" role="status">수비를 관찰하세요</div>','드리블',cb),go=s.start+1800+Math.random()*1300,signal=s.m.querySelector('.steal-signal');
    s.run(function(now){signal.textContent=now>=go?'공간 열림!':now-s.start>600&&now-s.start<1150?'압박! 기다려요':'수비를 관찰하세요';signal.classList.toggle('go',now>=go);s.bar(1-(now-s.start)/(go-s.start+850));if(now>=go+850)s.finish(0,'돌파 공간이 닫혔어요');});
    H.input(s.m,function(e){if(!s.active())return;var reaction=(H.time(e)-go)/1000;if(reaction<0)return s.finish(0,'압박 속에서 공을 잃었어요');var level=grade(reaction,.18,.32,.5);s.finish(level,['수비에게 막혔어요','간신히 공을 지켰어요','드리블 돌파!','완벽하게 수비를 제쳤어요!'][level]);});return s.cancel;
  };
  U.miniThrow=function(cb){
    var s=session('🎯 패스','동료에게 패스하세요. <b>두 번</b> 눌러 가로 → 세로 방향을 정합니다.','<div class="throw-target">동료</div><div class="throw-x"></div><div class="throw-y"></div><div class="throw-dot"></div><div class="mg-pitch">1 / 2 · 가로 방향</div>','패스',cb),tx=.25+Math.random()*.5,ty=.25+Math.random()*.45,phase=0,phaseStart=s.start,x=.5,y=.5;
    var m=s.m,target=m.querySelector('.throw-target');target.style.left=tx*100+'%';target.style.top=ty*100+'%';
    function put(now){var p=.5+.37*Math.sin((now-phaseStart)/1000*3.2);if(!phase)x=p;else y=p;m.querySelector('.throw-x').style.left=x*100+'%';m.querySelector('.throw-y').style.top=y*100+'%';m.querySelector('.throw-y').hidden=!phase;m.querySelector('.throw-dot').style.left=x*100+'%';m.querySelector('.throw-dot').style.top=y*100+'%';}
    s.run(function(now){put(now);s.bar(1-(now-s.start)/6000);if(now-s.start>=6000)s.finish(0,'패스 길이 막혔어요');});
    H.input(m,function(e){if(!s.active())return;var now=H.time(e);if(phase&&now-phaseStart<180)return;put(now);if(!phase){phase=1;phaseStart=now;m.querySelector('.mg-pitch').textContent='2 / 2 · 세로 방향';return;}var level=grade(Math.hypot(x-tx,y-ty),.06,.14,.25);s.finish(level,['패스가 끊겼어요','동료가 간신히 받았어요','정확한 패스!','완벽한 전진 패스!'][level]);});return s.cancel;
  };
  U.miniSigns=function(cb){
    var names=['압박','전환','침투'],sequence=[0,0,0].map(function(){return Math.floor(Math.random()*3);});
    var s=session('🧠 전술 기억','감독의 전술 <b>3개를 순서대로</b> 기억하고 같은 순서로 고르세요.','<div class="sign-display" role="status"></div><div class="sign-progress">전술을 기억하세요</div><div class="sign-answers">'+names.map(function(n,i){return '<button disabled data-sign="'+i+'"><small>'+(i+1)+'</small>'+n+'</button>';}).join('')+'</div><div class="sign-slots">○ ○ ○</div>','위치선정',cb),reveal=s.start+2400,answers=[],correct=0,last=-Infinity;
    var m=s.m,buttons=m.querySelectorAll('[data-sign]'),box=m.querySelector('.mg'),display=m.querySelector('.sign-display');box.tabIndex=0;box.setAttribute('aria-label','전술 기억. 숫자 1, 2, 3으로 선택');box.focus();
    function answer(n){var now=performance.now();if(!s.active()||now<reveal||now-last<180)return;last=now;if(now>reveal+5000)return s.finish(correct,'전술 입력 시간 초과 · '+correct+'개 일치');if(sequence[answers.length]===n)correct++;answers.push(n);m.querySelector('.sign-slots').textContent=answers.map(function(i){return names[i];}).concat(Array(3-answers.length).fill('○')).join(' · ');if(answers.length===3){buttons.forEach(function(b){b.disabled=true;});s.finish(correct,'전술 '+correct+'/3개 일치');}}
    buttons.forEach(function(b){b.onclick=function(){answer(Number(b.dataset.sign));};});box.addEventListener('keydown',function(e){if(/^[123]$/.test(e.key)&&!e.repeat){e.preventDefault();answer(Number(e.key)-1);}});
    var ready=false;s.run(function(now){if(now<reveal){var i=Math.min(2,Math.floor((now-s.start)/800));display.textContent=(now-s.start)%800<650?(i+1)+'. '+names[sequence[i]]:'· · ·';s.bar(1-(now-s.start)/2400);}else{if(!ready){ready=true;display.textContent='기억한 순서는?';buttons.forEach(function(b){b.disabled=false;});buttons[0].focus();}s.bar(1-(now-reveal)/5000);if(now>=reveal+5000)s.finish(correct,'전술 입력 시간 초과 · '+correct+'개 일치');}});return s.cancel;
  };
  U.extraPracticeGames=function(){var levels='최고 95% · 좋음 70% · 보통 30% · 실패 5%';return {
    bat:{title:'슈팅',icon:'⚽',play:U.miniBat,help:'공이 노란 슈팅 선에 닿는 순간 누르세요.',levels:levels},
    pitch:{title:'골키퍼',icon:'🧤',play:U.miniPitch,help:'파란 장갑이 공과 겹칠 때 눌러 선방하세요.',levels:levels},
    timer:{title:'수비',icon:'🛡',play:U.miniTimer,help:'상대가 노란 태클 구역에 들어오면 누르세요. 이른 태클은 파울입니다.',levels:levels},
    steal:{title:'돌파',icon:'⚡',play:U.miniSteal,help:'압박에는 기다리고 공간 열림 신호에 빠르게 누르세요.',levels:levels},
    throw:{title:'패스',icon:'🎯',play:U.miniThrow,help:'동료 위치에 맞춰 가로와 세로 방향을 차례로 멈추세요.',levels:levels},
    signs:{title:'전술 기억',icon:'🧠',play:U.miniSigns,help:'압박·전환·침투의 순서를 기억한 뒤 입력하세요.',levels:levels,keys:'터치·클릭 또는 숫자 1·2·3'}
  };};
})();
