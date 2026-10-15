import { OPTS } from "./options";

export type ReadinessInput = Record<string, unknown>;
export type CleanAnswers = ReturnType<typeof cleanAnswers>;

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "";
const pick = (v: unknown, key: keyof typeof OPTS | string) => {
  const s = str(v, 40);
  return OPTS[key as string]?.some((o) => o[0] === s) ? s : "";
};
const date = (v: unknown) => (/^\d{4}-\d{2}-\d{2}$/.test(str(v, 10)) ? str(v, 10) : "");

// Turns the posted form into the record the scoring code expects, dropping anything unexpected.
export function cleanAnswers(d: ReadinessInput, now: Date) {
  const country = pick(d.country, "country");
  const amountUnsure = d.amountUnsure === true;
  const amountNum = Math.min(Math.max(Number(d.amount) || 500000, 0), 100_000_000);
  const product = ["m1", "m2", "liq"].includes(str(d.product, 4)) ? str(d.product, 4) : "m1";
  const term = [1, 2, 3].includes(Number(d.term)) ? Number(d.term) : 3;
  const concerns = Array.isArray(d.concerns)
    ? d.concerns.map((c) => pick(c, "concerns")).filter(Boolean)
    : [];
  return {
    consent: d.consent === true,
    updates: d.updates === true,
    r: {
      ref: "",
      created: now.toISOString(),
      name: str(d.name, 120),
      age: str(d.age, 20),
      phone: str(d.phone, 24),
      email: str(d.email, 254),
      calltime: pick(d.calltime, "calltime"),
      amount: amountUnsure ? 0 : amountNum,
      amountUnsure,
      source: pick(d.source, "source") || "unk",
      tdMature: date(d.tdMature),
      broker: pick(d.broker, "broker"),
      smsf: pick(d.smsf, "smsf"),
      follow: date(d.follow),
      motive: pick(d.motive, "motive"),
      goal: parseInt(String(d.goal ?? "").replace(/[^0-9]/g, "").slice(0, 7), 10) || 0,
      decider: pick(d.decider, "decider") || "unk",
      when: pick(d.when, "when") || "unk",
      event: pick(d.event, "event"),
      wholesale: pick(d.wholesale, country === "sg" ? "wholesaleSG" : "wholesale") || "unk",
      risk: pick(d.risk, "risk") || "unk",
      product,
      term,
      concerns,
      notes: str(d.notes, 1000),
      startDate: date(d.startDate),
      country,
      existing: pick(d.existing, "existing"),
      entity: pick(d.entity, "entity"),
      experience: pick(d.experience, "experience"),
      heard: pick(d.heard, "heard"),
    },
  };
}
