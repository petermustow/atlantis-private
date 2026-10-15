import { describe, expect, it } from "vitest";
import { buildReport } from "@/lib/readiness/engine";
import { cleanAnswers } from "@/lib/readiness/input";

const now = new Date("2026-10-15T00:00:00");
const run = (a: Record<string, unknown>) => {
  const { r } = cleanAnswers({ name: "Jane", email: "j@example.com", source: "cash", consent: true, ...a }, now);
  return buildReport({ ...r, ref: "AP-TEST" });
};

describe("readiness report", () => {
  it("shows returns to a wholesale investor in Australia", () => {
    const r = run({ country: "au", wholesale: "cert", amount: 500000 });
    expect(r.rcShowReturns).toBe(true);
    expect(r.rcMoney[0].v).toBe("$5,208");
  });

  it("holds returns back from someone who is not wholesale", () => {
    const r = run({ country: "au", wholesale: "no", amount: 300000 });
    expect(r.rcShowReturns).toBe(false);
    expect(r.rcShowGated).toBe(true);
    expect(r.rcMoney).toEqual([]);
    expect(r.rcBars).toBe("");
    expect(JSON.stringify(r)).not.toMatch(/\d+(\.\d+)?% p\.a\./);
  });

  it("holds returns back from overseas visitors until the team confirms", () => {
    const r = run({ country: "sg", wholesale: "cert", amount: 900000 });
    expect(r.rcShowReturns).toBe(false);
    expect(r.rcCumul).toBe("");
  });

  it("gives phones plain lists, and only shows the income list to people who may see returns", () => {
    const ok = run({ country: "au", wholesale: "cert", amount: 500000 });
    expect(ok.rcTimelineRows.length).toBeGreaterThan(3);
    expect(ok.rcOptions.length).toBe(4);
    const no = run({ country: "au", wholesale: "no", amount: 300000 });
    expect(no.rcTimelineRows.length).toBeGreaterThan(3);
    expect(no.rcOptions).toEqual([]);
  });

  it("counts dates from the day of the check and does not drift", () => {
    const r = run({ country: "au", wholesale: "cert", amount: 500000, when: "30" });
    expect(r.rcDate).toBe("15 October 2026");
    expect(r.rcPlanRows.find((p: { tgt?: boolean; step: string }) => p.step === "Your target start date")?.when).toBe("14 Nov");
  });

  it("ignores values that are not on the option lists", () => {
    const { r } = cleanAnswers({ country: "mars", wholesale: "<script>", term: 99, product: "x" }, now);
    expect(r.country).toBe("");
    expect(r.wholesale).toBe("unk");
    expect(r.term).toBe(3);
    expect(r.product).toBe("m1");
  });
});
