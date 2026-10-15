import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import gated from "@/lib/gated/funds-gated.json";
import { sameOrigin } from "@/lib/leads";

export const runtime = "nodejs";
// Forms and the gate answer in milliseconds. A low cap stops a stuck or abused call from running up cost.
export const maxDuration = 10;

// Wholesale gate. The target returns and terms live only in lib/gated and are returned
// here after the visitor confirms. They are never part of a pre-built page.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  let body: { agree?: unknown; page?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.agree !== true) return NextResponse.json({ ok: false }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const salt = process.env.GATE_LOG_SALT;
  const ipHash = ip && salt ? createHmac("sha256", salt).update(ip).digest("hex").slice(0, 16) : null;
  // Stub log: hashed IP, page and time only, no name or email. The database log table
  // arrives in build step 5.
  console.info(
    JSON.stringify({
      event: "gate_tick",
      page: typeof body.page === "string" ? body.page.slice(0, 80) : "",
      ipHash,
      at: new Date().toISOString(),
    }),
  );
  return NextResponse.json({ ok: true, funds: gated }, { headers: { "Cache-Control": "no-store" } });
}
