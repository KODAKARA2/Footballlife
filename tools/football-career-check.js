const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const {load,root} = require('./helpers/game');
const count = Number(process.argv[2] || 240), summary = {seedBase:20261007,lives:count,positions:{},branches:{},maxTurns:0};
function valid(s) {
 assert.ok(Number.isInteger(s.나이)&&s.나이>=10&&s.나이<=100,`age ${s.나이}`);
 for(const [k,v] of Object.entries(s.능력치)) assert.ok(Number.isFinite(v)&&v>=0&&v<=100,`stat ${k} ${v}`);
 assert.ok(Number.isFinite(s.돈)&&s.돈>=0); assert.ok(Number.isFinite(s.성적));
 const ages=new Set();
 for(const L of s.기록) {
  assert.ok(!ages.has(L.나이),'duplicate season/pay age '+L.나이); ages.add(L.나이);
  for(const k of ['출전','출전시간','득점','도움','클린시트','선방','태클']) assert.ok(Number.isInteger(L[k])&&L[k]>=0,`record ${k}: ${L[k]}`);
  assert.ok(L.출전<=38); assert.ok(L.출전시간<=90*L.출전); assert.ok(L.클린시트<=L.출전);
  assert.ok(!('홈런' in L)&&!('방어율' in L)); if(L.포지션==='골키퍼') assert.equal(L.득점,0);
 }
}
for(let g=0;g<count;g++) {
 const {E,GD,Math:math,store}=load(20261007+g), pos=GD.포지션[g%4], specs=GD.특기.filter(x=>x.분류===pos.분류);
 for(const k of ['baseball-life-save-v1','baseball-life-bonus-looks','baseball-life-collection']) store[k]='BASEBALL PRESERVE '+k;
 let s=E.newGame('축구검사',pos.이름,specs[g%specs.length].이름,{외모:1+g%10});
 const r=summary.positions[pos.이름] ||= {lives:0,pro:0,overseas:0,return:0,university:0,injury:0,retired:0,goals:0,saves:0,score:0};r.lives++;
 const seen=new Set();let age=s.나이,t=0,wasOverseas=false,returned=false,injury=false;
 while(s.단계!=='엔딩'&&t++<1200) {
  seen.add(s.시기); if(s.시기==='해외리그') wasOverseas=true; if(wasOverseas&&s.시기==='프로')returned=true; injury ||= s.부상>0;
  assert.ok(s.현재옵션.length,'no enabled options');
  let choice=Math.floor(math.random()*s.현재옵션.length);
  // Half the lives select opportunities; the other half remain unbiased.
  if(g%2===0) {const ix=s.현재옵션.findIndex(i=>s.현재카드.선택지[i].이동==='해외리그');if(ix>=0)choice=ix;}
  E.choose(choice); assert.ok(s.나이>=age,`age reversal life ${g}`); age=s.나이;
  if(s.단계==='결과') { const snapshot=JSON.stringify(s); E.choose(choice); assert.equal(JSON.stringify(s),snapshot,'double choose awarded twice'); }
  valid(s);
  if(t%19===0){ E.save();const old=JSON.stringify(s);assert.ok(E.load());s=E.state();assert.equal(JSON.stringify(s),old,'save reload changed life'); }
  E.next();
 }
 assert.equal(s.단계,'엔딩',`infinite life ${g} (${s.현재카드?.제목})`);valid(s);
 for(const stage of seen)summary.branches[stage]=(summary.branches[stage]||0)+1;
 r.pro+=seen.has('프로');r.overseas+=seen.has('해외리그');r.university+=seen.has('대학');r.return+=returned;r.injury+=injury;r.retired++;
 r.goals+=E.totals().득점;r.saves+=E.totals().선방;r.score+=s.성적;summary.maxTurns=Math.max(summary.maxTurns,t);
 E.recordLife();const lives=E.collection().인생수;E.recordLife();assert.equal(E.collection().인생수,lives,'duplicate collection life');
 E.save();assert.ok(E.load());E.chooseCareer(GD.진로[g%GD.진로.length].아이디);
 E.newGame('2세',pos.이름,specs[0].이름,{이어하기:{아버지:s.이름,외모:s.외모,돈:s.돈,세대:s.세대||1}});
 assert.equal(E.state().세대,2);assert.equal(E.state().나이,10);assert.ok(E.state().플래그.이세);E.save();assert.ok(E.load());
 E.reset();for(const k of ['baseball-life-save-v1','baseball-life-bonus-looks','baseball-life-collection'])assert.equal(store[k],'BASEBALL PRESERVE '+k);
 if((g+1)%80===0)console.error(`${g+1}/${count} seeded football lives passed`);
}
// Targeted role fairness, injury, admissions, foreign romance, transfer and heir paths.
for(const role of ['공격수','미드필더','수비수','골키퍼']) {
 const {E,GD}=load(78), p=GD.포지션.find(p=>p.이름===role), spec=GD.특기.find(x=>x.분류===p.분류);
 let s=E.newGame('경로검사',role,spec.이름);
 for(const k of Object.keys(s.능력치))s.능력치[k]=90;
 E.enterStage('입단심사'); assert.equal(s.입단심사,'상위'); assert.equal(s.나이,19);
 E.enterStage('대학');E.enterStage('대학입단');assert.equal(s.나이,23);assert.equal(s.입단심사,'상위');
 E.enterStage('프로');s.일군=true;E.endYear();const domestic=s.기록.at(-1);assert.ok(domestic.가치>0,`${role} must succeed without goals`);assert.ok(s.계약.연봉>0);
 s.올해부상카드=GD.설정.시기.프로.한해카드수;E.endYear();assert.equal(s.기록.at(-1).출전,0,'full year injury availability');
 const transfersBefore=s.팀이동;E.enterStage('해외리그');assert.equal(s.팀이동,transfersBefore+1);s.플래그.해외주전=true;E.endYear();assert.ok(s.기록.at(-1).해외);assert.ok(GD.해외리그.팀.includes(s.계약.팀));
 const foreign=GD.히로인.find(h=>h.외국인);E._internal.attachHeroine(foreign.아이디);s.히로인.관계='연인';E.enterStage('프로');assert.equal(s.팀이동,transfersBefore+2);assert.ok(s.플래그.외국인작별);assert.ok(GD.설정.국내팀.includes(s.팀));
 E.enterStage('은퇴');let steps=0;while(s.단계!=='엔딩'&&steps++<80){E.next();if(s.단계==='카드')E.choose(0);}assert.equal(s.단계,'엔딩');
 const parent={아버지:s.이름,외모:s.외모,돈:s.돈,세대:1};s=E.newGame('2세완주',role,spec.이름,{이어하기:parent});
 let heirTurns=0;while(s.단계!=='엔딩'&&heirTurns++<1200){E.choose(0);E.next();valid(s);}assert.equal(s.단계,'엔딩');assert.equal(s.세대,2);
 s=E.newGame('대체입단',role,spec.이름);for(const k of Object.keys(s.능력치))s.능력치[k]=1;E.enterStage('입단심사');assert.equal(s.입단심사,'제안없음');
 const alternative=E._internal.CARDS().find(c=>c.시기==='입단심사'&&c.조건?.입단심사==='제안없음');s.현재카드=alternative;s.단계='카드';E.refreshOptions();const alternativeIx=s.현재옵션.findIndex(i=>alternative.선택지[i].이동==='프로');assert.ok(alternativeIx>=0);E.choose(alternativeIx);assert.equal(s.시기,'프로');assert.ok(s.플래그.육성출신);assert.ok(s.계약.연봉>0);
 for(const k of Object.keys(s.능력치))s.능력치[k]=85;
 const payBefore=s.돈;const recordsBefore=s.기록.length,awardsBefore=s.수상.length;E.endYear();
 assert.equal(s.기록.length,recordsBefore,'unregistered youth received senior stats');assert.equal(s.수상.length,awardsBefore,'unregistered youth received awards');assert.equal(s.돈-payBefore,3000,'youth contract salary mismatch');
 const registration=E._internal.CARDS().find(c=>c.아이디==='football-pro-002');assert.ok(registration.반복&&registration.간격>0,'youth wait must permit retry');
 s.현재카드=registration;s.단계='카드';E.refreshOptions();E.choose(1);assert.ok(s.플래그.육성선수);s.총턴+=registration.간격;assert.ok(E._internal.eligible(registration),'waiting locked player out of registration');
 s.현재카드=registration;s.단계='카드';E.refreshOptions();E.choose(0);assert.ok(!s.플래그.육성선수);
 const debut=E._internal.CARDS().find(c=>c.아이디==='football-pro-003');assert.ok(E._internal.eligible(debut));s.현재카드=debut;s.단계='카드';E.refreshOptions();E.choose(0);assert.ok(s.일군);E.endYear();assert.ok(s.기록.length>recordsBefore,'registered first-team debut missing senior stats');
}

fs.mkdirSync(path.join(root,'tools/results'),{recursive:true});fs.writeFileSync(path.join(root,'tools/results/football-careers.json'),JSON.stringify(summary,null,2)+'\n');
console.log('PASS football careers:',JSON.stringify(summary));
