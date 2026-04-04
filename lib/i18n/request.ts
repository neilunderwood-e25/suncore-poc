import { getRequestConfig } from "next-intl/server";

import { loadRouting } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const routing = await loadRouting();
  const locale = (await requestLocale) ?? routing.defaultLocale;

  return {
    locale,
    messages: {},
  };
});
