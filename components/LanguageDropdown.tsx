"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";

import { buildPathForLocale } from "@/lib/i18n/locale";

type LanguageDropdownProps = {
  locales: Array<{ code: string; name?: string }>;
  defaultLocale: string;
  currentLocale: string;
  slugSegments: string[];
};

export const LanguageDropdown = ({
  locales,
  defaultLocale,
  currentLocale,
  slugSegments,
}: LanguageDropdownProps) => {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    const nextPath = buildPathForLocale(
      nextLocale,
      slugSegments,
      defaultLocale
    );
    startTransition(() => {
      router.push(nextPath);
    });
  };

  if (!locales.length) {
    return null;
  }

  return (
    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
      Language
      <select
        className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700"
        value={currentLocale}
        onChange={handleChange}
      >
        {locales.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name ?? item.code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
};
