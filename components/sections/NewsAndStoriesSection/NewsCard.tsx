import Link from "next/link";
import { useLocale } from "next-intl";
import type { NewsArticleCard } from "@/lib/sections/types";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

type NewsCardProps = {
  article: NewsArticleCard;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NewsCard({ article }: NewsCardProps) {
  const locale = useLocale();
  const href = `/${locale}/news-and-stories/${article.slug}`;

  return (
    <Link href={href} className="group block overflow-hidden rounded-lg">
      {/* Thumbnail */}
      {article.thumbnail && (
        <div className="aspect-[16/9] overflow-hidden">
          <ResponsiveImage
            image={article.thumbnail}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="pt-4">
        {/* Date */}
        {article.publishDate && (
          <time
            dateTime={article.publishDate}
            className="text-xs font-semibold uppercase tracking-wider text-gray-500"
          >
            {formatDate(article.publishDate)}
          </time>
        )}

        {/* Title */}
        {article.title && (
          <h3 className="mt-2 text-lg font-bold leading-snug text-darkest-grey group-hover:underline">
            {article.title}
          </h3>
        )}

        {/* Summary */}
        {article.summary && (
          <p className="mt-2 line-clamp-3 text-sm text-dark-grey-70">
            {article.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
