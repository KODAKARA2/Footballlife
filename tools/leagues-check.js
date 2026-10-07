const assert = require('node:assert/strict');
const fs = require('node:fs');
const {load} = require('./helpers/game');
const plain = value => JSON.parse(JSON.stringify(value));
function setup(seed=44) {
  const ctx=load(seed), {E,GD}=ctx;
  const s=E.newGame('리그검사','공격수','결정력');
  E.enterStage('프로');s.나이=26;s.연차=5;s.일군=true;s.돈=90000;s.대기열=[];
  for(const k of Object.keys(s.능력치))s.능력치[k]=80;
  E.signContract(3);
  return ctx;
}
function show(E,id) {
  const s=E.state();s.현재카드=E._internal.clone(E._internal.CARDS().find(c=>c._id===id));
  s.단계='카드';s.결과=null;E.refreshOptions();
}
const report={pools:[],entryCases:0,assignments:0,legacySaves:0,careerPaths:0};
{const {E}=setup();const before=JSON.stringify(E.state());assert.throws(()=>E.enterStage('해외리그','invalid'));assert.equal(JSON.stringify(E.state()),before);}
const {GD}=setup();assert.equal(GD.해외리그.리그.length,3);assert.equal(new Set(GD.해외리그.팀).size,15);
for(const league of GD.해외리그.리그){assert.equal(league.팀.length,5);report.pools.push(plain(league));}
const ids=['football-mlb_cards-001','football-mlb_cards-002','football-pro_events-001'];
for(const [li,league] of GD.해외리그.리그.entries()) for(const id of ids) for(const played of [0,1]) {
  const {E}=setup();let s=E.state();if(id!=='football-mlb_cards-001')s.플래그.계약만료=true;s.올해카드=played;
  show(E,id);const index=s.현재옵션.findIndex(i=>s.현재카드.선택지[i].이동==='해외리그');assert(index>=0);
  const original=JSON.stringify(s), before=plain(s);
  assert.equal(E.choose(index),null);assert(s.리그선택대기);assert.equal(s.돈,before.돈);assert.deepEqual(plain(s.계약),before.계약);assert.deepEqual(plain(s.플래그),before.플래그);assert.equal(s.나이,before.나이);
  const pending=JSON.stringify(s);E.next();assert.equal(JSON.stringify(s),pending);
  E.save();assert(E.load());s=E.state();assert.equal(JSON.stringify(s),pending);
  E.choose(3);assert.equal(JSON.stringify(s),original,'cancel must restore exact original state');
  E.choose(index);E.save();E.load();s=E.state();let contracts=0;const sign=E.signContract;E.signContract=(...args)=>{contracts++;return sign(...args);};
  const result=E.choose(li);assert(result);assert.equal(contracts,1);assert.equal(s.시기,'해외리그');assert.equal(s.해외리그아이디,league.아이디);assert(league.팀.includes(s.팀));assert.equal(s.계약.리그아이디,league.아이디);assert(s.플래그.리저브);
  assert.equal(s.나이,before.나이+played);assert.equal(s.돈-before.돈,(id==='football-mlb_cards-001'?12000:16000)+(played?before.계약.연봉:0));
  assert(s.순간.at(-1).글.includes(league.이름));assert.equal(s.순간.at(-1).나이,before.나이);
  const after=JSON.stringify(s);E.choose(li);E.choose(li);assert.equal(JSON.stringify(s),after);E.save();E.load();assert.equal(JSON.stringify(E.state()),after);report.entryCases++;
}
// Declining each actual offer preserves the domestic contract and overseas flags.
for(const id of ids){const {E}=setup();const s=E.state();show(E,id);const before=plain(s);const decline=id==='football-pro_events-001'?0:1;E.choose(decline);assert.equal(s.시기,'프로');assert.equal(s.나이,before.나이);assert.equal(s.해외리그아이디,undefined);assert(!s.플래그.리저브);assert.equal(s.돈-before.돈,id==='football-pro_events-001'?8000:0);}
// Exercise every exact assignment boundary and same-league contract transfers.
for(const league of GD.해외리그.리그) for(let i=0;i<5;i++){
 const {E,Math:math}=setup();math.random=()=> (i+.1)/5;E.enterStage('해외리그',league.아이디);const s=E.state();assert.equal(s.팀,league.팀[i]);E._internal.changeTeam();assert(league.팀.includes(s.팀));assert.notEqual(s.팀,league.팀[i]);assert.equal(s.해외팀,s.팀);report.assignments++;
}
// Old eight-team saves retain team, salary, finances, age and history; migration is idempotent.
const oldTeams=['런던 리버스 FC','맨체스터 노스 FC','마드리드 솔 FC','바르셀로나 마르 FC','밀라노 스텔라','도르트문트 발트','파리 뤼미에르','리스본 오세아누'];
for(const team of oldTeams) for(const stage of ['해외리그','프로','은퇴']){
 const {E}=setup();let s=E.state();delete s.리그저장버전;s.시기=stage;s.해외팀=team;if(stage==='해외리그')s.팀=team;
 s.계약.팀=stage==='은퇴'?team:s.팀;s.기록=[{팀:team,해외:true,나이:25,연도:2040}];const before=plain(s);E.save();assert(E.load());s=E.state();assert.equal(s.해외리그아이디,E.leagueForTeam(team));assert.equal(s.해외팀,team);assert.equal(s.팀,before.팀);assert.equal(s.돈,before.돈);assert.equal(s.나이,before.나이);assert.equal(s.계약.연봉,before.계약.연봉);assert.equal(s.기록[0].팀,team);assert.equal(s.기록[0].리그아이디,E.leagueForTeam(team));
 if(stage!=='프로')assert.equal(s.계약.리그아이디,E.leagueForTeam(team));
 const migrated=JSON.stringify(s);E.save();E.load();assert.equal(JSON.stringify(E.state()),migrated);report.legacySaves++;
 if(stage==='해외리그'&&E.leagueForTeam(team)==='legacy'){s=E.state();E._internal.changeTeam();assert(GD.해외리그.레거시팀.includes(s.팀));E.enterStage('프로');assert.equal(s.시기,'프로');}
}
for(const league of GD.해외리그.리그){
 const {E,GD}=setup();let s=E.state();E.enterStage('해외리그',league.아이디);
 show(E,'football-mlb_cards-003');const adaptation=s.능력치.적응;E.choose(1);assert(s.능력치.적응>adaptation);
 show(E,'football-mlb_cards-008');E.choose(0);assert(s.플래그.해외주전);assert(!s.플래그.리저브);
 E.endYear();assert.equal(s.기록.at(-1).리그아이디,league.아이디);assert(s.대기열.some(c=>typeof c==='object'&&c.내용.includes(league.이름)));
 const foreign=GD.히로인.find(h=>h.외국인);E._internal.attachHeroine(foreign.아이디);s.히로인.관계='연인';E.save();assert(E.load());s=E.state();assert.equal(s.히로인.아이디,foreign.아이디);
 E.enterStage('프로');assert(s.플래그.외국인작별);assert(GD.설정.국내팀.includes(s.팀));assert.equal(s.해외리그아이디,league.아이디);
 E.enterStage('은퇴');for(let i=0;i<100&&s.단계!=='엔딩';i++){E.next();E.choose(0);}assert.equal(s.단계,'엔딩');report.careerPaths++;
}
for(const league of GD.해외리그.리그){const {E}=setup();const s=E.state();E.enterStage('해외리그',league.아이디);E.enterStage('은퇴');for(let i=0;i<100&&s.단계!=='엔딩';i++){E.next();E.choose(0);}assert.equal(s.단계,'엔딩');assert.equal(s.해외리그아이디,league.아이디);}
fs.mkdirSync('tools/results/leagues',{recursive:true});fs.writeFileSync('tools/results/leagues/engine.json',JSON.stringify(report,null,2)+'\n');console.log('PASS leagues',JSON.stringify(report));
