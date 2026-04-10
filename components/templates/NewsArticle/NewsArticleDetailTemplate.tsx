import type { NewsArticleFull } from "@/lib/sections/types";
import { ArticleBody } from "./ArticleBody";
import { ArticleHero } from "./ArticleHero";
import { splitFirstParagraph } from "./splitArticleIntro";

type NewsArticleDetailTemplateProps = {
  article: NewsArticleFull;
};

export function NewsArticleDetailTemplate({
  article,
}: NewsArticleDetailTemplateProps) {
  const split = article.body ? splitFirstParagraph(article.body) : null;

  return (
    <article className="bg-white">
      <ArticleHero
        title={article.title}
        publishDate={article.publishDate}
        heroImage={article.heroImage}
        intro={split?.intro ?? null}
      />
      <ArticleBody body={split?.rest ?? null} />
    </article>
  );
}
