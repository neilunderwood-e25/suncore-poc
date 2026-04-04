import type { ReactNode } from "react";
import type { Section } from "./types";
import type { RenderMode } from "@/lib/contentful/settings";

/** Shape of a raw Contentful section before adaptation. */
export type RawSection = {
  __typename: string;
  sys: { id: string };
  [key: string]: unknown;
};

/** Options passed to each section's hydrate function. */
export type HydrateOptions = {
  locale: string;
  preview?: boolean;
  revalidate?: number | false;
  mode?: RenderMode;
};

/** Everything needed to fetch, adapt, and render a single section type. */
export type SectionDefinition = {
  /** Contentful __typename, e.g. "Heroes" */
  contentfulTypename: string;
  /** Internal type key, e.g. "heroes" */
  type: Section["type"];
  /** Fetch full section data by ID (called during hydration phase) */
  hydrate: (id: string, options: HydrateOptions) => Promise<RawSection | null>;
  /** Transform raw Contentful data into the typed internal section */
  adapt: (raw: RawSection) => Section;
  /** Render the section component */
  render: (section: Section) => ReactNode;
};
