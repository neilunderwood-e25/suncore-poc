import { GraphQLClient } from "graphql-request";

import { renderMode, DEFAULT_REVALIDATE_SECONDS } from "./settings";

type ClientOptions = {
  preview?: boolean;
  revalidate?: number | false;
  mode?: "ssr" | "isr" | "static";
};

const getEnv = () => {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;
  const graphqlHost = process.env.CONTENTFUL_GRAPHQL_HOST ?? "graphql.contentful.com";
  const previewGraphqlHost =
    process.env.CONTENTFUL_PREVIEW_GRAPHQL_HOST ?? "preview.contentful.com";

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
    previewToken: previewToken?.trim(),
    graphqlHost: graphqlHost.trim(),
    previewGraphqlHost: previewGraphqlHost.trim(),
  };
};

const createFetch = (
  revalidate: number | false,
  preview: boolean,
  mode: "ssr" | "isr" | "static"
) => {
  const normalizedRevalidate =
    mode === "isr" && typeof revalidate !== "number"
      ? DEFAULT_REVALIDATE_SECONDS
      : revalidate;

  if (preview || mode === "ssr") {
    return (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, {
        ...init,
        cache: "no-store",
      });
  }

  if (mode === "isr") {
    return (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, {
        ...init,
        next: { revalidate: normalizedRevalidate },
      });
  }

  return (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      cache: "force-cache",
    });
};

export const getContentfulClient = ({
  preview = false,
  revalidate = false,
  mode = renderMode,
}: ClientOptions = {}) => {
  const {
    spaceId,
    environment,
    deliveryToken,
    previewToken,
    graphqlHost,
    previewGraphqlHost,
  } = getEnv();

  const token = preview ? previewToken : deliveryToken;
  if (!token) {
    throw new Error(
      preview
        ? "Missing CONTENTFUL_PREVIEW_TOKEN"
        : "Missing CONTENTFUL_DELIVERY_TOKEN"
    );
  }

  const host = preview ? previewGraphqlHost : graphqlHost;
  const endpoint = `https://${host}/content/v1/spaces/${spaceId}/environments/${environment}`;

  return new GraphQLClient(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    fetch: createFetch(revalidate, preview, mode),
  });
};
