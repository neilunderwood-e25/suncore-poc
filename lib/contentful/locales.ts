import { renderMode, DEFAULT_REVALIDATE_SECONDS } from "./settings";

export type ContentfulLocale = {
  code: string;
  name?: string;
  default: boolean;
};

const getEnv = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || spaceId.trim() === "") {
    throw new Error("Missing or empty CONTENTFUL_SPACE_ID environment variable");
  }

  if (!deliveryToken || deliveryToken.trim() === "") {
    throw new Error("Missing or empty CONTENTFUL_DELIVERY_TOKEN environment variable");
  }

  return {
    spaceId: spaceId.trim(),
    environment: environment.trim(),
    deliveryToken: deliveryToken.trim(),
  };
};

const createFetchOptions = () => {
  if (renderMode === "ssr") {
    return { cache: "no-store" as const };
  }

  if (renderMode === "isr") {
    return { next: { revalidate: DEFAULT_REVALIDATE_SECONDS } } as const;
  }

  return { cache: "force-cache" as const };
};

export const getContentfulLocales = async (): Promise<ContentfulLocale[]> => {
  const { spaceId, environment, deliveryToken } = getEnv();
  const endpoint = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/locales`;

  try {
    const response = await fetch(endpoint, {
      ...createFetchOptions(),
      headers: {
        Authorization: `Bearer ${deliveryToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load locales: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as {
      items?: Array<{ code: string; name?: string; default?: boolean }>;
    };

    const locales =
      data.items?.map((locale) => ({
        code: locale.code,
        name: locale.name,
        default: Boolean(locale.default),
      })) ?? [];

    if (!locales.length) {
      console.warn("No locales found in Contentful, using fallback");
      return [{ code: "en", default: true }];
    }

    return locales;
  } catch (error) {
    console.error("Failed to load Contentful locales:", error);
    // Return fallback locale instead of throwing
    return [{ code: "en", default: true }];
  }
};
