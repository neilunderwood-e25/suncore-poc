import type { ReactNode } from "react";
import type { Section } from "./types";

/** Shape of a raw Contentful section before adaptation. */
export type RawSection = {
  __typename: string;
  sys: { id: string };
  [key: string]: unknown;
};

/** Everything needed to fetch, adapt, and render a single section type. */
export type SectionDefinition = {
  /** Contentful __typename, e.g. "Heroes" */
  contentfulTypename: string;
  /** Internal type key, e.g. "heroes" */
  type: Section["type"];
  /** GraphQL fragment string (section-specific only, shared fragments are added automatically) */
  fragment: string;
  /** Fragment name used in the query spread, e.g. "HeroesFragment" */
  fragmentName: string;
  /** Transform raw Contentful data into the typed internal section */
  adapt: (raw: RawSection) => Section;
  /** Render the section component */
  render: (section: Section) => ReactNode;
};
