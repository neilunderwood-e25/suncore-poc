import { CTA_FRAGMENT } from "../cta/ctaFragment";

export const STOCK_TICKER_FRAGMENT = /* GraphQL */ `
  fragment StockTickerFields on StockTicker {
    sys { id }
    internalName
    companyName
    stocksCollection(limit: 10) {
      items {
        sys { id }
        exchange
        apiSymbol
        manualPrice
        manualChange
      }
    }
    delayDisclaimer
    cta {
      ...CtaFields
    }
  }
  ${CTA_FRAGMENT}
`;
