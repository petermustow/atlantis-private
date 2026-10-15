import { NextResponse } from "next/server";
import { sameOrigin, validateLead } from "@/lib/leads";

export const runtime = "nodejs";
// Forms and the gate answer in milliseconds. A low cap stops a stuck or abused call from running up cost.
export const maxDuration = 10;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const result = validateLead(body);
  if (!result.ok) return NextResponse.json(result, { status: 422 });
  // TODO (build step 5/6): encrypt personal fields, save to Neon, notify the lead worker.
  // Until then the thank-you is shown but nothing is kept. Never log the submitted fields.
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
