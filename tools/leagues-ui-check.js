const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright'),helper=require('./helpers/browser');
const out=process.argv[2]||path.join(__dirname,'results/leagues-ui');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch(helper.launchOptions()),report=[];
 try{
  for(const width of [320,390,1280]){
   const context=await browser.newContext({viewport:{width,height:900},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(await helper.url());await page.clock.install();
   for(const [li,id] of ['football-mlb_cards-001','football-mlb_cards-002','football-pro_events-001'].entries()){
    await page.evaluate(id=>{
     const s=E.newGame('리그선택검사','공격수','결정력');E.enterStage('프로');s.나이=26;s.연차=5;s.돈=90000;s.플래그.계약만료=id!=='football-mlb_cards-001';for(const k in s.능력치)s.능력치[k]=80;
     s.현재카드=E._internal.clone(E._internal.CARDS().find(c=>c._id===id));s.단계='카드';s.결과=null;E.refreshOptions();window.offerIndex=s.현재옵션.findIndex(i=>s.현재카드.선택지[i].이동==='해외리그');U.showGame();
    },id);
    await page.clock.runFor(800);
    const snapshot=await page.evaluate(()=>JSON.stringify(E.state())),index=await page.evaluate(()=>offerIndex);
    await page.locator('#actions .opt').nth(index).tap();await page.evaluate(i=>{U.choose(i);U.choose(i)},index);
    assert.equal(await page.evaluate(()=>E.state().시기),'프로');assert(await page.evaluate(()=>!!E.state().리그선택대기));
    await page.clock.runFor(800);
    assert.equal(await page.locator('#actions .opt').count(),4);
    assert(await page.getByRole('button',{name:/EPL · 잉글랜드/}).isVisible());assert(await page.getByRole('button',{name:/라리가 · 스페인/}).isVisible());assert(await page.getByRole('button',{name:/분데스리가 · 독일/}).isVisible());
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:path.join(out,`selector-${width}-${li}.png`),fullPage:true});
    const pending=await page.evaluate(()=>JSON.stringify(E.state()));await page.reload();await page.clock.runFor(800);assert.equal(await page.evaluate(()=>JSON.stringify(E.state())),pending);
    await page.getByRole('button',{name:/취소 · 제안으로 돌아가기/}).tap();await page.clock.runFor(800);assert.equal(await page.evaluate(()=>JSON.stringify(E.state())),snapshot);
    await page.locator('#actions .opt').nth(index).tap();await page.clock.runFor(800);
    await page.locator('#actions .opt').nth(li).tap();await page.evaluate(li=>{U.choose(li);U.choose(li)},li);await page.clock.runFor(800);
    const state=await page.evaluate(()=>E.state());assert.equal(state.시기,'해외리그');assert.equal(state.해외리그아이디,['epl','laliga','bundesliga'][li]);assert.equal(state.돈,90000+(li===0?12000:16000));assert.equal(state.나이,26);assert.equal(state.팀이동,1);
    assert((await page.locator('#top').innerText()).includes(['EPL','라리가','분데스리가'][li]));
    assert((await page.locator('#card .back').innerText()).includes(['EPL','라리가','분데스리가'][li]));
    const confirmed=await page.evaluate(()=>JSON.stringify(E.state()));await page.reload();await page.clock.runFor(800);assert.equal(await page.evaluate(()=>JSON.stringify(E.state())),confirmed);
    await page.getByRole('button',{name:'메뉴',exact:true}).click();await page.getByRole('button',{name:'📊 커리어 기록',exact:true}).click();assert((await page.locator('.modal').innerText()).includes(['EPL','라리가','분데스리가'][li]));await page.screenshot({path:path.join(out,`contract-${width}-${li}.png`),fullPage:true});await page.evaluate(()=>U.closeModals());
    report.push({width,entry:id,league:state.해외리그아이디,cancel:true,reload:true,rapidInput:true});
   }
   assert.deepEqual(errors,[]);await context.close();
  }
  fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS league selector touch, cancel, rapid input, save/reload, contract and result labels: '+report.length+' cases');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
