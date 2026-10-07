// Six football drills: keyboard, touch, grade boundaries, timeout, cancel/retry, spam.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {pathToFileURL}=require('node:url'),{chromium}=require('playwright');
const out=process.argv[2]||fs.mkdtempSync(path.join(os.tmpdir(),'football-mini-'));fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch(require('./helpers/browser').launchOptions());try{
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(await require('./helpers/browser').url());await page.clock.install();
 const start=async name=>page.evaluate(name=>{window.results=[];Math.random=()=>.5;window.cancelMini=U[name](r=>results.push(r));},name);
 const tap=async()=>page.evaluate(()=>{const e=new PointerEvent('pointerdown',{bubbles:true,button:0,isPrimary:true,pointerType:'touch'});Object.defineProperty(e,'timeStamp',{value:performance.now()});document.querySelector('.mg').dispatchEvent(e);});
 const result=async(p,stat)=>{await page.clock.runFor(1200);const rs=await page.evaluate(()=>results);assert.equal(rs.length,1);assert.equal(rs[0].확률,p);if(stat)assert.equal(rs[0].능력,stat);assert.equal(await page.locator('.mg-wrap').count(),0);};
 for(const [offset,p] of [[0,.95],[100,.7],[220,.3],[400,.05]]){await start('miniBat');await page.clock.runFor(2100+offset);await tap();await tap();await page.clock.runFor(650);await result(p,'슈팅');}
 await start('miniPitch');await page.keyboard.press('Space');await result(.95,'선방');
 for(const [offset,p] of [[0,.95],[180,.7],[350,.3],[650,.05]]){await start('miniTimer');await page.clock.runFor(2030+offset);await page.keyboard.press('Space');await result(p,'수비');}
 await start('miniSteal');await page.clock.runFor(800);assert.match(await page.locator('.steal-signal').innerText(),/압박/);await tap();await page.clock.runFor(650);await result(.05);
 for(const [reaction,p] of [[100,.95],[250,.7],[420,.3],[650,.05]]){await start('miniSteal');await page.clock.runFor(2450+reaction);await tap();await tap();await page.clock.runFor(650);await result(p,'드리블');}
 await start('miniThrow');await tap();await tap();assert.match(await page.locator('.mg-pitch').innerText(),/2 \/ 2/);assert.equal(await page.evaluate(()=>results.length),0);await page.clock.runFor(1000);await tap();await page.clock.runFor(450);await result(.95,'패스');
 for(let correct=0;correct<=3;correct++) {await start('miniSigns');await page.keyboard.press('2');assert.equal(await page.locator('[data-sign]:disabled').count(),3);await page.clock.runFor(2450);for(let n=0;n<3;n++){if(n===0)await page.locator(`[data-sign="${n<correct?1:0}"]`).tap();else await page.keyboard.press(n<correct?'2':'1');await page.clock.runFor(200);}await result([.05,.3,.7,.95][correct],'위치선정');}
 for(const name of ['miniBat','miniPitch','miniTimer','miniSteal','miniThrow','miniSigns']){
  await start(name);await page.clock.runFor(14000);assert.equal(await page.evaluate(()=>results.length),1,'timeout '+name);
  await start(name);await page.evaluate(()=>cancelMini());await page.clock.runFor(14000);assert.equal(await page.evaluate(()=>results.length),0,'cancel '+name);assert.equal(await page.locator('.mg-wrap').count(),0);
  await start(name);await page.clock.runFor(500);await page.screenshot({path:path.join(out,name+'.png'),animations:'disabled'});await page.evaluate(()=>cancelMini());
 }
 for(const name of ['miniBat','miniPitch','miniTimer','miniSteal','miniThrow']) {
  await start(name);await page.clock.runFor(500);await page.locator('.mg-wrap').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));
  await page.locator('.mg').tap();if(name==='miniThrow'){await page.clock.runFor(250);await page.locator('.mg').tap();}
  await page.clock.runFor(10000);assert.equal(await page.evaluate(()=>results.length),1,'real touchscreen '+name);
 }
 const dispatch=await page.evaluate(()=>{
  const abilities=U.drillAbilities;
  const pools=U.roleDrills;
  const original={},originalRandom=Math.random,report={};let pending,selected;
  for(const key of Object.keys(abilities)){original[key]=U[key];U[key]=cb=>{selected=key;const m=document.createElement('div');m.className='mg-wrap';document.body.appendChild(m);pending=()=>{m.remove();cb({확률:.95,능력:abilities[key]});};return ()=>m.remove();};}
  try{for(const [role,pool] of Object.entries(pools)){
   const pos=GD.포지션.find(p=>p.이름===role),spec=GD.특기.find(t=>t.분류===pos.분류&&pos.비중[t.능력치]);E.newGame('추첨검사',role,spec.이름);
   let seed=8912,last=null,run=0;const counts=Object.fromEntries(pool.map(k=>[k,0]));let maxRun=0;
   for(let i=0;i<200;i++){
    Math.random=i<100?()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296):()=>0;
    let calls=0,result;U.miniGame(r=>{calls++;result=r;});pending();pending();
    if(calls!==1)throw new Error(role+': duplicate callback');
    if(!pool.includes(selected)||!(pos.비중[result.능력]>0))throw new Error(role+': irrelevant drill/reward '+selected+'/'+result.능력);
    counts[selected]++;run=selected===last?run+1:1;last=selected;maxRun=Math.max(run,maxRun);if(run>2)throw new Error(role+': three consecutive '+selected);
   }
   if(Object.values(counts).some(n=>!n))throw new Error(role+': missing allowed drill');report[role]={draws:200,counts,maxConsecutive:maxRun};
  }}finally{for(const key of Object.keys(original))U[key]=original[key];Math.random=originalRandom;}
  return report;
 });
 fs.writeFileSync(path.join(__dirname,'results/minigame-distribution.json'),JSON.stringify(dispatch,null,2)+'\n');
 assert.equal(Object.values(dispatch).reduce((n,r)=>n+r.draws,0),800);
 assert.deepEqual(errors,[]);console.log('PASS: six football drills / touch + keyboard / grades / timeouts / cancel-retry / double input / 800 role-relevant draws, no triple repeat; screenshots '+out);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
