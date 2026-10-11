import { NextRequest, NextResponse } from "next/server";
import { deleteJobById } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const success = await deleteJobById(numId);
    return NextResponse.json({ ok: success });
  } catch (err) {
    console.error("DELETE /api/jobs/[id] failed", err);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
