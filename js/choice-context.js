// Explicit choice contracts: generic career showdowns retain the role fallback.
(function() {
  var contexts={
    'football-pro_events-006':{0:{평가능력:'슈팅',게임:['miniBat'],행동:'마무리'}},
    'football-special-001':{0:{평가능력:'선방',게임:['miniPitch'],행동:'선방'}},
    'football-special-003':{0:{평가능력:'위치선정',게임:['miniClaim'],행동:'크로스 처리'}},
    'football-special-007':{0:{평가능력:'수비',게임:['miniIntercept','miniTimer'],행동:'차단'}}
  };
  var final = GD.카드.find(function(c){return c.아이디 === 'football-pro_events-006';});
  if (final) {
    final.선택지[0].글 = '마무리는 내가 맡는다';
    final.선택지[0].조건 = {포지션:['공격수','미드필더']};
    [{글:'동료에게 연결한다',평가능력:'패스',게임:['miniThrow','miniScan'],행동:'동료 연결'},
     {글:'감독의 지시대로 움직인다',평가능력:'위치선정',게임:['miniSigns','miniLine'],행동:'지시 수행'}].forEach(function(x){
      var o=JSON.parse(JSON.stringify(final.선택지[0])); delete o.조건; o.글=x.글; o.경기맥락={평가능력:x.평가능력,게임:x.게임,행동:x.행동};final.선택지.push(o);
    });
  }
  GD.카드.forEach(function(c) {
    (c.선택지||[]).forEach(function(o,i) {
      if (contexts[c.아이디] && contexts[c.아이디][i]) o.경기맥락=contexts[c.아이디][i];
      else if (o.미니게임 && !o.경기맥락) o.경기맥락={행동:'역할 종합 평가',게임:[],평가능력:null};
    });
  });
  // These are explicit training choices, not probabilistic outcome previews.
  E.contextFor=function(o) {
    if (o.경기맥락) return o.경기맥락;
    var stat=o.훈련능력;
    return stat?{평가능력:stat,게임:[],행동:stat+' 연습'}:null;
  };
})();
