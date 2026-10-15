"use client";

import { useEffect, useState } from "react";
import { ticker } from "@/lib/content";

// Static first paint, then rotates. The values come from content/ticker.json, so a slow
// or missing data source can never hold up a page.
export default function Ticker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % ticker.items.length), 5000);
    return () => clearInterval(t);
  }, []);
  const item = ticker.items[i];
  return (
    <div className="latest" aria-label="Latest updates">
      <div className="latest-in">
        <span className="latest-tag">LATEST</span>
        <span className="latest-item" aria-live="off">
          <strong>{item.label}</strong>
          <span>{item.text}</span>
        </span>
        <span className="latest-rates">
          {ticker.rates.map((r) => (
            <span key={r.label}>
              {r.label} <strong>{r.value}</strong>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
