"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import RoleLink from "./RoleLink";

export type GatedFund = { returns: { term: string; rate: string }[]; maxLvr: string | null };
type GatedMap = Record<string, GatedFund>;

type GateState = {
  open: boolean;
  agreed: boolean;
  loading: boolean;
  error: string;
  data: GatedMap | null;
  setAgreed: (v: boolean) => void;
  reveal: () => void;
};

const Ctx = createContext<GateState | null>(null);

export function GateProvider({ children }: { children: ReactNode }) {
  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<GatedMap | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agree: true, page: location.pathname }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error("gate");
      setData(body.funds as GatedMap);
      setOpen(true);
    } catch {
      setError("We could not load that just now. Please try again, or call us.");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<GateState>(
    () => ({ open, agreed, loading, error, data, setAgreed, reveal: () => agreed && void load() }),
    [open, agreed, loading, error, data, load],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useGate() {
  const c = useContext(Ctx);
  if (!c) throw new Error("GateProvider missing");
  return c;
}

export function GateBanner() {
  const g = useGate();
  if (g.open) {
    return (
      <div className="stack gap-24">
        <div className="callout">
          <p className="small soft">
            Returns shown are target returns, quoted net of fund management fees. Target returns are not guaranteed and all investments
            carry risk, including the potential loss of capital. Past performance is not necessarily indicative of future performance.
            Full details of risks, fees and terms are in the relevant Information Memorandum.
          </p>
        </div>
        <div>
          <RoleLink role="Investor" className="btn">Request the Information Memorandum</RoleLink>
        </div>
        <div className="card">
          <h3 className="h2-sm">Returns history</h3>
          <p className="soft placeholder">
            [Monthly returns for each fund since inception, net of fees, with a short note on how they are calculated. To be added
            once each fund has a track record.]
          </p>
          <div className="callout muted" style={{ textAlign: "center", padding: 48 }}>[Returns table or chart]</div>
        </div>
      </div>
    );
  }
  return (
    <div className="gate">
      <div className="stack gap-16" style={{ flex: "1 1 460px" }}>
        <div>
          <div className="h3">Are you a wholesale investor?</div>
          <div className="soft">Target returns, terms and our Information Memorandum are available to wholesale and sophisticated investors only.</div>
        </div>
        <label>
          <input type="checkbox" checked={g.agreed} onChange={(e) => g.setAgreed(e.target.checked)} />
          <span className="small">
            I confirm that I am a wholesale or sophisticated investor, and I understand this information is not intended for retail
            investors. <span className="placeholder">[Final wording to be confirmed by compliance.]</span>
          </span>
        </label>
        {g.error && <div className="status-err" role="alert">{g.error}</div>}
      </div>
      <button type="button" className="btn" disabled={!g.agreed || g.loading} onClick={g.reveal}>
        {g.loading ? "Loading..." : "View returns and terms"}
      </button>
    </div>
  );
}

// The returns block on a fund card or fund page. Renders nothing until the visitor has confirmed.
export function GatedFundFigures({
  slug,
  min,
  income,
  compact,
}: {
  slug: string;
  min: string;
  income: string;
  compact?: boolean;
}) {
  const g = useGate();
  const f = g.data?.[slug];
  if (!g.open || !f) return null;
  return (
    <div className="stack fund-gated" aria-live="polite">
      <div className="eyebrow" style={{ paddingTop: 10 }}>Target returns</div>
      {f.returns.map((r) => (
        <div className="kv" key={r.term}><span>{r.term} term</span><span>{r.rate}</span></div>
      ))}
      {f.maxLvr && <div className="kv"><span>Maximum portfolio LVR</span><span>{f.maxLvr}</span></div>}
      {compact && <div className="kv"><span>Minimum investment</span><span>{min}</span></div>}
      {compact && <div className="kv"><span>Income paid</span><span>{income}</span></div>}
      {!compact && <p className="small muted" style={{ paddingTop: 8 }}>Target returns are quoted net of fund management fees and are not guaranteed.</p>}
    </div>
  );
}

// Side panel on a fund page: the tick box while closed, nothing extra once open.
export function GatePanel() {
  const g = useGate();
  if (g.open) return null;
  return (
    <div className="card-flat">
      <div className="h3">Target returns</div>
      <div className="soft">Available to wholesale and sophisticated investors only.</div>
      <label className="consent" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={g.agreed} onChange={(e) => g.setAgreed(e.target.checked)} />
        <span>
          I confirm that I am a wholesale or sophisticated investor. <span className="placeholder">[Final wording to be confirmed by compliance.]</span>
        </span>
      </label>
      {g.error && <div className="status-err" role="alert">{g.error}</div>}
      <button type="button" className="btn" disabled={!g.agreed || g.loading} onClick={g.reveal}>
        {g.loading ? "Loading..." : "View target returns"}
      </button>
    </div>
  );
}
