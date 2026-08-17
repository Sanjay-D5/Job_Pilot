import Image from "next/image";
import { MarketingCta } from "@/components/shared/MarketingCta";

type Props = {
  isAuthenticated: boolean;
};

export function Hero({ isAuthenticated }: Props) {
  const ctaHref = isAuthenticated ? "/dashboard" : "/login";

  return (
    <section className="px-4 pt-8 sm:px-6 lg:px-8">
      <div className="gradient-mesh mx-auto max-w-360 rounded-2xl border border-border px-6 py-20 text-center sm:py-24">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
          Job hunting is hard.
          <br />
          Your tools shouldn&apos;t be.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary">
          Stop applying blind. JobPilot finds the jobs, researches the
          companies, and gives you everything you need to stand out.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <MarketingCta
            href={ctaHref}
            label="Get Started"
            variant="dark"
            location="hero"
            icon
          />
          <MarketingCta
            href={ctaHref}
            label="Find Your First Match"
            variant="outline"
            location="hero"
          />
        </div>
      </div>

      <div className="mx-auto -mt-10 max-w-5xl sm:-mt-16">
        <Image
          src="/images/dashboard-demo.png"
          alt="JobPilot dashboard preview"
          width={4788}
          height={2416}
          priority
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="h-auto w-full rounded-2xl"
        />
      </div>
    </section>
  );
}
