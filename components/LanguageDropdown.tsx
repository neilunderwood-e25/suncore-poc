"use client";

import { useRouter, usePathname } from "next/navigation";
import { startTransition } from "react";
import {
  getLocaleConfigs,
  buildPathForLocale,
  type LocaleConfig,
} from "@/lib/i18n/locale";

type LanguageDropdownProps = {
  currentLocale: string;
  slugSegments: string[];
};

export const LanguageDropdown = ({
  currentLocale,
  slugSegments,
}: LanguageDropdownProps) => {
  const router = useRouter();
  const configs = getLocaleConfigs();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    const nextPath = buildPathForLocale(nextLocale, slugSegments);
    startTransition(() => {
      router.push(nextPath);
    });
  };

  return (
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
      Language
      <select
        className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700"
        value={currentLocale}
        onChange={handleChange}
      >
        {configs.map((config) => (
          <option key={config.urlSlug} value={config.urlSlug}>
            {config.displayName}
          </option>
        ))}
      </select>
    </label>
  );
};
