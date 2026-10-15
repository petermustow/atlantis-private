"use client";

import { useEffect, useState } from "react";
import { ticker } from "@/lib/content";

// Static first paint, then rotates. The values come from content/ticker.json, so a slow
// or missing data source can never hold up a page. Rotation stops while the pointer or
// keyboard focus is on the band, and the pause button stops it for good (WCAG 2.2.2).
export default function Ticker() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    if (paused || holding) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % ticker.items.length), 5000);
    return () => clearInterval(t);
  }, [paused, holding]);

  const item = ticker.items[i];
  return (
    <div
      className="latest"
      aria-label="Latest updates"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={() => setHolding(false)}
    >
      <div className="latest-in">
        <span className="latest-tag">LATEST</span>
        <span className="latest-item">
          <strong>{item.label}</strong>
          <span>{item.text}</span>
        </span>
        <span className="latest-rates">
          {ticker.rates.map((r) => (
            <span key={r.label}>
              <span className="r-long">{r.label}</span>
              <span className="r-short">{r.short}</span> <strong>{r.value}</strong>
            </span>
          ))}
        </span>
        <button
          type="button"
          className="latest-pause"
          aria-pressed={paused}
          aria-label={paused ? "Resume rotating updates" : "Pause rotating updates"}
          onClick={() => setPaused((p) => !p)}
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
