import type { Document } from "@contentful/rich-text-types";
import type { CardsSection } from "@/lib/sections/types";
import { RichTextRenderer } from "@/components/common/RichText/RichText";
import { CardGridSlider } from "./CardGridSlider";
import { CardGrid } from "./CardGrid";

type CardsProps = {
  section: CardsSection;
};

export function Cards({ section }: CardsProps) {
  const frontEndComponent = section.frontEndComponent;

  if (frontEndComponent === "card-grid-slider") {
    return <CardGridSlider section={section} />;
  }

  if (frontEndComponent === "card-grid") {
    return <CardGrid section={section} />;
  }

  // default — simple card grid
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {section.heading && (
          <h2 className="mb-8 text-[28px] font-bold text-darkest-grey">
            {section.heading}
          </h2>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.cards.map((card) => {
            const href = card.externalLink ?? (card.internalLink?.slug ? `/${card.internalLink.slug}` : null);
            const Tag = href ? "a" : "div";
            return (
              <Tag
                key={card.sys.id}
                {...(href ? { href } : {})}
                className="rounded-lg border border-light-grey p-6"
              >
                {card.stat && (
                  <span className="text-2xl font-bold text-darkest-grey">{card.stat}</span>
                )}
                {card.description && (
                  <RichTextRenderer
                    document={card.description.json as Document}
                    links={card.description.links}
                    className="mt-2 text-sm text-dark-grey-70"
                  />
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
