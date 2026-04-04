import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { loadRouting } from "./lib/i18n/routing";

export default async function proxy(request: NextRequest) {
  const routing = await loadRouting();
  const handleI18nRouting = createMiddleware(routing);

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

