"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { menus } from "@/lib/nav";
import { Chevron } from "./Icons";

type State = { menu: string | null; nav: boolean; path: string };

export default function Header() {
  const pathname = usePathname();
  // Open menus belong to the page they were opened on, so they close by themselves on navigation.
  const [st, setSt] = useState<State>({ menu: null, nav: false, path: pathname });
  const cur = st.path === pathname ? st : { menu: null, nav: false, path: pathname };
  const open = cur.menu;
  const navOpen = cur.nav;
  const set = (patch: Partial<State>) => setSt({ ...cur, ...patch, path: pathname });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeAll = () => setSt((s) => ({ ...s, menu: null, nav: false }));
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Give focus back to the control that opened the menu, so keyboard users don't lose their place.
      const opener = ref.current?.querySelector<HTMLElement>('[aria-expanded="true"]');
      closeAll();
      opener?.focus();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="site-header" ref={ref}>
      <div className="site-header-in">
        <Link href="/" className="brand" aria-label="Atlantis Private home">
          <Image src="/img/logo.png" alt="" width={61} height={52} priority />
          <span translate="no">Atlantis Private</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={navOpen}
          aria-controls="site-nav"
          onClick={() => set({ nav: !navOpen, menu: null })}
        >
          <span className="menu-label">{navOpen ? "Close" : "Menu"}</span>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {navOpen ? <path d="M4 4l10 10M14 4L4 14" /> : <path d="M3 5h12M3 9h12M3 13h12" />}
          </svg>
        </button>
        <nav className={`nav${navOpen ? " is-open" : ""}`} id="site-nav" aria-label="Main">
          {menus.map((m) => (
            <div className="nav-item" key={m.label}>
              <button
                type="button"
                className="nav-btn"
                aria-expanded={open === m.label}
                aria-controls={`menu-${m.label}`}
                onClick={() => set({ menu: open === m.label ? null : m.label })}
              >
                {m.label}
                <Chevron />
              </button>
              {
                <div className="menu" id={`menu-${m.label}`} hidden={open !== m.label}>
                  {m.items.map((it) => (
                    <Link key={it.label} href={it.href} onClick={() => set({ menu: null, nav: false })}>
                      <span className="t">{it.label}</span>
                      <span className="d">{it.desc}</span>
                    </Link>
                  ))}
                </div>
              }
            </div>
          ))}
          <Link href="/insights" className="nav-link" onClick={() => set({ menu: null, nav: false })}>Insights</Link>
          <Link href="/contact" className="btn btn-sm nav-cta" onClick={() => set({ menu: null, nav: false })}>Let&rsquo;s talk</Link>
        </nav>
      </div>
    </header>
  );
}
