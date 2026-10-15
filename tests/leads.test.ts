import { describe, expect, it } from "vitest";
import { validateLead } from "@/lib/leads";

describe("validateLead", () => {
  const base = { type: "contact", name: "Jane Citizen", email: "jane@example.com", phone: "0400 000 000" };

  it("accepts a normal enquiry", () => {
    expect(validateLead(base)).toMatchObject({ ok: true, honeypot: false });
  });
  it("rejects a bad email", () => {
    expect(validateLead({ ...base, email: "nope" })).toMatchObject({ ok: false });
  });
  it("rejects an unknown form type", () => {
    expect(validateLead({ ...base, type: "admin" })).toMatchObject({ ok: false });
  });
  it("quietly accepts but flags honeypot submissions", () => {
    expect(validateLead({ ...base, website: "http://spam.example" })).toMatchObject({ ok: true, honeypot: true });
  });
  it("needs a loan amount for the borrower scenario", () => {
    expect(validateLead({ ...base, type: "scenario" })).toMatchObject({ ok: false });
    expect(validateLead({ ...base, type: "scenario", amount: "1,500,000" })).toMatchObject({ ok: true });
  });
  it("newsletter needs only an email", () => {
    expect(validateLead({ type: "newsletter", email: "jane@example.com" })).toMatchObject({ ok: true });
  });
});
