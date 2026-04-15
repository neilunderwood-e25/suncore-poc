import type { NewsReleasesListingSection } from "@/lib/sections/types";
import { NewsReleaseItem } from "./NewsReleaseItem";

type NewsReleasesSectionProps = {
  section: NewsReleasesListingSection;
};

export function NewsReleasesSection({ section }: NewsReleasesSectionProps) {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="article-container">
        <div className="mx-auto max-w-3xl">
          {section.heading && (
            <h2 className="mb-8 text-2xl font-bold text-midnight md:text-3xl">
              {section.heading}
            </h2>
          )}

          {section.releases.length === 0 ? (
            <p className="py-12 text-center text-dark-grey-70">
              No news releases available at this time.
            </p>
          ) : (
            <div className="rounded-lg border border-light-grey">
              {section.releases.map((release) => (
                <NewsReleaseItem key={release.sys.id} release={release} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
