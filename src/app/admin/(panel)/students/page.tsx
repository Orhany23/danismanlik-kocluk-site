"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAdminDialog } from "@/components/admin/DialogProvider";
import { CardListSkeleton } from "@/components/admin/Skeleton";
import { AlertCircle, ArrowRight, CalendarClock, CheckCircle2, Search, Target, UserRound, Zap } from "lucide-react";

type Student = {
 id:string;name:string;email:string;gradeLevel:string|null;active:boolean;createdAt:string;
 client?:{id:string;name:string}|null;birthYear?:number|null;guardianName?:string|null;guardianPhone?:string|null;
 lastWork?:{createdAt:string;seen:boolean;feedback:string|null}|null;lastTest?:{createdAt:string}|null;
 nextMeeting?:{date:string;title:string;kind:string}|null;workCount:number;testCount:number;checkedTopics:number;
 daysSinceWork:number|null;needsAttention:boolean;
};
const fmt=(v:string)=>new Date(v).toLocaleDateString("tr-TR",{day:"2-digit",month:"short"});
const meetingFmt=(v:string)=>new Date(v).toLocaleString("tr-TR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});

export default function AdminStudentsPage(){
 const{confirm,alert}=useAdminDialog();const[students,setStudents]=useState<Student[]>([]);const[loading,setLoading]=useState(true);
 const[query,setQuery]=useState("");const[filter,setFilter]=useState<"attention"|"active"|"all">("attention");const[linking,setLinking]=useState<string|null>(null);
 const load=()=>{fetch("/api/admin/students",{cache:"no-store"}).then(r=>r.json()).then(d=>setStudents(d.students||[])).catch(()=>setStudents([])).finally(()=>setLoading(false))};
 useEffect(load,[]);
 const visible=useMemo(()=>students.filter(s=>{if(filter==="attention"&&!s.needsAttention)return false;if(filter==="active"&&!s.active)return false;const q=query.toLocaleLowerCase("tr-TR").trim();return !q||`${s.name} ${s.email} ${s.gradeLevel??""}`.toLocaleLowerCase("tr-TR").includes(q)}),[students,query,filter]);
 const attention=students.filter(s=>s.needsAttention).length, active=students.filter(s=>s.active).length;
 const linkStudent=async(s:Student)=>{const ok=await confirm({title:`${s.name} için danışan kaydı oluşturulsun mu?`,description:"Böylece randevu ve seans planlayabilirsin.",confirmLabel:"Oluştur ve bağla"});if(!ok)return;setLinking(s.id);try{const res=await fetch(`/api/admin/students/${s.id}/link`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({create:true})});const d=await res.json().catch(()=>({}));if(res.ok)load();else await alert({title:"Bağlantı kurulamadı",description:d.error||"Tekrar deneyin."})}finally{setLinking(null)}};
 const toggleActive=async(s:Student)=>{const active=!s.active;if(!active&&!await confirm({title:`${s.name} askıya alınsın mı?`,description:"Öğrenci hesabıyla giriş yapamaz.",confirmLabel:"Askıya al",tone:"danger"}))return;setStudents(p=>p.map(x=>x.id===s.id?{...x,active}:x));await fetch(`/api/admin/students/${s.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({active})}).catch(load)};
 if(loading)return <CardListSkeleton rows={5}/>;
 return <div className="student-radar space-y-6">
  <section className="radar-head"><div><span><Zap size={14}/> ÖĞRENCİ RADARI</span><h1>Kimin sana ihtiyacı var?</h1><p>Çalışma ritmi ve yaklaşan görüşmelere göre öğrencileri tek bakışta önceliklendir.</p></div><div className="radar-summary"><b>{attention}</b><span>öğrenci dikkat istiyor</span></div></section>
  <div className="radar-toolbar"><div className="radar-filters">{([["attention",`Dikkat gereken · ${attention}`],["active",`Aktif · ${active}`],["all",`Tümü · ${students.length}`]] as const).map(([k,l])=><button key={k} onClick={()=>setFilter(k)} className={filter===k?"is-active":""}>{l}</button>)}</div><label className="radar-search"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Öğrenci ara…"/></label></div>
  {visible.length===0?<div className="radar-empty"><CheckCircle2/><b>Bu görünüm temiz.</b><span>Filtreye uyan öğrenci bulunmuyor.</span></div>:<div className="radar-list">{visible.map(s=><article className={`radar-card ${s.needsAttention?"needs-attention":""}`} key={s.id}>
   <div className="radar-person"><span className="radar-avatar">{s.name.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()}</span><div><h2>{s.name}</h2><p>{s.gradeLevel||"Hedef belirtilmemiş"} · {s.email}</p>{s.guardianName&&<small>Veli: {s.guardianName} · {s.guardianPhone}</small>}</div></div>
   <div className="radar-signals">
    <div><span>Son çalışma</span><b className={s.daysSinceWork===null||s.daysSinceWork>=7?"warn":""}>{s.daysSinceWork===null?"Yok":s.daysSinceWork===0?"Bugün":`${s.daysSinceWork} gün önce`}</b></div>
    <div><span>Çalışma / Test</span><b>{s.workCount} / {s.testCount}</b></div>
    <div><span>Tamamlanan konu</span><b>{s.checkedTopics}</b></div>
    <div><span>Sıradaki görüşme</span><b>{s.nextMeeting?meetingFmt(s.nextMeeting.date):"Plan yok"}</b></div>
   </div>
   <div className="radar-reason">{s.needsAttention?<><AlertCircle/><span>{!s.lastWork?"Henüz çalışma göndermedi.":s.lastWork&&!s.lastWork.seen?"Yeni çalışması değerlendirilmeyi bekliyor.":s.daysSinceWork!==null&&s.daysSinceWork>=7?"Çalışma ritmi 7 günü geçti.":s.nextMeeting?"Görüşmesi yaklaşıyor.":"Takip öneriliyor."}</span></>:<><CheckCircle2/><span>Takip akışı güncel görünüyor.</span></>}</div>
   <div className="radar-actions">
    <Link href={`/admin/work?student=${s.id}`}>Çalışmaları <ArrowRight/></Link>
    <Link href={`/admin/mufredat?student=${s.id}`}><Target/> Konu takibi</Link>
    {s.client?<Link href={`/admin/clients/${s.client.id}`}><UserRound/> Danışan profili</Link>:<button onClick={()=>linkStudent(s)} disabled={linking===s.id}>{linking===s.id?"Bağlanıyor…":"Danışana bağla"}</button>}
    <button className="radar-state" onClick={()=>toggleActive(s)}>{s.active?"Askıya al":"Aktifleştir"}</button>
   </div>
  </article>)}</div>}
 </div>
}
