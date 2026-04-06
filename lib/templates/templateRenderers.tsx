import type { ReactNode } from "react";

import { TemplateType, type TemplateMatch } from "@/lib/routing/routingResolver";
import type { RenderMode } from "@/lib/contentful/settings";
import { getFlexiblePageBySlug } from "@/lib/contentful/pages";
import { getNewsArticleBySlug } from "@/lib/contentful/domain/newsArticle/newsArticle.service";
import { SectionsRenderer } from "@/lib/sections/SectionsRenderer";
import { NewsArticleDetailTemplate } from "@/components/templates/NewsArticle/NewsArticleDetailTemplate";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type TemplateContext = {
  locale: string;
  preview: boolean;
  revalidate: number | false;
  mode: RenderMode;
};

type TemplateRenderer = (
  match: TemplateMatch,
  ctx: TemplateContext
) => Promise<ReactNode | null>;

/* ------------------------------------------------------------------ */
/*  Metadata fetchers                                                  */
/* ------------------------------------------------------------------ */

export type TemplateMetadata = {
  title: string;
  description?: string | null;
};

type MetadataFetcher = (
  match: TemplateMatch,
  ctx: TemplateContext
) => Promise<TemplateMetadata | null>;

export const TEMPLATE_METADATA_FETCHERS: Partial<
  Record<TemplateType, MetadataFetcher>
> = {
  [TemplateType.NEWS_ARTICLE_DETAIL]: async (match, ctx) => {
    const article = await getNewsArticleBySlug(match.slug, {
      locale: ctx.locale,
      preview: ctx.preview,
      revalidate: ctx.revalidate,
      mode: ctx.mode,
    });
    if (!article) return null;
    return {
      title: article.title ?? match.slug,
      description: article.seoMetaDescription ?? article.summary,
    };
  },
};

/* ------------------------------------------------------------------ */
/*  Renderers                                                          */
/* ------------------------------------------------------------------ */

export const TEMPLATE_RENDERERS: Record<TemplateType, TemplateRenderer> = {
  [TemplateType.FLEXIBLE]: async (match, ctx) => {
    const page = await getFlexiblePageBySlug(match.slug, {
      locale: ctx.locale,
      preview: ctx.preview,
      revalidate: ctx.revalidate,
      mode: ctx.mode,
    });
    if (!page) return null;
    return <SectionsRenderer sections={page.sections} />;
  },

  [TemplateType.NEWS_ARTICLE_DETAIL]: async (match, ctx) => {
    const article = await getNewsArticleBySlug(match.slug, {
      locale: ctx.locale,
      preview: ctx.preview,
      revalidate: ctx.revalidate,
      mode: ctx.mode,
    });
    if (!article) return null;
    return <NewsArticleDetailTemplate article={article} />;
  },
};
