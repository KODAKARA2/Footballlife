// Each test gets an ephemeral localhost port. No file:// policy bypass required.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');let pending;
exports.url=()=>pending ||= new Promise(resolve=>{
 const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});
 });server.listen(0,'127.0.0.1',()=>{server.unref();resolve('http://127.0.0.1:'+server.address().port+'/');});
});
exports.launchOptions=()=>{
 const configured=process.env.CHROMIUM_PATH;
 const executablePath=configured||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 return {...(executablePath?{executablePath}:{}),args:process.platform==='linux'?['--no-sandbox']:[]};
};
