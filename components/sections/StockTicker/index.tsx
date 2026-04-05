import type { StockTickerSection } from "@/lib/sections/types";
import { Cta } from "@/components/common/Cta";

type StockTickerProps = {
  section: StockTickerSection;
};

function ChangeIndicator({ change }: { change: number }) {
  const isPositive = change >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-semibold leading-none ${
        isPositive ? "text-clover" : "text-red"
      }`}
    >
      <svg
        className={`h-2.5 w-2.5 ${isPositive ? "" : "rotate-180"}`}
        fill="currentColor"
        viewBox="0 0 10 10"
      >
        <path d="M5 0l5 10H0z" />
      </svg>
      {isPositive ? "+" : ""}
      <span className="text-black font-normal text-[16px]">{change.toFixed(3)}</span>
    </span>
  );
}

function StockRow({
  exchange,
  price,
  change,
}: {
  exchange?: string | null;
  price?: number | null;
  change?: number | null;
}) {
  return (
    <div className="flex items-baseline gap-4">
      {/* Exchange label — fixed width for alignment */}
      <span className="w-16 shrink-0 font-sans text-[16px] font-500 text-black lg:w-auto">
        {exchange}
      </span>

      {/* Price */}
      {price != null && (
        <span className="font-sans text-[32px] font-500 leading-none tracking-tight text-darkest-grey">
          ${price.toFixed(3)}
        </span>
      )}

      {/* Change */}
      {change != null && <ChangeIndicator change={change} />}
    </div>
  );
}

export function StockTicker({ section }: StockTickerProps) {
  const stockRows = section.stocks.map((stock) => {
    const quote = stock.apiSymbol
      ? section.liveQuotes?.[stock.apiSymbol]
      : null;

    return {
      id: stock.sys.id,
      exchange: stock.exchange,
      price: quote?.price ?? stock.manualPrice,
      change: quote?.change ?? stock.manualChange,
    };
  });

  return (
    <section className="border-b border-light-grey bg-white">
      {/* ── DESKTOP ── */}
      <div className="hidden h-[9.25rem] items-center lg:flex">
        <div className="mx-auto flex w-full max-w-[1440px] items-center px-16">
          {section.companyName && (
            <span className="shrink-0 font-sans text-[24px] font-bold leading-tight text-darkest-grey">
              {section.companyName}
            </span>
          )}

          <div className="flex flex-1 items-center justify-center gap-12">
            {stockRows.map((row) => (
              <StockRow key={row.id} {...row} />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-8">
            {section.delayDisclaimer && (
              <span className="text-[16px] text-black">
                {section.delayDisclaimer}
              </span>
            )}
            {section.cta && (
              <Cta
                cta={section.cta}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="flex flex-col items-center px-6 py-8 lg:hidden">
        {section.companyName && (
          <span className="mb-6 font-sans text-[24px] font-bold text-darkest-grey">
            {section.companyName}
          </span>
        )}

        <div className="flex flex-col gap-4">
          {stockRows.map((row) => (
            <StockRow key={row.id} {...row} />
          ))}
        </div>

        {section.delayDisclaimer && (
          <span className="mt-6 text-[14px] font-semibold text-darkest-grey">
            {section.delayDisclaimer}
          </span>
        )}

        {section.cta && (
          <div className="mt-4">
            <Cta
              cta={section.cta}
              className="!border-darkest-grey !text-darkest-grey !bg-transparent hover:!bg-darkest-grey hover:!text-white !text-[13px] !px-5 !py-2"
            />
          </div>
        )}
      </div>
    </section>
  );
}
