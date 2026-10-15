"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { menus } from "@/lib/nav";
import { Chevron } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  // The open menu belongs to the page it was opened on, so it closes by itself on navigation.
  const [openState, setOpenState] = useState<{ menu: string | null; path: string }>({ menu: null, path: pathname });
  const open = openState.path === pathname ? openState.menu : null;
  const setOpen = (menu: string | null) => setOpenState({ menu, path: pathname });
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = () => setOpenState((s) => ({ ...s, menu: null }));
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-in">
        <Link href="/" className="brand" aria-label="Atlantis Private home">
          <Image src="/img/logo.png" alt="" width={61} height={52} priority />
          <span>Atlantis Private</span>
        </Link>
        <nav className="nav" aria-label="Main" ref={ref}>
          {menus.map((m) => (
            <div className="nav-item" key={m.label}>
              <button
                type="button"
                className="nav-btn"
                aria-expanded={open === m.label}
                aria-controls={`menu-${m.label}`}
                onClick={() => setOpen(open === m.label ? null : m.label)}
              >
                {m.label}
                <Chevron />
              </button>
              {open === m.label && (
                <div className="menu" id={`menu-${m.label}`}>
                  {m.items.map((it) => (
                    <Link key={it.label} href={it.href} onClick={() => setOpen(null)}>
                      <span className="t">{it.label}</span>
                      <span className="d">{it.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/insights" className="nav-link">Insights</Link>
          <Link href="/contact" className="btn btn-sm nav-cta">Let&apos;s talk</Link>
        </nav>
      </div>
    </header>
  );
}
