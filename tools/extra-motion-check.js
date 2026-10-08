const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch(require('./helpers/browser').launchOptions());try{
const names=['miniRun','miniScan','miniRhythm','miniIntercept','miniLine','miniClaim','miniAngle'];
fs.mkdirSync('/tmp/extra-motion-shots',{recursive:true});
for(const width of [320,390,1280]){
 const p=await browser.newPage({viewport:{width,height:844},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('football-life-feedback-v1',JSON.stringify({muted:true,volume:.22,reduced:false}));window.starts=0;const old=AudioContext.prototype.createOscillator;AudioContext.prototype.createOscillator=function(){starts++;return old.apply(this,arguments);};});
 await p.goto(await require('./helpers/browser').url());await p.clock.install();await p.clock.pauseAt(await p.evaluate(()=>Date.now()));
 const start=async name=>p.evaluate(name=>{Math.random=()=>.5;window.results=[];window.sounds=[];window.frames=0;if(!window.originalPlay){originalPlay=Feedback.play;originalFrame=Feedback.frame;Feedback.play=k=>{sounds.push(k);return originalPlay(k);};Feedback.frame=(...a)=>{frames++;return originalFrame(...a);};}window.before=JSON.stringify(localStorage);window.cancelDrill=U[name](r=>results.push(r));},name);
 const input=async n=>width===390?p.locator('[data-input="'+(n-1)+'"]').tap():p.keyboard.press(String(n));
 async function resolve(name){
  if(name==='miniRun'){for(let i=0;i<3;i++){await input(2);if(i<2)await p.clock.runFor(220);}}
  if(name==='miniScan'){await p.clock.runFor(1450);await input(2);}
  if(name==='miniRhythm'){for(let i=0;i<6;i++){await input(i%2+1);if(i<5)await p.clock.runFor(500);}}
  if(name==='miniIntercept'){await input(2);await p.clock.runFor(2010);}
  if(name==='miniLine'){for(let i=0;i<40;i++){const delta=await p.evaluate(()=>parseFloat(document.querySelector('.drill-line').style.left)-parseFloat(document.querySelector('.line-player').style.left));if(Math.abs(delta)>4)await input(delta>0?2:1);await p.clock.runFor(100);}await p.clock.runFor(20);}
  if(name==='miniClaim'){await p.clock.runFor(1800);await input(1);}
  if(name==='miniAngle')await input(3);
 }
 for(const name of names){
  await start(name);await resolve(name);assert.equal(await p.locator('.mg-wrap').getAttribute('data-presentation'),'resolving',name);await p.keyboard.press('1'); // disabled input must not resolve twice
  await p.clock.runFor(600);assert.equal(await p.locator('.drill-outcome').isVisible(),true,name);assert.equal(await p.evaluate(()=>results.length),0,name);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===390)await p.screenshot({path:'/tmp/extra-motion-shots/'+name+'.png'});
  await p.clock.runFor(1200);assert.equal(await p.evaluate(()=>results.length),1);assert.ok(await p.evaluate(()=>results[0].확률>=.7),name);assert.equal(await p.evaluate(()=>JSON.stringify(localStorage)===before),true);assert.equal(await p.evaluate(()=>starts),0,'muted '+name);
  await start(name);await p.clock.runFor(17000);assert.equal(await p.evaluate(()=>results.length),1);assert.ok(await p.evaluate(()=>results[0].확률<.5));
  for(const mode of ['cancel','remove','hidden','resize']){await start(name);await resolve(name);await p.evaluate(mode=>{if(mode==='cancel')cancelDrill();if(mode==='remove')document.querySelector('.mg-wrap').remove();if(mode==='resize')window.dispatchEvent(new Event('resize'));if(mode==='hidden'){Object.defineProperty(document,'hidden',{value:true,configurable:true});document.dispatchEvent(new Event('visibilitychange'));delete document.hidden;}},mode);await p.clock.runFor(100);const frames=await p.evaluate(()=>window.frames);await p.clock.runFor(2500);assert.equal(await p.evaluate(()=>window.frames),frames,'frames after '+mode+' '+name);assert.deepEqual(await p.evaluate(()=>results),mode==='hidden'||mode==='resize'?[{취소:true}]:[]);}
  await p.evaluate(()=>document.documentElement.dataset.reducedMotion='true');await start(name);await resolve(name);assert.equal(await p.locator('.drill-outcome').isVisible(),true);await p.clock.runFor(1200);assert.equal(await p.evaluate(()=>results.length),1);await p.evaluate(()=>document.documentElement.dataset.reducedMotion='false');
 }
 // High cross has a distinct punch trajectory; a wrong choice keeps the old failure grade.
 await p.evaluate(()=>{Math.random=()=>.25;results=[];cancelDrill=U.miniClaim(r=>results.push(r));});await p.clock.runFor(1800);await input(2);await p.clock.runFor(600);assert.equal(await p.locator('.drill-outcome').textContent(),'펀칭 성공!');assert.ok(await p.locator('.drill-ball').evaluate(el=>parseFloat(el.style.left)<50));await p.clock.runFor(1200);assert.equal(await p.evaluate(()=>results[0].확률),.95);
 await p.evaluate(()=>{Math.random=()=>.25;results=[];cancelDrill=U.miniClaim(r=>results.push(r));});await p.clock.runFor(1800);await input(1);await p.clock.runFor(1800);assert.equal(await p.evaluate(()=>results[0].확률),.05);
 assert.deepEqual(errors,[]);await p.close();
}console.log('PASS seven role motions: successful/failing resolution, repeat guard, cancel/remove/hidden/resize/restart, muted no oscillators, reduced motion, unchanged storage, keyboard/touch, 320/390/1280');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
