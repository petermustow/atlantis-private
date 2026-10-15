"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OPTS } from "@/lib/readiness/options";
import { site } from "@/lib/content";

type A = Record<string, unknown>;
type Opt = string[];

const short$ = (v: number) =>
  v >= 1e6 ? "$" + (v / 1e6).toFixed(v % 1e6 ? 2 : 0).replace(/\.?0+$/, "") + "m" : "$" + Math.round(v / 1e3) + "k";

function Radio({ name, list, value, onPick, col }: { name: string; list: Opt[]; value: unknown; onPick: (v: string) => void; col?: boolean }) {
  return (
    <div className={`opts${col ? " col" : ""}`} role="radiogroup">
      {list.map(([v, label, hint]) => (
        <label className="opt" key={v}>
          <input type="radio" name={`rc-${name}`} checked={value === v} onChange={() => onPick(v)} />
          <span>{label}{hint && <i>{hint}</i>}</span>
        </label>
      ))}
    </div>
  );
}

function Multi({ name, list, value, onPick }: { name: string; list: Opt[]; value: string[]; onPick: (v: string[]) => void }) {
  return (
    <div className="opts col">
      {list.map(([v, label]) => (
        <label className="opt" key={v}>
          <input
            type="checkbox"
            name={`rc-${name}`}
            checked={value.includes(v)}
            onChange={() => onPick(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])}
          />
          <span>{label}</span>
        </label>
      ))}
    </div>
  );
}

type Report = Record<string, any>;

export default function ReadinessCheck() {
  const [a, setA] = useState<A>({ amount: 500000, product: "m1", term: 3, concerns: [] });
  const [view, setView] = useState<"form" | "report">("form");
  const [report, setReport] = useState<Report | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (patch: A) => {
    setA((p) => ({ ...p, ...patch }));
    setErr("");
  };
  const text = (k: string) => String(a[k] ?? "");
  const sg = a.country === "sg";
  const unsure = a.amountUnsure === true;
  const amount = Number(a.amount);
  const product = text("product");
  const concerns = (a.concerns as string[]) ?? [];

  async function submit() {
    if (busy) return;
    const missing: string[] = [];
    if (!text("name").trim()) missing.push("your name");
    if (!text("phone").trim() && !text("email").trim()) missing.push("a phone number or email");
    if (!a.source) missing.push("where your money sits today");
    if (!a.consent) missing.push("the consent box");
    if (missing.length) return setErr(`Please add ${missing.join(", ")}.`);
    setBusy(true);
    try {
      const res = await fetch("/api/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...a, website: "" }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setReport(body.report);
        setView("report");
        window.scrollTo(0, 0);
      } else {
        setErr(body.error || `Sorry, that did not go through. Please call us on ${site.phone} or email ${site.email}.`);
      }
    } catch {
      setErr(`Sorry, that did not go through. Please call us on ${site.phone} or email ${site.email}.`);
    }
    setBusy(false);
  }

  return (
    <div className="rc">
      <div className="rcwrap">
        <header className="mast">
          <Image className="logo" src="/img/logo.png" alt="" width={51} height={44} />
          <span className="brandname">Atlantis Private</span>
          <div className="word"><span>Investor Readiness Check</span></div>
        </header>

        {view === "form" && (
          <div className="sheet">
            <div className="intro">
              <h1>See how ready you are to invest</h1>
              <p className="muted">
                Short questions, mostly one tap each, about five minutes. You will get a personal summary with your readiness score, the
                steps ahead and how long each one usually takes, and, for wholesale investors, an illustration of what your money could earn.
              </p>
              <div className="steps-strip">
                <span>1 · About you</span><span>2 · Your money</span><span>3 · Your goals</span><span>4 · Timing and fit</span><span>5 · How do you feel so far?</span>
              </div>
            </div>

            <div className="block"><h2>1 · About you</h2>
              <div className="grid2">
                <label className="f">Full name<input value={text("name")} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Jane Citizen" autoComplete="name" maxLength={120} /></label>
                <label className="f">Age range
                  <select value={text("age")} onChange={(e) => set({ age: e.target.value })}>
                    <option value="">Prefer not to say</option>
                    {["Under 40", "40 to 49", "50 to 59", "60 to 65", "Over 65"].map((x) => <option key={x}>{x}</option>)}
                  </select>
                </label>
                <label className="f">Mobile<input inputMode="tel" value={text("phone")} onChange={(e) => set({ phone: e.target.value })} placeholder="04xx xxx xxx" autoComplete="tel" maxLength={24} /></label>
                <label className="f">Email<input type="email" value={text("email")} onChange={(e) => set({ email: e.target.value })} placeholder="name@email.com" autoComplete="email" maxLength={254} /></label>
              </div>
              <div className="q"><div className="q-l">Best time for a call</div><Radio name="calltime" list={OPTS.calltime} value={a.calltime} onPick={(v) => set({ calltime: v })} /></div>
              <div className="q"><div className="q-l">Where do you live?</div><Radio name="country" list={OPTS.country} value={a.country} onPick={(v) => set({ country: v })} /></div>
              <div className="q"><div className="q-l">Are you already investing with Atlantis?</div><Radio name="existing" list={OPTS.existing} value={a.existing} onPick={(v) => set({ existing: v })} /></div>
            </div>

            <div className="block"><h2>2 · Your money</h2>
              <div className="q">
                <div className="q-l">
                  {sg ? "Are you an accredited investor under Singapore rules?" : "Has an accountant issued you a wholesale or sophisticated investor certificate in the last two years?"}{" "}
                  <small>
                    {sg ? "Our investments are open to wholesale and accredited investors only, so this comes first." : "Our investments are open to wholesale investors only, so this comes first."}
                    {a.country === "os" && " If you live outside Australia, our team will confirm what applies where you live."}
                  </small>
                </div>
                <Radio col name="wholesale" list={sg ? OPTS.wholesaleSG : OPTS.wholesale} value={a.wholesale} onPick={(v) => set({ wholesale: v })} />
              </div>
              <div className="q">
                <div className="q-l">Roughly how much are you thinking of investing?</div>
                <div className="amount-row">
                  <input type="range" min={50000} max={3000000} step={25000} value={amount} disabled={unsure} aria-label="Investment amount" onChange={(e) => set({ amount: Number(e.target.value) })} />
                  <output className="amount-out">{unsure ? "Not sure" : short$(amount)}</output>
                </div>
                <div className="opts">
                  {[50000, 250000, 500000, 1000000, 2000000].map((v) => (
                    <button className="rbtn small" type="button" key={v} onClick={() => set({ amount: v, amountUnsure: false })}>{short$(v)}</button>
                  ))}
                </div>
                <label className="opt" style={{ alignSelf: "flex-start" }}>
                  <input type="checkbox" checked={unsure} onChange={() => set({ amountUnsure: !unsure })} /><span>I am not sure yet</span>
                </label>
              </div>
              <div className="q"><div className="q-l">How would you invest? <small>This decides the paperwork.</small></div><Radio name="entity" list={OPTS.entity} value={a.entity} onPick={(v) => set({ entity: v })} /></div>
              <div className="q"><div className="q-l">Where does that money sit today? <small>This sets your timeline.</small></div><Radio col name="source" list={OPTS.source} value={a.source} onPick={(v) => set({ source: v })} /></div>
              {a.source === "td" && (
                <div className="sub"><div className="q-l" style={{ fontSize: ".9rem" }}>Term deposit or shares</div>
                  <div className="grid2"><label className="f">Term deposit maturity date (if known)<input type="date" value={text("tdMature")} onChange={(e) => set({ tdMature: e.target.value })} /></label></div></div>
              )}
              {a.source === "equity" && (
                <div className="sub"><div className="q-l" style={{ fontSize: ".9rem" }}>Do you already have a broker or lender helping you?</div><Radio name="broker" list={OPTS.broker} value={a.broker} onPick={(v) => set({ broker: v })} /></div>
              )}
              {a.source === "super" && (
                <div className="sub"><div className="q-l" style={{ fontSize: ".9rem" }}>Do you already have a self managed super fund (SMSF)?</div><Radio name="smsf" list={OPTS.smsf} value={a.smsf} onPick={(v) => set({ smsf: v })} /></div>
              )}
              {(a.source === "unk" || a.when === "later" || a.when === "unk") && (
                <div className="sub"><div className="q-l" style={{ fontSize: ".9rem" }}>When would be a good time for us to follow up?</div>
                  <div className="grid2"><label className="f">Follow up date<input type="date" value={text("follow")} onChange={(e) => set({ follow: e.target.value })} /></label></div></div>
              )}
            </div>

            <div className="block"><h2>3 · Your goals</h2>
              <div className="q"><div className="q-l">What matters most to you?</div><Radio col name="motive" list={OPTS.motive} value={a.motive} onPick={(v) => set({ motive: v })} /></div>
              <div className="q"><div className="q-l">Do you have a monthly income goal? <small>Optional</small></div>
                <div className="grid2"><label className="f">Monthly income I would like ($)<input inputMode="numeric" value={text("goal")} onChange={(e) => set({ goal: e.target.value })} placeholder="e.g. 4000" maxLength={7} /></label></div></div>
              <div className="q"><div className="q-l">Who else will be part of the decision?</div><Radio col name="decider" list={OPTS.decider} value={a.decider} onPick={(v) => set({ decider: v })} /></div>
            </div>

            <div className="block"><h2>4 · Timing and fit</h2>
              <div className="q"><div className="q-l">When would you like your investment to start?</div>
                <Radio name="when" list={OPTS.when} value={a.when} onPick={(v) => set({ when: v })} />
                <div className="grid2"><label className="f">Do you have a date in mind? <span style={{ fontWeight: 400 }}>Optional. We will plan your steps around it.</span><input type="date" value={text("startDate")} onChange={(e) => set({ startDate: e.target.value })} /></label></div></div>
              <div className="q"><div className="q-l">Is anything coming up that affects timing? <small>A deposit maturing, a property sale, retirement</small></div><Radio name="event" list={OPTS.event} value={a.event} onPick={(v) => set({ event: v })} /></div>
              <div className="q"><div className="q-l">Have you invested in private credit, mortgage funds or other unlisted investments before?</div><Radio col name="experience" list={OPTS.experience} value={a.experience} onPick={(v) => set({ experience: v })} /></div>
              <div className="q"><div className="q-l">How do you feel about locking money away for a fixed term?</div><Radio col name="risk" list={OPTS.risk} value={a.risk} onPick={(v) => set({ risk: v })} /></div>
              <div className="q"><div className="q-l">Which option would you like illustrated?</div>
                <div className="grid2">
                  <label className="f">Option
                    <select value={product} onChange={(e) => set({ product: e.target.value })}>
                      <option value="m1">1st Mortgage Fund</option><option value="m2">2nd Mortgage Fund</option><option value="liq">Liquidity Fund</option>
                    </select>
                  </label>
                  <label className="f">{product === "liq" ? "Show income over" : "Term"}
                    <select value={String(a.term)} onChange={(e) => set({ term: Number(e.target.value) })}>
                      <option value="1">1 year</option><option value="2">2 years</option><option value="3">3 years</option>
                    </select>
                  </label>
                </div>
                {product === "liq" && <p className="muted" style={{ fontSize: ".82rem" }}>The Liquidity Fund has no fixed term. You can withdraw with 30 days&apos; notice. The illustration simply shows the income over the period you choose.</p>}
              </div>
            </div>

            <div className="block"><h2>5 · How do you feel so far?</h2>
              <div className="q"><div className="q-l">Tick anything that applies. <small>There are no wrong answers. It helps us explain things better.</small></div>
                <Multi name="concerns" list={OPTS.concerns} value={concerns} onPick={(v) => set({ concerns: v })} /></div>
              <div className="q"><div className="q-l">How did you hear about Atlantis?</div><Radio name="heard" list={OPTS.heard} value={a.heard} onPick={(v) => set({ heard: v })} /></div>
              <label className="f">Anything else on your mind?<textarea value={text("notes")} onChange={(e) => set({ notes: e.target.value })} placeholder="Questions, concerns, anything you would like us to know" maxLength={1000} /></label>
            </div>

            <div className="block" style={{ gap: 14 }}>
              <label className="consent"><input type="checkbox" checked={a.consent === true} onChange={() => set({ consent: !a.consent })} /><span>I agree to Atlantis Private contacting me about investing. I understand this check is general information only and is not financial advice.</span></label>
              <p className="privacy"><b>Your privacy.</b> We collect these details so Atlantis Private can work out whether our investments may suit you, contact you about them and keep a record of your enquiry. Without them we may not be able to help. We share them only with our own team and the service providers who help us run our business. We never sell your information. Our <Link href="/privacy">Privacy Policy</Link> explains how to access or correct your information and how to make a complaint.</p>
              <label className="consent" style={{ background: "var(--sunk)" }}><input type="checkbox" checked={a.updates === true} onChange={() => set({ updates: !a.updates })} /><span>Optional: send me the Atlantis investor newsletter, on the first Wednesday of every month. You can unsubscribe at any time.</span></label>
              <div className="actions-row">
                <button className="rbtn primary big" type="button" onClick={submit} disabled={busy}>{busy ? "Working it out..." : "Create my summary"}</button>
                <span className="err" role="alert">{err}</span>
              </div>
            </div>
          </div>
        )}

        {view === "report" && report && (
          <ReportView
            r={report}
            onEdit={() => { setView("form"); window.scrollTo(0, 0); }}
            onNew={() => { setA({ amount: 500000, product: "m1", term: 3, concerns: [] }); setReport(null); setView("form"); window.scrollTo(0, 0); }}
          />
        )}
      </div>
    </div>
  );
}

// The SVG charts are built on the server from our own numbers. No visitor text is placed in them.
const Svg = ({ html, label, wide }: { html: string; label: string; wide?: boolean }) => (
  <div className={`chart-wrap${wide ? " only-wide" : ""}`} role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: html }} />
);

function ReportView({ r, onEdit, onNew }: { r: Report; onEdit: () => void; onNew: () => void }) {
  return (
    <>
      <div className="bar-actions">
        <button className="rbtn" type="button" onClick={onEdit}>Edit answers</button>
        <button className="rbtn" type="button" onClick={onNew}>New check</button>
        <button className="rbtn" type="button" onClick={() => window.print()}>Print</button>
      </div>
      <div className="report">
        <header className="r-head">
          <div>
            <div className="eyebrow">Investor Readiness Summary</div>
            <h1>{r.rcHeadName}</h1>
            <p className="muted" style={{ marginTop: 4 }}>{r.rcPathText}</p>
          </div>
          <div className="r-meta"><div><b>{r.rcDate}</b></div><div>Ref <b className="num">{r.rcRef}</b></div></div>
        </header>

        <section className="r-sec">
          <div className="score-hero">
            <div className="ring" role="img" aria-label={r.rcScoreLabel} dangerouslySetInnerHTML={{ __html: r.rcRing }} />
            <div>
              <div className="eyebrow">Your readiness</div>
              <div className="band">{r.rcBandName}</div>
              <p style={{ marginTop: 4 }}>{r.rcBandText}</p>
              <div className="pathway"><span className="eyebrow" style={{ margin: 0 }}>Your pathway</span><b>{r.rcPathName}</b><span className="muted">{r.rcPathTag}</span></div>
              <div className="facts">
                <div><span>Amount</span><b>{r.rcFactAmount}</b></div>
                {r.rcShowTimeline && <div><span>Typical time to invest</span><b>{r.rcFactTime}</b></div>}
                <div><span>Items to address</span><b>{r.rcFactItems}</b></div>
              </div>
            </div>
          </div>
          <div className="legend5" aria-hidden="true">
            {r.rcLegend.map((l: { n: string; cls: string }) => <div key={l.n} className={l.cls}>{l.n}</div>)}
          </div>
        </section>

        {r.rcShowTimeline && (
          <>
            <section className="r-sec">
              <h2>Your timeline</h2>
              <p className="lead muted">Each bar shows how long a step usually takes. The paler part shows how long it can take if things are slower. Steps for paperwork can often run side by side, so many investors finish sooner.</p>
              <Svg wide html={r.rcTimeline} label="Timeline of steps and expected durations" />
              <ol className="tl-list only-narrow" aria-label="Steps and expected durations">
                {r.rcTimelineRows.map((s: { n: string; d: string; done: boolean; next: boolean; income: boolean }) => (
                  <li key={s.n} className={s.done ? "done" : s.next ? "is-next" : s.income ? "income" : ""}>
                    <b>{s.n}</b><span>{s.next ? `Next step. ${s.d}` : s.d}</span>
                  </li>
                ))}
              </ol>
              <p style={{ fontSize: ".9rem" }}><b>Next step:</b> {r.rcNextName}. {r.rcNextDesc}</p>
            </section>
            <section className="r-sec">
              <h2>Your plan, in dates</h2>
              <p className="lead">{r.rcPlanA}<b>{r.rcPlanB}</b>{r.rcPlanC}</p>
              {r.rcPlanStatus && <div className="plan-note"><b>{r.rcPlanStatusB}</b>{r.rcPlanStatusT}</div>}
              <div className="plan-grid" role="table" aria-label="Your plan">
                <div className="pg-row pg-head" role="row"><span role="columnheader">Step</span><span role="columnheader">Who</span><span role="columnheader">Aim to finish</span></div>
                {r.rcPlanRows.map((p: { step: string; who: string; when: string; cls: string }, i: number) => (
                  <div className={`pg-row ${p.cls}`} role="row" key={i}><span role="cell"><b>{p.step}</b></span><span role="cell">{p.who}</span><span role="cell" className="d">{p.when}</span></div>
                ))}
              </div>
              <p className="muted" style={{ fontSize: ".8rem" }}>{r.rcPlanFoot}</p>
            </section>
          </>
        )}

        <section className="r-sec">
          <h2>Items to address</h2>
          <ul className="todo">
            {r.rcTodos.map((t: { b: string; d: string; cls: string }) => (
              <li key={t.b} className={t.cls}><span className="box" aria-hidden="true" /><div><b>{t.b}</b>{t.d}</div></li>
            ))}
          </ul>
        </section>

        {r.rcShowQA && (
          <section className="r-sec">
            <h2>Your questions, answered</h2>
            <p className="lead muted">You told us how you are feeling about it. Here is how we will cover each point on your intro call.</p>
            <div className="fb">
              {r.rcReady && <div style={{ borderColor: "#1f7a50", background: "#e3f2ea" }}><b>You are happy to go ahead</b>{r.rcReadyReply}</div>}
              {r.rcQA.map((q: { q: string; a: string }) => <div key={q.q}><b>{q.q}</b>{q.a}</div>)}
              {r.rcHasNote && <div><b>Your note</b>{r.rcNoteText}</div>}
            </div>
          </section>
        )}

        {r.rcShowGated && (
          <section className="r-sec">
            <h2>What your money could earn</h2>
            <div className="gated">
              <p>{r.rcGatedA}</p>
              <p className="muted" style={{ marginTop: 6 }}>{r.rcGatedB}</p>
              {r.rcGoalGated && <p style={{ marginTop: 6 }}>{r.rcGoalGatedText}</p>}
            </div>
          </section>
        )}

        {r.rcShowReturns && (
          <section className="r-sec">
            <h2>What your money could earn</h2>
            <p className="lead muted">{r.rcEarnLead}</p>
            <div className="money">
              {r.rcMoney.map((m: { k: string; v: string; s: string }) => <div key={m.k}><span>{m.k}</span><b>{m.v}</b><small>{m.s}</small></div>)}
            </div>
            {r.rcGoalShow && (
              <div className="goalbox"><h3>{r.rcGoalTitle}</h3><p>{r.rcGoalStatus}</p>
                <p className="muted" style={{ fontSize: ".8rem" }}>Rounded up to the nearest $5,000. Based on the target rate, which is not guaranteed.</p></div>
            )}
            <div className="eyebrow" style={{ marginTop: 6 }}>Yearly income by option</div>
            <Svg wide html={r.rcBars} label="Yearly income by option" />
            <ul className="opt-bars only-narrow" aria-label="Yearly income by option">
              {r.rcOptions.map((o: { n: string; rate: number; yr: string; pct: number; focus: boolean; td: boolean }) => (
                <li key={o.n} className={o.focus ? "on" : ""}>
                  <div className="ob-top"><span>{o.n}</span><b>{o.yr}</b></div>
                  <div className="ob-bar"><span style={{ width: `${o.pct}%` }} /></div>
                  <small>{o.rate}% p.a. {o.td ? "(comparison)" : "target"}</small>
                </li>
              ))}
            </ul>
            <p className="muted" style={{ fontSize: ".85rem" }}>Higher target returns come with higher risk. The 2nd Mortgage Fund is repaid after the first mortgage, so it carries more risk than the 1st Mortgage Fund. The Liquidity Fund pays less in return for access with 30 days&apos; notice.</p>
            <div className="eyebrow" style={{ marginTop: 6 }}>Your income building up, month by month</div>
            <p className="muted only-narrow" style={{ fontSize: ".8rem" }}>Swipe sideways to see the whole chart.</p>
            <Svg html={r.rcCumul} label="Income building up over the term" />
            <p className="muted" style={{ fontSize: ".8rem" }}>{r.rcEarnFoot}</p>
          </section>
        )}

        <section className="r-sec">
          <div className="next">
            <div><h3>{r.rcNextTitle}</h3><p style={{ marginTop: 4 }}>{r.rcNextText}</p></div>
            <div className="contact"><b>Atlantis Private</b>{r.rcContactLines.map((l: string) => <div key={l}>{l}</div>)}</div>
          </div>
        </section>

        <footer className="fine">
          <p><b>Important information.</b> This summary is general information only. It does not take into account your objectives, financial situation or needs and is not financial, tax or legal advice. Consider the Information Memorandum and seek independent advice before investing. Atlantis Private investments are available to wholesale investors only. {site.licence.replace(" Services are provided to wholesale clients only.", "")} Returns shown are target returns, are not guaranteed and are not a forecast. Your capital is at risk, and fixed term investments may not be readily accessible before maturity. Timeframes are typical estimates and depend on third parties such as banks, brokers and accountants.</p>
        </footer>
      </div>
    </>
  );
}
