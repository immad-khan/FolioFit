import { NextRequest, NextResponse } from "next/server";
import { getJobs, saveIncomingJobs, clearAllJobs } from "@/lib/storage";

export const dynamic = "force-dynamic";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(res: NextResponse) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const source = searchParams.get("source")?.trim();

    const data = await getJobs({ q, source });

    return withCors(NextResponse.json(data));
  } catch (err) {
    console.error("GET /api/jobs failed", err);
    return withCors(
      NextResponse.json({ error: "Failed to load jobs" }, { status: 500 })
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return withCors(
        NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
      );
    }

    const incoming = Array.isArray(body.jobs) ? body.jobs : [body];
    const result = await saveIncomingJobs(incoming);

    return withCors(
      NextResponse.json({
        ok: true,
        ...result,
      })
    );
  } catch (err) {
    console.error("POST /api/jobs failed", err);
    return withCors(
      NextResponse.json({ error: "Failed to save job" }, { status: 500 })
    );
  }
}

export async function DELETE() {
  try {
    await clearAllJobs();
    return withCors(NextResponse.json({ ok: true }));
  } catch (err) {
    console.error("DELETE /api/jobs failed", err);
    return withCors(
      NextResponse.json({ error: "Failed to clear jobs" }, { status: 500 })
    );
  }
}
