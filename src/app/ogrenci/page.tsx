import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CalendarClock, ClipboardList, FileText, Link2, MapPin, MessageSquareQuote,
  NotebookPen, PlayCircle, Video, ArrowRight, Sparkles, Target,
  BookOpen, Send, CheckCircle2, Clock3
} from "lucide-react";
import { requireStudent, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureResourceSchema } from "@/lib/ensureResourceSchema";
import { getGradeById, guessGradeId } from "@/lib/curriculum";
import StudentPasswordChange from "@/components/StudentPasswordChange";
import StudentProfileSettings from "@/components/StudentProfileSettings";
import StudentTestimonial from "@/components/StudentTestimonial";
import StudentWorkForm from "@/components/StudentWorkForm";
import StudentMessageLink from "@/components/messages/StudentMessageLink";

export const metadata = { title: "Öğrenci Paneli | Orhan Yaşlı", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Resource = { id:string; title:string; description:string|null; type:string; url:string|null; body:string|null; category:string|null; pinned:boolean };
const TYPE_ICON: Record<string, React.ReactNode> = {
  LINK:<Link2 strokeWidth={1.8}/>, VIDEO:<PlayCircle strokeWidth={1.8}/>,
  FILE:<FileText strokeWidth={1.8}/>, NOTE:<NotebookPen strokeWidth={1.8}/>
};
const TYPE_OPEN:Record<string,string>={LINK:"Bağlantıyı aç",VIDEO:"Videoyu izle",FILE:"Dosyayı aç"};
const NOTE_HEADINGS=["Araştırmanın Amacı","Yöntem ve Denekler","Bulgular ve Sonuç","Psikolojik Yorum"];

function splitNoteBody(body:string){const m=body.match(/^Kaynak:\s*(https?:\S+)\s*$/m);if(!m)return{text:body,sourceUrl:null};return{text:body.slice(0,m.index).replace(/\s+$/,""),sourceUrl:m[1]}}
function renderNoteBody(text:string){return text.split("\n\n").map((block,i)=>{const nl=block.indexOf("\n");const first=nl===-1?block:block.slice(0,nl);if(NOTE_HEADINGS.includes(first.trim())){const rest=nl===-1?"":block.slice(nl+1);return <div key={i}><strong className="resource-note-heading">{first.trim()}</strong>{rest&&<p>{rest}</p>}</div>}return <p key={i}>{block}</p>})}
function ResourceItem({r}:{r:Resource}){const note=r.type==="NOTE"&&r.body?splitNoteBody(r.body):null;return <div className="resource-item"><span className="resource-icon">{TYPE_ICON[r.type]??TYPE_ICON.LINK}</span><div className="resource-main">{r.category&&<span className="resource-cat">{r.category}</span>}<h4 className="resource-title">{r.title}</h4>{r.description&&<p className="resource-desc">{r.description}</p>}{note&&<details className="resource-note"><summary>Notu oku</summary>{renderNoteBody(note.text)}{note.sourceUrl&&<a className="resource-open" href={note.sourceUrl} target="_blank" rel="noopener noreferrer">Kaynağı aç →</a>}</details>}{r.type!=="NOTE"&&r.url&&<a className="resource-open" href={r.url} target="_blank" rel="noopener noreferrer">{TYPE_OPEN[r.type]||"Aç"} →</a>}</div></div>}

type NextMeeting={title:string;date:Date;type:string;kind:"appointment"|"session"};
async function getNextMeeting(clientId:string|null):Promise<NextMeeting|null>{if(!clientId)return null;const now=new Date();try{const[a,s]=await Promise.all([prisma.appointment.findFirst({where:{clientId,date:{gte:now},status:{notIn:["CANCELLED","IPTAL"]}},orderBy:{date:"asc"},select:{title:true,date:true,type:true}}),prisma.session.findFirst({where:{clientId,date:{gte:now},status:"PLANNED"},orderBy:{date:"asc"},select:{title:true,date:true,type:true}})]);const c:NextMeeting[]=[];if(a)c.push({...a,kind:"appointment"});if(s)c.push({...s,kind:"session"});return c.sort((x,y)=>x.date.getTime()-y.date.getTime())[0]??null}catch{return null}}
async function getLatestFeedback(studentId:string){try{return await prisma.studentWork.findFirst({where:{studentId,feedback:{not:null}},orderBy:[{feedbackAt:"desc"},{createdAt:"desc"}],select:{title:true,feedback:true,feedbackAt:true,createdAt:true}})}catch{return null}}
async function getProgress(studentId:string,gradeId:string){try{const grade=getGradeById(gradeId);const topicIds=grade?.subjects.flatMap(s=>s.topics.map(t=>t.id))??[];const[checked,works,pending]=await Promise.all([topicIds.length?prisma.topicProgress.count({where:{studentId,topicId:{in:topicIds},checkedAt:{not:null}}}):Promise.resolve(0),prisma.studentWork.count({where:{studentId}}),prisma.studentWork.count({where:{studentId,seen:false}})]);return{total:topicIds.length,checked,works,pending}}catch{return{total:0,checked:0,works:0,pending:0}}}
const DATE_FMT=new Intl.DateTimeFormat("tr-TR",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});

export default async function StudentDashboard(){
 await ensureResourceSchema();
 const student=await requireStudent();if(!student)redirect("/ogrenci/giris");
 const gradeId=guessGradeId(student.gradeLevel);
 const[nextMeeting,latestFeedback,progress,personal,library]=await Promise.all([
  getNextMeeting(student.clientId),getLatestFeedback(student.id),getProgress(student.id,gradeId),
  prisma.resource.findMany({where:{studentId:student.id,published:true},orderBy:[{pinned:"desc"},{createdAt:"desc"}]}),
  prisma.resource.findMany({where:{studentId:null,published:true,isTemplate:false},orderBy:[{pinned:"desc"},{createdAt:"desc"}]})
 ]);
 const first=student.name.split(" ")[0];const pct=progress.total?Math.round(progress.checked/progress.total*100):0;
 return <div className="student-shell student-os">
  <header className="student-top"><div className="student-top-inner"><div className="student-brand"><svg viewBox="0 0 48 48" width="28" height="28"><g fill="none" stroke="var(--clr-primary)" strokeWidth="3.4" strokeLinecap="round"><path d="M24 10v28"/><path d="M12 12v7c0 7 5 11 12 11s12-4 12-11v-7"/></g></svg><span>Öğrenci OS</span></div><div className="student-top-actions"><Link href="/" className="student-back-link">← Siteye dön</Link><form action={async()=>{"use server";await signOut({redirectTo:"/"})}}><button type="submit" className="student-logout">Çıkış Yap</button></form></div></div></header>
  <main className="student-main">
   <section className="student-os-hero">
    <div><span className="student-os-kicker"><Sparkles size={14}/> KİŞİSEL ÇALIŞMA MERKEZİ</span><h1>Merhaba {first}.<br/><em>Bugün ilerleyelim.</em></h1><p>Ne yapacağını aramak yerine, sıradaki doğru adıma odaklan.</p></div>
    <div className="student-os-score"><span>Genel konu ilerlemen</span><strong>{pct}%</strong><div><i style={{width:`${pct}%`}}/></div><small>{progress.checked} tamamlanan konu · {progress.works} çalışma gönderildi</small></div>
   </section>

   <nav className="student-os-actions" aria-label="Hızlı işlemler">
    <StudentMessageLink/>
    <a href="#calisma-gonder"><Send/><span><b>Çalışma gönder</b><small>Bugünkü emeğini kaydet</small></span><ArrowRight/></a>
    <Link href="/ogrenci/mufredat"><Target/><span><b>Konu takibi</b><small>{pct ? `%${pct} ilerleme` : "İlerlemeni başlat"}</small></span><ArrowRight/></Link>
    <Link href="/testler"><ClipboardList/><span><b>Testler</b><small>Kendini değerlendir</small></span><ArrowRight/></Link>
    <a href="#kaynaklar"><BookOpen/><span><b>Kaynaklar</b><small>{personal.length+library.length} içerik</small></span><ArrowRight/></a>
   </nav>

   <div className="student-os-grid">
    <section className="student-os-panel student-os-next"><span className="student-os-label">SIRADAKİ GÖRÜŞME</span>{nextMeeting?<><div className="student-os-panel-icon"><CalendarClock/></div><h2><time dateTime={nextMeeting.date.toISOString()}>{DATE_FMT.format(nextMeeting.date)}</time></h2><p>{nextMeeting.type==="ONLINE"?<Video/>:<MapPin/>}{nextMeeting.title} · {nextMeeting.type==="ONLINE"?"Online":"Yüz yüze"}</p></>:<><div className="student-os-panel-icon muted"><Clock3/></div><h2>Şimdilik planlanmış görüşme yok.</h2><p>Yeni görüşme planlandığında burada göreceksin.</p></>}</section>
    <section className="student-os-panel student-os-feedback"><span className="student-os-label">KOÇUNDAN SON DÖNÜT</span>{latestFeedback?.feedback?<><div className="student-os-panel-icon"><MessageSquareQuote/></div><blockquote>“{latestFeedback.feedback}”</blockquote><p>{latestFeedback.title||"Çalışma dönütü"} · {DATE_FMT.format(latestFeedback.feedbackAt??latestFeedback.createdAt)}</p></>:<><div className="student-os-panel-icon muted"><MessageSquareQuote/></div><h2>Henüz dönüt yok.</h2><p>Çalışmanı gönder; değerlendirildiğinde burada öne çıkacak.</p></>}</section>
   </div>

   {progress.pending>0&&<div className="student-os-notice"><CheckCircle2/><span><b>{progress.pending} çalışman koçuna ulaştı.</b> Değerlendirildiğinde dönütünü burada göreceksin.</span></div>}

   <StudentWorkForm/>

   <section className="student-section student-os-resources" id="kaynaklar"><div className="student-section-head"><h2>Sana Özel İçerikler</h2><span className="student-section-count">{personal.length}</span></div>{personal.length===0?<div className="student-empty">Henüz sana özel bir içerik yok.</div>:<div className="resource-list">{personal.map(r=><ResourceItem key={r.id} r={r as Resource}/>)}</div>}</section>
   <section className="student-section student-os-resources"><div className="student-section-head"><h2>Kaynak Kütüphanesi</h2><span className="student-section-count">{library.length}</span></div>{library.length===0?<div className="student-empty">Yeni kaynaklar eklendiğinde burada görünecek.</div>:<div className="resource-list">{library.map(r=><ResourceItem key={r.id} r={r as Resource}/>)}</div>}</section>
   <div className="student-os-secondary"><StudentTestimonial/><StudentProfileSettings name={student.name} email={student.email} gradeLevel={student.gradeLevel}/><StudentPasswordChange/></div>
  </main>
 </div>
}
