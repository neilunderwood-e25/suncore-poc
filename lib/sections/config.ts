import type { ReactNode } from "react";
import type { Section } from "./types";
import type { RenderMode } from "@/lib/contentful/settings";

/** Options passed to each section's hydrate function. */
export type HydrateOptions = {
  locale: string;
  preview?: boolean;
  revalidate?: number | false;
  mode?: RenderMode;
};

/** Everything needed to fetch and render a single section type. */
export type SectionDefinition = {
  /** Contentful __typename, e.g. "Heroes" */
  contentfulTypename: string;
  /** Internal type key, e.g. "heroes" */
  type: Section["type"];
  /** Fetch and return typed section data by ID */
  hydrate: (id: string, options: HydrateOptions) => Promise<Section | null>;
  /** Render the section component */
  render: (section: Section) => ReactNode;
};
