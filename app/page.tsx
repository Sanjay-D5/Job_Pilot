import { CtaBanner } from "@/components/homepage/CtaBanner";
import { FeatureSection } from "@/components/homepage/FeatureSection";
import { Hero } from "@/components/homepage/Hero";
import { Testimonial } from "@/components/homepage/Testimonial";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const manageFeatures = [
  {
    title: "Find jobs that actually fit",
    description:
      "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
    highlighted: true,
  },
  {
    title: "Know the Company Before You Apply",
    description:
      "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
  },
  {
    title: "Keep track of every application",
    description:
      "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
  },
];

const confidenceFeatures = [
  {
    title: "Understand your match score",
    description:
      "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
  },
  {
    title: "AI-Powered Job Matching",
    description:
      "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
    highlighted: true,
  },
  {
    title: "Focus on the right roles",
    description:
      "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeatureSection
          heading={
            <>
              Manage Your Job Search
              <br />
              With Ease
            </>
          }
          items={manageFeatures}
          imageSrc="/images/jobs-lists.png"
          imageAlt="Jobs list with match scores, salary estimates, and sources"
          imageWidth={2364}
          imageHeight={1778}
          tinted
        />
        <FeatureSection
          heading={
            <>
              Apply With More Confidence,
              <br />
              Every Time
            </>
          }
          items={confidenceFeatures}
          imageSrc="/images/agnet-log.png"
          imageAlt="JobPilot agent activity log"
          imageWidth={2144}
          imageHeight={1656}
          reverse
        />
        <Testimonial />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
