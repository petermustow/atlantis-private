"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/lib/content";

export type FormStatus = "idle" | "sending" | "sent" | "error";

export function useLeadForm(type: "contact" | "scenario" | "partner" | "readiness" | "newsletter") {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>, extra: Record<string, unknown> = {}) {
    e.preventDefault();
    if (status === "sending") return;
    const data: Record<string, unknown> = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...extra, type, page: location.pathname }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setStatus("sent");
        return;
      }
      setError(
        res.status === 422 && body.error
          ? body.error
          : `Sorry, that did not go through. Please call us on ${site.phone} or email ${site.email}.`,
      );
    } catch {
      setError(`Sorry, that did not go through. Please call us on ${site.phone} or email ${site.email}.`);
    }
    setStatus("error");
  }

  return { status, error, submit };
}
