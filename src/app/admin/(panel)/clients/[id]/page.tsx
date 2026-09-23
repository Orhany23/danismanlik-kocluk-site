"use client";
import { useCallback,useEffect,useMemo,useState } from "react";
import { useParams,useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminDialog } from "@/components/admin/DialogProvider";
import { CardListSkeleton } from "@/components/admin/Skeleton";
import { ArrowLeft,BrainCircuit,CalendarClock,CheckCircle2,ClipboardCheck,GraduationCap,MessageSquareQuote,NotebookPen,Target,TestTube2 } from "lucide-react";

type Appointment={id:string;title:string;date:string;duration:number;status:string;notes:string|null};
type SessionRow={id:string;title:string;date:string;duration:number;status:string;notes:string|null;mood?:string|null;followUp?:string|null};
type Work={id:string;type:string;title:string|null;note:string|null;seen:boolean;feedback:string|null;feedbackAt:string|null;createdAt:string};
type Topic={topicId:string;checkedAt:string|null;feedback:string|null;feedbackAt:string|null};
type Test={id:string;testTitle:string;score:number|null;maxScore:number|null;resultLabel:string;createdAt:string};
type Student={id:string;name:string;email:string;gradeLevel:string|null;active:boolean;works:Work[];topicProgress:Topic[];testSubmissions:Test[];_count:{works:number;resources:number;testSubmissions:number}};
type Client={id:string;name:string;phone:string;email:string|null;notes:string|null;createdAt:string;appointments:Appointment[];sessions:SessionRow[];student:Student|null};
const fmt=(v:string)=>new Date(v).toLocaleString("tr-TR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});

export default function ClientDetailPage(){
 const{confirm,alert}=useAdminDialog();const{id}=useParams<{id:string}>();const router=useRouter();const[now]=useState(()=>Date.now());const[client,setClient]=useState<Client|null>(null);const[loading,setLoading]=useState(true);const[notes,setNotes]=useState("");const[saving,setSaving]=useState(false);const[saved,setSaved]=useState(false);
 const load=useCallback(()=>{fetch(`/api/clients/${id}`,{cache:"no-store"}).then(r=>r.ok?r.json():null).then((d:Client|null)=>{setClient(d);setNotes(d?.notes??"")}).catch(()=>setClient(null)).finally(()=>setLoading(false))},[id]);useEffect(load,[load]);
 const saveNotes=async()=>{if(!client)return;setSaving(true);setSaved(false);try{const r=await fetch(`/api/clients/${client.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:client.name,email:client.email,phone:client.phone,notes})});if(r.ok){setSaved(true);setTimeout(()=>setSaved(false),2200)}}finally{setSaving(false)}};
 const intelligence=useMemo(()=>{if(!client)return null;const student=client.student;const upcoming=[...client.appointments.filter(x=>new Date(x.date).getTime()>=now&&!["CANCELLED","IPTAL"].includes(x.status)).map(x=>({...x,kind:"Randevu"})),...client.sessions.filter(x=>new Date(x.date).getTime()>=now&&x.status==="PLANNED").map(x=>({...x,kind:"Seans"}))].sort((a,b)=>+new Date(a.date)-+new Date(b.date));const lastWork=student?.works[0]??null;const checked=student?.topicProgress.filter(x=>x.checkedAt).length??0;const feedbacks=student?.topicProgress.filter(x=>x.feedback).length??0;const days=lastWork?Math.floor((now-+new Date(lastWork.createdAt))/86400000):null;return{next:upcoming[0]??null,lastWork,checked,feedbacks,days,latestTest:student?.testSubmissions[0]??null}},[client,now]);
 if(loading)return <CardListSkeleton rows={4}/>;if(!client)return <div className="radar-empty">Danışan bulunamadı.</div>;
 const s=client.student,i=intelligence!;
 return <div className="session-intel space-y-6">
  <Link href="/admin/clients" className="intel-back"><ArrowLeft/> Danışanlar</Link>
  <section className="intel-hero"><div><span><BrainCircuit/> GÖRÜŞME HAZIRLIK MERKEZİ</span><h1>{client.name}</h1><p>{s?.gradeLevel||"Danışan"} · {client.phone}{client.email?` · ${client.email}`:""}</p></div><div className="intel-next"><small>SIRADAKİ TEMAS</small>{i.next?<><b>{fmt(i.next.date)}</b><span>{i.next.kind} · {i.next.title}</span></>:<><b>Plan yok</b><span>Yeni görüşme planlanabilir.</span></>}</div></section>
  <section className="intel-brief">
   <div className="intel-brief-head"><div><span>60 SANİYELİK BRİF</span><h2>Görüşmeden önce bilmen gerekenler</h2></div><BrainCircuit/></div>
   <div className="intel-brief-grid">
    <article><NotebookPen/><span>Çalışma ritmi</span><b>{!s?"Portal bağlı değil":i.days===null?"Henüz çalışma yok":i.days===0?"Bugün çalışma gönderdi":`Son çalışma ${i.days} gün önce`}</b><p>{s?`${s._count.works} toplam çalışma · ${s.works.filter(x=>!x.seen).length} bekleyen`:"Öğrenci portalı bağlanırsa çalışma ritmi burada görünür."}</p></article>
    <article><Target/><span>Konu ilerlemesi</span><b>{s?`${i.checked} konu tamamlandı`:"Veri yok"}</b><p>{s?`${i.feedbacks} konuya danışman yorumu yazıldı.`:"Portal öğrencilerinde otomatik hesaplanır."}</p></article>
    <article><TestTube2/><span>Son değerlendirme</span><b>{i.latestTest?i.latestTest.testTitle:"Henüz test yok"}</b><p>{i.latestTest?`${i.latestTest.resultLabel}${i.latestTest.score!==null?` · ${i.latestTest.score}${i.latestTest.maxScore?`/${i.latestTest.maxScore}`:""}`:""}`:"Test sonucu oluştuğunda burada görünür."}</p></article>
    <article><MessageSquareQuote/><span>Son koç dönütü</span><b>{s?.works.find(x=>x.feedback)?.feedback||"Henüz çalışma dönütü yok"}</b><p>{s?.works.find(x=>x.feedback)?.feedbackAt?fmt(s.works.find(x=>x.feedback)!.feedbackAt!):"Görüşme öncesi son geri bildirimi hatırlatır."}</p></article>
   </div>
  </section>
  <div className="intel-layout">
   <section className="intel-card"><div className="intel-card-head"><div><span>GÖRÜŞME NOTU</span><h3>Hazırlık ve danışman notların</h3></div><ClipboardCheck/></div><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={10} placeholder="Görüşmede ele alınacaklar, gözlemler, hedefler, aile/okul notları…" /><div className="intel-save"><button onClick={saveNotes} disabled={saving}>{saving?"Kaydediliyor…":"Notu kaydet"}</button>{saved&&<span><CheckCircle2/> Kaydedildi</span>}</div></section>
   <section className="intel-card"><div className="intel-card-head"><div><span>SON HAREKETLER</span><h3>Öğrenci akışı</h3></div><GraduationCap/></div>{!s?<div className="intel-empty">Bu danışana öğrenci portalı bağlı değil.</div>:<div className="intel-stream">{s.works.slice(0,5).map(w=><div key={w.id}><i className={!w.seen?"is-new":""}/><div><b>{w.title||w.type}</b><p>{w.feedback?"Dönüt verildi":w.seen?"Görüldü":"Değerlendirme bekliyor"}</p></div><time>{fmt(w.createdAt)}</time></div>)}{s.works.length===0&&<div className="intel-empty">Henüz çalışma gönderilmedi.</div>}</div>}</section>
  </div>
  <div className="intel-layout">
   <Timeline title="Randevu geçmişi" rows={client.appointments}/>
   <Timeline title="Seans geçmişi" rows={client.sessions}/>
  </div>
  <div className="intel-links">{s&&<><Link href={`/admin/work?student=${s.id}`}>Çalışmaları incele</Link><Link href={`/admin/mufredat?student=${s.id}`}>Konu takibine git</Link></>}<Link href="/admin/appointments">Randevu planla</Link><Link href="/admin/sessions">Seans planla</Link></div>
  <button onClick={async()=>{if(!await confirm({title:`${client.name} silinsin mi?`,description:"Randevu veya seans kaydı varsa işlem başarısız olur.",confirmLabel:"Sil",tone:"danger"}))return;const r=await fetch(`/api/clients/${client.id}`,{method:"DELETE"});if(r.ok)router.push("/admin/clients");else await alert({title:"Silinemedi",description:"Önce randevu ve seans kayıtlarını silmelisin."})}} className="text-xs text-red-500 hover:underline">Danışanı sil</button>
 </div>
}
function Timeline({title,rows}:{title:string;rows:(Appointment|SessionRow)[]}){return <section className="intel-card"><div className="intel-card-head"><div><span>GEÇMİŞ</span><h3>{title}</h3></div><CalendarClock/></div>{rows.length===0?<div className="intel-empty">Henüz kayıt yok.</div>:<div className="intel-timeline">{rows.slice(0,8).map(r=><div key={r.id}><span/><div><b>{r.title}</b><p>{r.duration} dk · {r.status}{r.notes?` · ${r.notes}`:""}</p></div><time>{fmt(r.date)}</time></div>)}</div>}</section>}
