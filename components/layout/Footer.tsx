import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-360 flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="relative h-7 w-28 shrink-0">
          <Image
            src="/logo.png"
            alt="JobPilot"
            fill
            className="object-contain object-left"
          />
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Dashboard
          </Link>
          <span className="text-sm text-text-secondary">Privacy Policy</span>
          <span className="text-sm text-text-secondary">
            Terms &amp; Condition
          </span>
        </div>
      </div>
    </footer>
  );
}
