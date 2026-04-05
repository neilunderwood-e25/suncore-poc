import type { Document } from "@contentful/rich-text-types";
import type { CardsSection, CardEntry } from "@/lib/sections/types";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { RichTextRenderer } from "@/components/common/RichText/RichText";
import { Cta } from "@/components/common/Cta";

function GridCard({ card }: { card: CardEntry }) {
  const href =
    card.externalLink ??
    (card.internalLink?.slug ? `/${card.internalLink.slug}` : null);

  const isClickable = !!href;

  const content = (
    <>
      {/* Image — 2:1 aspect ratio, flush to card edges */}
      {card.icon && (
        <div className="aspect-[2/1] overflow-hidden rounded-t-[var(--radius-default-inner)]">
          <ResponsiveImage
            image={card.icon}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <div className="px-[24px] pt-[16px] pb-[48px]">
        {card.stat && (
          <h3
            className={`text-[22px] font-bold leading-[1.5] text-darkest-grey transition-colors duration-300 ${
              isClickable ? "group-hover:text-dusk" : ""
            }`}
          >
            {card.stat}
          </h3>
        )}

        {card.description && (
          <RichTextRenderer
            document={card.description.json as Document}
            links={card.description.links}
            className={`text-[22px] font-bold leading-relaxed text-dark-grey transition-colors duration-300 [&_*]:text-[22px] [&_*]:font-bold [&_*]:mb-0 ${
              isClickable ? "group-hover:text-dusk [&_*]:group-hover:text-dusk" : ""
            }`}
          />
        )}
      </div>
    </>
  );

  if (isClickable) {
    return (
      <a
        href={href!}
        className="clickable-card group flex flex-col overflow-hidden rounded-[var(--radius-default)] bg-white transition-[filter] duration-300 hover:drop-shadow-[0_1px_16px_rgba(0,0,0,0.1)]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-default)] bg-white">
      {content}
    </div>
  );
}

export function CardGrid({ section }: { section: CardsSection }) {
  return (
    <section className="bg-dusty-blue py-[32px]">
      {/* Container */}
      <div className="mx-auto max-w-[1312px]">
        {/* Header */}
        <div className="max-w-[76rem]">
          {/* Lead-in */}
          {section.subtitle && (
            <p className="mb-0 text-[18px] font-bold leading-[1.6] text-white lg:text-[18px] uppercase">
              {section.subtitle}
            </p>
          )}

          {/* Heading */}
          {section.heading && (
            <h2 className="mb-[32px] mt-[16px] text-[28px] font-bold leading-[1.3] text-white lg:text-[36px]">
              {section.heading}
            </h2>
          )}
        </div>

        {/* Cards Grid — 4 columns on desktop, single column on mobile */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[32px]">
          {section.cards.map((card) => (
            <GridCard key={card.sys.id} card={card} />
          ))}
        </div>

        {/* CTA */}
        {section.cta && (
          <div className="mt-8 flex justify-center lg:mt-10">
            <Cta cta={section.cta} />
          </div>
        )}
      </div>
    </section>
  );
}
