import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email ?? "",
        phone: body.phone ?? "",
        notes: body.notes ?? "",
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
