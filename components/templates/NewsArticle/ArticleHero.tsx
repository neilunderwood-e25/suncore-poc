import type { Document } from "@contentful/rich-text-types";
import type { ImageEntry, RichTextDocument } from "@/lib/sections/types";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { RichTextRenderer } from "@/components/common/RichText/RichText";

type ArticleHeroProps = {
  title?: string | null;
  publishDate?: string | null;
  heroImage?: ImageEntry | null;
  intro?: RichTextDocument | null;
};

function formatArticleDate(dateString: string): string {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

function ArticleHeroImage({ image, title }: { image: ImageEntry; title?: string | null }) {
  if (image.desktop?.url) {
    return (
      <ResponsiveImage
        image={image}
        className="h-auto w-full object-cover"
      />
    );
  }
  const url = image.mobile?.url;
  if (!url) return null;
  return (
    <img
      src={url}
      alt={image.altText ?? title ?? ""}
      width={image.mobile?.width ?? undefined}
      height={image.mobile?.height ?? undefined}
      className="h-auto w-full object-cover"
    />
  );
}

export function ArticleHero({
  title,
  publishDate,
  heroImage,
  intro,
}: ArticleHeroProps) {
  const hasImage = Boolean(
    heroImage?.desktop?.url ?? heroImage?.mobile?.url
  );

  return (
    <section className="relative bg-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[70%] bg-midnight"
        aria-hidden
      />

      <div className="relative z-10">
        <div className="article-container pt-12 pb-4 lg:pt-16">
          {publishDate && (
            <time
              dateTime={publishDate}
              className="block text-left text-xs font-semibold tracking-[0.12em] text-white"
            >
              {formatArticleDate(publishDate)}
            </time>
          )}
          {title && (
            <h1 className="mt-6 text-center text-[28px] font-bold leading-snug text-white sm:text-3xl lg:mt-8 lg:text-[40px] lg:leading-tight">
              {title}
            </h1>
          )}
        </div>

        {hasImage && heroImage && (
          <div className="article-container relative z-20 mt-8 lg:mt-10">
            <div className="overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)]">
              <ArticleHeroImage image={heroImage} title={title} />
            </div>
          </div>
        )}

        {intro != null && intro.json != null ? (
          <div className="relative z-10 bg-white pt-10 pb-2 lg:pt-12">
            <div className="article-container text-center">
              <RichTextRenderer
                document={intro.json as Document}
                links={intro.links}
                className="text-lg font-semibold leading-relaxed text-darkest-grey [&_p]:mb-0 [&_a]:text-dusty-blue [&_a]:underline-offset-2"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
