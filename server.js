const express=require("express");
const cors=require("cors");
const path=require("path");
const fs=require("fs");
const jwt=require("jsonwebtoken");
const app=express();
const PORT=process.env.PORT||3000;
const JWT_SECRET=process.env.JWT_SECRET||"change-this-secret";
const dataDir=path.join(__dirname,"data"), publicDir=path.join(__dirname,"public");
fs.mkdirSync(dataDir,{recursive:true});
app.use(cors()); app.use(express.json({limit:"2mb"})); app.use(express.urlencoded({extended:true})); app.use(express.static(publicDir));
const files={resources:path.join(dataDir,"resources.json"),announcements:path.join(dataDir,"announcements.json"),projects:path.join(dataDir,"projects.json"),calendar:path.join(dataDir,"calendar.json")};
function read(f,d=[]){try{return JSON.parse(fs.readFileSync(f,"utf8"))}catch{return d}}
function write(f,d){fs.writeFileSync(f,JSON.stringify(d,null,2))}
if(!fs.existsSync(files.resources))write(files.resources,[
{id:1,type:"Coding",title:"GeeksforGeeks",description:"DSA, programming and interview preparation.",url:"https://www.geeksforgeeks.org/data-structures/"},
{id:2,type:"Coding",title:"LeetCode",description:"Coding problems and interview practice.",url:"https://leetcode.com/problemset/"},
{id:3,type:"Coding",title:"HackerRank",description:"Programming and SQL practice.",url:"https://www.hackerrank.com/domains"},
{id:4,type:"Learning",title:"freeCodeCamp",description:"Free programming and web development courses.",url:"https://www.freecodecamp.org/learn/"},
{id:5,type:"Learning",title:"NPTEL",description:"Engineering courses from IITs and IISc.",url:"https://nptel.ac.in/courses"},
{id:6,type:"Learning",title:"SWAYAM",description:"Online courses and learning resources.",url:"https://swayam.gov.in/explorer"},
{id:7,type:"Aptitude",title:"IndiaBix",description:"Quantitative aptitude, reasoning and verbal practice.",url:"https://www.indiabix.com/aptitude/questions-and-answers/"},
{id:8,type:"Technical",title:"Programiz",description:"Programming tutorials and examples.",url:"https://www.programiz.com/tutorial"},
{id:9,type:"Technical",title:"W3Schools",description:"Web, SQL, programming and reference tutorials.",url:"https://www.w3schools.com/"},
{id:10,type:"Interview",title:"InterviewBit",description:"Coding and interview preparation resources.",url:"https://www.interviewbit.com/courses/programming/"}]);
for(const k of ["announcements","projects","calendar"])if(!fs.existsSync(files[k]))write(files[k],[]);
const ADMIN_EMAIL=process.env.ADMIN_EMAIL||"admin@college.com",ADMIN_PASSWORD=process.env.ADMIN_PASSWORD||"admin123";
app.post("/api/login",(q,s)=>{const{email,password}=q.body;if(!email||!password)return s.status(400).json({message:"Email and password are required."});if(email.toLowerCase()!=ADMIN_EMAIL.toLowerCase()||password!=ADMIN_PASSWORD)return s.status(401).json({message:"Invalid admin login."});s.json({token:jwt.sign({email:ADMIN_EMAIL,role:"admin"},JWT_SECRET,{expiresIn:"12h"}),user:{email:ADMIN_EMAIL,role:"admin"}})});
function adminOnly(q,s,n){const h=q.headers.authorization||"";if(!h.startsWith("Bearer "))return s.status(401).json({message:"Admin login required."});try{const d=jwt.verify(h.slice(7),JWT_SECRET);if(d.role!="admin")return s.status(403).json({message:"Admin access required."});q.admin=d;n()}catch{s.status(401).json({message:"Admin session expired. Please login again."})}}
function crud(name,file,required=[]){app.get("/api/"+name,(q,s)=>s.json(read(file)));app.post("/api/"+name,adminOnly,(q,s)=>{for(const x of required)if(!q.body[x])return s.status(400).json({message:x+" is required."});const d=read(file),item={id:Date.now(),...q.body};d.unshift(item);write(file,d);s.json({message:name+" added successfully.",item})});app.put("/api/"+name+"/:id",adminOnly,(q,s)=>{const d=read(file),i=d.findIndex(x=>String(x.id)==String(q.params.id));if(i<0)return s.status(404).json({message:"Item not found."});d[i]={...d[i],...q.body};write(file,d);s.json({message:"Item updated successfully.",item:d[i]})});app.delete("/api/"+name+"/:id",adminOnly,(q,s)=>{write(file,read(file).filter(x=>String(x.id)!=String(q.params.id)));s.json({message:"Item deleted successfully."})})}
crud("resources",files.resources,["type","title","url"]);crud("announcements",files.announcements,["title","message"]);crud("projects",files.projects,["title","description"]);crud("calendar",files.calendar,["title","date"]);
app.get("/api/health",(q,s)=>s.json({ok:true,message:"Engineering Student Portal is running."}));
app.get("*",(q,s)=>s.sendFile(path.join(publicDir,"index.html")));
app.listen(PORT,()=>console.log("Portal running on port "+PORT));
