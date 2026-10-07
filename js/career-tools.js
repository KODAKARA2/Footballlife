// Career inspection never rolls random rewards or applies them a second time.
(function () {
  var I = E._internal;
  E.snapshotValues = function () {
    var s = E.state(), values = Object.assign({}, s.능력치);
    ['행복도','성적','돈','부상','슬럼프'].forEach(function (k) { values[k] = s[k] || 0; });
    values.애정도 = s.히로인 ? s.히로인.애정도 : 0;
    values.애정도2 = s.히로인2 ? s.히로인2.애정도 : 0;
    return values;
  };
  E.finishDelta = function (result, before) {
    var after = E.snapshotValues(); result.최종변화 = {};
    Object.keys(after).forEach(function (k) {
      if (after[k] !== before[k]) result.최종변화[k] = { 이전: before[k], 이후: after[k], 차이: after[k] - before[k], 직접: (result.직후 || after)[k] - before[k], 후속: after[k] - (result.직후 || after)[k] };
    });
    delete result.직후;
    result.변화설명 = '선택 효과와 연습, 자연성장·노화, 회복, 관계 변화 및 정산을 모두 반영한 실제 변화입니다.';
  };
  E.choiceWarnings = function (o) {
    var s = E.state(), notes = [];
    function inspect(x, label) {
      var fx = x.효과 || {};
      Object.keys(fx).forEach(function (k) {
        var v = fx[k], lo = Array.isArray(v) ? v[0] : v, hi = Array.isArray(v) ? v[1] : v;
        if ((k === '행복도' || k.indexOf('애정도') === 0) && lo <= -10) notes.push(label + k + ' 최대 ' + Math.abs(lo) + ' 감소');
        if ((k === '행복도' || k === '애정도') && hi > 0 && (k === '행복도' ? s.행복도 : s.히로인 ? s.히로인.애정도 : 0) + Math.ceil(hi * E.looksMult(k === '행복도' ? '성적행복' : '이성')) > 100) notes.push(label + k + ' 상한 100 · 일부 보상 소멸 가능');
        if (k === '부상' && hi > 0) notes.push(label + '부상 최대 ' + hi + '턴');
        var stats = k === '모든능력치' ? E.posStats() : k === '특기능력치' ? [E.spec().능력치] : [k];
        stats.forEach(function (stat) { if (I.SPORT_STATS.indexOf(stat) >= 0 && hi > 0 && s.능력치[stat] + Math.ceil(hi * (GD.설정.능력치상승배율 || 1) * E.looksMult('능력치')) > E.cap()) notes.push(label + stat + (s.능력치[stat] >= E.cap() ? ' 상한 · 상승 보상 소멸' : ' 상한 · 보상 일부 소멸 가능'));  });
      });
      if (x.관계 === '이별' || x.양다리정리 || x.갈아타기) notes.push(label + '관계 종료와 이별 타격');
    }
    inspect(o, '');
    if (o.확률결과) { inspect(Object.assign({},o,o.확률결과.성공), '성공 시 '); inspect(Object.assign({},o,o.확률결과.실패), '실패 시 '); }
    if (o.집중 && s.히로인 && s.히로인.관계 !== '만남') notes.push('집중 훈련으로 관계 유지 비용 증가');
    return Array.from(new Set(notes));
  };
})();
(function () {
  var I = E._internal;
  E.goalCard = function() {
    var s=E.state();
    if (!I.YEARLY[s.시기] || (s.시즌목표 && s.시즌목표.나이===s.나이)) return null;
    var stat={공격수:'슈팅',미드필더:'패스',수비수:'수비',골키퍼:'선방'}[s.포지션];
    return {시스템:true,목표선택:true,제목:'이번 시즌의 목표',내용:'한 가지 목표를 고르세요. 시즌 결산 때 한 번 평가합니다. 달성 보상은 행복 +3 (상한 100)입니다.',선택지:[
      {글:'주전 확보 · 주전으로 한 구간 출전',목표:'주전'},
      {글:stat+' 연마 · 능력 +2',목표:stat},
      {글:'동료 연결 · 패스 +2',목표:'패스'},
      {글:'무부상 · 모든 기록 구간 건강 유지',목표:'무부상'}
    ].filter(function(o,i,a){return (!s.능력치[o.목표] || E.cap()-s.능력치[o.목표]>=2) && a.findIndex(function(x){return x.목표===o.목표;})===i;})};
  };
  E.selectGoal=function(o) {
    var s=E.state(); if (s.시즌목표 && s.시즌목표.나이===s.나이) return;
    s.시즌목표={나이:s.나이,종류:o.목표,시작:s.능력치[o.목표]||0,보상:false};
  };
  E.evaluateGoal=function() {
    var s=E.state(), g=s.시즌목표, intervals=s.시즌구간||[];
    if (!g || g.나이!==s.나이 || g.평가) return;
    var met=g.종류==='주전'?intervals.some(function(x){return x.주전&&x.기록&&x.기록.출전>0;}):g.종류==='무부상'?intervals.length>0&&intervals.every(function(x){return x.부상===0;}):(s.능력치[g.종류]||0)-g.시작>=2;
    g.평가=true;g.달성=met;
    var gain=met?Math.min(3,100-s.행복도):0;
    if (met&&!g.보상) {s.행복도+=gain;g.보상=true;}
    s.대기열.push({시스템:true,제목:'시즌 목표 평가',내용:g.종류+' · '+(met?'달성! 행복 +'+gain+(gain<3?' (상한 적용)':''):'이번 시즌은 미달성. 다음 시즌에 다시 도전하세요.'),선택지:[{글:'평가 확인'}]});
  };
})();
