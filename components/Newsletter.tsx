"use client";

import { useLeadForm } from "./useLeadForm";

export default function Newsletter() {
  const { status, error, submit } = useLeadForm("newsletter");
  return (
    <form className="callout row between" onSubmit={(e) => submit(e)} style={{ padding: 28 }}>
      <div className="stack gap-8" style={{ maxWidth: 520 }}>
        <div className="h3">Stay in the loop</div>
        <div className="soft">Our investor newsletter goes out on the first Wednesday of every month, with fund updates and market insights.</div>
      </div>
      <div className="row">
        <label className="field">Email<input name="email" type="email" spellCheck={false} autoComplete="email" required maxLength={254} /></label>
        <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <button type="submit" className="btn" disabled={status === "sending" || status === "sent"} style={{ alignSelf: "flex-end" }}>
          {status === "sent" ? "Subscribed" : "Subscribe"}
        </button>
      </div>
      {status === "error" && <div className="status-err" role="alert" style={{ width: "100%" }}>{error}</div>}
      {status === "sent" && <div className="status-ok" role="status" style={{ width: "100%" }}>Thank you, you are on the list.</div>}
    </form>
  );
}
