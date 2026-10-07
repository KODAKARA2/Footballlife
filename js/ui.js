// 화면 그리기 (시작 화면, 인생 카드, 이벤트 카드, 애니메이션)
(function () {
  var U = window.U = {};
  var $ = function (s) { return document.querySelector(s); };
  var I = E._internal;
  var EMOJI = { rival: "🔥", parents: "👪", coach_little: "🧢", coach_high: "📣", buddy: "🤝", manager_pro: "📋",
    agent: "💼", child: "👶", interpreter: "🗣️", mlb_teammate: "🤜" };
  var ICON = { 공: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff" stroke="#263238"/><path d="M12 6L18 10L16 16H8L6 10Z M3 7L6 10L4 17 M21 7L18 10L20 17 M8 16L7 21 M16 16L17 21" stroke="#263238" fill="#263238"/></svg>' };
  U.icon = function () { return ICON[E.pos().아이콘] || ICON.공; };

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function br(t) { return esc(t).replace(/\n/g, "<br>"); }
  U.esc = esc; U.br = br;

  // 그림: 파일이 없으면 다음 후보 → 모두 없으면 기본 카드 디자인
  // 주인공 그림은 외모 레벨에 맞는 그림을 먼저 찾음: 미남(기본) / 평범 _plain / 추남 _ugly. 없으면 기본 그림
  U.looksSuffix = function () {
    var L = GD.설정.외모 || {}, v = (E.state() || {}).외모 || 5;
    return v >= (L.미남 || 8) ? "" : v <= (L.추남 || 3) ? "_ugly" : "_plain";
  };
  U.heroArt = function (keys) {
    var sx = U.looksSuffix(), out = [];
    I.arr(keys).forEach(function (k) {
      // 골키퍼는 나이·외모에 맞는 전용 장갑/유니폼 그림을 사용합니다.
      if ((E.state() || {}).포지션 === "골키퍼" && /^hero_(elementary|middle|high|college|pro|mlb)$/.test(k)) {
        if (sx) out.push(k + "_gk" + sx);
        out.push(k + "_gk");
      }
      if (sx && /^hero_/.test(k)) out.push(k + sx);
      out.push(k);
    });
    return out;
  };
  U.art = function (keys, fallbackIcon, overlay, cls, bg) {
    keys = U.heroArt(I.arr(keys).filter(Boolean));
    var st = bg ? ' style="background-image:url(images/' + esc(bg) + (/\.\w+$/.test(bg) ? "" : ".png") + '),linear-gradient(160deg,#2c5d8f,#173556)"' : "";
    return '<div class="art ' + (cls || "") + (bg ? " has-bg" : "") + '"' + st + '><div class="art-fallback">' + (fallbackIcon || "⚽") + '</div>' +
      (keys.length ? '<img alt="" data-keys="' + esc(keys.join(",")) + '" src="images/' + esc(keys[0]) + '.png" onload="U.imgLoad(this)" onerror="U.imgFail(this)">' : "") +
      (overlay ? '<div class="overlay">' + overlay + "</div>" : "") + "</div>";
  };
  // 인물은 고해상도로 저장한 작은 픽셀 그림도 선명하게 표시합니다.
  U.imgLoad = function (img) { img.classList.add("px"); };
  U.imgFail = function (img) {
    var keys = img.dataset.keys.split(","), i = keys.indexOf(img.getAttribute("src").replace(/^images\/|\.png$/g, ""));
    if (i >= 0 && i + 1 < keys.length) img.src = "images/" + keys[i + 1] + ".png"; else img.remove();
  };

  // 카드 배경: 내용의 낱말을 보고 장소를 고름 (카드에 배경: "경기장"|"거리"|"실내"|"교실"|"학교"|"집"|"방"|"사무실"|"행사장" 으로 직접 정할 수도 있음)
  var BG = { 경기장: "bg_stadium", 거리: "bg_street", 실내: "bg_indoor", 교실: "bg_classroom.jpg", 학교: "bg_school.jpg",
    집: "bg_home.jpg", 방: "bg_room.jpg", 사무실: "bg_office.jpg", 행사장: "bg_hall.jpg" };
  var SCHOOL = ["초등학교", "중학교", "고등학교", "대학", "입단심사", "대학입단"];
  // 위에 있는 장소일수록 낱말 수가 같을 때 먼저 골라짐
  var BG_RULES = [
    ["경기장", /경기|슈팅|패스|결승|대회|시즌|구장|선방|득점|태클|클린시트|공격수|연장전|훈련장|올스타|캠프|훈련|연습|입단심사|콜업|데뷔|국가대표|대표팀|전광판|관중|벤치|그라운드|돌파|승부|수비|우천|리저브|해외 1부|리그/g],
    ["행사장", /기자회견|시상식|입단식|은퇴식|졸업식|행사|축하연|팬미팅|사인회|발표회|무대/g],
    ["사무실", /사무실|협상|계약서|계약|단장실|에이전트|프런트|구단주|트레이드/g],
    ["실내", /병원|재활|인터뷰|라커룸|식당|카페|면회|영화관|노래방|PC방|모텔|호텔|센터|훈련소|기숙사|클럽하우스|숙소|수술|레스토랑|옥상/g],
    ["교실", /교실|수업|시험|숙제|반장|칠판|성적표|자습|담임|학급|공부|노트|책상/g],
    ["학교", /교문|운동장|축제|복도|하굣길|등굣길|급식|방과 후|점심시간|학교 앞|매점/g],
    ["집", /집에|집으로|우리 집|거실|부엌|식탁|부모님|엄마|아빠|아내|명절|가족|밥상|신혼집|소파/g],
    ["방", /내 방|방에|방 안|침대|새벽|밤새|일기|이불|잠이|잠을|문자/g],
    ["거리", /거리|공원|한강|골목|놀이공원|여행|바다|데이트|공항|포장마차|버스|산책|소나기|우산|가게|마트|동네|놀이터|해변|바닷가|영화관 앞|대문|집 앞/g]
  ];
  U.bgOf = function (card) {
    if (!card) return null;
    if (card.배경) return BG[card.배경] || card.배경;
    var t = (card.제목 || "") + " " + (card.내용 || ""), best = null, bs = 0;
    BG_RULES.forEach(function (r) { var m = t.match(r[1]), n = m ? m.length : 0; if (n > bs) { bs = n; best = r[0]; } });
    var school = SCHOOL.indexOf((E.state() || {}).시기) >= 0;
    if ((best === "교실" || best === "학교") && !school) best = best === "교실" ? "실내" : "거리";
    return BG[best || (card.히로인 || card._만남 || card._끼어들기 ? (school ? "학교" : "거리") : "경기장")];
  };

  // 외모 레벨 표시: "외모 9 미남"
  U.looksTag = function () {
    var s = E.state(), L = GD.설정.외모 || {}, v = s.외모 || 5;
    return "외모 <b>" + v + "</b>" + (v >= (L.미남 || 8) ? ' <em class="look hand">미남</em>' : v <= (L.추남 || 3) ? ' <em class="look ugly">추남</em>' : "");
  };
  U.BONUS_KEY = "football-life-bonus-looks-v2";

  U.heroKeys = function () {
    var s = E.state(), base = s.단계 === "엔딩" ? "hero_retired" : (I.sdef(s.시기).그림 || "hero_pro");
    if (s.부상 > 0) return ["hero_injured", base];
    if (s.슬럼프 > 0) return ["hero_slump", base];
    return [base];
  };
  U.heroineKeys = function (id, rel) { var h = E.heroDef(id); return h ? [h.그림[rel] || h.그림.만남, h.그림.만남] : []; };

  // ---------------- 시작 화면 ----------------
  U.showSetup = function () {
    Feedback.clearAll(); busy = false;
    var sel = { pos: null, spec: null };
    $("#app").className = "is-setup";
    $("#app").innerHTML =
      '<section class="setup"><div class="setup-intro"><span class="eyebrow">FOOTBALL LIFE · 나만의 축구 이야기</span><h1>축구는 기록으로,<br>인생은 <em>선택으로.</em></h1>' +
      '<p class="sub">첫 축구화부터 마지막 은퇴 경기까지.<br>어떤 선수가 되고, 누구와 함께할까요?</p>' +
      '<div class="journey-art" aria-hidden="true"><div><img src="images/hero_elementary.png" alt=""><span>첫 킥</span></div><div><img src="images/hero_high.png" alt=""><span>커지는 꿈</span></div><div><img src="images/hero_pro.png" alt=""><span>나만의 전성기</span></div></div>' +
      '<div class="setup-links"><button onclick="Feedback.settings()">소리·움직임 설정</button><button onclick="U.openPractice()">⚽ 미니게임 연습장 <span>먼저 체험하기 →</span></button><button onclick="U.openCollection()">📖 엔딩 도감 <span>모아 온 이야기 →</span></button></div>' +
      '<p class="intro-note">잘하는 축구와 행복한 인생 사이, 정답은 하나가 아닙니다.</p></div>' +
      '<div class="setup-form"><span class="eyebrow">NEW PLAYER</span><h2>나의 선수 만들기</h2><p class="form-note">이름, 포지션, 특기를 고르면 이야기가 시작됩니다.</p>' +
      '<label>주인공 이름<input id="nm" maxlength="8" placeholder="예: 강민준" autocomplete="off"></label>' +
      '<h3>포지션</h3><div class="grid" id="pos"></div><h3>특기</h3><div class="grid" id="spec"><p class="hint">포지션을 먼저 고르세요</p></div>' +
      '<button class="big" id="go" disabled>나의 축구 인생 시작 →</button><p class="form-note save-note">한 장씩 선택하며 진행 · 자동 저장</p></div></section>';
    // 엔딩에서 고른 새 인생 보너스 ({외모: 10} / {외모: 1} / {랜덤보너스: true} / {이어하기: {아버지, 외모, 돈, 세대}})
    var bonus = null;
    try { var raw = localStorage.getItem(U.BONUS_KEY); if (raw) { bonus = JSON.parse(raw); if (typeof bonus === "number") bonus = { 외모: bonus }; } } catch (e) { bonus = null; }
    var heir = bonus && bonus.이어하기;
    if (bonus) $(".setup .sub").insertAdjacentHTML("afterend", '<p class="bonus">' + (heir ? "👶 " + esc(heir.아버지) + "의 아이로 태어났습니다! (" + ((heir.세대 || 1) + 1) + "대째)<br><small>아빠의 재능과 인기를 물려받고, 프로에 입단하면 유산을 받을 수 있어요. 아빠의 라이벌 집안과의 승부도 이어집니다.</small>"
      : bonus.외모 ? (bonus.외모 >= 10 ? "✨" : "😅") + " 이번 인생은 외모 레벨 " + bonus.외모 + "에서 시작합니다"
      : "🎁 이번 인생은 랜덤 보너스! 특기 말고도 능력치 하나가 특기만큼 빠르게 자랍니다") + "</p>");
    if (heir) $("#nm").value = String(heir.아버지 || "").charAt(0);
    $("#pos").innerHTML = GD.포지션.map(function (p, i) { return p.시작선택 === false ? "" : '<button class="chip" aria-pressed="false" data-i="' + i + '">' + esc(p.이름) + "</button>"; }).join("");
    function ok() { $("#go").disabled = !(sel.pos && sel.spec && $("#nm").value.trim()); }
    $("#pos").onclick = function (e) {
      var b = e.target.closest("button"); if (!b) return;
      sel.pos = GD.포지션[b.dataset.i]; sel.spec = null;
      [].forEach.call($("#pos").children, function (c) { c.classList.toggle("on", c === b); c.setAttribute("aria-pressed", c === b); });
      var list = GD.특기.filter(function (t) { return t.분류 === sel.pos.분류 && (!sel.pos.비중 || sel.pos.비중[t.능력치] > 0); });
      $("#spec").innerHTML = list.map(function (t) { return '<button class="chip" aria-pressed="false" data-n="' + esc(t.이름) + '"><b>' + esc(t.이름) + "</b><small>" + esc(t.설명) + "</small></button>"; }).join("");
      ok();
    };
    $("#spec").onclick = function (e) {
      var b = e.target.closest("button"); if (!b) return;
      sel.spec = b.dataset.n; [].forEach.call($("#spec").children, function (c) { c.classList.toggle("on", c === b); c.setAttribute("aria-pressed", c === b); }); ok();
    };
    $("#nm").oninput = ok;
    $("#go").onclick = function () {
      E.newGame($("#nm").value.trim(), sel.pos.이름, sel.spec, bonus);
      try { localStorage.removeItem(U.BONUS_KEY); } catch (e) {}
      U.showGame();
    };
  };

  // ---------------- 게임 화면 ----------------
  U.showGame = function () {
    Feedback.clearAll(); busy = false;
    $("#app").className = "is-game";
    $("#app").innerHTML = '<header class="top" id="top"></header><section class="life" id="life"></section>' +
      '<aside class="chapter" id="chapter"></aside><div class="story-column"><section class="table" id="table"></section><nav class="actions" id="actions" aria-label="이야기의 선택지"></nav></div>';
    U.renderAll(true);
    window.scrollTo(0, 0);
  };
  U.renderAll = function (deal) {
    var s = E.state();
    if (s.단계 === "엔딩") return U.showEnding();
    U.renderTop(); U.renderLife(); U.renderCard(deal);
  };

  U.renderTop = function () {
    var s = E.state(), sd = I.sdef(s.시기), yr = GD.설정.시작연도 + s.나이 - 10;
    $("#top").innerHTML = '<div class="stage">' + (sd.아이콘 || "⚽") + " <b>" + esc(s.시기) + "</b> · " + s.나이 + "세 · " + yr + "년" +
      (s.팀 && (s.시기 === "프로" || s.시기 === "해외리그" || s.시기 === "군복무") ? '<small>' + esc(s.팀) + (s.시기 === "프로" ? (s.일군 ? " · 1군 선수단" : " · 리저브") : s.플래그.리저브 ? " · 리저브" : "") + "</small>" : "") +
      '</div><button class="menu" onclick="U.openMenu()" aria-label="메뉴">☰</button>';
    var guide = (GD.설정.시기안내 || {})[s.시기] || "기록과 마음을 함께 돌보세요.";
    var count = sd.카드수 ? "여정 " + Math.min(s.시기턴 + 1, sd.카드수) + " / " + sd.카드수 : "시즌마다 새로운 선택";
    $("#chapter").innerHTML = '<div><span class="eyebrow">' + esc(count) + '</span><p>' + esc(guide) + '</p></div><button onclick="U.openPractice()" aria-label="미니게임 연습장 열기">⚽ 연습장</button>';
  };

  function bar(v, cls) { return '<span class="bar ' + (cls || "") + '"><i style="width:' + Math.max(0, Math.min(100, v)) + '%"></i></span>'; }
  U.bar = bar;

  U.renderLife = function (animateHeroine) {
    var s = E.state(), p = E.pos();
    var stats = E.posStats().map(function (k) { return "<span>" + k + (k === s.보조특기 ? "🎁" : "") + " <b>" + s.능력치[k] + "</b></span>"; }).join("");
    var status = (s.부상 > 0 ? '<em class="bad">부상</em>' : "") + (s.슬럼프 > 0 ? '<em class="warn">슬럼프</em>' : "");
    var hero = '<button class="mini hero-mini" onclick="U.openHero()" aria-label="내 선수 능력치 보기">' +
      U.art(U.heroKeys(), '<span class="posicon">' + U.icon() + "</span>",
        "<b>" + esc(s.이름) + '</b><small><span class="pi">' + U.icon() + "</span>" + esc(p.약칭) + "</small>", "card-art") + "</button>";
    var mid = '<div class="lifestats">' + '<div class="row">' + stats + "</div>" +
      '<div class="row common"><span>' + U.looksTag() + '</span><span>멘탈 <b>' + s.능력치.멘탈 + "</b></span><span>인기 <b>" + s.능력치.인기 + "</b></span><span>컨디션 <b>" + s.능력치.컨디션 + "</b></span>" +
      (s.시기 === "해외리그" ? "<span>적응 <b>" + s.능력치.적응 + "</b></span>" : "") + "</div>" +
      '<div class="row"><span>행복 <b>' + s.행복도 + '</b>' + bar(s.행복도, "happy") + "</span><span>성적 <b>" + s.성적 + "</b></span>" + status + "</div>" +
      '<div class="row"><button class="money" onclick="U.openShop()">💰 ' + E.money(s.돈) + ' · 상점</button></div></div>';
    var her = "";
    if (s.히로인) {
      var h = E.heroDef(), rel = s.히로인.관계;
      her = '<button class="mini heroine-mini ' + (animateHeroine ? "attach" : "") + '" onclick="U.openHeroine()" aria-label="인연과 애정도 보기">' +
        U.art(U.heroineKeys(h.아이디, rel), "💗", "<b>" + esc(h.이름) + "</b><small>" + esc(rel === "만남" ? "알아가는 중" : rel) + "</small>", "card-art") +
        '<div class="aff">' + (rel === "만남" ? "호감 " : "❤ ") + s.히로인.애정도 + bar(s.히로인.애정도, "love") + "</div>" +
        ((s.알아가는인연 || []).length ? '<div class="aff2">🌱 알아가는 인연 ' + E.acquaintances().length + '명</div>' : '') +
        (s.히로인2 ? '<div class="aff2">🤫 ' + esc(E.heroDef(s.히로인2.아이디).이름) + " ❤" + s.히로인2.애정도 + "</div>" : "") + "</button>";
    } else her = '<button class="mini empty" onclick="U.openHeroine()" aria-label="인연 안내 보기"><span>💗</span><small>아직 쓰지 않은<br>인연의 이야기</small></button>';
    $("#life").innerHTML = hero + mid + her;
  };

  U.cardArtKeys = function (card) {
    var s = E.state();
    if (card._끼어들기) { var hi = E.heroDef(card._끼어들기); return { keys: U.heroineKeys(hi.아이디, "만남"), icon: "💗", label: "<b>" + esc(hi.이름) + "</b><small>끼어든 인연</small>" }; }
    if (card.히로인 === "양다리" && s.히로인2) { var hs = E.heroDef(s.히로인2.아이디); return { keys: U.heroineKeys(hs.아이디, "연인"), icon: "🤫", label: "<b>" + esc(hs.이름) + "</b><small>비밀 연인 · ❤ " + s.히로인2.애정도 + "</small>" }; }
    if (card._만남) return { keys: U.heroineKeys(card._만남, "만남"), icon: "💗", label: "<b>" + esc(E.heroDef(card._만남).이름) + "</b><small>첫 만남</small>" };
    if (card.히로인 && s.히로인) { var h = E.heroDef(); return { keys: U.heroineKeys(h.아이디, s.히로인.관계), icon: "💗", label: "<b>" + esc(h.이름) + "</b><small>" + (s.히로인.관계 === "만남" ? "알아가는 중 · 호감 " : esc(s.히로인.관계) + " · ❤ ") + s.히로인.애정도 + "</small>" }; }
    var g = card.그림;
    if (g && GD.조연[g]) return { keys: [g], icon: EMOJI[g] || "👤", label: "<b>" + esc(GD.조연[g].이름) + "</b><small>" + esc(GD.조연[g].역할) + "</small>" };
    if (g && /^hero/.test(g)) return { keys: [g].concat(U.heroKeys()), icon: U.icon(), label: "<b>" + esc(s.이름) + "</b>" };
    return null;
  };

  U.renderCard = function (deal) {
    var s = E.state(), c = s.현재카드, sd = I.sdef(s.시기);
    if (!c) return;
    var a = U.cardArtKeys(c), r = s.결과;
    var front = '<div class="face front' + (c.레어 ? " rare" : "") + '">' +
      (a ? U.art(a.keys, a.icon, a.label, "banner", U.bgOf(c)) : U.art([], sd.아이콘 || "⚽", null, "banner plain", U.bgOf(c))) +
      '<div class="txt"><div class="tag">' + (c.레어 ? '<span class="rare-tag">✨ 레어 카드</span> ' : "") + esc(c.자유행동 ? "자유행동" : c.시스템 ? "시즌" : s.시기) + (c.히로인 || c._만남 ? " · 💗" : "") + "</div><h2>" + esc(E.tpl(c.제목)) + "</h2><p>" + br(E.tpl(c.내용)) + "</p></div></div>";
    var back = '<div class="face back">' + (r ? U.resultHTML(r) : "") + "</div>";
    $("#table").innerHTML = '<div class="card3d ' + (r ? "flipped " : "") + (deal ? "deal" : "") + '" id="card">' + front + back + "</div>";
    $("#card .front").inert = !!r; $("#card .back").inert = !r;
    U.renderActions();
  };

  U.chips = function (eff) {
    return Object.keys(eff || {}).filter(function (k) { return eff[k]; }).map(function (k) {
      var v = eff[k];
      if (k === "돈") return '<span class="fx money">💰 ' + (v > 0 ? "+" : "") + E.money(v) + "</span>";
      if (k === "부상감소" || k === "슬럼프감소") return '<span class="fx up">' + k.replace("감소", "") + " 기간 -" + v + "%</span>";
      if (k === "만남확률") return '<span class="fx up">💗 만남 확률 보너스 +' + v + "%p</span>";
      if (k === "부상" || k === "슬럼프") return '<span class="fx bad">' + k + (v > 0 ? " " + v + "장" : " 회복") + "</span>";
      var label = k === "애정도" && E.state().히로인 && E.state().히로인.관계 === "만남" ? "호감" : k;
      return '<span class="fx ' + (v > 0 ? "up" : "down") + '">' + label + " " + (v > 0 ? "+" : "") + v + "</span>";
    }).join("");
  };

  U.resultHTML = function (r) {
    var chips = U.chips(r.효과);
    var pic = r.결혼그림 ? U.art(r.결혼그림.키, "💍", "<b>" + esc(r.결혼그림.이름) + "</b><small>결혼식</small>", "banner", "bg_hall.jpg")
      : r.만남그림 ? U.art(r.만남그림.키, "💗", "<b>" + esc(r.만남그림.이름) + "</b><small>새로운 인연</small>", "banner", "bg_street.png")
      : r.그림 ? U.art([r.그림].concat(U.heroKeys()), U.icon(), "<b>" + esc(E.state().이름) + "</b>", "banner small", U.bgOf(E.state().현재카드)) : "";
    var g = r.미니게임, mg = g ? '<div class="tag">' + (g.표시 ? esc(g.표시) : "⏱ " + g.타이밍.toFixed(2) + "초" + (g.목표 != null ? " (목표 " + g.목표.toFixed(1) + "초)" : "")) +
      " · 성공 확률 " + Math.round(g.확률 * 100) + "%</div> " : "";
    return pic + '<div class="txt">' + mg + (r.성공 === true ? '<div class="tag ok">성공!</div>' : r.성공 === false ? '<div class="tag ng">실패…</div>' : "") +
      "<p>" + br(r.결과 || "…") + '</p><div class="fxs">' + chips + "</div>" +
      (r.알림 || []).map(function (n) { return '<div class="note">' + esc(n) + "</div>"; }).join("") +
      (r.뉴스 ? '<div class="news"><b>📰 축구 소식</b>' + esc(r.뉴스) + "</div>" : "") + "</div>";
  };

  U.renderActions = function () {
    var s = E.state(), c = s.현재카드;
    if (s.단계 === "결과") { $("#actions").innerHTML = '<button class="big next" onclick="U.next()">다음 카드 ▶</button>'; return; }
    $("#actions").innerHTML = '<div class="choice-heading">이번에는 어떤 선택을 할까요?</div>' + s.현재옵션.map(function (oi, i) {
      var o = c.선택지[oi];
      var hints = [];
      if (o.미니게임 && o.확률결과) hints.push("승부의 순간");
      else if (o.확률결과) hints.push("결과가 달라질 수 있어요");
      if (o.관계 === "이별") hints.push("신뢰를 잃을 수 있어요");
      if (o.효과 && typeof o.효과.행복도 === "number" && o.효과.행복도 <= -15) hints.push("행복을 크게 소모");
      return '<button class="opt" onclick="U.choose(' + i + ')"><span class="option-no" aria-hidden="true">' + String(i + 1).padStart(2, "0") + '</span><span class="option-body">' + esc(E.tpl(o.글)) + (o.비용 ? ' <small class="cost">💰 ' + E.money(o.비용) + "</small>" : "") +
        (o.비용비율 ? ' <small class="cost">💰 가진 돈의 ' + o.비용비율 + "% (" + E.money(Math.floor((E.state().돈 || 0) * o.비용비율 / 100)) + ")</small>" : "") +
        (hints.length ? '<small class="choice-hint">' + hints.join(" · ") + '</small>' : '') + '</span><span class="option-arrow" aria-hidden="true">↗</span></button>';
    }).join("");
  };

  var busy = false;
  var BALL = '<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#fff" stroke="#222" stroke-width="3"/><path d="M50 28L70 43L62 67H38L30 43Z M10 35L25 20L30 43L14 60Z M75 20L90 35L86 60L70 43Z M38 67L30 88L50 96L62 87L62 67Z" fill="#263238"/></svg>';

  // ---------------- 승부의 순간 미니게임 ----------------
  // 역할 평가에 쓰이는 능력의 게임 중 추첨. 같은 종류는 세 번 연속 나오지 않음.
  var mgLast = [];
  U.miniGame = function (cb) {
    var pools = { 공격수: ["miniBat", "miniSteal", "miniThrow", "miniSigns"],
      미드필더: ["miniThrow", "miniSteal", "miniTimer", "miniSigns"],
      수비수: ["miniTimer", "miniThrow", "miniSigns"], 골키퍼: ["miniPitch", "miniThrow", "miniSigns"] };
    var pool = pools[E.pos().이름] || pools.공격수;
    var blocked = mgLast.length === 2 && mgLast[0] === mgLast[1] ? mgLast[0] : null;
    var choices = pool.filter(function (key) { return key !== blocked; });
    var key = choices[Math.floor(Math.random() * choices.length)];
    mgLast = [key].concat(mgLast.slice(0, 1));
    var closed = false, cancel;
    function finish(result) { if (closed) return; closed = true; document.removeEventListener("keydown", escape); cb(result); }
    function stop() { if (closed) return; cancel(); finish({ 취소: true }); }
    function escape(e) { if (e.key === "Escape") { e.preventDefault(); stop(); } }
    cancel = U[key](finish);
    var active = document.querySelector(".mg-wrap"), quit = document.createElement("button");
    quit.className = "practice-stop"; quit.textContent = "선택으로 돌아가기 · Esc"; quit.onclick = stop; active.appendChild(quit);
    document.addEventListener("keydown", escape);
    return stop;
  };

  // 마우스·터치·키보드로 같은 동작을 실행합니다. 종료 버튼은 게임 입력 영역 밖에 둡니다.
  function mgInput(m, fn, selector) {
    var box = m.querySelector(".mg"), target = m.querySelector(selector || ".mg");
    box.tabIndex = 0; box.setAttribute("role", "group"); box.setAttribute("aria-label", "승부의 순간. 스페이스 또는 엔터로 플레이");
    target.addEventListener("pointerdown", function (e) { if (e.isPrimary === false || (e.button != null && e.button !== 0)) return; e.preventDefault(); fn(e); });
    box.addEventListener("keydown", function (e) { if ((e.code === "Space" || e.code === "Enter") && !e.repeat) { e.preventDefault(); fn(e); } });
    box.focus({ preventScroll: true });
  }

  // 미니게임 창: 제목·설명·놀이판(.mgf)·결과 칸
  function mgOpen(title, sub, field, cls) {
    var m = document.createElement("div"); m.className = "modal mg-wrap";
    m.innerHTML = '<div class="mg"><div class="mg-title">' + title + '</div><div class="mg-sub">' + sub + "</div>" +
      '<div class="mgf ' + (cls || "") + '">' + field + '</div><div class="mg-result"></div></div>';
    document.body.appendChild(m); return m;
  }
  // 결과를 보여 준 뒤 창을 닫고 성공 확률을 돌려줌
  function mgEnd(m, big, bad, msg, p, show, cb) {   // big: 놀이판에 크게 띄우는 글 (bad면 붉은색)
    if (big) { var b = document.createElement("div"); b.className = "mg-big" + (bad ? " bad" : ""); b.textContent = big; m.querySelector(".mgf").appendChild(b); }
    m.querySelector(".mg-result").innerHTML = msg + " <b>성공 확률 " + Math.round(p * 100) + "%</b>";
    setTimeout(function () { if (!m.isConnected) return; m.remove(); cb({ 확률: p, 표시: show }); }, 1600);
  }
  // 누른 순간의 시각 (이벤트에 찍힌 시각을 써서 화면 프레임 오차를 줄임)
  function tapTime(e) { var n = performance.now(), t = e && e.timeStamp; return t && Math.abs(n - t) < 1000 ? t : n; }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function move(el, x, y, s, sec, op) {   // sec초 동안 (x, y)로 옮기며 크기를 s로
    el.style.transition = sec ? "transform " + sec + "s cubic-bezier(.15,.7,.3,1), opacity " + sec + "s" : "none";
    el.style.transform = "translate(" + x + "px," + y + "px) scale(" + s + ")";
    if (op != null) el.style.opacity = op;
  }

  U._mini = { open: mgOpen, end: mgEnd, input: mgInput, time: tapTime, ball: BALL };

  // 연습은 미니게임 화면만 실행하며 선수 상태·저장·보너스를 변경하지 않습니다.
  U.openPractice = function () {
    if (document.querySelector(".practice-modal, .mg-wrap")) return;
    var opener = document.activeElement, selected = "bat", cancel = null, closed = false, last = null;
    var app = $("#app"), wasInert = app.inert, oldOverflow = document.body.style.overflow;
    app.inert = true; document.body.style.overflow = "hidden";
    var history = { bat: [], pitch: [], timer: [] }, M = GD.설정.미니게임 || {}, B = M.슈팅 || {}, P = M.선방 || {};
    function pct(v) { return Math.round(v * 100) + "%"; }
    var games = U.extraPracticeGames();
    Object.keys(games).forEach(function (key) { if (!history[key]) history[key] = []; });
    var m = document.createElement("div"); m.className = "modal practice-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-label", "미니게임 연습장");
    document.body.appendChild(m);
    function draw() {
      var g = games[selected], list = history[selected];
      m.innerHTML = '<div class="sheet practice-sheet"><div class="sheet-bar"><button class="close" aria-label="연습장 닫기">✕</button></div><span class="eyebrow">TRAINING · 연습장</span><h2>결정적인 순간을 위해.</h2>' +
        '<p class="hint">부담 없이 감각을 익혀 보세요. 진행 중인 인생에는 영향을 주지 않습니다.</p><div class="practice-tabs" role="group" aria-label="연습 종류">' +
        Object.keys(games).map(function (key) { return '<button data-game="' + key + '" aria-pressed="' + (selected === key) + '">' + games[key].icon + " " + games[key].title + '</button>'; }).join("") + '</div>' +
        '<div class="practice-instructions"><span class="practice-icon" aria-hidden="true">' + g.icon + '</span><h3>' + g.title + ' 연습</h3><p>' + esc(g.help) + '</p><small>' + esc(g.keys || "터치·클릭 또는 스페이스·엔터") + '</small></div>' +
        '<div class="practice-score" aria-live="polite">' + (list.length ? '<b>이번 연습 ' + list.length + '회</b><span>최고 성공 확률 ' + Math.round(Math.max.apply(null, list.map(function (r) { return r.확률; })) * 100) + '%</span>' : '<b>아직 첫 연습 전이에요</b><span>준비되면 아래 버튼을 누르세요.</span>') + '</div>' +
        (last ? '<p class="practice-last">' + esc(last) + '</p>' : '') + '<button class="big practice-start">' + (list.length ? '한 번 더 연습하기' : '연습 시작') + ' →</button>' +
        '<details class="practice-help"><summary>판정과 성공 확률 알아보기</summary><p>' + esc(g.levels) + '</p><p>본게임에서는 이 확률로 카드의 성공·실패를 결정합니다. 득점·선방 판정도 이야기의 성공을 보장하지는 않습니다.</p></details>' +
        '<button class="sheet-close">게임으로 돌아가기</button></div>';
      m.querySelectorAll("[data-game]").forEach(function (b) { b.onclick = function () { selected = b.dataset.game; last = null; draw(); m.querySelector('[data-game="' + selected + '"]').focus(); }; });
      m.querySelector(".close").onclick = close; m.querySelector(".sheet-close").onclick = close;
      m.querySelector(".practice-start").onclick = start;
    }
    function close() {
      closed = true; if (cancel) cancel(); m.remove(); document.removeEventListener("keydown", keys);
      app.inert = wasInert; document.body.style.overflow = oldOverflow;
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    }
    function stop() {
      if (!cancel) return; cancel(); cancel = null; m.hidden = false; draw(); m.querySelector(".practice-start").focus();
    }
    function start() {
      if (cancel) return; m.hidden = true;
      cancel = games[selected].play(function (r) {
        if (closed) return; cancel = null; history[selected].push(r);
        last = (r.표시 || "⏱ " + r.타이밍.toFixed(2) + "초 / 목표 " + r.목표.toFixed(1) + "초") + " · 성공 확률 " + Math.round(r.확률 * 100) + "%";
        m.hidden = false; draw(); m.querySelector(".practice-start").focus();
      });
      var active = document.querySelector(".mg-wrap"), quit = document.createElement("button");
      quit.className = "practice-stop"; quit.textContent = "연습 그만하기 · Esc"; quit.onclick = stop; active.appendChild(quit);
    }
    function keys(e) {
      if (e.key === "Escape") { e.preventDefault(); if (cancel) stop(); else close(); return; }
      // 대기 화면과 플레이 화면 모두 키보드 포커스를 현재 창 안에 유지합니다.
      if (e.key === "Tab") {
        var scope = cancel ? document.querySelector(".mg-wrap") : m;
        if (!scope) return;
        var nodes = Array.from(scope.querySelectorAll(".mg, button, summary")), first = nodes[0], end = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end.focus(); }
        else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus(); }
      }
    }
    m.onclick = function (e) { if (e.target === m) close(); };
    document.addEventListener("keydown", keys); draw(); m.querySelector(".practice-start").focus();
  };

  U.choose = function (i) {
    if (busy || E.state().단계 !== "카드" || E.state().현재옵션[i] == null) return;
    Feedback.cue("select", document.querySelectorAll("#actions .opt")[i]);
    var s = E.state(), o = s.현재카드.선택지[s.현재옵션[i]];
    if (s.현재카드.자유행동 && o.자유선택 === "이동") {
      E.choose(i); E.next(); U.renderAll(); return;
    }
    if (o.미니게임 && o.확률결과) { busy = true; return U.miniGame(function (mg) { busy = false; if (!mg.취소) doChoose(i, mg); }); }
    doChoose(i);
  };
  function doChoose(i, mg) {
    if (busy) return; busy = true;
    var before = E.state().히로인 && E.state().히로인.아이디;
    var r = E.choose(i, mg);
    var after = E.state().히로인 && E.state().히로인.아이디;
    var card = $("#card"); card.querySelector(".back").innerHTML = U.resultHTML(r);
    card.classList.remove("deal"); card.classList.add("flipped");
    if (typeof r.성공 === "boolean") Feedback.later(card, function () { Feedback.cue(r.성공 ? "result" : "fail", document.querySelector("#table")); }, 330);
    card.querySelector(".front").inert = true; card.querySelector(".back").inert = false;
    if (before && !after) { var m = document.querySelector(".heroine-mini"); if (m) m.classList.add("detach"); }
    Feedback.later($("#app"), function () { U.renderTop(); if (!(before && !after)) U.renderLife(!before && after); U.renderActions(); busy = false; }, before && !after ? 700 : 350);
    if (before && !after) Feedback.later($("#app"), function () { U.renderLife(); }, 750);
  }
  U.next = function () {
    if (busy) return; busy = true;
    Feedback.clearAll();
    $("#card").classList.add("discard");
    Feedback.later($("#app"), function () { E.next(); busy = false; U.renderAll(true); window.scrollTo(0, 0); }, 320);
  };
})();
