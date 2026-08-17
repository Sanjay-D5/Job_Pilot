import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="px-4 pb-8 sm:px-6 lg:px-8">
      <div className="gradient-mesh mx-auto max-w-360 rounded-2xl border border-border px-6 py-20 text-center sm:py-24">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl">
          Your next job search can feel a lot less overwhelming
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-text-secondary">
          Set up your profile, upload your resume, and start finding matches
          in minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-md bg-overlay px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-overlay-dark"
          >
            Get Started
            <ChevronRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
