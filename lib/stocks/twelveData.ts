export type StockQuote = {
  symbol: string;
  price: number;
  change: number;
};

type TwelveDataQuoteResponse = {
  symbol?: string;
  close?: string;
  change?: string;
  is_market_open?: boolean;
};

type TwelveDataBatchResponse = {
  [symbol: string]: TwelveDataQuoteResponse;
};

const API_KEY = process.env.TWELVE_DATA_API_KEY;
const BASE_URL = "https://api.twelvedata.com";

/**
 * Fetch live quotes for multiple symbols from Twelve Data API.
 * Returns a map of apiSymbol → StockQuote.
 * Falls back gracefully on errors (returns empty map).
 */
export async function fetchStockQuotes(
  symbols: string[]
): Promise<Map<string, StockQuote>> {
  const map = new Map<string, StockQuote>();

  if (!API_KEY || symbols.length === 0) return map;

  try {
    const joined = symbols.join(",");
    const res = await fetch(
      `${BASE_URL}/quote?symbol=${encodeURIComponent(joined)}&apikey=${API_KEY}`,
      { next: { revalidate: 300 } } // cache for 5 minutes
    );

    if (!res.ok) {
      console.error(`Twelve Data API error: ${res.status}`);
      return map;
    }

    const data = await res.json();

    // Single symbol returns an object, multiple returns keyed object
    if (symbols.length === 1) {
      const quote = data as TwelveDataQuoteResponse;
      if (quote.symbol && quote.close) {
        map.set(symbols[0], {
          symbol: quote.symbol,
          price: parseFloat(quote.close),
          change: parseFloat(quote.change ?? "0"),
        });
      }
    } else {
      const batch = data as TwelveDataBatchResponse;
      for (const symbol of symbols) {
        const quote = batch[symbol];
        if (quote?.close) {
          map.set(symbol, {
            symbol: quote.symbol ?? symbol,
            price: parseFloat(quote.close),
            change: parseFloat(quote.change ?? "0"),
          });
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch stock quotes:", error);
  }

  return map;
}
