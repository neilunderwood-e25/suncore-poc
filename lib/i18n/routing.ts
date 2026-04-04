type LocaleResponse = {
  items?: Array<{ code: string; default?: boolean }>;
};

type RoutingConfig = {
  locales: string[];
  defaultLocale: string;
  localePrefix?: "always" | "as-needed" | "never";
  localeDetection?: boolean;
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

export const loadRouting = async (): Promise<RoutingConfig> => {
  const { spaceId, environment, deliveryToken } = getEnv();
  const endpoint = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/locales`;

  try {
    const response = await fetch(endpoint, {
      // Use revalidation for ISR/static, no-store for SSR
      cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store",
      next: process.env.NODE_ENV === "production" ? { revalidate: 3600 } : undefined,
      headers: {
        Authorization: `Bearer ${deliveryToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load locales: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as LocaleResponse;
    const locales = data.items?.map((item) => item.code).filter(Boolean) ?? ["en"];
    const defaultLocale =
      data.items?.find((item) => item.default)?.code ?? locales[0] ?? "en";

    if (!locales.length) {
      throw new Error("No locales found in Contentful");
    }

    return {
      locales,
      defaultLocale,
      localePrefix: "as-needed",
      localeDetection: false,
    };
  } catch (error) {
    console.error("Failed to load routing configuration:", error);
    // Fallback to default locale
    return {
      locales: ["en"],
      defaultLocale: "en",
      localePrefix: "as-needed",
      localeDetection: false,
    };
  }
};
