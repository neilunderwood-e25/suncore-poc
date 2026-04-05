import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { LanguageDropdown } from "@/components/LanguageDropdown";
import { SectionsRenderer } from "@/components/sections/SectionsRenderer";
import { getContentfulLocales } from "@/lib/contentful/locales";
import {
  HOME_SLUG,
  getAllFlexiblePageSlugs,
  getFlexiblePageBySlug,
  normalizeSlugForPath,
} from "@/lib/contentful/pages";
import { DEFAULT_REVALIDATE_SECONDS, renderMode } from "@/lib/contentful/settings";
import { buildPathForLocale } from "@/lib/i18n/locale";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

type FlexiblePageParams = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export const generateStaticParams = async () => {
  if (renderMode === "ssr") {
    return [];
  }

  try {
    const cmsLocales = await getContentfulLocales();
    const defaultLocale = cmsLocales.find((item) => item.default)?.code ?? "en";
    const localeCodes = cmsLocales.length
      ? cmsLocales.map((item) => item.code)
      : [defaultLocale];

    const entries = await Promise.all(
      localeCodes.map(async (locale) => {
        try {
          const slugs = await getAllFlexiblePageSlugs(locale, {
            preview: false,
            revalidate: renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
            mode: renderMode,
          });

          return slugs.map((slug) => {
            const normalized = normalizeSlugForPath(slug);
            const slugSegments =
              normalized === HOME_SLUG ? [] : normalized.split("/");
            return { locale, slug: slugSegments };
          });
        } catch (error) {
          console.error(`Failed to generate static params for locale "${locale}":`, error);
          return [];
        }
      })
    );

    const flattened = entries.flat();
    return flattened.length > 0 ? flattened : [{ locale: defaultLocale, slug: [] }];
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [{ locale: "en", slug: [] }];
  }
};

// Revalidate for ISR mode
export const revalidate = renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false;

export const generateMetadata = async ({ params }: FlexiblePageParams) => {
  try {
    const { locale: paramLocale, slug } = await params;
    const cmsLocales = await getContentfulLocales();
    const defaultLocale = cmsLocales.find((item) => item.default)?.code ?? "en";
    const locale = paramLocale ?? (await getLocale());
    const slugSegments = slug ?? [];
    const resolvedSlug = slugSegments.length ? slugSegments.join("/") : HOME_SLUG;

    let page = await getFlexiblePageBySlug(resolvedSlug, {
      locale,
      preview: false,
      revalidate:
        renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
      mode: renderMode,
    });
    if (!page && locale !== defaultLocale) {
      page = await getFlexiblePageBySlug(resolvedSlug, {
        locale: defaultLocale,
        preview: false,
        revalidate:
          renderMode === "isr" ? DEFAULT_REVALIDATE_SECONDS : false,
        mode: renderMode,
      });
    }

    const title = page?.pageTitle ?? resolvedSlug;
    const canonicalPath = buildPathForLocale(
      locale,
      slugSegments,
      defaultLocale
    );

    return {
      title,
      alternates: {
        canonical: new URL(canonicalPath, siteUrl).toString(),
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Page",
    };
  }
};

export default async function FlexiblePage({ params }: FlexiblePageParams) {
  const { locale: paramLocale, slug } = await params;
  const cmsLocales = await getContentfulLocales();
  const defaultLocale = cmsLocales.find((item) => item.default)?.code ?? "en";
  const locale = paramLocale ?? (await getLocale());
  const slugSegments = slug ?? [];

  const preview =
    renderMode === "static" ? false : (await draftMode()).isEnabled;
  const resolvedSlug = slugSegments.length
    ? slugSegments.join("/")
    : HOME_SLUG;

  let page = await getFlexiblePageBySlug(resolvedSlug, {
    locale,
    preview,
    revalidate:
      renderMode === "isr" && !preview ? DEFAULT_REVALIDATE_SECONDS : false,
    mode: renderMode,
  });
  if (!page && locale !== defaultLocale) {
    page = await getFlexiblePageBySlug(resolvedSlug, {
      locale: defaultLocale,
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
