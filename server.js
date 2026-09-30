const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const root=path.join(__dirname,'public'), dataDir=path.join(__dirname,'data'), dataFile=path.join(dataDir,'content.json');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir,{recursive:true});
if(!fs.existsSync(dataFile)) fs.writeFileSync(dataFile,JSON.stringify({updatedAt:new Date().toISOString()},null,2));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};
function send(res,status,type,body){res.writeHead(status,{'Content-Type':type});res.end(body)}
function readBody(req){return new Promise((resolve,reject)=>{let b='';req.on('data',c=>{b+=c;if(b.length>2e6) req.destroy()});req.on('end',()=>resolve(b));req.on('error',reject)})}
http.createServer(async(req,res)=>{
 const u=url.parse(req.url,true);
 if(u.pathname==='/api/content'&&req.method==='GET') return send(res,200,mime['.json'],fs.readFileSync(dataFile,'utf8'));
 if(u.pathname==='/api/content'&&req.method==='POST'){
  const key=req.headers['x-admin-key']; if(key!==(process.env.ADMIN_KEY||'admin123')) return send(res,401,'text/plain; charset=utf-8','Unauthorized');
  try{const obj=JSON.parse(await readBody(req));obj.updatedAt=new Date().toISOString();fs.writeFileSync(dataFile,JSON.stringify(obj,null,2));return send(res,200,mime['.json'],JSON.stringify({ok:true}))}catch(e){return send(res,400,'text/plain; charset=utf-8','Invalid JSON')}
 }
 let p=u.pathname==='/'?'/index.html':u.pathname; let f=path.normalize(path.join(root,p));
 if(!f.startsWith(root)) return send(res,403,'text/plain; charset=utf-8','Forbidden');
 fs.readFile(f,(e,d)=>e?send(res,404,'text/plain; charset=utf-8','Not found'):send(res,200,mime[path.extname(f)]||'text/plain; charset=utf-8',d));
}).listen(process.env.PORT||3000,()=>console.log('Engineering Student Portal running'));
