const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch(require('./helpers/browser').launchOptions());try{
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(await require('./helpers/browser').url());
await page.evaluate(()=>{E.newGame('복구 검사','수비수','대인 수비');U.showGame();});
const raw=await page.evaluate(()=>E.exportSave());await page.evaluate(()=>U.openSave());
await page.locator('.import-save').setInputFiles({name:'career.json',mimeType:'application/json',buffer:Buffer.from(raw)});
await page.locator('.save-preview button').filter({hasText:'취소'}).click();assert.equal(await page.locator('.save-preview button').count(),0);
await page.locator('.import-save').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{')});assert.match(await page.locator('.save-status').innerText(),/JSON/);assert.equal(await page.evaluate(()=>E.state().이름),'복구 검사');
await page.locator('.import-save').setInputFiles({name:'injected.json',mimeType:'application/json',buffer:Buffer.from(raw.replace('복구 검사','<img src=x onerror=alert(1)>'))});assert.match(await page.locator('.save-status').innerText(),/허용/);
await page.locator('.sheet-close').click();await page.evaluate(()=>{E.reset();U.showSetup();U.openSave();});
await page.locator('.import-save').setInputFiles({name:'restore.json',mimeType:'application/json',buffer:Buffer.from(raw)});await page.locator('.save-preview button').filter({hasText:'확인'}).click();assert.equal(await page.locator('#top').count(),1);assert.equal(await page.evaluate(()=>E.state().이름),'복구 검사');
for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});await page.evaluate(()=>U.openSave());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.locator('.sheet-close').click();}
// Quota failures are visible; export contains current in-memory progress.
await page.evaluate(()=>{window.savedSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('quota','QuotaExceededError');};E.state().이름='저장 실패 후 진행';E.save();});assert.match(await page.locator('#save-error').innerText(),/실패/);assert.equal(await page.evaluate(()=>JSON.parse(E.exportSave()).career.이름),'저장 실패 후 진행');await page.evaluate(()=>{Storage.prototype.setItem=savedSet;});
assert.deepEqual(errors,[]);console.log('PASS import preview / cancel / damaged & HTML rejected / restore from setup / quota notification / 320-390-1280');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
