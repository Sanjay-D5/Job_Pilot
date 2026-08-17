"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import posthog from "posthog-js";

type Props = {
  href: string;
  label: string;
  variant: "dark" | "outline";
  location: "navbar" | "hero" | "cta_banner";
  icon?: boolean;
};

const variantClasses = {
  dark: "inline-flex items-center gap-1.5 rounded-md bg-overlay px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-overlay-dark",
  outline:
    "inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary",
};

export function MarketingCta({ href, label, variant, location, icon }: Props) {
  return (
    <Link
      href={href}
      className={variantClasses[variant]}
      onClick={() => {
        posthog.capture("cta_clicked", { location, label, destination: href });
      }}
    >
      {label}
      {icon && <ChevronRight className="size-4" />}
    </Link>
  );
}
