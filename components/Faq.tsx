"use client";

import { useState } from "react";

export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {items.map((f, i) => (
        <div className="faq" key={f.q}>
          <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            <span aria-hidden="true">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p id={`faq-${i}`}>{f.a}</p>}
        </div>
      ))}
    </div>
  );
}
