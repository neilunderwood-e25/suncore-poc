import type { ImageEntry } from "@/lib/sections/types";

type ArticleHeroProps = {
  title?: string | null;
  publishDate?: string | null;
  heroImage?: ImageEntry | null;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleHero({ title, publishDate, heroImage }: ArticleHeroProps) {
  const imageUrl = heroImage?.desktop?.url ?? heroImage?.mobile?.url;

  return (
    <div className="relative">
      {/* Hero image with dark overlay */}
      {imageUrl && (
        <div className="relative h-[400px] w-full md:h-[500px]">
          <img
            src={imageUrl}
            alt={heroImage?.altText ?? title ?? ""}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Date + Title overlay */}
      <div
        className={
          imageUrl
            ? "absolute inset-0 flex flex-col justify-end px-6 pb-12 md:px-16"
            : "px-6 py-12 md:px-16"
        }
      >
        <div className="mx-auto w-full max-w-3xl">
          {publishDate && (
            <time
              dateTime={publishDate}
              className={`text-xs font-semibold uppercase tracking-wider ${
                imageUrl ? "text-white/80" : "text-gray-500"
              }`}
            >
              {formatDate(publishDate)}
            </time>
          )}
          {title && (
            <h1
              className={`mt-3 text-3xl font-bold leading-tight md:text-4xl ${
                imageUrl ? "text-white" : "text-darkest-grey"
              }`}
            >
              {title}
            </h1>
          )}
        </div>
      </div>
    </div>
  );
}
