
const DB_NAME="feryProfileDB", DB_VER=1, STORE="media";
const DEFAULT_SETTINGS={
  siteName:"Fery Rahmanto, S.Kom.",
  website:"https://artaitsolution.com",
  whatsapp:"081222570583",
  email:"art4fers@gmail.com",
  instagram:"https://instagram.com/f_rahmanto79",
  facebook:"https://facebook.com/ArtaFers"
};
const DEFAULT_LINKS=[
 {id:"l1",title:"Arta IT Solution",url:"https://artaitsolution.com",desc:"Website layanan IT, jaringan, CCTV, komputer, desain dan digital printing."},
 {id:"l2",title:"Instagram",url:"https://instagram.com/f_rahmanto79",desc:"Profil dan karya."},
 {id:"l3",title:"Facebook",url:"https://facebook.com/ArtaFers",desc:"Halaman sosial."}
];
const CLASSES=["Kelas 7","Kelas 8","Kelas 9","Kelas 10","Kelas 11","Kelas 12"];

function getSettings(){try{return {...DEFAULT_SETTINGS,...JSON.parse(localStorage.getItem("fery_settings")||"{}")}}catch(e){return {...DEFAULT_SETTINGS}}}
function saveSettings(v){localStorage.setItem("fery_settings",JSON.stringify(v))}
function getLinks(){try{const x=JSON.parse(localStorage.getItem("fery_links"));return Array.isArray(x)?x:DEFAULT_LINKS}catch(e){return DEFAULT_LINKS}}
function saveLinks(v){localStorage.setItem("fery_links",JSON.stringify(v))}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function normalizeUrl(u){if(!u)return"#";return /^https?:\/\//i.test(u)?u:"https://"+u}
function pageName(){return location.pathname.split("/").pop()||"index.html"}

function initNav(){
 const btn=document.querySelector(".menu-btn"),links=document.querySelector(".links");
 if(btn&&links){btn.addEventListener("click",()=>{links.classList.toggle("open");btn.setAttribute("aria-expanded",links.classList.contains("open"))});
   links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")))}
 const path=pageName();
 document.querySelectorAll(".links a").forEach(a=>{if(a.getAttribute("href")===path)a.classList.add("active")});
 document.querySelectorAll(".year-now").forEach(x=>x.textContent=new Date().getFullYear());
 applySettings();
}
function applySettings(){
 const s=getSettings();
 document.querySelectorAll("[data-site-name]").forEach(x=>x.textContent=s.siteName);
 document.querySelectorAll("[data-site-website]").forEach(x=>{x.href=normalizeUrl(s.website);x.textContent=s.website});
 document.querySelectorAll("[data-whatsapp]").forEach(x=>{x.href="https://wa.me/"+s.whatsapp.replace(/\D/g,"");});
 document.querySelectorAll("[data-email]").forEach(x=>{x.href="mailto:"+s.email;x.textContent=s.email});
 document.querySelectorAll("[data-instagram]").forEach(x=>x.href=normalizeUrl(s.instagram));
 document.querySelectorAll("[data-facebook]").forEach(x=>x.href=normalizeUrl(s.facebook));
}
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:"id",autoIncrement:true})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function dbAdd(item){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(STORE,"readwrite"),r=tx.objectStore(STORE).add(item);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function dbGetAll(){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function dbDelete(id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(STORE,"readwrite").objectStore(STORE).delete(Number(id));r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function mediaURL(blob){return blob?URL.createObjectURL(blob):""}
function isVideoUrl(url){return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url||"")}
function youtubeId(url){const m=String(url||"").match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);return m?m[1]:""}
function videoHTML(x){const src=x.blob?mediaURL(x.blob):normalizeUrl(x.url||"");const yt=youtubeId(src);if(yt)return `<iframe src="https://www.youtube.com/embed/${yt}" title="${esc(x.title||"Video")}" style="width:100%;height:100%;border:0" allowfullscreen></iframe>`;return `<video src="${esc(src)}" controls preload="metadata"></video>`}

document.addEventListener("DOMContentLoaded",initNav);
