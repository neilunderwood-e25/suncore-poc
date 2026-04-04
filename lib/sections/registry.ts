import type { ReactNode } from "react";
import type { Section, SectionType } from "./types";

export type SectionComponent = (props: { section: Section }) => ReactNode;

export type SectionRegistry = Partial<Record<SectionType, SectionComponent>>;

export const createSectionRegistry = (registry: SectionRegistry) => registry;
