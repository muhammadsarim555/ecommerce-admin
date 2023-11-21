import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = req.json();
    const { name } = await body;

    if (!userId) new NextResponse("Unauthorized", { status: 401 });

    if (!name) new NextResponse("Name is required", { status: 400 });

    const store = await prismadb.store.create({
      data: {
        name,
        userId: userId || "1",
      },
    });
  } catch (e) {
    console.log("[STORE_POST]", e);

    return new NextResponse("Internal error", { status: 500 });
  }
}
