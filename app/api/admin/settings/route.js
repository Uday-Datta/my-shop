import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

export async function PUT(req) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { logo } = await req.json();

  let settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { logo } });
  } else {
    settings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: { logo },
    });
  }

  return NextResponse.json(settings);
}
