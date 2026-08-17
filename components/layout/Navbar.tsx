import Image from "next/image";
import Link from "next/link";
import { MarketingCta } from "@/components/shared/MarketingCta";
import { createInsforgeServer } from "@/lib/insforge-server";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Find Jobs", href: "/find-jobs" },
  { label: "Profile", href: "/profile" },
];

export async function Navbar() {
  const insforge = await createInsforgeServer();
  const { data } = await insforge.auth.getCurrentUser();
  const isAuthenticated = Boolean(data.user);

  return (
    <header className="w-full border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-360 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative h-8 w-32 shrink-0">
          <Image
            src="/logo.png"
            alt="JobPilot"
            fill
            priority
            sizes="128px"
            className="object-contain object-left"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-dark transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <MarketingCta
          href={isAuthenticated ? "/dashboard" : "/login"}
          label={isAuthenticated ? "Go to Dashboard" : "Start for free"}
          variant="dark"
          location="navbar"
        />
      </div>
    </header>
  );
}
