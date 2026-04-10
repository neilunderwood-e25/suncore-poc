import type { NewsAndStoriesSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { NewsCard } from "./NewsCard";

type NewsAndStoriesProps = {
  section: NewsAndStoriesSection;
};

export function NewsAndStories({ section }: NewsAndStoriesProps) {
  if (!section.articles.length) return null;

  const firstRow = section.articles.slice(0, 2);
  const restRows = section.articles.slice(2);

  return (
    <section className="relative py-16">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[80%] bg-midnight"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        {section.heading && (
          <div className="mt-[16px] mb-[32px]">
            <h2 className="text-[32px] font-bold leading-[48px] text-white text-center">
              {section.heading}
            </h2>
          </div>
        )}
        {section.subtitle && (
          <div className="mt-[16px] mb-[32px]">
            <p className="text-[22px] font-bold leading-[48px] text-white text-center">
              {section.subtitle}
            </p>
          </div>
        )}

        {/* Card grid: row 1 = 2 cols, row 2+ = 3 cols */}
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {firstRow.map((article) => (
              <NewsCard key={article.sys.id} article={article} />
            ))}
          </div>
          {restRows.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {restRows.map((article) => (
                <NewsCard key={article.sys.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        {section.cta && (
          <div className="mt-10 text-center">
            <Cta cta={section.cta} />
          </div>
        )}
      </div>
    </section>
  );
}
