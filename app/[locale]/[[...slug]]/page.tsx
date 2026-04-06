import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import {
  HOME_SLUG,
  getAllFlexiblePageSlugs,
} from "@/lib/contentful/pages";
import { DEFAULT_REVALIDATE_SECONDS, renderMode } from "@/lib/contentful/settings";
import {
  toContentfulLocale,
  buildPathForLocale,
  URL_LOCALES,
  DEFAULT_URL_LOCALE,
} from "@/lib/i18n/locale";
import { resolveTemplate, TemplateType } from "@/lib/routing/routingResolver";
import {
  TEMPLATE_RENDERERS,
  TEMPLATE_METADATA_FETCHERS,
  type TemplateContext,
} from "@/lib/templates/templateRenderers";
import { getAllNewsArticleSlugs } from "@/lib/contentful/domain/newsArticle/newsArticle.service";
import { RoutePrefix } from "@/lib/routing/routingResolver";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-dynamic";

type FlexiblePageParams = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export const generateStaticParams = async () => {
  if (renderMode === "ssr") {
    return [];
  }

  try {
    const entries = await Promise.all(
      URL_LOCALES.map(async (urlLocale) => {
        const contentfulLocale = toContentfulLocale(urlLocale);
        const params: Array<{ locale: string; slug: string[] }> = [];

        try {
          // FlexiblePage slugs
          const slugs = await getAllFlexiblePageSlugs(contentfulLocale, {
            preview: false,
            revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
            mode: renderMode,
          });

          for (const slug of slugs) {
            const normalized = slug.replace(/^\/+|\/+$/g, "");
            const slugSegments =
              normalized === HOME_SLUG ? [] : normalized.split("/");
            params.push({ locale: urlLocale, slug: slugSegments });
          }

          // NewsArticle slugs
          const articleSlugs = await getAllNewsArticleSlugs(contentfulLocale, {
            preview: false,
            revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
            mode: renderMode,
          });

          for (const articleSlug of articleSlugs) {
            params.push({
              locale: urlLocale,
              slug: [RoutePrefix.NEWS_AND_STORIES, articleSlug],
            });
          }
        } catch (error) {
          console.error(
            `Failed to generate static params for locale "${urlLocale}":`,
            error
          );
        }

        return params;
      })
    );

    const flattened = entries.flat();
    return flattened.length > 0
      ? flattened
      : [{ locale: DEFAULT_URL_LOCALE, slug: [] }];
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [{ locale: DEFAULT_URL_LOCALE, slug: [] }];
  }
};

export const generateMetadata = async ({ params }: FlexiblePageParams) => {
  try {
    const { locale: urlLocale, slug } = await params;
    const contentfulLocale = toContentfulLocale(urlLocale);
    const slugSegments = slug ?? [];
    const match = resolveTemplate(slugSegments);

    const ctx: TemplateContext = {
      locale: contentfulLocale,
      preview: false,
      revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
      mode: renderMode,
    };

    // Try template-specific metadata first
    const metadataFetcher = TEMPLATE_METADATA_FETCHERS[match.type];
    if (metadataFetcher) {
      const meta = await metadataFetcher(match, ctx);
      if (meta) {
        const canonicalPath = buildPathForLocale(urlLocale, slugSegments);
        return {
          title: meta.title,
          description: meta.description ?? undefined,
          alternates: {
            canonical: new URL(canonicalPath, siteUrl).toString(),
          },
        };
      }
    }

    // Fallback: use slug as title
    const resolvedSlug = slugSegments.length
      ? slugSegments.join("/")
      : HOME_SLUG;
    const canonicalPath = buildPathForLocale(urlLocale, slugSegments);

    return {
      title: resolvedSlug,
      alternates: {
        canonical: new URL(canonicalPath, siteUrl).toString(),
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return { title: "Page" };
  }
};

export default async function FlexiblePage({ params }: FlexiblePageParams) {
  const { locale: urlLocale, slug } = await params;
  const contentfulLocale = toContentfulLocale(urlLocale);
  const contentfulDefault = toContentfulLocale(DEFAULT_URL_LOCALE);
  const slugSegments = slug ?? [];

  const preview =
    renderMode === "static" ? false : (await draftMode()).isEnabled;

  const match = resolveTemplate(slugSegments);

  const ctx: TemplateContext = {
    locale: contentfulLocale,
    preview,
    revalidate:
      renderMode === "isr" && !preview ? DEFAULT_REVALIDATE_SECONDS : false,
    mode: renderMode,
  };

  // Render using the matched template
  let content = await TEMPLATE_RENDERERS[match.type](match, ctx);

  // For FLEXIBLE pages, try the default locale as fallback
  if (!content && match.type === TemplateType.FLEXIBLE && contentfulLocale !== contentfulDefault) {
    content = await TEMPLATE_RENDERERS[match.type](match, {
      ...ctx,
      locale: contentfulDefault,
    });
  }

  if (!content) {
    notFound();
  }

  return (
    <>
      {/* Header placeholder */}
      <header>
        <img src="/header.png" alt="" className="w-full" />
      </header>

      <main>{content}</main>

      {/* Footer placeholder */}
      <footer>
        <img src="/footer.png" alt="" className="w-full" />
      </footer>
    </>
  );
}
