"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { ROLE_EVENT } from "./RoleLink";
import { useLeadForm } from "./useLeadForm";

const ROLES = ["Investor", "Borrower", "Broker or partner"] as const;
type Role = (typeof ROLES)[number];

const ROUTE: Record<Role, string> = {
  Investor: "We will make sure someone who looks after investors calls you.",
  Borrower: "We will make sure someone from our lending side calls you.",
  "Broker or partner": "We will make sure someone who looks after our partners calls you.",
};

export default function ContactSection() {
  const [role, setRole] = useState<Role>("Investor");
  const { status, error, submit } = useLeadForm("contact");

  useEffect(() => {
    const on = (e: Event) => setRole((e as CustomEvent<Role>).detail);
    window.addEventListener(ROLE_EVENT, on);
    return () => window.removeEventListener(ROLE_EVENT, on);
  }, []);

  return (
    <section id="contact" className="section section-alt">
      <div className="wrap split">
        <div className="stack gap-24" style={{ maxWidth: 460 }}>
          <h2 className="h2">Let&apos;s have a chat</h2>
          <p className="soft">
            Whether you are looking to invest, borrow, or simply want to understand your options, we are here to listen.
            A member of our team will get back to you personally within one business day.
          </p>
          <div className="bold">
            <a href={`tel:${site.phoneHref.replace("tel:", "")}`} style={{ textDecoration: "none" }}>{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>

        <form className="stack gap-16" onSubmit={(e) => submit(e, { role })} noValidate={false}>
          <div className="form">
            <label className="field">Name<input name="name" type="text" autoComplete="name" required maxLength={120} /></label>
            <label className="field">Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
            <label className="field">
              I am a
              <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </label>
            <label className="field">Phone<input name="phone" type="tel" autoComplete="tel" maxLength={24} /></label>
            <label className="field full">Message<textarea name="message" rows={4} maxLength={2000} /></label>
            <div className="hp" aria-hidden="true">
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
          </div>
          <div className="row">
            <button type="submit" className="btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Start the conversation"}
            </button>
            <span className="tiny muted">{ROUTE[role]}</span>
          </div>
          <p className="tiny muted">
            We use these details to reply to you. See our <a href="/privacy">Privacy Policy</a>.
          </p>
          {status === "error" && <div className="status-err" role="alert">{error}</div>}
          {status === "sent" && (
            <div className="status-ok" role="status">
              <span className="bold">Thank you, we have your message.</span>
              <span>{site.followUpName} from our team will be in touch within one business day.</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
