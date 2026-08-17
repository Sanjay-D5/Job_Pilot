import Image from "next/image";
import type { ReactNode } from "react";

type FeatureItem = {
  title: string;
  description: string;
  highlighted?: boolean;
};

type FeatureSectionProps = {
  heading: ReactNode;
  items: FeatureItem[];
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  reverse?: boolean;
  tinted?: boolean;
};

export function FeatureSection({
  heading,
  items,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  reverse = false,
  tinted = false,
}: FeatureSectionProps) {
  return (
    <section className={tinted ? "bg-surface-secondary" : "bg-surface"}>
      <div className="mx-auto grid max-w-360 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div className={reverse ? "lg:order-2" : ""}>
          <h2 className="text-3xl font-semibold leading-snug text-text-primary sm:text-4xl">
            {heading}
          </h2>
          <ul className="mt-8 space-y-6">
            {items.map((item) => (
              <li
                key={item.title}
                className={`border-l-2 pl-4 ${
                  item.highlighted ? "border-accent" : "border-border"
                }`}
              >
                <p className="text-sm font-semibold text-text-primary">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className={reverse ? "lg:order-1" : ""}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            sizes="(max-width: 1024px) 100vw, 600px"
            className="h-auto w-full rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
