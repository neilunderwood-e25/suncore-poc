import type { StockTickerSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";

type StockTickerProps = {
  section: StockTickerSection;
};

export function StockTicker({ section }: StockTickerProps) {
  return (
    <section className="flex h-[9.25rem] items-center border-b border-light-grey bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-8 px-6 lg:px-8">
        {/* Company name */}
        {section.companyName && (
          <span className="shrink-0 text-base font-bold text-darkest-grey">
            {section.companyName}
          </span>
        )}

        {/* Stock items */}
        <div className="flex flex-1 items-center gap-8 overflow-x-auto">
          {section.stocks.map((stock) => {
            const quote = stock.apiSymbol
              ? section.liveQuotes?.[stock.apiSymbol]
              : null;

            const price = quote?.price ?? stock.manualPrice;
            const change = quote?.change ?? stock.manualChange;
            const isPositive = (change ?? 0) >= 0;

            return (
              <div key={stock.sys.id} className="flex shrink-0 items-center gap-3">
                {/* Exchange label */}
                <span className="text-xs font-semibold uppercase tracking-wider text-dark-grey-70">
                  {stock.exchange}
                </span>

                {/* Price */}
                {price != null && (
                  <span className="text-3xl font-bold text-darkest-grey">
                    ${price.toFixed(3)}
                  </span>
                )}

                {/* Change */}
                {change != null && (
                  <span
                    className={`flex items-center gap-0.5 text-sm font-semibold ${
                      isPositive ? "text-clover" : "text-red"
                    }`}
                  >
                    {/* Arrow */}
                    <svg
                      className={`h-3 w-3 ${isPositive ? "" : "rotate-180"}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4l-8 8h5v8h6v-8h5z" />
                    </svg>
                    {isPositive ? "+" : ""}
                    {change.toFixed(3)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Delay disclaimer */}
        {section.delayDisclaimer && (
          <span className="shrink-0 text-sm text-dark-grey-70">
            {section.delayDisclaimer}
          </span>
        )}

        {/* CTA */}
        {section.cta && (
          <div className="shrink-0">
            <Cta
              cta={section.cta}
              className="!border-darkest-grey !text-darkest-grey hover:!bg-darkest-grey hover:!text-white"
            />
          </div>
        )}
      </div>
    </section>
  );
}
