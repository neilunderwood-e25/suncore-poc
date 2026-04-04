import type { ReactNode } from "react";
import type { Section } from "./types";

/** Shape of a raw Contentful section before adaptation. */
export type RawSection = {
  __typename: string;
  sys: { id: string };
  [key: string]: unknown;
};

/** Everything needed to adapt and render a single section type. */
export type SectionDefinition = {
  /** Contentful __typename, e.g. "Heroes" */
  contentfulTypename: string;
  /** Internal type key, e.g. "heroes" */
  type: Section["type"];
  /** Transform raw Contentful data into the typed internal section */
  adapt: (raw: RawSection) => Section;
  /** Render the section component */
  render: (section: Section) => ReactNode;
};
