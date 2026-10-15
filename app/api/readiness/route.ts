import { NextResponse } from "next/server";
import { buildReport } from "@/lib/readiness/engine";
import { cleanAnswers } from "@/lib/readiness/input";
import { sameOrigin } from "@/lib/leads";

export const runtime = "nodejs";
// Forms and the gate answer in milliseconds. A low cap stops a stuck or abused call from running up cost.
export const maxDuration = 10;

const emailOk = (s: string) => /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(s);

// The readiness check is scored here so the target rates never reach the browser unless the
// visitor may see them. Only contact details would be kept (build step 5). The answers are
// used to build the report and then discarded.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Honeypot
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  }

  const now = new Date();
  const { r, consent } = cleanAnswers(body, now);

  const missing: string[] = [];
  if (!r.name) missing.push("your name");
  if (!r.phone && !r.email) missing.push("a phone number or email");
  if (r.email && !emailOk(r.email)) missing.push("a valid email address");
  if (typeof body.source !== "string" || !body.source) missing.push("where your money sits today");
  if (!consent) missing.push("the consent box");
  if (missing.length) {
    return NextResponse.json({ ok: false, error: `Please add ${missing.join(", ")}.` }, { status: 422 });
  }

  const d = (n: number) => String(n).padStart(2, "0");
  r.ref = `AP-${String(now.getFullYear()).slice(2)}${d(now.getMonth() + 1)}${d(now.getDate())}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  // TODO (build step 5/6): encrypt and save name, phone, email and source page, then notify the worker.
  const report = buildReport(r);
  return NextResponse.json({ ok: true, report }, { headers: { "Cache-Control": "no-store" } });
}
