import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appointments = await prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: { client: { select: { id: true, name: true, email: true, phone: true } } },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const appointment = await prisma.appointment.create({
      data: {
        clientId: body.clientId,
        title: body.title,
        date: new Date(body.date),
        duration: body.duration ?? 45,
        status: body.status ?? "PENDING",
        notes: body.notes ?? "",
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
