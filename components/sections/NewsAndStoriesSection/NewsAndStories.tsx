import type { NewsAndStoriesSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { NewsCard } from "./NewsCard";

type NewsAndStoriesProps = {
  section: NewsAndStoriesSection;
};

export function NewsAndStories({ section }: NewsAndStoriesProps) {
  if (!section.articles.length) return null;

  return (
    <></>
    // <section className="bg-white py-16">
    //   <div className="mx-auto max-w-7xl px-6 lg:px-8">
    //     {/* Header */}
    //     <div className="mb-10">
    //       {section.subtitle && (
    //         <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
    //           {section.subtitle}
    //         </p>
    //       )}
    //       {section.heading && (
    //         <h2 className="text-[32px] font-bold leading-tight text-darkest-grey">
    //           {section.heading}
    //         </h2>
    //       )}
    //     </div>

    //     {/* Card grid */}
    //     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    //       {section.articles.map((article) => (
    //         <NewsCard key={article.sys.id} article={article} />
    //       ))}
    //     </div>

    //     {/* CTA */}
    //     {section.cta && (
    //       <div className="mt-10 text-center">
    //         <Cta cta={section.cta} />
    //       </div>
    //     )}
    //   </div>
    // </section>
  );
}
