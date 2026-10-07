// Force every registered option and each random outcome in each role. Fixtures
// deliberately satisfy relationship prerequisites; reachability is tested separately.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {load,root}=require('./helpers/game');const {E,GD,Math:math}=load(77);const I=E._internal;
E.newGame('선택검사','공격수','결정력');const cards=I.CARDS().map(c=>I.clone(c));
let tested=0,branches=0;const failures=[];
for(const pos of GD.포지션) for(const card of cards) for(let index=0;index<card.선택지.length;index++) {
 const option=card.선택지[index];
 for(const outcome of option.확률결과?[true,false]:[null]) try{
  math.random=()=>.5;
  const s=E.newGame('선택검사',pos.이름,GD.특기.find(x=>x.분류===pos.분류&&pos.비중[x.능력치]).이름,{외모:5});
  s.시기=[].concat(card.시기||'프로')[0];s.나이=s.진입나이=Math.max(30,card.조건?.최소나이||0);s.총턴=100;s.시기턴=0;
  s.팀=GD.설정.국내팀[0];s.국내팀=s.팀;s.원래팀=s.팀;s.제안팀=s.팀;s.돈=10000000;s.상속금=300;s.플래그={군필:true};s.일군=true;s.연차=8;s.대기열=[];
  for(const k of Object.keys(s.능력치))s.능력치[k]=60;
  const hero=GD.히로인.some(h=>h.아이디===card.히로인)?card.히로인:GD.히로인.find(h=>h.아이디!==card._끼어들기).아이디;
  I.attachHeroine(hero);s.히로인.관계=[].concat(card.조건?.관계||'연인')[0];s.히로인.애정도=80;s.히로인.만남턴=0;s.히로인.교류횟수=5;
  s.히로인2={아이디:GD.히로인.find(h=>h.아이디!==hero&&h.아이디!==card._끼어들기).아이디,관계:'연인',애정도:70,만난시기:'프로'};
  if(card._만남){s.히로인=null;s.히로인2=null;s.만난히로인=[];}
  s.새인연={아이디:card._끼어들기||'heroine2',기존인연:hero,등장턴:0};s._상대=card._끼어들기;s._새포지션=(pos.변경후보||[])[0];
  s.현재카드=card;s.현재옵션=[index];s.단계='카드';s.결과=null;
  const result=E.choose(0,outcome===null?null:{확률:outcome?1:0,능력:'위치선정'});
  assert.ok(result);if(outcome!==null){assert.equal(result.성공,outcome);branches++;}
  for(const [k,v] of Object.entries(s.능력치))assert.ok(Number.isFinite(v)&&v>=0&&v<=100,k);
  assert.ok(Number.isFinite(s.돈)&&s.돈>=0);assert.ok(s.나이>=30);
  const snapshot=JSON.stringify(s);E.choose(0);assert.equal(JSON.stringify(s),snapshot,'duplicate option');
  E.save();assert.ok(E.load());tested++;
 }catch(e){failures.push({position:pos.이름,card:card.제목,id:card._id,index,outcome,error:e.stack.split('\n').slice(0,4).join('\n')});}
}
const report={registeredCards:cards.length,tested,randomOutcomeExecutions:branches,failures};fs.writeFileSync(path.join(root,'tools/results/football-choices.json'),JSON.stringify(report,null,2)+'\n');
assert.deepEqual(failures,[]);console.log('PASS: every registered choice across four roles',JSON.stringify(report));
