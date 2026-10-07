const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch(require('./helpers/browser').launchOptions());try{
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(await require('./helpers/browser').url());await page.clock.install();
const start=async name=>page.evaluate(name=>{window.results=[];Math.random=()=>.5;window.cancelDrill=U[name](r=>results.push(r));},name);
const key=async n=>page.keyboard.press(String(n));
async function success(name,touch=false){
 const input=async n=>touch?page.locator('[data-input="'+(n-1)+'"]').tap({force:true}):key(n);
 if(name==='miniVolley'){await page.keyboard.down('Space');await page.clock.runFor(700);await page.keyboard.up('Space');}
 else if(name==='miniRun'){for(let i=0;i<3;i++){await input(2);await page.clock.runFor(220);}}
 else if(name==='miniScan'){await page.clock.runFor(1450);await input(2);}
 else if(name==='miniRhythm'){for(let i=0;i<6;i++){await input(i%2+1);await page.clock.runFor(500);}}
 else if(name==='miniIntercept'){await input(2);await page.clock.runFor(2100);}
 else if(name==='miniLine'){for(let i=0;i<41;i++){const d=await page.evaluate(()=>{const line=document.querySelector('.drill-line'),player=document.querySelector('.line-player');return line&&player?parseFloat(line.style.left)-parseFloat(player.style.left):null;});if(d===null)break;if(Math.abs(d)>4)await input(d>0?2:1);await page.clock.runFor(100);}}
 else if(name==='miniClaim'){await page.clock.runFor(1800);await input(1);}
 else if(name==='miniAngle')await input(3);
 else if(name==='miniBat'){await page.clock.runFor(2100);await key('Space');await page.clock.runFor(650);}
 else if(name==='miniPitch')await key('Space');
 else if(name==='miniTimer'){await page.clock.runFor(2030);await key('Space');}
 else if(name==='miniSteal'){await page.clock.runFor(2550);await key('Space');await page.clock.runFor(650);}
 else if(name==='miniThrow'){await key('Space');await page.clock.runFor(1000);await key('Space');await page.clock.runFor(450);}
 else if(name==='miniSigns'){await page.clock.runFor(2450);for(let i=0;i<3;i++){await key(2);await page.clock.runFor(200);}}
 await page.clock.runFor(1300);const result=await page.evaluate(()=>results);assert.equal(result.length,1,name);assert.ok(result[0].확률>=.7,name+': '+JSON.stringify(result));
}
const pools=await page.evaluate(()=>U.roleDrills),names=[...new Set(Object.values(pools).flat())];assert.equal(names.length,14);assert.equal(Object.values(pools).flat().length,20);
for(const [role,drills]of Object.entries(pools)){assert.equal(drills.length,5);for(const name of drills){await start(name);await success(name);await start(name);await page.clock.runFor(15000);const r=await page.evaluate(()=>results);assert.equal(r.length,1,'timeout '+role+name);assert.ok(r[0].확률<.5,'failure '+role+name);await start(name);await page.evaluate(()=>cancelDrill());await page.clock.runFor(15000);assert.equal(await page.evaluate(()=>results.length),0,'cancel '+name);}}
for(const name of ['miniVolley','miniRun','miniScan','miniRhythm','miniIntercept','miniLine','miniClaim','miniAngle']){await start(name);if(name!=='miniVolley')await success(name,true);else{const box=page.locator('.mg');const b=await box.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+80);await page.mouse.down();await page.clock.runFor(700);await page.mouse.up();await page.clock.runFor(1300);assert.equal(await page.evaluate(()=>results[0].확률),.95);}}
for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});await page.clock.runFor(100);for(const name of names){await start(name);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.evaluate(()=>cancelDrill());}}
// Context is separate from the role fallback, and shares the repeat guard.
const contexts=await page.evaluate(()=>{E.newGame('맥락','공격수','결정력');return E._internal.CARDS().find(c=>c._id==='football-pro_events-006').선택지.map(o=>o.경기맥락);});assert.deepEqual(contexts.map(x=>x.평가능력),['슈팅','패스','위치선정']);
for(const context of contexts){const stats=[];for(let i=0;i<6;i++){const name=await page.evaluate(context=>{window.chosen=null;window.original={};for(const k of Object.keys(U.drillAbilities)){original[k]=U[k];U[k]=cb=>{chosen=k;const m=document.createElement('div');m.className='mg-wrap';document.body.append(m);return()=>m.remove();};}window.stopContext=U.miniGame(()=>{},context);return chosen;},context);stats.push(name);assert.equal(await page.evaluate(n=>U.drillAbilities[n],name),context.평가능력);await page.evaluate(()=>{stopContext();Object.assign(U,original);});}for(let i=2;i<stats.length;i++)assert.ok(!(stats[i]===stats[i-1]&&stats[i]===stats[i-2]));}
await start('miniScan');await page.setViewportSize({width:400,height:844});await page.waitForTimeout(100);await page.clock.runFor(100);assert.equal(await page.locator('.mg-wrap').count(),0);assert.equal(await page.evaluate(()=>results[0].취소),true);
await start('miniVolley');await page.locator('.mg').dispatchEvent('pointercancel');await page.clock.runFor(2000);assert.equal(await page.evaluate(()=>results.length),1);assert.equal(await page.evaluate(()=>results[0].취소),true);
await page.evaluate(()=>{E.newGame('숨김','공격수','결정력');window.beforeHidden=JSON.stringify(E.state());window.hiddenResult=[];U.miniGame(r=>hiddenResult.push(r));Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
assert.equal(await page.locator('.mg-wrap').count(),0);assert.equal(await page.evaluate(()=>hiddenResult[0].취소),true);assert.equal(await page.evaluate(()=>JSON.stringify(E.state())===beforeHidden),true);await page.evaluate(()=>{delete document.hidden;});
await page.route('**/images/minigames/**',route=>route.abort());
for(const name of ['miniVolley','miniRun','miniScan','miniRhythm','miniIntercept','miniLine','miniClaim','miniAngle']) {await start(name);await success(name);}
assert.deepEqual(errors,[]);console.log('PASS 14 unique drills / 20 role slots success-failure-cancel / touch-keyboard / 320-390-1280 / contextual repeat prevention / resize');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
