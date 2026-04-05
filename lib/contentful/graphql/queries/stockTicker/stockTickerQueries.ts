import { STOCK_TICKER_FRAGMENT } from "../../fragments/stockTicker/stockTickerFragment";

export const STOCK_TICKER_BY_ID = /* GraphQL */ `
  ${STOCK_TICKER_FRAGMENT}

  query StockTickerById($id: String!, $locale: String!, $preview: Boolean) {
    stockTicker(id: $id, locale: $locale, preview: $preview) {
      ...StockTickerFields
    }
  }
`;
