// @ts-nocheck
// Server-side scoring and report for the investor readiness check.
// Ported from the concept mockup's logic with the browser plumbing removed. It holds the
// target rates, so it must only be imported by server code (app/api/readiness).
// Typing this module properly is a follow-up. The public surface is buildReport().
import { OPTS } from "./options";

let NOW = new Date();
    const RC = {
      contactName: 'Atlantis Private', contactPhone: '(03) 7050 7030', contactEmail: 'info@atlantisprivate.com', website: 'atlantisprivate.com',
      address: 'Level 9, 470 Collins Street, Melbourne VIC 3000', addressSG: '133 New Bridge Road, #10-03 Chinatown Point, Singapore 059413',
      minimum: 250000, minimumLiq: 50000,
      rates: { m1: { 1: 10, 2: 11.5, 3: 12.5 }, m2: { 1: 15, 2: 18, 3: 20 }, liq: { 1: 6.5, 2: 6.5, 3: 6.5 } },
      tdRate: 5.5, tdNote: 'top 12 month bank term deposit rate, October 2026', callbackDays: 'one business day'
    };
    const PRODUCT_NAME = { m1: '1st Mortgage Fund', m2: '2nd Mortgage Fund', liq: 'Liquidity Fund' };

    const CONCERN_REPLY = {
      more_info: 'We will send the Information Memorandum and a one page summary before your call, so you can read ahead at your own pace.',
      explain: 'No problem. We will walk through it again on a short call, step by step, and you are welcome to bring someone along.',
      understand: 'We will explain in plain terms how the fund lends against property, where the return comes from and how your money is secured.',
      convinced: 'Tell us what would help. We can share the fund\'s lending track record, how loans are assessed and how arrears are handled, and you can meet the team.',
      risk: 'We will go through the security behind each loan, the lending limits (loan to value ratios) and what happens if a borrower falls behind. Returns are targets and are not guaranteed.',
      lockup: 'There are 1, 2 and 3 year terms, plus a Liquidity Fund with 30 days\' notice. Many investors split their money across more than one.',
      partner: 'Good idea. We are happy to meet you both together, or to speak with your accountant directly and send them the fund documents.',
      compare: 'We can show you a side by side comparison with term deposits, shares and property using your own amount.',
      timing: 'That is fine. We will set a follow up for when timing suits and send occasional updates in the meantime.',
      ready: 'Great. We will start the paperwork on your intro call so there are no delays.'
    };
    const CONCERN_LABEL = Object.fromEntries(OPTS.concerns);
    const W = { amount: { '1m': 4, '500k': 3, '250k': 2, liqonly: 1, under: 0, unk: -2 }, source: { cash: 3, td: 2, equity: 1, super: 1, unk: -1 }, decider: { sole: 3, jointin: 3, adviser: 2, jointout: 0, gate: -1, unk: -2 },
      motive: { income: 4, yield: 3, diversify: 2, browse: 0, unk: -2 }, clarity: { target: 3, general: 1, none: -1, unk: -1 }, when: { '30': 4, '90': 2, '180': 0, later: -1, unk: -2 },
      event: { dated: 3, undated: 1, none: 0, unk: -1 }, wholesale: { cert: 2, '500': 2, likely: 0, smsf: -2, no: -3, unk: -2 }, risk: { ok: 2, edu: 0, liquid: -1, guarantee: -3, unk: -1 } };
    const MAXS = Object.values(W).reduce((a, o) => a + Math.max(...Object.values(o)), 0);
    const BANDS = {
      A: { n: 'Ready to proceed', d: 'You are in a strong position. The next step is a short intro call to confirm details and start the paperwork.' },
      B: { n: 'Nearly ready', d: 'Most of the pieces are in place. A couple of items below need sorting before you invest.' },
      C: { n: 'Early stage', d: 'There is interest here, but timing or a few details need to settle first. We will keep you informed until then.' },
      H: { n: 'A few details to confirm', d: 'We need a few more answers to give you an accurate picture. Our intro call will cover them.' },
      X: { n: 'Not the right fit right now', d: 'Based on your answers, these investments may not suit you at the moment. The notes below explain why.' }
    };
    const PATHWAYS = {
      cash: { n: 'Ready funds', tag: 'Cash or savings', d: 'Your money is available now, so the main steps are paperwork and checks.' },
      td: { n: 'Release funds', tag: 'Term deposit or shares', d: 'Your funds need to mature or be sold first, so timing depends on that date.' },
      equity: { n: 'Unlock equity', tag: 'Property equity', d: 'A refinance needs to be approved and settle before funds can move.' },
      super: { n: 'Super pathway', tag: 'Super or SMSF', d: 'Investing through super can involve your adviser, your fund\'s rules and possibly setting up an SMSF.' },
      unk: { n: 'Plan the source', tag: 'Not sure yet', d: 'Once we know where the funds will come from, we can map out the timing properly.' }
    };
    const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]));
    const fmt$ = (v) => '$' + Math.round(v).toLocaleString('en-AU');
    const short$ = (v) => v >= 1e6 ? '$' + (v / 1e6).toFixed(v % 1e6 ? 2 : 0).replace(/\.?0+$/, '') + 'm' : '$' + Math.round(v / 1e3) + 'k';
    const fmtDate = (d) => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
    const today = () => new Date(NOW.getTime());
    const addDays = (n) => { const d = today(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + Math.round(n)); return d; };
    const dShort = (d) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
    const dLong = (d) => d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    const daysUntil = (d) => { if (!d) return null; return Math.max(0, Math.ceil((new Date(d + 'T00:00:00') - today()) / 864e5)); };
    const weeks = (a, b) => { const w = (x) => Math.max(1, Math.round(x / 7)); const A = w(a), B = w(b); return A === B ? A + (A === 1 ? ' week' : ' weeks') : A + ' to ' + B + ' weeks'; };

    const internalAnswers = (r) => {
      const a = {};
      a.amount = r.amountUnsure ? 'unk' : r.amount < RC.minimumLiq ? 'under' : r.amount < RC.minimum ? 'liqonly' : r.amount >= 1e6 ? '1m' : r.amount >= 5e5 ? '500k' : '250k';
      a.source = r.source; a.decider = r.decider; a.motive = r.motive || 'unk';
      a.clarity = r.goal > 0 ? 'target' : (r.motive && r.motive !== 'browse' && r.motive !== 'unk' ? 'general' : 'unk');
      a.when = r.when; a.event = r.event || 'unk'; if (r.source === 'td' && r.tdMature) a.event = 'dated';
      let w = r.wholesale;
      if (r.source === 'super' || r.entity === 'smsf') w = 'smsf';
      else if (w !== 'cert' && !r.amountUnsure && r.amount >= 5e5 && r.country !== 'sg' && r.country !== 'os') w = '500';
      a.wholesale = w; a.risk = r.risk;
      return a;
    };
    const canSeeReturns = (a, r) => ['cert', 'likely', '500'].includes(a.wholesale) && !(r && (r.country === 'sg' || r.country === 'os'));
    const score = (a) => {
      let t = 0, unk = 0; const gates = [];
      Object.keys(W).forEach((k) => { const v = a[k]; const s = W[k][v]; if (s == null) return; t += s; if (v === 'unk') unk++; });
      if (a.amount === 'under') gates.push('min'); if (a.wholesale === 'no') gates.push('ws'); if (a.risk === 'guarantee') gates.push('fit');
      const p = Math.max(0, t) / MAXS;
      const tier = gates.length ? 'X' : unk >= 3 ? 'H' : p >= 0.65 ? 'A' : p >= 0.4 ? 'B' : 'C';
      return { t: t, p: p, pts: Math.round(p * 100), tier: tier, gates: gates, unk: unk };
    };
    const targetStart = (r) => {
      if (r.startDate) { const n = daysUntil(r.startDate); if (n != null && n > 0) return { days: n, date: new Date(r.startDate + 'T00:00:00'), stated: true }; }
      const m = { '30': 30, '90': 90, '180': 180 }[r.when]; if (m) return { days: m, date: addDays(m), stated: false };
      return null;
    };
    const OWNER = (n) => /Eligibility/.test(n) ? 'You and our team' : /Intro call|First monthly|First income/.test(n) ? 'Atlantis' : /Information pack/.test(n) ? 'You, with your partner or accountant' : /Term deposit|Release your funds/.test(n) ? 'You and your bank' : /Refinance/.test(n) ? 'Your broker or bank' : /SMSF/.test(n) ? 'You and your adviser' : /Wholesale certificate/.test(n) ? 'You and your accountant' : /Accredited investor/.test(n) ? 'You and our Singapore office' : 'You';
    const timeline = (r) => {
      const S = [];
      S.push({ n: 'Readiness check', d: 'Done today', min: 0, max: 0, done: true });
      S.push({ n: 'Intro call with Atlantis', d: 'Confirm your goals, answer questions and agree a plan.', min: 1, max: 3 });
      S.push({ n: 'Information pack and questions', d: 'Read the documents and bring your partner or accountant into a follow up call.', min: 3, max: 7 });
      if (r.source === 'td') { const dd = daysUntil(r.tdMature);
        if (dd != null && dd > 0) S.push({ n: 'Term deposit matures', d: 'Your deposit matures on ' + fmtDate(r.tdMature) + '. Shares settle two business days after sale.', target: dd, fixed: true });
        else S.push({ n: 'Release your funds', d: 'Breaking a term deposit usually needs 31 days\' notice. Shares settle two business days after sale.', min: 3, max: 31 }); }
      if (r.source === 'equity') {
        S.push({ n: 'Refinance approval', d: (r.broker === 'yes' ? 'Your broker submits the application and the bank values the property.' : 'We can introduce a broker. Application, valuation and approval.') + ' Banks are taking longer than usual at the moment.', min: 28, max: 35 });
        S.push({ n: 'Refinance settles', d: 'The new loan settles and the released equity lands in your account.', min: 14, max: 21 }); }
      if (r.source === 'super') {
        if (r.smsf === 'yes') S.push({ n: 'SMSF checks and trustee approval', d: 'Check your investment strategy allows private credit and record the trustee decision.', min: 7, max: 14 });
        else S.push({ n: 'Set up SMSF and roll over super', d: 'With a licensed adviser: establish the fund, register it and roll your super across.', min: 28, max: 56 }); }
      if (r.source === 'unk') S.push({ n: 'Confirm where funds come from', d: r.follow ? 'Follow up call on ' + fmtDate(r.follow) + '.' : 'Choose a follow up date with us on the intro call.', min: 14, max: 30, target: r.follow ? daysUntil(r.follow) : null, fixed: !!r.follow });
      const cert = r.wholesale === 'cert'; const sgp = r.country === 'sg';
      if (r.country === 'os') S.push({ n: 'Eligibility and ID checks', d: 'Our team will confirm what you need where you live, and check your photo ID. This can run alongside the steps above.', min: 3, max: 10 });
      else S.push({ n: cert ? 'Identity checks' : sgp ? 'Accredited investor and ID checks' : 'Wholesale certificate and ID checks', d: cert ? (sgp ? 'Confirm your accredited investor status and provide photo ID.' : 'Upload your certificate and photo ID.') : sgp ? 'Confirm your accredited investor status with our Singapore office. This can run alongside the steps above.' : 'Ask your accountant for a wholesale certificate. This can run alongside the steps above.', min: cert ? 1 : 3, max: cert ? 3 : 10 });
      S.push({ n: 'Application and transfer', d: 'Sign the application and transfer your funds.', min: 2, max: 5 });
      S.push({ n: (r.product === 'liq' ? 'First income payment' : 'First monthly income'), d: r.product === 'liq' ? 'Income starts once your investment starts. Payment frequency is confirmed in the Information Memorandum.' : 'Income is paid monthly once your investment starts.', min: 30, max: 30, income: true });
      let a = 0, b = 0; S.forEach((s) => { if (s.target != null) { s.min = Math.max(1, s.target - a); s.max = Math.max(1, s.target - b); } s.s0 = a; s.s1 = b; a += s.min; b += s.max; s.e0 = a; s.e1 = b; });
      const inv = S[S.length - 2];
      return { S: S, toInvestMin: inv.e0, toInvestMax: inv.e1, total: b };
    };
    const timelineSVG = (T) => {
      const W = 720, L = 230, R = 24, rowH = 46, top = 48, h = top + T.S.length * rowH + 30;
      const tg = T.target; const maxD = Math.max(T.total, 14, tg ? tg.days + 4 : 0); const span = W - L - R; const x = (d) => L + d / maxD * span;
      const wk = Math.ceil(maxD / 7); const step = wk > 16 ? 4 : wk > 8 ? 2 : 1;
      let g = '<svg viewBox="0 0 ' + W + ' ' + h + '"><rect width="' + W + '" height="' + h + '" fill="#ffffff"/>';
      for (let i = 0; i <= wk; i += step) { const xx = x(i * 7); g += '<line x1="' + xx + '" y1="' + (top - 8) + '" x2="' + xx + '" y2="' + (h - 24) + '" stroke="#ECEAE5"/><text x="' + xx + '" y="' + (top - 27) + '" font-size="11" font-weight="700" fill="#1E2633" text-anchor="middle" font-family="Manrope,Arial,sans-serif">' + (i === 0 ? 'Today' : 'Wk ' + i) + '</text><text x="' + xx + '" y="' + (top - 13) + '" font-size="10" fill="#8A919C" text-anchor="middle" font-family="Manrope,Arial,sans-serif">' + dShort(addDays(i * 7)) + '</text>'; }
      if (tg) { const tx = x(tg.days); g += '<line x1="' + tx + '" y1="' + (top - 8) + '" x2="' + tx + '" y2="' + (h - 24) + '" stroke="#B8975A" stroke-width="2" stroke-dasharray="5 4"/>'; const lx = tx > W - 176 ? tx - 164 : tx + 6; g += '<rect x="' + lx + '" y="' + (top - 2) + '" width="158" height="20" rx="10" fill="#F4EDE0" stroke="#B8975A" stroke-width="1"/><text x="' + (lx + 79) + '" y="' + (top + 12) + '" font-size="10.5" font-weight="700" text-anchor="middle" fill="#8A6E3B" font-family="Manrope,Arial,sans-serif">Your start: ' + dShort(tg.date) + ' · Wk ' + Math.max(1, Math.ceil(tg.days / 7)) + '</text>'; }
      T.S.forEach((s, i) => {
        const y = top + i * rowH; const cy = y + rowH / 2; const isNext = i === 1;
        g += '<text x="0" y="' + (cy - 3) + '" font-size="13" font-weight="600" fill="' + (s.done ? '#1f7a50' : isNext ? '#14213D' : '#1E2633') + '" font-family="Manrope,Arial,sans-serif">' + esc(s.n) + '</text>';
        g += '<text x="0" y="' + (cy + 13) + '" font-size="11" fill="#5B6472" font-family="Manrope,Arial,sans-serif">' + (s.done ? 'Complete' : s.income ? 'About ' + s.min + ' days after investing' : s.fixed ? 'Set date' : s.min === s.max ? s.min + ' days' : s.min + ' to ' + s.max + ' days') + '</text>';
        if (s.done) { g += '<circle cx="' + x(0) + '" cy="' + cy + '" r="8" fill="#1f7a50"/><path d="M' + (x(0) - 4) + ' ' + cy + ' l3 3 l5 -6" stroke="#fff" stroke-width="2" fill="none"/>';
          g += '<rect x="' + (x(0) + 14) + '" y="' + (cy - 11) + '" width="86" height="22" rx="11" fill="#e3f2ea"/><text x="' + (x(0) + 57) + '" y="' + (cy + 4) + '" font-size="11" font-weight="600" text-anchor="middle" fill="#1f7a50" font-family="Manrope,Arial,sans-serif">You are here</text>'; return; }
        const fill = s.income ? '#B8975A' : isNext ? '#14213D' : '#2E3B58';
        const x0 = x(s.s0), x1 = Math.max(x(s.e0), x0 + 6), x2 = Math.max(x(s.s1 + s.max), x1);
        if (x2 > x1) g += '<rect x="' + x0 + '" y="' + (cy - 7) + '" width="' + (x2 - x0) + '" height="14" rx="3" fill="' + fill + '" opacity=".22"/>';
        g += '<rect x="' + x0 + '" y="' + (cy - 7) + '" width="' + (x1 - x0) + '" height="14" rx="3" fill="' + fill + '"/>';
        if (isNext) g += '<text x="' + (x2 + 8) + '" y="' + (cy + 4) + '" font-size="11" font-weight="600" fill="#14213D" font-family="Manrope,Arial,sans-serif">Next step</text>';
        if (s.income) g += '<text x="' + Math.min(x2 + 8, W - 4) + '" y="' + (cy + 4) + '" font-size="11" font-weight="600" fill="#B8975A" text-anchor="' + (x2 + 80 > W ? 'end' : 'start') + '" font-family="Manrope,Arial,sans-serif">$</text>';
      });
      g += '<rect x="' + L + '" y="' + (h - 16) + '" width="18" height="8" rx="2" fill="#2E3B58"/><text x="' + (L + 24) + '" y="' + (h - 9) + '" font-size="10.5" fill="#5B6472" font-family="Manrope,Arial,sans-serif">Typical time</text><rect x="' + (L + 110) + '" y="' + (h - 16) + '" width="18" height="8" rx="2" fill="#2E3B58" opacity=".22"/><text x="' + (L + 134) + '" y="' + (h - 9) + '" font-size="10.5" fill="#5B6472" font-family="Manrope,Arial,sans-serif">Can take up to</text>';
      return g + '</svg>';
    };
    const returns = (r) => {
      const liqOnly = !r.amountUnsure && r.amount < RC.minimum;
      const amount = r.amountUnsure ? RC.minimum * 2 : Math.max(r.amount, RC.minimumLiq);
      const term = r.term;
      const list = [
        { k: 'td', n: 'Bank term deposit', rate: RC.tdRate, c: '#C2C6CE' },
        { k: 'liq', n: 'Liquidity Fund', rate: RC.rates.liq[term], c: '#8C97AD' },
        { k: 'm1', n: '1st Mortgage Fund (' + term + 'y)', rate: RC.rates.m1[term], c: '#2E3B58' },
        { k: 'm2', n: '2nd Mortgage Fund (' + term + 'y)', rate: RC.rates.m2[term], c: '#14213D' }
      ].filter((o) => !liqOnly || o.k === 'td' || o.k === 'liq').map((o) => Object.assign(o, { yr: amount * o.rate / 100 }));
      const focus = list.find((o) => o.k === (liqOnly ? 'liq' : r.product)) || list[2];
      return { amount: amount, term: term, list: list, focus: focus, td: list[0] };
    };
    const barsSVG = (R) => {
      const W = 720, L = 200, Rp = 120, rowH = 40, h = R.list.length * rowH + 10; const max = Math.max(...R.list.map((o) => o.yr)); const x = (v) => v / max * (W - L - Rp);
      let g = '<svg viewBox="0 0 ' + W + ' ' + h + '"><rect width="' + W + '" height="' + h + '" fill="#ffffff"/>';
      R.list.forEach((o, i) => { const y = i * rowH + 8; const isF = o === R.focus;
        g += '<text x="0" y="' + (y + 15) + '" font-size="13" font-weight="' + (isF ? 700 : 500) + '" fill="#1E2633" font-family="Manrope,Arial,sans-serif">' + esc(o.n) + '</text>';
        g += '<text x="0" y="' + (y + 29) + '" font-size="11" fill="#5B6472" font-family="Manrope,Arial,sans-serif">' + o.rate + '% p.a.' + (o.k === 'td' ? ' (comparison)' : ' target') + '</text>';
        g += '<rect x="' + L + '" y="' + (y + 6) + '" width="' + Math.max(2, x(o.yr)) + '" height="20" rx="3" fill="' + o.c + '"' + (isF ? ' stroke="#B8975A" stroke-width="2"' : '') + '/>';
        g += '<text x="' + (L + x(o.yr) + 8) + '" y="' + (y + 21) + '" font-size="13" font-weight="600" fill="#1E2633" font-family="Manrope,Arial,sans-serif">' + fmt$(o.yr) + '</text>';
      });
      return g + '</svg>';
    };
    const shortK = (v) => v >= 1e6 ? '$' + (v / 1e6).toFixed(1) + 'm' : '$' + Math.round(v / 1e3) + 'k';
    const cumulSVG = (R) => {
      const W = 720, H = 250, L = 70, Rp = 150, T = 16, B = 34; const months = R.term * 12;
      const f = R.focus.yr / 12, t = R.td.yr / 12; const maxV = f * months; const x = (m) => L + m / months * (W - L - Rp), y = (v) => T + (1 - v / maxV) * (H - T - B);
      let g = '<svg viewBox="0 0 ' + W + ' ' + H + '"><rect width="' + W + '" height="' + H + '" fill="#ffffff"/>';
      const ticks = 4; for (let i = 0; i <= ticks; i++) { const v = maxV * i / ticks; g += '<line x1="' + L + '" x2="' + (W - Rp) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#ECEAE5"/><text x="' + (L - 8) + '" y="' + (y(v) + 4) + '" font-size="10.5" text-anchor="end" fill="#5B6472" font-family="Manrope,Arial,sans-serif">' + shortK(v) + '</text>'; }
      for (let yr = 0; yr <= R.term; yr++) { g += '<text x="' + x(yr * 12) + '" y="' + (H - 12) + '" font-size="10.5" text-anchor="middle" fill="#5B6472" font-family="Manrope,Arial,sans-serif">' + (yr === 0 ? 'Start' : 'Year ' + yr) + '</text>'; }
      const bw = Math.max(2, (W - L - Rp) / months * 0.62);
      for (let m = 1; m <= months; m++) { const v = f * m; g += '<rect x="' + (x(m) - bw / 2) + '" y="' + y(v) + '" width="' + bw + '" height="' + (y(0) - y(v)) + '" fill="#14213D" opacity="' + (0.18 + 0.5 * m / months) + '"/>'; }
      g += '<polyline points="' + [0, months].map((m) => x(m) + ',' + y(t * m)).join(' ') + '" fill="none" stroke="#C2C6CE" stroke-width="2.5" stroke-dasharray="6 4"/>';
      const fe = f * months, te = t * months;
      g += '<circle cx="' + x(months) + '" cy="' + y(fe) + '" r="5" fill="#B8975A"/><text x="' + (x(months) + 10) + '" y="' + (y(fe) + 4) + '" font-size="12.5" font-weight="700" fill="#1E2633" font-family="Manrope,Arial,sans-serif">' + fmt$(fe) + '</text><text x="' + (x(months) + 10) + '" y="' + (y(fe) + 19) + '" font-size="10.5" fill="#5B6472" font-family="Manrope,Arial,sans-serif">' + esc(PRODUCT_NAME[R.focus.k]) + '</text>';
      g += '<circle cx="' + x(months) + '" cy="' + y(te) + '" r="4" fill="#C2C6CE"/><text x="' + (x(months) + 10) + '" y="' + (y(te) + 4) + '" font-size="12" fill="#5B6472" font-family="Manrope,Arial,sans-serif">' + fmt$(te) + '</text><text x="' + (x(months) + 10) + '" y="' + (y(te) + 19) + '" font-size="10.5" fill="#5B6472" font-family="Manrope,Arial,sans-serif">Term deposit</text>';
      return g + '</svg>';
    };
    const ringSVG = (pts, tier) => {
      const c = 2 * Math.PI * 66, col = tier === 'X' ? '#a8291f' : tier === 'A' ? '#1f7a50' : '#14213D';
      return '<svg viewBox="0 0 170 170"><circle cx="85" cy="85" r="66" fill="none" stroke="#ECEAE5" stroke-width="14"/><circle cx="85" cy="85" r="66" fill="none" stroke="' + col + '" stroke-width="14" stroke-linecap="round" stroke-dasharray="' + (c * pts / 100) + ' ' + c + '" transform="rotate(-90 85 85)"/><text x="85" y="88" text-anchor="middle" font-size="44" font-family="Manrope,Arial,sans-serif" fill="#1E2633">' + pts + '</text><text x="85" y="112" text-anchor="middle" font-size="12" fill="#5B6472" font-family="Manrope,Arial,sans-serif">out of 100</text></svg>';
    };
    const todos = (r, a, s) => {
      const t = []; const add = (b, d, c) => t.push({ b: b, d: d, c: c || '' });
      if (s.gates.includes('min')) add('Minimum investment', 'The lowest minimum investment at Atlantis is ' + fmt$(RC.minimumLiq) + ', in the Liquidity Fund. The mortgage funds start at ' + fmt$(RC.minimum) + '. If your plans change, we would be glad to talk again.', 'bad');
      if (a.amount === 'liqonly') add('The Liquidity Fund is open at this amount', 'The Liquidity Fund has a minimum of ' + fmt$(RC.minimumLiq) + '. The mortgage funds start at ' + fmt$(RC.minimum) + ', so the illustration shows the Liquidity Fund.', 'warn');
      if (s.gates.includes('fit')) add('Capital is not guaranteed', 'No Atlantis investment guarantees your capital. If capital protection is essential, these investments may not suit you.', 'bad');
      if (s.gates.includes('ws')) add('Wholesale investors only', 'These investments are offered to wholesale investors. Atlantis will confirm whether any option is available to you.', 'bad');
      if (r.existing === 'yes') add('Welcome back', 'As an existing investor, the person who looks after your investment will call you to arrange the extra investment.');
      if (r.country === 'sg') add('Investing from Singapore', 'We will put you in touch with our Singapore office, which will confirm your accredited investor status and which options are open to you.');
      if (r.country === 'os') add('Investing from overseas', 'Our team will confirm which options are available where you live before going any further.', 'warn');
      if (r.entity === 'co') add('Have your company details ready', 'A recent company extract and the details of each director and shareholder.');
      if (r.entity === 'trust') add('Have your trust details ready', 'A copy of the trust deed and the details of the trustee.');
      if (r.experience === 'none') add('New to private credit', 'That is completely fine. We will start with the basics on your intro call: how the funds work, how your money is secured and the risks.');
      const src = {
        cash: ['Confirm your funds are ready', 'Make sure the money is in an account in your name and can be transferred when needed.'],
        td: ['Check your release date', r.tdMature ? 'Your term deposit matures on ' + fmtDate(r.tdMature) + '. Tell your bank not to roll it over.' : 'Find your maturity date. Breaking early usually needs 31 days\' notice and can reduce the interest paid. If selling shares, check any tax with your accountant.'],
        equity: ['Start the refinance early', r.broker === 'yes' ? 'Let your broker know the amount you would like to release so the application can start.' : 'Speak with a broker or your bank about releasing equity. We can introduce a broker if you would like.'],
        super: r.smsf === 'yes' ? ['Check your SMSF can invest', 'Confirm your fund\'s investment strategy allows private credit and record the trustee decision. SMSFs are generally treated as retail investors unless the fund has net assets of $10 million or more, so Atlantis will confirm which options are open to you.'] : ['Get advice on super', 'Setting up an SMSF needs a licensed adviser and usually takes 4 to 8 weeks. Atlantis will also confirm which options are open to an SMSF.'],
        unk: ['Decide where the funds will come from', r.follow ? 'We will follow up on ' + fmtDate(r.follow) + '. Before then, think about which account or asset you would use.' : 'Pick a follow up date with us so this does not drift.']
      }[r.source];
      if (src) add(src[0], src[1], r.source === 'unk' ? 'warn' : '');
      if (r.decider === 'jointout') add('Talk it through with your partner', 'Investors who include their partner early usually decide faster. We would suggest you both join the intro call.', 'warn');
      if (r.decider === 'adviser') add('Brief your accountant or adviser', 'Let them know you are looking at this. We can send them the fund documents and speak with them directly.');
      if (r.decider === 'unk') add('Confirm who is involved', 'Think about who else would want to be comfortable with this decision, and invite them to the intro call.', 'warn');
      if (a.wholesale === '500') add('Wholesale test', 'Investing $500,000 or more in a single fund can meet the wholesale test without an accountant\'s certificate. Atlantis will confirm.');
      else if (r.country === 'os') { /* our team confirms what applies overseas */ }
      else if (r.country === 'sg') { if (r.wholesale === 'cert') add('Have proof of your status ready', 'Our Singapore office will ask you to confirm your accredited investor status.'); else if (r.wholesale === 'likely' || r.wholesale === 'unk') add('Check your accredited investor status', 'Net personal assets over S$2 million, financial assets over S$1 million, or income of S$300,000 or more in the last 12 months. We can explain what is involved.', 'warn'); }
      else if (r.wholesale === 'cert') add('Have your certificate ready', 'Your accountant\'s certificate needs to be less than two years old.');
      else if (r.wholesale === 'likely') add('Ask your accountant for a certificate', 'Request a wholesale investor certificate now (net assets of $2.5m or more, or gross income of $250k or more in each of the last two years). Waiting on this is the most common delay.', 'warn');
      else if (r.wholesale === 'unk' && r.source !== 'super') add('Check if you qualify as a wholesale investor', 'Ask your accountant whether you meet the wholesale test. We can explain what is involved on the intro call.', 'warn');
      if (r.experience === 'many' && r.country !== 'sg' && r.country !== 'os' && ['likely', 'unk', 'no'].includes(r.wholesale) && a.wholesale !== '500' && a.wholesale !== 'smsf') add('Your experience may count', 'If you have invested in similar products before, our licensee may be able to assess you as a sophisticated investor based on that experience, even without an accountant\'s certificate. We can talk this through on your intro call.');
      if (r.risk === 'liquid') add('Keep some money accessible', 'If you may need funds at short notice, the Liquidity Fund or a shorter term may suit part of your money better.', 'warn');
      if (r.risk === 'unk') add('Think about access to your money', 'Consider how much you could leave invested for 1 to 3 years without needing it.');
      if (r.motive === 'income' && !r.goal) add('Set an income target', 'Work out the monthly income you would like. It makes the right amount and term much easier to choose.');
      add('Have photo ID ready', 'A driver licence or passport for the standard identity checks.');
      return t;
    };

export function buildReport(r): Record<string, any> {
  NOW = new Date(r.created);
    const ra = internalAnswers(r), rs = score(ra); if (r.country === 'os' && rs.tier !== 'X') rs.tier = 'H'; const rT = timeline(r), rR = returns(r), rP = PATHWAYS[r.source], rB = BANDS[rs.tier];
    rT.target = targetStart(r);
    const rTodo = todos(r, ra, rs);
    const rConcerns = (r.concerns || []).filter((c) => c !== 'ready');
    const rReady = (r.concerns || []).includes('ready');
    const rMonthly = rR.focus.yr / 12, rExtra = (rR.focus.yr - rR.td.yr) * rR.term;
    const showReturns = !(rs.gates.includes('min') || rs.gates.includes('fit')) && canSeeReturns(ra, r);
    const showGated = !(rs.gates.includes('min') || rs.gates.includes('fit')) && !canSeeReturns(ra, r);
    const overseasR = r.country === 'sg' || r.country === 'os';
    // plan in dates
    const tg = rT.target, invD = addDays(rT.toInvestMin), invMaxD = addDays(rT.toInvestMax);
    let planIntro;
    if (tg && tg.stated) planIntro = ['You told us you would like your investment to start by ', dLong(tg.date), '. We have built this plan around that date, so everyone knows what needs to happen and by when, and we will check in with you against it at each step.'];
    else if (tg) planIntro = ['You told us you would like to start ' + (((OPTS.when.find((o) => o[0] === r.when) || [])[1]) || '').toLowerCase() + ', so we have used ', dLong(tg.date), ' as your target. We will confirm the date together on your intro call and check in with you against it at each step.'];
    else planIntro = ['You have not set a start date yet. Here is how the steps would usually fall from today. We will agree a target date together on your intro call.', '', ''];
    let planStatus = null;
    if (tg) { const gap = Math.round((tg.date - invD) / 864e5);
      planStatus = gap >= 0 ? { b: 'On track.', t: ' With typical timings you could be invested by ' + dLong(invD) + (gap > 2 ? ', about ' + weeks(gap, gap) + ' ahead of your target' : ', right on your target') + '. If anything runs slower, we will let you know straight away.' }
        : { b: 'Your date is tight.', t: ' Typical timings put your investment at around ' + dLong(invD) + ', which is ' + weeks(-gap, -gap) + ' after your target.' + (r.source === 'td' && r.tdMature && new Date(r.tdMature + 'T00:00:00') > tg.date ? ' The main reason is that your term deposit matures on ' + dLong(new Date(r.tdMature + 'T00:00:00')) + ', after your target date.' : '') + ' We will look at which steps can run side by side to close the gap, or agree a date that works on your intro call.' }; }
    const planItems = rT.S.filter((x) => !x.done).map((x) => { const by = x.fixed && x.target != null ? addDays(x.target) : addDays(x.e0); return { d: by, k: 0, step: x.n, who: OWNER(x.n), when: (x.income ? 'From ' : 'By ') + dShort(by), tgt: false }; });
    if (tg) planItems.push({ d: tg.date, k: 1, step: 'Your target start date', who: tg.stated ? 'Set by you' : 'From your answer', when: dShort(tg.date), tgt: true });
    planItems.sort((a, b) => (a.d - b.d) || (a.k - b.k));
    const roundUp = (v) => Math.ceil(v / 5000) * 5000;
    const goalRows = r.goal > 0 ? ['m1', 'm2', 'liq'].map((k) => { const rate = RC.rates[k][r.term]; const need = roundUp(r.goal * 12 / (rate / 100)); const min = k === 'liq' ? RC.minimumLiq : RC.minimum;
      return { name: PRODUCT_NAME[k] + (k === 'liq' ? '' : ' (' + r.term + ' year' + (r.term > 1 ? 's' : '') + ')'), rate: rate + '% p.a. target', need: fmt$(Math.max(need, min)), note: need < min ? 'Minimum investment' : '', cls: k === rR.focus.k ? 'on' : '' }; }) : [];
    let goalStatus = '';
    if (r.goal > 0) { const fr = rR.focus.rate; const need = roundUp(r.goal * 12 / (fr / 100)); const fname = PRODUCT_NAME[rR.focus.k];
      if (r.amountUnsure) goalStatus = 'You have not settled on an amount yet. In the ' + fname + ', an income of ' + fmt$(r.goal) + ' a month would need about ' + fmt$(need) + ' invested.';
      else if (r.amount >= need) goalStatus = 'Good news. Your amount of ' + fmt$(r.amount) + ' in the ' + fname + ' could pay about ' + fmt$(r.amount * fr / 100 / 12) + ' a month, which meets your goal.';
      else goalStatus = 'To reach ' + fmt$(r.goal) + ' a month in the ' + fname + ', you would need about ' + fmt$(need) + ' invested. That is about ' + fmt$(need - r.amount) + ' more than the ' + fmt$(r.amount) + ' you mentioned.'; }
    const createdD = new Date(r.created);
  const report = {
      rcHeadName: r.name || 'Your summary', rcPathText: rP.d,
      rcDate: createdD.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }), rcRef: r.ref,
      rcRing: (ringSVG(rs.pts, rs.tier)), rcScoreLabel: 'Readiness score ' + rs.pts + ' out of 100',
      rcBandName: rB.n, rcBandText: rB.d, rcPathName: rP.n, rcPathTag: rP.tag,
      rcFactAmount: r.amountUnsure ? 'To confirm' : short$(r.amount), rcFactTime: rs.tier === 'X' ? 'Not applicable' : weeks(rT.toInvestMin, rT.toInvestMax), rcFactItems: String(rTodo.length),
      rcLegend: ['X', 'C', 'H', 'B', 'A'].map((k) => ({ n: BANDS[k].n, cls: k === rs.tier ? 'on' : '' })),
      rcShowTimeline: rs.tier !== 'X',
      rcTimeline: (timelineSVG(rT)),
      rcNextName: rT.S[1].n, rcNextDesc: rT.S[1].d,
      rcPlanA: planIntro[0], rcPlanB: planIntro[1], rcPlanC: planIntro[2],
      rcPlanStatus: !!planStatus, rcPlanStatusB: planStatus ? planStatus.b : '', rcPlanStatusT: planStatus ? planStatus.t : '',
      rcPlanRows: planItems.map((i) => ({ step: i.step, who: i.who, when: i.when, cls: i.tgt ? 'tgt' : '' })),
      rcPlanFoot: 'Dates use typical timings from today, ' + dShort(today()) + '. Some steps depend on banks, brokers and accountants, so they can move. Typical time to invest is ' + weeks(rT.toInvestMin, rT.toInvestMax) + ', so the latest we would usually expect is ' + dShort(invMaxD) + '.',
      rcTodos: rTodo.map((i) => ({ b: i.b, d: i.d, cls: i.c })),
      rcShowQA: rConcerns.length > 0 || !!r.notes || rReady,
      rcReady: rReady, rcReadyReply: CONCERN_REPLY.ready,
      rcQA: rConcerns.map((c) => ({ q: '“' + CONCERN_LABEL[c] + '”', a: CONCERN_REPLY[c] })),
      rcHasNote: !!r.notes, rcNoteText: r.notes,
      rcShowReturns: showReturns, rcShowGated: showGated,
      rcGoalShow: showReturns && r.goal > 0, rcGoalTitle: 'Your income goal: ' + fmt$(r.goal || 0) + ' a month', rcGoalStatus: goalStatus, rcGoalRows: goalRows,
      rcGoalGated: showGated && r.goal > 0, rcGoalGatedText: 'You told us you would like ' + fmt$(r.goal || 0) + ' a month. Once your eligibility is confirmed, we will show you how much you would need to invest in each fund to reach it.',
      rcGatedA: overseasR ? 'Target returns are only shared once we have confirmed which options are open to investors where you live, so we have not shown any figures here.' : 'Target returns are only shared with wholesale investors, so we have not shown any figures here.',
      rcGatedB: overseasR ? 'Our team will confirm this on your intro call and take you through the target returns, fees and risks of each fund.' : r.wholesale === 'no' ? 'If your situation changes, or you would like to understand the wholesale test, we are happy to talk it through.' : 'Once your eligibility is confirmed, we will take you through the target returns, fees and risks of each fund on your intro call. Your accountant can usually confirm whether you qualify within a few days.',
      rcEarnLead: 'An illustration based on ' + (r.amountUnsure ? 'an example amount of ' + fmt$(rR.amount) : 'your amount of ' + fmt$(rR.amount)) + ', with income ' + (rR.focus.k === 'liq' ? 'shown monthly' : 'paid monthly') + ' at the target rates. Targets are not guaranteed.',
      rcMoney: [
        { k: 'Each month', v: fmt$(rMonthly), s: PRODUCT_NAME[rR.focus.k] + ' at ' + rR.focus.rate + '%' },
        { k: 'Each year', v: fmt$(rR.focus.yr), s: 'about ' + fmt$(rR.focus.yr / 52) + ' a week' },
        { k: 'Over ' + rR.term + ' year' + (rR.term > 1 ? 's' : ''), v: fmt$(rR.focus.yr * rR.term), s: rExtra > 0 ? fmt$(rExtra) + ' more than a term deposit' : '' }
      ],
      rcBars: (barsSVG(rR)), rcCumul: (cumulSVG(rR)),
      rcEarnFoot: 'Term deposit comparison uses ' + RC.tdRate + '% p.a., the ' + RC.tdNote + ', held for the same period. ' + (rR.focus.k === 'liq' ? 'You can withdraw your capital with 30 days\' notice. It is not shown in the income figures.' : 'Your capital is returned at the end of the term and is not shown in the income figures.'),
      rcNextTitle: rs.tier === 'X' ? 'Thank you for your time' : 'What happens next',
      rcNextText: rs.tier === 'X' ? 'Atlantis Private will be in touch to talk through your answers and whether anything may suit you in future.' : 'Atlantis Private will call you within ' + RC.callbackDays + (r.calltime && r.calltime !== 'any' ? ' in the ' + (((OPTS.calltime.find((o) => o[0] === r.calltime) || [])[1]) || '').toLowerCase() : '') + ' for a short intro call. Have this summary handy.',
      rcContactLines: [RC.contactPhone, RC.contactEmail, RC.website, r.country === 'sg' ? RC.addressSG : RC.address]
  };
  // Plain-text versions of the charts, for phones where the SVGs would be too small to read.
  report.rcTimelineRows = rT.S.map((s, i) => ({
    n: s.n,
    d: s.done ? 'Complete' : s.income ? 'About ' + s.min + ' days after investing' : s.fixed ? 'Set date' : s.min === s.max ? s.min + ' days' : s.min + ' to ' + s.max + ' days',
    done: !!s.done, next: i === 1, income: !!s.income
  }));
  const maxYr = Math.max(...rR.list.map((o) => o.yr));
  report.rcOptions = rR.list.map((o) => ({
    n: o.n, rate: o.rate, yr: fmt$(o.yr), pct: Math.max(2, Math.round(o.yr / maxYr * 100)), focus: o === rR.focus, td: o.k === 'td'
  }));
  // Data minimisation: figures that depend on the target rates leave the server only when
  // this visitor is allowed to see returns.
  if (!report.rcShowReturns) {
    report.rcMoney = []; report.rcBars = ""; report.rcCumul = ""; report.rcEarnLead = "";
    report.rcEarnFoot = ""; report.rcOptions = []; report.rcGoalRows = []; report.rcGoalStatus = ""; report.rcGoalShow = false;
  }
  return report;
}
