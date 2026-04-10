import Link from "next/link";
import { useLocale } from "next-intl";
import type { NewsArticleCard } from "@/lib/sections/types";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

const CATEGORY_FR: Record<string, string> = {
  Community: "Collectivité",
  People: "Nos gens",
  Investment: "Investissements",
  Operations: "Exploitation",
};

type NewsCardProps = {
  article: NewsArticleCard;
};

export function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale();
  const categoryLabel =
    article.category && locale === "fr"
      ? CATEGORY_FR[article.category] ?? article.category
      : article.category;
  const href = article.slug
    ? `/${locale}/news-and-stories/${article.slug}`
    : undefined;

  const inner = (
    <div className="relative h-[416px] w-full overflow-hidden rounded-xl">
      <div className="absolute inset-0">
        {article.thumbnail ? (
          <ResponsiveImage
            image={article.thumbnail}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800" aria-hidden />
        )}
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
        aria-hidden
      />
      <div className="relative flex h-full min-h-0 flex-col justify-end px-6 pb-8 pt-12">
        {categoryLabel && (
          <p className="text-sm font-semibold uppercase tracking-wider text-white">
            {categoryLabel}
          </p>
        )}
        {article.title && (
          <h3
            className={`block cursor-pointer text-[22px] font-bold text-white [text-wrap:balance] ${
              categoryLabel ? "mt-4" : ""
            }`}
            style={{
              fontFamily: 'var(--font-noto-sans), "Noto Sans", Arial, sans-serif',
            }}
          >
            {article.title}
          </h3>
        )}
      </div>
    </div>
  );

  const className =
    "group block w-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
