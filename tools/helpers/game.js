const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
function load(seed = 42) {
  const store = {}, math = Object.create(Math);
  math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const ctx = {console, Math: math, JSON, Date, localStorage: {
    getItem: k => Object.hasOwn(store, k) ? store[k] : null,
    setItem: (k,v) => store[k] = String(v), removeItem: k => delete store[k]
  }};
  ctx.window = ctx; vm.createContext(ctx);
  const files = [...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/src="([^"]+\.js)"/g)]
    .map(m => m[1]).filter(f => !/ui\.js|panels\.js/.test(f));
  for (const file of files) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
  return {...ctx, store, root, files};
}
module.exports = {load, root};
