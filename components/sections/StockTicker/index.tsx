import type { StockTickerSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";

type StockTickerProps = {
  section: StockTickerSection;
};

function ChangeIndicator({ change }: { change: number }) {
  const isPositive = change >= 0;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-sm font-semibold leading-none ${
        isPositive ? "text-clover" : "text-red"
      }`}
    >
      {/* Triangle arrow */}
      <svg
        className={`h-2.5 w-2.5 ${isPositive ? "" : "rotate-180"}`}
        fill="currentColor"
        viewBox="0 0 10 10"
      >
        <path d="M5 0l5 10H0z" />
      </svg>
      {isPositive ? "+" : ""}
      {change.toFixed(3)}
    </span>
  );
}

export function StockTicker({ section }: StockTickerProps) {
  return (
    <section className="flex h-[9.25rem] items-center border-b border-light-grey bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] items-center px-6 lg:px-16">
        {/* Company name */}
        {section.companyName && (
          <span className="shrink-0 text-[18px] font-bold leading-tight text-darkest-grey">
            {section.companyName}
          </span>
        )}

        {/* Stock items */}
        <div className="flex flex-1 items-center justify-center gap-12 overflow-x-auto">
          {section.stocks.map((stock) => {
            const quote = stock.apiSymbol
              ? section.liveQuotes?.[stock.apiSymbol]
              : null;

            const price = quote?.price ?? stock.manualPrice;
            const change = quote?.change ?? stock.manualChange;

            return (
              <div
                key={stock.sys.id}
                className="flex shrink-0 items-baseline gap-3"
              >
                {/* Exchange label */}
                <span className="text-[13px] font-semibold tracking-wide text-slate-70">
                  {stock.exchange}
                </span>

                {/* Price */}
                {price != null && (
                  <span className="text-[42px] font-bold leading-none tracking-tight text-darkest-grey">
                    ${price.toFixed(3)}
                  </span>
                )}

                {/* Change indicator */}
                {change != null && <ChangeIndicator change={change} />}
              </div>
            );
          })}
        </div>

        {/* Right side: disclaimer + CTA */}
        <div className="flex shrink-0 items-center gap-8">
          {section.delayDisclaimer && (
            <span className="text-[14px] text-slate-70">
              {section.delayDisclaimer}
            </span>
          )}

          {section.cta && (
            <Cta
              cta={section.cta}
              className="!border-darkest-grey !text-darkest-grey !bg-transparent hover:!bg-darkest-grey hover:!text-white !text-[13px] !px-5 !py-2"
            />
          )}
        </div>
      </div>
    </section>
  );
}
