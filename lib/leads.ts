// Server-side validation for every form. Pass 1: nothing is stored or emailed yet.
// Personal fields are validated here and then dropped. The encrypted save and the
// core-details email arrive in build steps 5 and 6 of the master plan.

export type LeadType = "contact" | "scenario" | "partner" | "readiness" | "newsletter";

export type LeadResult =
  | { ok: true; type: LeadType; honeypot: boolean }
  | { ok: false; error: string };

const MAX = 2000;
const clean = (v: unknown, max = 200) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
const emailOk = (s: string) => /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254;
const phoneOk = (s: string) => s === "" || /^[0-9+()\-\s.]{6,24}$/.test(s);

export function validateLead(input: unknown): LeadResult {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request." };
  const d = input as Record<string, unknown>;
  const type = clean(d.type, 20) as LeadType;
  if (!["contact", "scenario", "partner", "readiness", "newsletter"].includes(type)) {
    return { ok: false, error: "Unknown form." };
  }
  // Honeypot: a real visitor never fills this in. Pretend success so bots learn nothing.
  if (clean(d.website, 100) !== "") return { ok: true, type, honeypot: true };

  const email = clean(d.email, 254);
  if (!emailOk(email)) return { ok: false, error: "Please enter a valid email address." };

  if (type !== "newsletter") {
    if (clean(d.name, 120).length < 2) return { ok: false, error: "Please enter your name." };
    if (!phoneOk(clean(d.phone, 24))) return { ok: false, error: "Please check your phone number." };
  }
  if (type === "scenario") {
    const amount = Number(String(d.amount ?? "").replace(/[^0-9.]/g, ""));
    if (!(amount > 0)) return { ok: false, error: "Please enter the loan amount." };
  }
  if (clean(d.message, MAX + 1).length > MAX) return { ok: false, error: "Your message is too long." };
  if (type === "readiness" && d.consent !== true) {
    return { ok: false, error: "Please tick the box so we can contact you." };
  }
  return { ok: true, type, honeypot: false };
}

export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
