"use client";

import { useMemo, useState } from "react";
import { site } from "@/lib/content";
import { Tick } from "./Icons";
import { useLeadForm } from "./useLeadForm";

const num = (s: string) => parseFloat(String(s || "").replace(/[^0-9.]/g, "")) || 0;

function docsFor(purpose: string, type: string) {
  const list = ["Identification for all borrowers and guarantors"];
  if (purpose === "Purchase") list.push("The signed contract of sale");
  if (purpose === "Refinance" || purpose === "Equity release")
    list.push("A recent statement for the existing loan", "A recent council rates notice for the property");
  if (purpose === "Bridging") list.push("Details of the property you are selling and the one you are buying");
  if (purpose === "Business or working capital")
    list.push("The last two years of business financials", "A short summary of what the funds are for");
  list.push("A recent valuation, if you have one", "A short note on how the loan will be repaid");
  if (type !== "The borrower") list.push("Your authority to act for the borrower");
  return list;
}

export default function ScenarioForm() {
  const [type, setType] = useState("The borrower");
  const [purpose, setPurpose] = useState("Purchase");
  const [amount, setAmount] = useState("");
  const [value, setValue] = useState("");
  const { status, error, submit } = useLeadForm("scenario");

  const lvr = useMemo(() => {
    const a = num(amount), v = num(value);
    return a > 0 && v > 0 ? `Loan to value ratio: ${Math.round((a / v) * 100)}%` : "We will work out the loan to value ratio for you.";
  }, [amount, value]);
  const docs = docsFor(purpose, type);

  return (
    <form className="stack gap-16" onSubmit={(e) => submit(e, { who: type, purpose, lvrPercent: num(amount) > 0 && num(value) > 0 ? Math.round((num(amount) / num(value)) * 100) : null })}>
      <div className="form">
        <label className="field">I am
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>The borrower</option><option>A broker</option><option>An accountant or adviser</option>
          </select>
        </label>
        <label className="field">Loan purpose
          <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option>Purchase</option><option>Refinance</option><option>Bridging</option><option>Equity release</option><option>Business or working capital</option>
          </select>
        </label>
        <label className="field">Security type
          <select name="security"><option>Residential property</option><option>Commercial property</option><option>Industrial property</option><option>Other</option></select>
        </label>
        <label className="field">Property suburb and state<input name="location" placeholder="e.g. Richmond VIC" maxLength={120} /></label>
        <label className="field">Loan amount ($)<input name="amount" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 1,500,000" required /></label>
        <label className="field">Estimated property value ($)<input name="value" inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 2,500,000" /></label>
        <label className="field">Loan term needed
          <select name="term"><option>Up to 6 months</option><option>6 to 12 months</option><option>12 to 24 months</option><option>Not sure yet</option></select>
        </label>
        <label className="field">How will it be repaid?
          <select name="repayment"><option>Sale of the property</option><option>Refinance to a bank</option><option>Sale of another asset</option><option>Business cash flow</option><option>Not sure yet</option></select>
        </label>
        <label className="field">Funds needed by<input name="needBy" type="date" /></label>
        <label className="field">Your name<input name="name" autoComplete="name" required maxLength={120} /></label>
        <label className="field">Phone<input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} /></label>
        <label className="field">Email<input name="email" type="email" spellCheck={false} autoComplete="email" required maxLength={254} /></label>
        <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      </div>
      <div className="row">
        <button type="submit" className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send the scenario"}
        </button>
        <span className="small muted" aria-live="polite">{lvr}</span>
      </div>
      {status === "error" && <div className="status-err" role="alert">{error}</div>}
      {status === "sent" && (
        <div className="status-ok" role="status">
          <span className="bold">Thank you, we have your scenario.</span>
          <span>
            {site.followUpName} from our team will be in touch within one business day. To keep things moving, here is what to send
            next for a {purpose.toLowerCase()}:
          </span>
          <ul className="ticks">
            {docs.map((d) => <li key={d}><Tick /><span>{d}</span></li>)}
          </ul>
          <span className="small">
            Send documents to {site.email}. <span className="placeholder">[Checklist to be confirmed by our lending team.]</span>
          </span>
        </div>
      )}
    </form>
  );
}
