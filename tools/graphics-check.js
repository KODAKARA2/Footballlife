// Validate the generated graphics, their references and actual browser layouts.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'tools/results/graphics');
fs.mkdirSync(out, {recursive:true});
(async () => {
  const inventory = JSON.parse(fs.readFileSync(path.join(root,'docs/art-progress.json')));
  const files = fs.readdirSync(path.join(root,'images')).filter(f=>/\.(png|jpe?g|webp)$/.test(f));
  for(const a of inventory.assets) {
    const bytes = fs.readFileSync(path.join(root,a.file));
    assert.notEqual(crypto.createHash('sha256').update(bytes).digest('hex'),a.originalSha256,'Unchanged original: '+a.file);
  }
  const browser = await chromium.launch(require('./helpers/browser').launchOptions());
  const failures=[];const report={checkedAt:new Date().toISOString(),files:files.length,images:[],layouts:[]};
  try {
    const page = await browser.newPage();
    page.on('pageerror',e=>failures.push(e.message));
    await page.goto(await require('./helpers/browser').url());
    report.images = await page.evaluate(async files => {
      const all=[];
      for(const f of files){const im=new Image();im.src='images/'+f;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);const data=ctx.getImageData(0,0,c.width,c.height).data;let clear=0,solid=0;for(let n=3;n<data.length;n+=4){if(data[n]===0)clear++;if(data[n]>=240)solid++;}all.push({file:f,width:im.width,height:im.height,clear,solid});}return all;
    },files);
    for(const im of report.images){assert(im.width>=400 && im.height>=400,im.file+' insufficient resolution');assert(im.solid>10000,im.file+' empty foreground');if(!im.file.startsWith('bg_'))assert(im.clear>1000,im.file+' missing transparency');}
    report.goalkeeperMappings = await page.evaluate(() => {
      E.newGame('매핑검수','골키퍼','빌드업');
      const all=[];
      for(const stage of ['elementary','middle','high','college','pro','mlb']) for(const [looks,suffix] of [[9,''],[5,'_plain'],[1,'_ugly']]) {
        E.state().외모=looks;
        all.push({stage,looks,expected:'hero_'+stage+'_gk'+suffix,keys:U.heroArt(['hero_'+stage])});
      }
      return all;
    });
    for(const mapping of report.goalkeeperMappings) {
      assert.equal(mapping.keys[0],mapping.expected);
      assert(files.includes(mapping.expected+'.png'),mapping.expected+' missing');
      assert(mapping.keys.includes('hero_'+mapping.stage),'Missing generic fallback');
    }
    for(const width of [320,390,1280]){
      await page.setViewportSize({width,height:900});
      await page.reload();await page.screenshot({path:path.join(out,`setup-${width}.png`),fullPage:true});
      for(const pos of ['공격수','골키퍼'])for(const stage of ['초등학교','프로','해외리그']){
        await page.evaluate(({pos,stage})=>{E.newGame('그림검수',pos,pos==='골키퍼'?'빌드업':'결정력');E.enterStage(stage);E.state().나이=stage==='초등학교'?10:stage==='프로'?24:28;E.state().외모=9;U.showGame();},{pos,stage});
        await page.waitForTimeout(200);
        const state = await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,src:document.querySelector('.life img')?.getAttribute('src'),images:[...document.images].filter(i=>i.offsetParent!==null).map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0}))}));
        assert(!state.overflow,`overflow ${width} ${pos} ${stage}`);assert(state.images.every(i=>i.ok),JSON.stringify(state));
        if(pos==='골키퍼') assert(state.images.some(i=>/_gk/.test(i.src)), 'Missing goalkeeper art '+stage);
        await page.screenshot({path:path.join(out,`${pos}-${stage}-${width}.png`),fullPage:true});
        report.layouts.push({width,pos,stage,...state});
      }
    }
    assert.deepEqual(failures,[]);report.passed=true;
    fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log('Graphics PASS:',files.length,'files,',report.layouts.length,'layouts');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
