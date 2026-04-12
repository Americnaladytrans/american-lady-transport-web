import { useState, useMemo, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Fuel, RotateCcw, ArrowDown } from "lucide-react";

interface Band {
  low: number;
  high: number;
  pct: number;
  label: string;
}

const DEFAULTS = { currentPrice: 5.643, mpg: 6.5, miles: 1200 };
const BASELINE = 1.5;

const FuelSurchargeCalculator = () => {
  const [currentPrice] = useState(DEFAULTS.currentPrice);
  const [mpg, setMpg] = useState(DEFAULTS.mpg);
  const [miles, setMiles] = useState(DEFAULTS.miles);
  const activeRowRef = useRef<HTMLTableRowElement>(null);

  const bands = useMemo(() => {
    const result: Band[] = [];
    let pct = 0.02;
    for (let low = 1.4; low <= 10.0001; low = +(low + 0.05).toFixed(2)) {
      const high = +(low + 0.04).toFixed(2);
      result.push({ low: +low.toFixed(2), high, pct: +pct.toFixed(4), label: `$${low.toFixed(2)} - $${high.toFixed(2)}` });
      pct = +(pct + 0.005).toFixed(4);
    }
    return result;
  }, []);

  const results = useMemo(() => {
    const cp = currentPrice || 0;
    const m = Math.max(mpg || 0.1, 0.1);
    const mi = Math.max(miles || 0, 0);
    let normalized = Math.ceil(cp * 20) / 20;
    normalized = +normalized.toFixed(2);

    let idx = bands.findIndex((b) => normalized >= b.low && normalized <= b.high);
    if (idx === -1 && normalized > bands[bands.length - 1].high) idx = bands.length - 1;
    if (idx === -1 && normalized < bands[0].low) idx = 0;
    if (idx === -1) idx = 0;

    const band = bands[idx] ?? bands[0];
    const delta = Math.max(cp - BASELINE, 0);
    const cpm = delta / m;
    const total = cpm * mi;

    return { idx, band, cpm, total };
  }, [currentPrice, mpg, miles, bands]);

  const money = (n: number, d = 2) => `$${n.toFixed(d)}`;
  const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

  const resetDefaults = () => {
    setMpg(DEFAULTS.mpg);
    setMiles(DEFAULTS.miles);
  };

  const jumpToBand = useCallback(() => {
    activeRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-accent/30 border border-border rounded-xl p-6 shadow-md">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-xs uppercase tracking-widest text-muted-foreground">
            <Fuel className="w-4 h-4" /> On-highway diesel
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4 font-display">
            Rate freight faster with live fuel surcharge logic.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-prose">
            Uses the federal EIA U.S. on-highway diesel benchmark as the current fuel reference, matches the correct percentage band, and calculates truckload fuel surcharge with fixed contract logic built in.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-lg font-bold font-display">$10.00</div>
              <div className="text-xs text-muted-foreground mt-1">Range schedule ceiling</div>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-lg font-bold font-display">$5.643</div>
              <div className="text-xs text-muted-foreground mt-1">Federal EIA current price</div>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="text-lg font-bold font-display">5¢</div>
              <div className="text-xs text-muted-foreground mt-1">Band size per tier</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold font-display">Calculator</h2>
          <p className="text-sm text-muted-foreground mt-1">
            The current price follows the federal EIA benchmark shown below. Adjust MPG and miles to update the cents-per-mile surcharge and trip total instantly.
          </p>
          <div className="grid gap-4 mt-5">
            <label className="grid gap-1.5 text-sm font-semibold">
              Federal EIA on-highway diesel price ($/gal)
              <input
                type="number"
                value={currentPrice}
                readOnly
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg cursor-not-allowed opacity-75"
              />
            </label>
            <InputField label="Average MPG" value={mpg} step={0.1} min={0.1} onChange={(v) => setMpg(Math.max(v, 0.1))} />
            <InputField label="Loaded miles" value={miles} step={1} onChange={setMiles} isInt />
            <div className="flex gap-3 flex-wrap">
              <button onClick={resetDefaults} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                <RotateCcw className="w-4 h-4" /> Reset to federal price
              </button>
              <button onClick={jumpToBand} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-background border border-border font-bold hover:bg-accent transition-colors">
                <ArrowDown className="w-4 h-4" /> Jump to matched band
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[360px_1fr] gap-6">
        <ResultsPanel results={results} currentPrice={currentPrice} money={money} percent={percent} />
        <ScheduleTable bands={bands} activeIdx={results.idx} activeRowRef={activeRowRef} money={money} percent={percent} />
      </div>
    </>
  );
};

const InputField = ({ label, value, step, min = 0, onChange, isInt }: {
  label: string;
  value: number;
  step: number;
  min?: number;
  onChange: (v: number) => void;
  isInt?: boolean;
}) => (
  <label className="grid gap-1.5 text-sm font-semibold">
    {label}
    <input
      type="number"
      min={min}
      step={step}
      value={value}
      onChange={(e) => onChange(isInt ? parseInt(e.target.value) || 0 : parseFloat(e.target.value) || 0)}
      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
    />
  </label>
);

const ResultsPanel = ({ results, currentPrice, money, percent }: {
  results: { band: Band; cpm: number; total: number };
  currentPrice: number;
  money: (n: number, d?: number) => string;
  percent: (n: number) => string;
}) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
    <div>
      <h2 className="text-xl font-bold font-display">Results</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Percentage band results work well for schedules, while cents-per-mile is common in truckload contracts.
      </p>
    </div>
    <div className="grid grid-cols-3 gap-3">
      <MetricCard label="Matched FSC %" value={percent(results.band.pct)} />
      <MetricCard label="FSC $ / mile" value={money(results.cpm, 4)} />
      <MetricCard label="Trip FSC total" value={money(results.total)} />
    </div>
    <div className="p-4 rounded-lg bg-background border border-border">
      <strong>Matched price band:</strong> {results.band.label} (rounded up from {money(currentPrice, 3)})
    </div>
    <div className="p-4 rounded-lg bg-accent/40 border border-border text-sm">
      This app uses the federal EIA on-highway diesel price as the current fuel reference and recalculates the per-mile and trip surcharge totals from the built-in contract logic.
    </div>
  </div>
);

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 rounded-lg bg-background border border-border min-w-0 overflow-hidden">
    <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className="mt-2 text-xl md:text-2xl font-extrabold font-display tracking-tight break-all">{value}</div>
  </div>
);

const ScheduleTable = ({ bands, activeIdx, activeRowRef, money, percent }: {
  bands: Band[];
  activeIdx: number;
  activeRowRef: React.RefObject<HTMLTableRowElement>;
  money: (n: number, d?: number) => string;
  percent: (n: number) => string;
}) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-md">
    <h2 className="text-xl font-bold font-display">Range Schedule</h2>
    <p className="text-sm text-muted-foreground mt-1">
      Extended through $10.00 per gallon using 5-cent bands. The table is simplified to show only the diesel band and the matching FSC percentage, and $5.643 maps to the $5.65-$5.69 row.
    </p>
    <div className="mt-5 max-h-[620px] overflow-auto rounded-lg border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground p-3 text-left border-b border-border">Band</th>
            <th className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground p-3 text-left border-b border-border">FSC %</th>
          </tr>
        </thead>
        <tbody>
          {bands.map((b, i) => (
            <tr
              key={i}
              ref={i === activeIdx ? activeRowRef : undefined}
              className={`${i === activeIdx ? "bg-primary/10 font-semibold" : ""} border-b border-border/50`}
            >
              <td className="p-3">{b.label}</td>
              <td className="p-3 tabular-nums">{percent(b.pct)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const FuelSurchargePage = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Fuel Surcharge Calculator | American Lady Transport"
      description="Calculate fuel surcharge percentages and per-mile costs using DOE/EIA on-highway diesel benchmarks. Free fuel surcharge lookup tool for freight and trucking."
      canonicalPath="/fuel-surcharge"
    />
    <Header />
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <FuelSurchargeCalculator />
      </div>
    </main>
    <Footer />
  </div>
);

export default FuelSurchargePage;
