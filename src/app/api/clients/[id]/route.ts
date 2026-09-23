import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/db";
import { ensureStudentClientLink } from "@/lib/ensureStudentClientLink";
import { ensureStudentWorkTable } from "@/lib/ensureStudentWorkTable";
import { ensureTopicProgressTable } from "@/lib/ensureTopicProgressTable";
import { ensureTestSubmissionTable } from "@/lib/ensureTestSubmissionTable";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  await Promise.allSettled([ensureStudentClientLink(), ensureStudentWorkTable(), ensureTopicProgressTable(), ensureTestSubmissionTable()]);
  const client = await prisma.client.findUnique({
    where: { id },
    include: { appointments: { orderBy: { date: "desc" } }, sessions: { orderBy: { date: "desc" } } },
  });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let student = null;
  try {
    student = await prisma.student.findFirst({
      where: { clientId: id },
      select: {
        id:true,name:true,email:true,gradeLevel:true,active:true,
        works:{orderBy:{createdAt:"desc"},take:8,select:{id:true,type:true,title:true,note:true,seen:true,feedback:true,feedbackAt:true,createdAt:true}},
        topicProgress:{select:{topicId:true,checkedAt:true,feedback:true,feedbackAt:true}},
        testSubmissions:{orderBy:{createdAt:"desc"},take:5,select:{id:true,testTitle:true,score:true,maxScore:true,resultLabel:true,createdAt:true}},
        _count:{select:{works:true,resources:true,testSubmissions:true}},
      },
    });
  } catch (err) { console.error("Client intelligence lookup failed:", err); }

  return NextResponse.json({ ...client, student }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin(); if (!session) return NextResponse.json({ error:"Unauthorized" },{status:401});
  const { id }=await params;
  try{const b=await req.json();const client=await prisma.client.update({where:{id},data:{
    name:typeof b.name==="string"?b.name.trim().slice(0,120):undefined,
    email:typeof b.email==="string"?b.email.trim().slice(0,200):undefined,
    phone:typeof b.phone==="string"?b.phone.trim().slice(0,50):undefined,
    notes:typeof b.notes==="string"?b.notes.slice(0,4000):undefined,
  }});return NextResponse.json(client)}catch{return NextResponse.json({error:"Failed to update"},{status:500})}
}
export async function DELETE(req:NextRequest,{params}:{params:Promise<{id:string}>}){const s=await requireAdmin();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const{id}=await params;try{await prisma.client.delete({where:{id}});return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"Failed to delete"},{status:500})}}
