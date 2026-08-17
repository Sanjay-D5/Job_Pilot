import { MarketingCta } from "@/components/shared/MarketingCta";

type Props = {
  isAuthenticated: boolean;
};

export function CtaBanner({ isAuthenticated }: Props) {
  const ctaHref = isAuthenticated ? "/dashboard" : "/login";

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
          <MarketingCta
            href={ctaHref}
            label="Get Started"
            variant="dark"
            location="cta_banner"
            icon
          />
          <MarketingCta
            href={ctaHref}
            label="Find Your First Match"
            variant="outline"
            location="cta_banner"
          />
        </div>
      </div>
    </section>
  );
}
