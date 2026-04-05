import { defineRouting } from "next-intl/routing";
import { URL_LOCALES, DEFAULT_URL_LOCALE } from "./locale";

export const routing = defineRouting({
  locales: URL_LOCALES,
  defaultLocale: DEFAULT_URL_LOCALE,
  localePrefix: "always",
  localeDetection: false,
});
