"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export const ROLE_EVENT = "ap:role";

// A link to the contact form that also pre-selects who is asking.
export default function RoleLink({
  role,
  href = "#contact",
  className,
  children,
}: {
  role: "Investor" | "Borrower" | "Broker or partner";
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(ROLE_EVENT, { detail: role }));
      }}
    >
      {children}
    </Link>
  );
}
