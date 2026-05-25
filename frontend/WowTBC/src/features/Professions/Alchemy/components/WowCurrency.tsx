import { parseWowCurrency } from "../utils/helpers";

export function WowCurrency({ value, isProfit = false }: { value: number; isProfit?: boolean }) {
  if (!isFinite(value)) return <span>—</span>;

  const { isNegative, gold, silver, copper } = parseWowCurrency(value);

  if (isProfit) {
    const numberColorClass = isNegative ? "text-destructive" : "text-[hsl(var(--quality-uncommon))]";
    const sign = isNegative ? "-" : "+";

    return (
      <span className="tabular-nums font-mono whitespace-nowrap inline-flex items-baseline">
        <span className={`${numberColorClass} mr-1`}>{sign}</span>
        {gold > 0 && (
          <>
            <span className={numberColorClass}>{gold}</span>
            <span className="text-money-gold mr-1">g</span>
          </>
        )}

        {(gold > 0 || silver > 0) && (
          <>
            <span className={numberColorClass}>{silver}</span>
            <span className="text-money-silver mr-1">s</span>
          </>
        )}

        <>
          <span className={numberColorClass}>{copper}</span>
          <span className="text-money-copper">c</span>
        </>
      </span>
    );
  }

  return (
    <span className="tabular-nums font-mono whitespace-nowrap">
      {isNegative ? 
        <div className="mr-1 inline-flex">
          <span className="mr-1">-</span>
          {gold > 0 && <span className="mr-1">{gold}g</span>}

          {(gold > 0 || silver > 0) && <span className="mr-1">{silver}s</span>}

          <span>{copper}c</span>
        </div> : 
        <>
          {gold > 0 && <span className="text-money-gold mr-1">{gold}g</span>}

          {(gold > 0 || silver > 0) && <span className="text-money-silver mr-1">{silver}s</span>}

          <span className="text-money-copper">{copper}c</span>
        </>
      }
    </span>
  );
}
