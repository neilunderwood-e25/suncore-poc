import type { SectionDefinition } from "@/lib/sections/config";
import type { StockTickerSection, StockItem, CtaEntry } from "@/lib/sections/types";
import { getContentfulClient } from "@/lib/contentful/client";
import { renderMode } from "@/lib/contentful/settings";
import { STOCK_TICKER_BY_ID } from "@/lib/contentful/graphql/queries/stockTicker/stockTickerQueries";
import { fetchStockQuotes } from "@/lib/stocks/twelveData";
import { StockTicker } from "@/components/sections/StockTicker";

type StockTickerResponse = {
  stockTicker?: {
    sys: { id: string };
    companyName?: string | null;
    stocksCollection?: {
      items?: Array<StockItem | null> | null;
    } | null;
    delayDisclaimer?: string | null;
    cta?: CtaEntry | null;
  } | null;
};

export const stockTickerSection: SectionDefinition = {
  contentfulTypename: "StockTicker",
  type: "stockTicker",

  hydrate: async (id, options) => {
    const client = getContentfulClient({
      preview: options.preview,
      revalidate: options.revalidate,
      mode: options.mode ?? renderMode,
    });

    try {
      const { data } = await client.rawRequest<StockTickerResponse>(
        STOCK_TICKER_BY_ID,
        {
          id,
          locale: options.locale,
          preview: options.preview ?? false,
        }
      );

      const ticker = data?.stockTicker;
      if (!ticker) return null;

      const stocks = (ticker.stocksCollection?.items ?? []).filter(
        (s): s is StockItem => s !== null
      );

      // Fetch live quotes from Twelve Data
      const symbols = stocks
        .map((s) => s.apiSymbol)
        .filter((s): s is string => !!s);

      const quotes = await fetchStockQuotes(symbols);

      // Build liveQuotes map keyed by apiSymbol
      const liveQuotes: Record<string, { price: number; change: number }> = {};
      for (const stock of stocks) {
        if (!stock.apiSymbol) continue;
        const quote = quotes.get(stock.apiSymbol);
        if (quote) {
          liveQuotes[stock.apiSymbol] = {
            price: quote.price,
            change: quote.change,
          };
        }
      }

      return {
        id: ticker.sys.id,
        type: "stockTicker",
        companyName: ticker.companyName ?? null,
        stocks,
        delayDisclaimer: ticker.delayDisclaimer ?? null,
        cta: ticker.cta ?? null,
        liveQuotes,
      } satisfies StockTickerSection;
    } catch (error) {
      console.error(`Failed to hydrate StockTicker (${id}):`, error);
      return null;
    }
  },

  render: (section) => <StockTicker section={section as StockTickerSection} />,
};
