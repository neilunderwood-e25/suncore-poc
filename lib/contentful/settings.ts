export type RenderMode = "ssr" | "isr" | "static";

const normalizeRenderMode = (value: string | undefined): RenderMode => {
  const normalized = value?.toLowerCase() ?? "ssr";
  if (normalized === "isr" || normalized === "static") {
    return normalized;
  }
  return "ssr";
};

export const renderMode = normalizeRenderMode(
  process.env.CONTENTFUL_RENDER_MODE
);

export const DEFAULT_REVALIDATE_SECONDS = Number(
  process.env.CONTENTFUL_REVALIDATE_SECONDS ?? 60
);

export const DEFAULT_CONTENTFUL_LOCALE =
  process.env.CONTENTFUL_DEFAULT_LOCALE ?? "en-US";
