import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";
import { footerLinks } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <span className="brand">
            <Image src="/img/logo.png" alt="" width={51} height={44} />
            <span translate="no">{site.name}</span>
          </span>
          <span>{site.tagline}</span>
        </div>
        {site.offices.map((o) => (
          <div className="footer-col" key={o.city}>
            <span className="footer-h">{o.city}</span>
            <span>
              {o.lines.map((l, i) => (
                <span key={l}>
                  {l}
                  {i < o.lines.length - 1 && <br />}
                </span>
              ))}
            </span>
          </div>
        ))}
        <div className="footer-col">
          {footerLinks.left.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>
        <div className="footer-col">
          {footerLinks.right.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-in">
          <span style={{ maxWidth: 640 }}>{site.licence}</span>
          <span className="footer-links">
            <Link href="/terms">Terms and Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/complaints">Complaints</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
