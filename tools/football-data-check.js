// Registered-data integrity: unknown effects/conditions must fail loudly.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const {load} = require('./helpers/game');
const {E, GD, root, files} = load();
E.newGame('검증', GD.포지션[0].이름, GD.특기.find(x=>x.분류===GD.포지션[0].분류).이름);
const cards = E._internal.CARDS(), errors = [], flagsRead = new Set(), flagsWritten = new Set(), awardsRead = new Set(), awardsWritten = new Set();
const stats = new Set(Object.keys(E.state().능력치));
const effects = new Set([...stats,'모든능력치','특기능력치','부상','부상감소','슬럼프감소','슬럼프','애정도2','애정도','행복도','성적','돈','만남확률']);
const values = new Set([...stats,'행복도','성적','평균','상한도달','계약잔여','연차','자녀','나이','애정도','팀이동','시기카드','애정도2','은퇴나이','이별수','수상수','총수입','외모','세대','상속금','이군기간','돈']);
const conditions = new Set(['시기','시기아님','포지션','특기','최소나이','최대나이','최소','최대','상태','플래그','플래그없음','일군','입단심사','히로인','관계','고백가능','양다리','한국인연','구매','포지션변경가능','수상','확률']);
const stages = new Set(Object.keys(GD.설정.시기)), shops = new Set(GD.상점.map(x=>x.이름));
const roles = new Set(GD.포지션.flatMap(p=>[p.이름,p.분류])), specialties = new Set(GD.특기.map(s=>s.이름));
const titles = new Set(cards.map(c=>c.제목)), ids = new Set(cards.map(c=>c._id));
const arr = x => Array.isArray(x)?x:[x];
function need(ok,msg) {if(!ok) errors.push(msg);}
function walk(x,loc) {
  if (!x || typeof x !== 'object') return;
  if(Array.isArray(x)) return x.forEach((v,i)=>walk(v,`${loc}[${i}]`));
  for (const [k,v] of Object.entries(x)) {
    if (k==='조건'||k==='만남조건') {
      for(const ck of Object.keys(v)) need(conditions.has(ck),`${loc}.${k}: unknown condition ${ck}`);
      for(const ck of ['최소','최대']) for(const vk of Object.keys(v[ck]||{})) need(values.has(vk),`${loc}: unknown condition value ${vk}`);
      for(const fk of ['플래그','플래그없음']) if(v[fk]) arr(v[fk]).forEach(f=>flagsRead.add(f));
      for(const [field,allowed] of [['포지션',roles],['특기',specialties],['상태',new Set(['부상','슬럼프','건강'])],['관계',new Set(['만남','연인','배우자'])],['입단심사',new Set(['상위','하위','제안없음'])]]) if(v[field]) arr(v[field]).forEach(n=>need(allowed.has(n),`${loc}: invalid ${field} ${n}`));
      if(v.수상) arr(v.수상).forEach(n=>awardsRead.add(n));
      if(v.구매) arr(v.구매).forEach(n=>need(shops.has(n),`${loc}: unknown shop ${n}`));
    }
    if(k==='효과'||k==='이별타격'||k==='매턴효과'||k==='매카드'||k==='추가보너스'||k==='시작보너스') for(const [ek,ev] of Object.entries(v)) {
      need(effects.has(ek),`${loc}: unknown stat/effect ${ek}`);
      need(typeof ev==='number'&&Number.isFinite(ev)||Array.isArray(ev)&&ev.length===2&&ev.every(Number.isFinite)&&ev[0]<=ev[1],`${loc}: invalid effect ${ek}`);
    }
    if(k==='비용'||k==='가격') need(Number.isFinite(v)&&v>=0,`${loc}: invalid cost ${v}`);
    if(k==='비용비율') need(Number.isFinite(v)&&v>=0&&v<=100,`${loc}: invalid percent cost ${v}`);
    if(k==='수상'&&typeof v==='string'&&!/\.조건$/.test(loc)) awardsWritten.add(v);
    if(k==='그림'&&v&&typeof v==='object') for(const image of Object.values(v)) need(['.png','.jpg','.webp'].some(ext=>fs.existsSync(path.join(root,'images',image+ext))),`${loc}: missing heroine image ${image}`);
    if(k==='다음카드') arr(v).forEach(n=>need(titles.has(n)||ids.has(n),`${loc}: missing followup ${n}`));
    if(k==='그림'||k==='그림변경') if(typeof v==='string') for(const image of v.split(',').map(s=>s.trim())) need(['.png','.jpg','.webp'].some(ext=>fs.existsSync(path.join(root,'images',image+ext))),`${loc}: missing image ${image}`);
    if(k==='시기'||k==='이동') if(typeof v==='string'||Array.isArray(v)) arr(v).forEach(s=>need(stages.has(s),`${loc}: unknown stage ${s}`));
    if(k==='플래그' && !/\.조건$|\.만남조건$/.test(loc)) arr(v).forEach(f=>flagsWritten.add(f));
    walk(v,`${loc}.${k}`);
  }
}
walk(GD,'GD');
const sourceCards = GD.카드.concat(...GD.히로인.map(h=>[h.만남카드,...h.전용카드||[]].filter(Boolean)));
for(const card of sourceCards) need(typeof card.아이디==='string'&&card.아이디.length>0,`missing permanent ID: ${card.제목}`);
need(new Set(sourceCards.map(c=>c.아이디)).size===sourceCards.length,'duplicate source card ID');
need(ids.size===cards.length,'duplicate registered card IDs');
need(GD.포지션.length===4,'requires four football roles');
for(const p of GD.포지션) for(const k of Object.keys(p.비중)) need(stats.has(k),`position ${p.이름}: ${k}`);
for(const s of GD.특기) need(stats.has(s.능력치),`specialty ${s.이름}: ${s.능력치}`);
const code=files.filter(f=>f.startsWith('js/')).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
for(const m of code.matchAll(/플래그\.([가-힣A-Za-z0-9_]+)\s*=/g)) flagsWritten.add(m[1]);
for(const m of code.matchAll(/(?:give|addAward)\(\"([^\"]+)\"/g)) awardsWritten.add(m[1]);
for(const m of code.matchAll(/(?:골키퍼|수비수|미드필더|공격수): \"(올해의 [^\"]+)\"/g)) awardsWritten.add(m[1]);
for(const award of awardsRead) need(awardsWritten.has(award),`award has no producer: ${award}`);
for(const flag of flagsRead) need(flagsWritten.has(flag),`condition flag has no producer: ${flag}`);
// All followups must resolve by permanent identity; every chain needs an exit.
const cardByRef = new Map(cards.flatMap(c=>[[c._id,c],[c.제목,c]]));
function nextRefs(o) { return [...arr(o.다음카드||[]),...Object.values(o.확률결과||{}).filter(v=>v&&typeof v==='object').flatMap(nextRefs)]; }
const edges = new Map(cards.map(c=>[c._id,new Set(c.선택지.flatMap(nextRefs).map(ref=>cardByRef.get(ref)?._id).filter(Boolean))]));
const safe = new Set(cards.filter(c=>c.선택지.some(o=>nextRefs(o).length===0)).map(c=>c._id));
let changed=true;while(changed){changed=false;for(const c of cards)if(!safe.has(c._id)&&c.선택지.some(o=>nextRefs(o).every(r=>safe.has(cardByRef.get(r)?._id)))){safe.add(c._id);changed=true;}}
for(const c of cards)need(safe.has(c._id),`followup has no exit: ${c.제목}`);
const followupEdges=[...edges.values()].reduce((n,s)=>n+s.size,0);
// A renamed/reordered source retains identity and a queued followup survives reload.
const target=GD.카드.find(c=>!c.끼어들기),oldTitle=target.제목,permanent=target.아이디;
E.state().현재카드=E._internal.clone(target);E.state().현재카드._id=permanent;E.state().단계='카드';E.refreshOptions();E.state().대기열=[permanent];E.save();target.제목='검증용 변경 제목';GD.카드.reverse();Ibuild();
function Ibuild(){E._internal.buildCards();}
need(E._internal.CARDS().some(c=>c._id===permanent&&c.제목==='검증용 변경 제목'),'title/order mutation broke identity');
need(!!E.load(),'renamed-source save load failed');need(E.state().현재카드._id===permanent&&E.state().현재카드.제목==='검증용 변경 제목','current card identity/title refresh failed');E.next();need(E.state().현재카드._id===permanent,'queued ID was lost after title change');
target.제목=oldTitle;GD.카드.reverse();Ibuild();
assert.throws(()=>E.applyEffects({없는축구능력:1},{}), /Unknown|unknown|능력/);
fs.mkdirSync(path.join(root,'tools/results'),{recursive:true});
const report={followupEdges,sourceCards:sourceCards.length,sourceChoices:sourceCards.reduce((n,c)=>n+c.선택지.length,0),cards:GD.카드.length,registeredCards:cards.length,choices:cards.reduce((n,c)=>n+c.선택지.length,0),heroines:GD.히로인.length,news:GD.뉴스.length,items:GD.상점.length,achievements:GD.업적.length,positions:GD.포지션.map(p=>p.이름),flagsRead:[...flagsRead],flagsWritten:[...flagsWritten],errors};
fs.writeFileSync(path.join(root,'tools/results/data-validation.json'),JSON.stringify(report,null,2)+'\n');
assert.deepEqual(errors,[]); console.log('Football data validation passed:',JSON.stringify(report));
