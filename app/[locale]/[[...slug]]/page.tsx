import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { SectionsRenderer } from "@/lib/sections/SectionsRenderer";
import {
  HOME_SLUG,
  getAllFlexiblePageSlugs,
  getFlexiblePageBySlug,
  normalizeSlugForPath,
} from "@/lib/contentful/pages";
import { DEFAULT_REVALIDATE_SECONDS, renderMode } from "@/lib/contentful/settings";
import {
  toContentfulLocale,
  toUrlLocale,
  buildPathForLocale,
  URL_LOCALES,
  DEFAULT_URL_LOCALE,
} from "@/lib/i18n/locale";
import { getContentfulLocales } from "@/lib/contentful/locales";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
        try {
          const slugs = await getAllFlexiblePageSlugs(contentfulLocale, {
            preview: false,
            revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
            mode: renderMode,
          });

          return slugs.map((slug) => {
            const normalized = normalizeSlugForPath(slug);
            const slugSegments =
              normalized === HOME_SLUG ? [] : normalized.split("/");
            return { locale: urlLocale, slug: slugSegments };
          });
        } catch (error) {
          console.error(`Failed to generate static params for locale "${urlLocale}":`, error);
          return [];
        }
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

export const revalidate = renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false;

export const generateMetadata = async ({ params }: FlexiblePageParams) => {
  try {
    const { locale: urlLocale, slug } = await params;
    const contentfulLocale = toContentfulLocale(urlLocale);
    const contentfulDefault = toContentfulLocale(DEFAULT_URL_LOCALE);
    const slugSegments = slug ?? [];
    const resolvedSlug = slugSegments.length ? slugSegments.join("/") : HOME_SLUG;

    let page = await getFlexiblePageBySlug(resolvedSlug, {
      locale: contentfulLocale,
      preview: false,
      revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
      mode: renderMode,
    });
    if (!page && contentfulLocale !== contentfulDefault) {
      page = await getFlexiblePageBySlug(resolvedSlug, {
        locale: contentfulDefault,
        preview: false,
        revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
        mode: renderMode,
      });
    }

    const title = page?.pageTitle ?? resolvedSlug;
    const canonicalPath = buildPathForLocale(urlLocale, slugSegments);

    return {
      title,
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
  const resolvedSlug = slugSegments.length
    ? slugSegments.join("/")
    : HOME_SLUG;

  let page = await getFlexiblePageBySlug(resolvedSlug, {
    locale: contentfulLocale,
    preview,
    revalidate:
      renderMode === "isr" && !preview ? DEFAULT_REVALIDATE_SECONDS : false,
    mode: renderMode,
  });
  if (!page && contentfulLocale !== contentfulDefault) {
    page = await getFlexiblePageBySlug(resolvedSlug, {
      locale: contentfulDefault,
      preview,
      revalidate:
        renderMode === "isr" && !preview ? DEFAULT_REVALIDATE_SECONDS : false,
      mode: renderMode,
    });
  }

  if (!page) {
    notFound();
  }

  return (
    <main>
      <SectionsRenderer sections={page.sections} />
    </main>
  );
}
