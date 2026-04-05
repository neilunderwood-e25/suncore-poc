"use client";

import { useState, useCallback, useRef } from "react";
import type { Document } from "@contentful/rich-text-types";
import type { CardsSection, CardEntry } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { RichTextRenderer } from "@/components/common/RichText/RichText";

/* ------------------------------------------------------------------ */
/*  Fact Card                                                          */
/* ------------------------------------------------------------------ */

function FactCard({ card }: { card: CardEntry }) {
  const href =
    card.externalLink ??
    (card.internalLink?.slug ? `/${card.internalLink.slug}` : null);

  const isClickable = !!href;

  const content = (
    <>
      {card.category && (
        <span className="text-[13px] font-semibold uppercase tracking-wider text-darkest-grey">
          {card.category}
        </span>
      )}

      {card.icon && (
        <div className="mt-5">
          <ResponsiveImage image={card.icon} className="h-10 w-10 object-contain" />
        </div>
      )}

      {card.stat && (
        <span className={`mt-5 text-[28px] font-bold leading-tight text-darkest-grey transition-colors lg:text-[32px] ${
          isClickable ? "group-hover:text-dusk-95" : ""
        }`}>
          {card.stat}
        </span>
      )}

      {card.description && (
        <RichTextRenderer
          document={card.description.json as Document}
          links={card.description.links}
          className="mt-3 text-[15px] leading-relaxed text-dark-grey-70"
        />
      )}
    </>
  );

  if (isClickable) {
    return (
      <a
        href={href!}
        className="clickable-card group flex h-full flex-col rounded-lg bg-white p-6 transition-shadow hover:shadow-lg lg:p-8"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-white p-6 lg:p-8">
      {content}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Carousel                                                    */
/* ------------------------------------------------------------------ */

function MobileCarousel({ cards }: { cards: CardEntry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / (clientWidth * 0.75));
    setActiveIndex(Math.min(index, cards.length - 1));
  }, [cards.length]);

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", paddingLeft: 24, scrollPaddingLeft: 24 }}
      >
        {cards.map((card) => (
          <div key={card.sys.id} className="w-[75vw] shrink-0 snap-start">
            <FactCard card={card} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {cards.map((card, i) => (
          <button
            key={card.sys.id}
            type="button"
            onClick={() => {
              setActiveIndex(i);
              scrollRef.current?.scrollTo({
                left: i * scrollRef.current.clientWidth * 0.75,
                behavior: "smooth",
              });
            }}
            className={`h-3 w-3 rounded-full border-none transition-colors ${
              i === activeIndex ? "bg-white" : "bg-white/40"
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Did You Know Section                                               */
/* ------------------------------------------------------------------ */

export function CardGridSlider({ section }: { section: CardsSection }) {
  return (
    <section className="bg-midnight py-12 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-16">
        {section.heading && (
          <h2 className="mb-8 text-[28px] font-bold text-white lg:mb-10 lg:text-[36px]">
            {section.heading}
          </h2>
        )}
      </div>

      {/* Desktop: 4-column grid */}
      <div className="mx-auto hidden max-w-[1440px] px-6 lg:grid lg:grid-cols-4 lg:gap-6 lg:px-16">
        {section.cards.map((card) => (
          <FactCard key={card.sys.id} card={card} />
        ))}
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="lg:hidden">
        <MobileCarousel cards={section.cards} />
      </div>

      {/* CTA */}
      {section.cta && (
        <div className="mt-10 flex justify-center lg:mt-12">
          <Cta cta={section.cta} />
        </div>
      )}
    </section>
  );
}
