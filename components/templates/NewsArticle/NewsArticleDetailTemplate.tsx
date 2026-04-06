import type { NewsArticleFull } from "@/lib/sections/types";
import { ArticleHero } from "./ArticleHero";
import { ArticleBody } from "./ArticleBody";

type NewsArticleDetailTemplateProps = {
  article: NewsArticleFull;
};

export function NewsArticleDetailTemplate({
  article,
}: NewsArticleDetailTemplateProps) {
  return (
    <article>
      <ArticleHero
        title={article.title}
        publishDate={article.publishDate}
        heroImage={article.heroImage}
      />
      <ArticleBody body={article.body} />
    </article>
  );
}
