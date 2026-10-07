// 시즌 기록, 수상, 엔딩, 저장
(function () {
  var I = E._internal, cfg = I.cfg, sdef = I.sdef, rnd = I.rnd, clamp = I.clamp;
  function S() { return I.S; }
  function year() { return cfg().시작연도 + S().나이 - 10; }

  // ---------------- 시즌 경기력 ----------------
  function perf() {
    var s = S(), p = E.pos(), w = 0, t = 0;
    E.posStats().forEach(function (k) { var x = (p.비중 || {})[k] || 1; w += x; t += x * s.능력치[k]; });
    var q = t / w + (s.능력치.멘탈 - 50) / 10 + (s.능력치.컨디션 - 60) / 15;
    if (s.슬럼프 > 0) q -= 8;
    if (s.시기 === "해외리그") q += (GD.해외리그.경기력보정 || -8) - (100 - s.능력치.적응) * (GD.해외리그.적응반영 || 0.12);
    return q + rnd() * 8 - 4;
  }

  function seasonLine(snapshot, fraction) {
    var s = snapshot || S();
    if (s.시기 !== "프로" && s.시기 !== "해외리그") return null;
    var live = I.S; I.S = s; var q = perf(); I.S = live;
    var A = s.능력치, starter = s.시기 === "프로" ? s.일군 : s.플래그.해외주전;
    if (!starter || s.플래그.육성선수) return null;
    var available = snapshot ? (s.부상 > 0 ? 0 : fraction) : clamp(1 - s.올해부상카드 / (sdef(s.시기).한해카드수 || 2), 0, 1);
    var games = Math.round(clamp((starter ? 25 : 8) + (q - 50) * 0.25 + rnd() * 4, 0, 38) * available);
    var L = { 연도: cfg().시작연도 + s.나이 - 10, 나이: s.나이, 팀: s.팀, 포지션: s.포지션, 해외: s.시기 === "해외리그", 경기력: Math.round(q), 출전: games,
      출전시간: games * Math.round(starter ? 65 + A.체력 * 0.25 : 20 + A.체력 * 0.35), 득점: 0, 도움: 0, 클린시트: 0, 선방: 0, 태클: 0 };
    var attack = s.포지션 === "공격수" ? 1 : s.포지션 === "미드필더" ? 0.45 : s.포지션 === "수비수" ? 0.12 : 0;
    var creator = s.포지션 === "미드필더" ? 1 : s.포지션 === "공격수" ? 0.65 : s.포지션 === "수비수" ? 0.35 : 0.04;
    L.득점 = Math.round(games * clamp((A.슈팅 - 25) / 95, 0, 0.85) * attack * (0.8 + rnd() * 0.4));
    L.도움 = Math.round(games * clamp((A.패스 - 25) / 130, 0, 0.6) * creator * (0.8 + rnd() * 0.4));
    L.클린시트 = Math.round(games * clamp((q - 25) / 160, 0.02, 0.5));
    if (s.포지션 === "골키퍼") L.선방 = Math.round(games * (2 + A.선방 / 45));
    else L.태클 = Math.round(games * (A.수비 / 55) * (s.포지션 === "수비수" ? 2 : s.포지션 === "미드필더" ? 1.4 : 0.6));
    // Career value measures performance in the player's role, never raw goal totals.
    L.가치 = Math.max(0, Math.round((q - cfg().시즌.기준선) * cfg().시즌.점수배율 * games / 30));
    return L;
  }
  // Each ordinary card represents one interval under the contract and roster
  // present when it began. Later demotion/transfer cannot rewrite that interval.
  E.captureSeason = function () {
    var s = S(); if (!I.YEARLY[s.시기]) return null;
    var out={}; ['시기','나이','팀','포지션','총턴','일군','부상','슬럼프','올해부상카드','능력치','플래그','계약'].forEach(function(k){out[k]=s[k];}); return I.clone(out);
  };
  E.accrueSeason = function (snapshot) {
    if (!snapshot) return;
    var s = S(), list = s.시즌구간 || (s.시즌구간 = []);
    if (list.some(function (x) { return x.턴 === snapshot.총턴; })) return;
    var fraction = 1 / (sdef(snapshot.시기).한해카드수 || 2);
    snapshot.부상 = Math.max(snapshot.부상, s.부상);
    list.push({ 턴: snapshot.총턴, 나이: snapshot.나이, 팀: snapshot.팀, 시기: snapshot.시기,
      주전: snapshot.시기 === "프로" ? snapshot.일군 : !!snapshot.플래그.해외주전,
      컨디션: snapshot.능력치.컨디션, 부상: snapshot.부상, 비율: fraction,
      급여: Math.round((snapshot.계약 ? snapshot.계약.연봉 : 0) * fraction * (list.length + 1)) - Math.round((snapshot.계약 ? snapshot.계약.연봉 : 0) * fraction * list.length), 기록: seasonLine(snapshot, fraction) });
  };
  function accumulatedLine() {
    var s = S(), list = s.시즌구간 || [];
    if (!list.length) return seasonLine(); // Explicit full-season simulation API.
    var played = list.filter(function (x) { return x.기록; });
    if (!played.length) return null;
    var L = I.clone(played[0].기록), numeric = ["출전", "출전시간", "득점", "도움", "클린시트", "선방", "태클", "가치"];
    numeric.forEach(function (k) { L[k] = played.reduce(function (n,x) { return n + x.기록[k]; }, 0); });
    L.경기력 = Math.round(played.reduce(function (n,x) { return n + x.기록.경기력 * x.기록.출전; }, 0) / (L.출전 || 1));
    L.팀 = Array.from(new Set(list.map(function (x) { return x.팀; }))).join(" → ");
    L.해외 = played.some(function (x) { return x.시기 === "해외리그"; });
    L.구간 = I.clone(list); return L;
  }
  function awards(L) {
    var s = S(), A = cfg().수상, P = A.점수, got = [];
    function give(n, pts) { got.push(n); I.addAward(n, L.연도); s.성적 += E.looksGain(pts || 0, "성적행복"); }
    if (L.출전 < 15) return got;
    if (!L.해외) {
      if (!s.플래그._신인왕체크) { s.플래그._신인왕체크 = true; if (L.경기력 >= A.신인왕) give("신인왕", P.신인왕); }
      if (L.경기력 >= A.MVP && rnd() < 0.5) give("MVP", P.MVP);
      if (L.경기력 >= A.베스트11 && rnd() < 0.7) give("베스트11", P.베스트11);
      if (L.득점 >= 20) give("득점왕", P.타이틀);
      if (L.도움 >= 12) give("도움왕", P.타이틀);
      if (s.포지션 === "수비수" && L.경기력 >= 78) give("올해의 수비수", P.타이틀);
      if (s.포지션 === "골키퍼" && L.클린시트 >= 12) give("골든글러브", P.타이틀);
    } else {
      if (L.경기력 >= 76 && rnd() < 0.6) give("해외리그 베스트11", P.올스타);
      if (L.경기력 >= 88 && rnd() < 0.4) give("해외리그 MVP", P.해외MVP);
      var roleAward = { 골키퍼: "올해의 골키퍼", 수비수: "올해의 수비수", 미드필더: "올해의 미드필더", 공격수: "올해의 공격수" }[s.포지션];
      if (L.경기력 >= 82 && rnd() < 0.5) give(roleAward, P.타이틀);
    }
    return got;
  }
  function fmtLine(L) {
    var text = [L.출전 + "경기", L.출전시간 + "분", L.득점 + "골", L.도움 + "도움"];
    if (L.포지션 === "골키퍼") text.push(L.선방 + "선방", L.클린시트 + "클린시트");
    else text.push(L.태클 + "태클", L.클린시트 + "클린시트");
    return text.join(" · ");
  }
  E.fmtLine = fmtLine;
  E.signContract = function (years) {
    var s = S(), M = cfg().돈.연봉, overseas = s.시기 === "해외리그";
    years = clamp(Math.round(years || 3), 1, 5);
    var pay = overseas ? M.해외기본 + Math.max(0, E.avg() - 60) * M.해외경기력당 : M.일군기본 + Math.max(0, E.avg() - 50) * M.경기력당;
    if (!overseas && s.플래그.육성선수) pay = M.이군;
    s.계약 = { 팀: s.팀, 시작나이: s.나이, 만료나이: s.나이 + years, 년수: years, 연봉: Math.round(pay) };
    delete s.플래그.계약만료;
    return s.계약;
  };
  // 연봉 (단위: 만원) — 한 해에 한 번만 받음
  function salary(L) {
    var s = S(), M = (cfg().돈 || {}).연봉 || {}, pay = 0;
    if (s._연봉연도 === s.나이) return s._연봉;
    if (s.시기 === "프로" || s.시기 === "해외리그") {
      if (!s.계약) E.signContract(3);
      pay = s.시즌구간 && s.시즌구간.length ? s.시즌구간.reduce(function (n,x) { return n + x.급여; }, 0) : s.계약.연봉;
    }
    pay = Math.round(pay); s.돈 = (s.돈 || 0) + pay; s.총수입 = (s.총수입 || 0) + pay;
    s._연봉연도 = s.나이; s._연봉 = pay; return pay;
  }
  E.money = function (n) {
    n = Math.round(n || 0); var sg = n < 0 ? "-" : ""; n = Math.abs(n);
    if (n >= 10000) return sg + (Math.round(n / 1000) / 10) + "억";
    return sg + n.toLocaleString("ko-KR") + "만원";
  };

  // ---------------- 상점 (data/shop.js) ----------------
  E.shopList = function () {
    var s = S();
    return (GD.상점 || []).map(function (it) {
      var last = (s.구매 || {})[it.이름];
      var wait = last == null ? 0 : Math.max(0, (it.간격 == null ? 4 : it.간격) - (s.총턴 - last));
      var stageOk = !it.시기 || I.arr(it.시기).indexOf(s.시기) >= 0;
      var sold = !!it.한번만 && last != null, cond = stageOk && E.check(it.조건);
      return { item: it, wait: wait, sold: sold, cond: cond, stageOk: stageOk, ok: cond && !sold && !wait && (s.돈 || 0) >= it.가격 };
    });
  };
  E.buy = function (name) {
    var s = S(), e = E.shopList().find(function (x) { return x.item.이름 === name; });
    if (!e || !e.ok) return null;
    s.돈 -= e.item.가격; s.구매[name] = s.총턴;
    var fx = Object.assign({}, e.item.효과 || {}), lim = (cfg().상점 || {}).애정도한계;
    if (lim != null && fx.애정도 > lim) fx.애정도 = lim;          // 아이템으로 오르는 애정도는 한계까지만
    var out = {}; E.applyEffects(fx, out);
    if (lim != null && out.애정도 > lim && s.히로인) { s.히로인.애정도 -= out.애정도 - lim; out.애정도 = lim; }   // 외모 보너스가 있어도 한계까지만
    if (fx.만남확률) { s.만남버프 = { 값: fx.만남확률 / 100, 남은: e.item.지속 || (cfg().상점 || {}).버프지속 || 10 }; out.만남확률 = fx.만남확률; }
    if (e.item.기록) s.순간.push({ 나이: s.나이, 글: E.tpl(e.item.기록) });
    if (s.단계 === "카드" && s.현재카드 && s.현재카드.자유행동 && s.자유시간) s.현재카드 = E.freeTimeCard();
    E.refreshOptions(); E.save();
    return { 결과: E.tpl(e.item.결과 || ""), 효과: out };
  };

  E.endYear = function () {
    var s = S();
    if (s._결산나이 === s.나이) return;
    s._결산나이 = s.나이;
    E.evaluateGoal();
    var L = accumulatedLine();
    if (L) {
      if (s.시즌목표) L.목표 = I.clone(s.시즌목표);
      s.기록.push(L); s.성적 += E.looksGain(L.가치, "성적행복");
      var got = awards(L);
      var lines = [L.팀 + " · " + (L.해외 ? "해외리그" : "1군"), fmtLine(L), "💰 연봉 " + E.money(salary(L))];
      if (got.length) lines.push("🏅 " + got.join(", "));
      s.대기열.unshift({ 시스템: true, 제목: L.연도 + " 시즌 결산", 내용: lines.join("\n"), 그림: got.length ? "hero_victory" : null,
        선택지: [{ 글: "다음 시즌으로" }] });
    }
    if (!L) {
      var reservePay = salary(null);
      if (s.시기 === "프로" || s.시기 === "해외리그") s.대기열.unshift({ 시스템: true, 제목: year() + " 리저브 시즌 결산", 내용: s.팀 + " · 리저브에서 성장한 시즌\n1군 공식 기록은 없습니다.\n💰 계약 연봉 " + E.money(reservePay), 선택지: [{ 글: "다음 시즌 준비" }] });
    }
    if (s.시기 === "프로" || (s.시즌구간 || []).some(function(x) { return x.시기 === "프로"; })) s.연차++;
    s.나이++;
    if (s.계약 && s.나이 >= s.계약.만료나이) {
      s.플래그.계약만료 = true;
      if (s.시기 === "해외리그") s.대기열.push({ 시스템: true, 계약갱신: true, 제목: "계약 갱신 협상", 내용: "계약 기간이 끝났습니다. 새 계약을 맺거나 다른 구단과 협상할 수 있습니다.", 선택지: [
        { 글: "현 소속팀과 3년 재계약", 계약년수: 3 },
        { 글: "자유계약으로 새 팀 선택", 팀이동: true, 계약년수: 2 }
      ] });
    }
    s.올해카드 = 0; s.올해부상카드 = 0; s.시즌구간 = [];
  };

  // ---------------- 통산 기록과 엔딩 ----------------
  E.totals = function () {
    var s = S(), T = { 시즌: s.기록.length, 해외시즌: 0, 출전: 0, 출전시간: 0, 득점: 0, 도움: 0, 클린시트: 0, 선방: 0, 태클: 0 };
    s.기록.forEach(function (L) {
      if (L.해외) T.해외시즌++;
      ["출전", "출전시간", "득점", "도움", "클린시트", "선방", "태클"].forEach(function (k) { T[k] += L[k] || 0; });
    });
    return T;
  };

  E.computeEnding = function () {
    var s = S(), C = cfg().엔딩기준;
    var ph = s.성적 >= C.성적높음, hh = s.행복도 >= C.행복도높음;
    var base = GD.기본엔딩.find(function (e) { return e.조건 && E.check(e.조건); }) ||
      GD.기본엔딩.find(function (e) { return !e.조건 && (e.성적 === "높음") === ph && (e.행복도 === "높음") === hh; }) || GD.기본엔딩[0];
    var titles = GD.직업엔딩.filter(function (e) { return e.종류 === "칭호" && E.check(e.조건); });
    var job = GD.직업엔딩.find(function (e) { return e.종류 !== "칭호" && E.check(e.조건); });
    var heroines = s.지난히로인.slice();
    (s.알아가는인연 || []).forEach(function (person) { heroines.push({ 아이디: person.아이디, 이름: E.heroDef(person.아이디).이름, 관계: "만남", 결말: "알아가던 인연" }); });
    if (s.히로인) { var h = E.heroDef(); heroines.push({ 아이디: h.아이디, 이름: h.이름, 관계: s.히로인.관계, 결말: s.히로인.관계 === "배우자" ? "평생의 반려자" : "함께" }); }
    if (s.히로인2) { var h2 = E.heroDef(s.히로인2.아이디); heroines.push({ 아이디: h2.아이디, 이름: h2.이름, 관계: "연인", 결말: "끝까지 비밀이었던 연인" }); }
    var specials = (GD.특별엔딩 || []).filter(function (e) { return E.check(e.조건); });
    var he = null;
    if (s.히로인 && s.히로인.관계 === "배우자") {
      var hd = E.heroDef();
      if (hd.엔딩) he = { 아이디: hd.아이디, 히로인: hd.이름, 이름: hd.엔딩.이름, 아이콘: hd.엔딩.아이콘 || "💍", 내용: hd.엔딩.내용 };
    }
    return { 특별: specials[0] || null, 함께이룬것들: specials.slice(1), 히로인엔딩: he, 기본: base, 칭호: titles, 직업: job, 히로인들: heroines, 성적: s.성적, 행복도: s.행복도 };
  };

  // ---------------- 저장 ----------------
  E.save = function () { try { localStorage.setItem(I.SAVE_KEY, JSON.stringify(S())); } catch (e) {} };
  E.load = function () {
    try {
      var raw = localStorage.getItem(I.SAVE_KEY); if (!raw) return null;
      var s = JSON.parse(raw); if (!s || s.버전 !== 2 || s.게임 !== "football-life") return null;
      // 이전 버전 저장 파일에 없는 항목 채우기
      s.돈 = s.돈 || 0; s.총수입 = s.총수입 || 0; s.구매 = s.구매 || {}; s.본뉴스 = s.본뉴스 || {};
      s.알아가는인연 = s.알아가는인연 || [];
      if (!s.외모) s.외모 = 1 + Math.floor(Math.random() * 10);
      if (s.히로인 && s.히로인.관계 === "만남") {
        if (s.히로인.만남턴 == null) s.히로인.만남턴 = s.총턴;
        if (s.히로인.교류횟수 == null) s.히로인.교류횟수 = 0;
      }
      I.buildCards(); I.S = s;
      E.initFreeTime();
      // 이전 저장의 고백·커플 카드나 즉시 교제 선택지를 그대로 실행하지 않도록 갱신합니다.
      if (s.단계 === "카드" && s.현재카드 && s.현재카드.자유행동 && s.자유시간) { s.현재카드 = E.freeTimeCard(); E.refreshOptions(); }
      if (s.단계 === "카드" && s.현재카드 && !s.현재카드.자유행동 && (s.현재카드._끼어들기 || (s.히로인 && s.히로인.관계 === "만남" && s.현재카드.히로인))) {
        var current = I.CARDS().find(function (c) { return c._id === s.현재카드._id; });
        if (current && I.eligible(current)) { s.현재카드 = I.clone(current); E.refreshOptions(); }
        else E.next();
      }
      // Permanent IDs keep an in-progress ordinary card attached to its current
      // source definition when copy edits or source ordering change.
      if (s.단계 === "카드" && s.현재카드 && !s.현재카드.시스템 && !s.현재카드.자유행동) {
        var registered = I.CARDS().find(function (c) { return c._id === s.현재카드._id; });
        if (registered) { s.현재카드 = I.clone(registered); E.refreshOptions(); }
      }
      return s;
    } catch (e) { return null; }
  };
  // ---------------- 도감 (인생이 바뀌어도 남는 기록) ----------------
  var COL_KEY = "football-life-collection-v2";
  E.collection = function () {
    var c = null; try { c = JSON.parse(localStorage.getItem(COL_KEY)); } catch (e) {}
    c = c || {}; c.엔딩 = c.엔딩 || {}; c.업적 = c.업적 || {}; c.레어 = c.레어 || {}; c.인생수 = c.인생수 || 0;
    return c;
  };
  function saveCol(c) { try { localStorage.setItem(COL_KEY, JSON.stringify(c)); return true; } catch (e) { E.saveStatus.error = "도감 저장 실패: " + e.message; return false; } }
  function addTo(c, group, key, fresh, label) {
    if (!c[group][key]) { c[group][key] = { 처음: Date.now(), 횟수: 0 }; if (fresh) fresh.push(label || key); }
    c[group][key].횟수++;
  }
  E.colCounts = function (c) {
    var k = Object.keys(c.엔딩);
    return { 인생수: c.인생수, 엔딩수: k.filter(function (x) { return x.indexOf("특별:") === 0; }).length,
      히로인엔딩: k.filter(function (x) { return x.indexOf("히로인:") === 0; }).length, 레어: Object.keys(c.레어).length, 업적: Object.keys(c.업적).length };
  };
  E.noteRare = function (title) { var c = E.collection(); addTo(c, "레어", title); saveCol(c); };
  // 엔딩을 볼 때 한 번: 엔딩·업적을 도감에 기록하고 새로 발견한 이름들을 돌려줌
  E.recordLife = function () {
    var s = S(); if (s._도감) return s._도감새로 || [];
    var en = s.엔딩 || E.computeEnding(), c = E.collection(), fresh = [];
    s.인생ID = s.인생ID || ('legacy-' + Date.now().toString(36));
    c.기록인생 = c.기록인생 || {};
    if(c.기록인생[s.인생ID]) { s._도감=true; E.save(); return s._도감새로 || []; }
    c.기록인생[s.인생ID] = true;
    c.인생수++;
    [en.특별].concat(en.함께이룬것들 || []).filter(Boolean).forEach(function (e) { addTo(c, "엔딩", "특별:" + e.이름, fresh, e.아이콘 + " " + e.이름); });
    addTo(c, "엔딩", "기본:" + en.기본.이름, fresh, en.기본.아이콘 + " " + en.기본.이름);
    if (en.직업 && s.진로확정) addTo(c, "엔딩", "직업:" + en.직업.이름, fresh, en.직업.아이콘 + " " + en.직업.이름);
    en.칭호.forEach(function (t) { addTo(c, "엔딩", "칭호:" + t.이름, fresh, t.아이콘 + " " + t.이름); });
    if (en.히로인엔딩) addTo(c, "엔딩", "히로인:" + en.히로인엔딩.아이디, fresh, en.히로인엔딩.아이콘 + " " + en.히로인엔딩.이름);
    var n = E.colCounts(c);
    (GD.업적 || []).forEach(function (a) {
      var ok = E.check(a.조건) && Object.keys(a.도감 || {}).every(function (k) { return (n[k] || 0) >= a.도감[k]; });
      if (ok) addTo(c, "업적", a.이름, fresh, "🏆 " + a.이름);
    });
    if (!saveCol(c)) return []; s._도감 = true; s._도감새로 = fresh; E.save();
    return fresh;
  };

  // 엔딩에서 한 번만 진로 확정. 인생 수나 기존 엔딩의 획득 횟수는 다시 올리지 않습니다.
  E.chooseCareer = function (id) {
    var s = S(); if (!s || s.단계 !== "엔딩" || s.진로확정) return false;
    var career = GD.진로.find(function (c) { return c.아이디 === id; });
    if (!career) return false;
    E.recordLife();
    Object.keys(s.플래그).forEach(function (key) { if (key.indexOf("진로_") === 0) delete s.플래그[key]; });
    s.플래그[career.플래그] = true; s.진로확정 = id;
    var ending = E.computeEnding();
    if (s.엔딩) s.엔딩.직업 = ending.직업; else s.엔딩 = ending;
    var collection = E.collection(), fresh = [];
    addTo(collection, "엔딩", "직업:" + ending.직업.이름, fresh, ending.직업.아이콘 + " " + ending.직업.이름);
    saveCol(collection); s._도감새로 = (s._도감새로 || []).concat(fresh); E.save();
    return true;
  };

  E.reset = function () { try { localStorage.removeItem(I.SAVE_KEY); } catch (e) {} I.S = null; };
})();
