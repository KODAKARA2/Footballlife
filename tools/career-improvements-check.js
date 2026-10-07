const assert=require('node:assert/strict');
const {load}=require('./helpers/game');
function setup(seed=4){const c=load(seed),{E}=c;E.newGame('검증','공격수','결정력',{외모:5});E.enterStage('프로');const s=E.state();s.나이=24;s.일군=true;for(const k of Object.keys(s.능력치))s.능력치[k]=85;s.부상=0;return c;}
function play(E,option={효과:{}}){const s=E.state();s.현재카드={제목:'구간 검사',선택지:[option]};s.단계='카드';s.현재옵션=[0];return E.choose(0);}
{
 const {E,GD}=setup();GD.설정.컨디션.기본부상확률=0;GD.설정.컨디션.부상확률=0;GD.설정.컨디션.슬럼프확률=0;
 const s=E.state(),salary=s.계약.연봉,team=s.팀;
 play(E);assert.equal(s.시즌구간.length,1);assert.ok(s.시즌구간[0].기록.출전>0);play(E,{일군:false});assert.ok(s.기록.at(-1).출전>0);assert.equal(s.기록.at(-1).구간[0].팀,team);assert.equal(s.기록.at(-1).구간[1].기록,null);assert.equal(s.나이,25);assert.equal(s._연봉,salary);
}
{
 const {E}=setup(),s=E.state();s.일군=false;play(E);play(E,{일군:true});const line=s.기록.at(-1);assert.ok(line.출전<=19);assert.equal(line.구간[0].기록,null);
}
{
 const {E}=setup(),s=E.state(),first=s.팀,pay=s.계약.연봉;play(E,{이동:'해외리그'});s.플래그.해외주전=true;s.부상=0;s.슬럼프=0;const next=s.팀,overseas=s.계약.연봉;play(E,{이동:'프로'});assert.equal(s.나이,25);assert.equal(s._연봉,Math.round(pay/2)+Math.round(overseas/2));assert.equal(s.기록.at(-1).구간[0].팀,first);assert.equal(s.기록.at(-1).구간[1].팀,next);
}
{
 const {E}=setup(),s=E.state();s.부상=2;play(E);play(E,{이동:'은퇴'});assert.equal(s.나이,25);assert.equal(s.기록.at(-1).출전,0);assert.equal(s.시기,'은퇴');
}
{
 const {E}=setup(),s=E.state();s.돈=20;s.행복도=99;s.능력치.슈팅=E.cap();const before=E.snapshotValues();const r=play(E,{비용:50,효과:{슈팅:9,행복도:30}});assert.equal(r.최종변화.돈.차이,-20);assert.equal(s.능력치.슈팅,E.cap());for(const [k,v] of Object.entries(r.최종변화))assert.equal(v.차이,E.snapshotValues()[k]-before[k]);
 let randoms=0;const ctx=setup();ctx.Math.random=()=>{randoms++;return .5;};ctx.E.choiceWarnings({효과:{행복도:[-20,10],슈팅:5},확률결과:{성공:{효과:{애정도:-15}},실패:{효과:{부상:3}}}});assert.equal(randoms,0);
}
{
 const {E}=setup(),s=E.state();E.selectGoal({목표:'슈팅'});s.시즌목표.시작=80;s.행복도=50;E.evaluateGoal();assert.equal(s.행복도,53);E.evaluateGoal();assert.equal(s.행복도,53);assert.ok(s.시즌목표.보상);
 const stats={...s.능력치};s.능력치.패스=40;s.자유시간={화면:'연습'};s.현재카드=E.freeTimeCard();s.단계='카드';E.refreshOptions();const ix=s.현재옵션.findIndex(i=>s.현재카드.선택지[i].훈련능력==='패스');E.choose(ix);assert.equal(s.능력치.패스,41);assert.equal(s.능력치.슈팅,stats.슈팅);
}
{
 const {E,GD}=setup(),s=E.state();GD.특별엔딩=[{이름:'첫째',아이콘:'A',조건:{}},{이름:'둘째',아이콘:'B',조건:{}}];const en=E.computeEnding();assert.equal(en.특별.이름,'첫째');assert.equal(en.함께이룬것들.length,1);s.엔딩=en;E.recordLife();E.recordLife();assert.equal(E.collection().엔딩['특별:둘째'].횟수,1);
}
{
 const {E,store}=setup(),s=E.state();E.save();const raw=E.exportSave(),before=JSON.stringify(store);assert.ok(E.previewImport(raw));assert.equal(JSON.stringify(store),before,'preview mutated storage');
 for(const bad of ['{','x'.repeat(2*1024*1024+1),raw.replace('"version": 1','"version": 99'),raw.replace('"검증"','"<img src=x onerror=alert(1)>"'),raw.replace('"career": {','"career": {"__proto__":{"polluted":true},')]){assert.throws(()=>E.importSave(bad));assert.equal(JSON.stringify(store),before);}
 const b=JSON.parse(raw);b.career.능력치.슈팅='wrong';assert.throws(()=>E.importSave(JSON.stringify(b)));assert.equal(JSON.stringify(store),before);
 E.importSave(raw);assert.equal(E.state().이름,'검증');assert.ok(E.recoverySave());
 const old=JSON.parse(raw);delete old.career.저장형식;delete old.career.시즌구간;old.career.올해카드=1;E.importSave(JSON.stringify(old));assert.equal(E.state().시즌구간.length,1);assert.ok(E.state().시즌구간[0].이전저장);assert.equal(E.state().시즌구간[0].기록,null);
 const previous=E.state();store['football-life-save-v2']='{';assert.equal(E.load(),null);assert.equal(E.state(),previous);
}
{
 const {E}=setup(),s=E.state(),pay=s.계약.연봉;play(E,{이동:'은퇴'});assert.equal(s.나이,25);assert.equal(s._연봉,Math.round(pay/2));const cash=s.돈;E.choose(0);assert.equal(s.돈,cash);
}
{
 const {E}=setup(),s=E.state(),team=s.팀;play(E,{팀이동:true});assert.notEqual(s.팀,team);play(E);assert.equal(s.기록.at(-1).구간[0].팀,team);
}
{
 const c=setup(),{E,store}=c;E.save();const raw=E.exportSave(),old=[store['football-life-save-v2'],store['football-life-collection-v2'],store['football-life-bonus-looks-v2']],original=c.localStorage.setItem;let failed=false;
 const b=JSON.parse(raw);b.collection={엔딩:{},업적:{},레어:{},인생수:99};
 c.localStorage.setItem=(k,v)=>{if(k==='football-life-collection-v2'&&!failed){failed=true;throw new Error('simulated quota');}original(k,v);};
 assert.throws(()=>E.importSave(JSON.stringify(b)));assert.deepEqual([store['football-life-save-v2'],store['football-life-collection-v2'],store['football-life-bonus-looks-v2']],old);c.localStorage.setItem=original;
 E.recordLife();const count=E.collection().인생수;E.state()._도감=false;E.recordLife();assert.equal(E.collection().인생수,count,'stale career flag duplicated collection');
}
console.log('PASS career interval boundaries, actual deltas, no-random previews, direct training, goal once, multiple endings, migration and damaged imports');
