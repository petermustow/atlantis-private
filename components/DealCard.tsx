import type { deals } from "@/lib/content";

export default function DealCard({ deal }: { deal: (typeof deals)[number] }) {
  return (
    <div className="deal">
      <div className="deal-in">
        <span className="badge">SETTLED</span>
        <div className="deal-amount">{deal.amount}</div>
        <div className="bold">{deal.type}</div>
        <div className="muted">{deal.purpose}</div>
        <div className="row between small muted" style={{ marginTop: 8 }}>
          <span>{deal.position}</span>
          <span>LVR {deal.lvr}</span>
        </div>
      </div>
    </div>
  );
}
