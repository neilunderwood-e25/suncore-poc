import { HOME_SLUG } from "@/lib/contentful/pages";

/* ------------------------------------------------------------------ */
/*  Enums                                                              */
/* ------------------------------------------------------------------ */

export enum RoutePrefix {
  NEWS_AND_STORIES = "news-and-stories",
}

export enum TemplateType {
  FLEXIBLE = "flexible",
  NEWS_ARTICLE_DETAIL = "newsArticleDetail",
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TemplateMatch = {
  type: TemplateType;
  slug: string;
};

/* ------------------------------------------------------------------ */
/*  Resolvers                                                          */
/* ------------------------------------------------------------------ */

type TemplateResolver = {
  prefix: RoutePrefix;
  resolve: (segments: string[]) => TemplateMatch;
};

const TEMPLATE_RESOLVERS: TemplateResolver[] = [
  {
    prefix: RoutePrefix.NEWS_AND_STORIES,
    resolve: (segments) => {
      const [, second] = segments;
      // /news-and-stories → flexible page (listing page)
      if (!second) {
        return { type: TemplateType.FLEXIBLE, slug: "news-and-stories" };
      }
      // /news-and-stories/news-releases → flexible page with sections
      if (second === "news-releases") {
        return { type: TemplateType.FLEXIBLE, slug: segments.join("/") };
      }
      // /news-and-stories/article-slug → article detail template
      return { type: TemplateType.NEWS_ARTICLE_DETAIL, slug: second };
    },
  },
];

/**
 * Maps URL slug segments to a TemplateMatch.
 *
 * If the first segment matches a known RoutePrefix the corresponding
 * resolver decides the template type; otherwise the default FlexiblePage
 * template is used.
 */
export const resolveTemplate = (slugSegments: string[]): TemplateMatch => {
  const [first] = slugSegments;
  const handler = TEMPLATE_RESOLVERS.find((r) => r.prefix === first);

  if (!handler) {
    return {
      type: TemplateType.FLEXIBLE,
      slug: slugSegments.length ? slugSegments.join("/") : HOME_SLUG,
    };
  }

  return handler.resolve(slugSegments);
};
