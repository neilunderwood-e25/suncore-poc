import type { Section } from "@/lib/sections/types";

export type SectionAdapter<T> = (input: T[]) => Section[];
