import { useState, useMemo, useRef, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Fuel, RotateCcw, ArrowDown, ChevronDown } from "lucide-react";

interface Band {
  low: number;
  high: number;
  pct: number;
  label: string;
}

const DEFAULTS = { currentPrice: 5.643, mpg: 6.5, miles: 1200 };
const BASELINE = 1.5;

const money = (n: number, d = 2) => `$${n.toFixed(d)}`;
const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

const FuelSurchargeCalculator = () => {
  const [currentPrice] = useState(DEFAULTS.currentPrice);
  const [mpg, setMpg] = useState(DEFAULTS.mpg);
  const [miles, setMiles] = useState(DEFAULTS.miles);
  const [tableOpen, setTableOpen] = useState(false);
  const activeRowRef = useRef<HTMLTableRowElement>(null);

  const bands = useMemo(() => {
    const result: Band[] = [];
    let pct = 0.0;
    for (let low = 1.5; low <= 10.0001; low = +(low + 0.05).toFixed(2)) {
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

    return { idx, band, cpm, total, delta };
  }, [currentPrice, mpg, miles, bands]);

  const resetDefaults = () => {
    setMpg(DEFAULTS.mpg);
    setMiles(DEFAULTS.miles);
  };

  const jumpToBand = useCallback(() => {
    if (!tableOpen) setTableOpen(true);
    setTimeout(() => {
      activeRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, [tableOpen]);

  return (
    <>
      {/* Hero section */}
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-5 mb-5">
        <div className="bg-card border border-border rounded-xl p-5 shadow-md">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 border border-border text-xs uppercase tracking-widest text-muted-foreground">
            <Fuel className="w-4 h-4" /> On-highway diesel
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 font-display leading-[0.98]">
            Fast fuel surcharge lookup for freight quotes.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-prose">
            Uses the federal EIA diesel benchmark, rounds up to the next 5-cent band, and matches the correct FSC percentage based on your $1.50 base.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="p-4 bg-accent/30 rounded-lg border border-border">
              <div className="text-lg font-extrabold font-display text-green-600">$5.643</div>
              <div className="text-xs text-muted-foreground mt-1">Current federal diesel price</div>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg border border-border">
              <div className="text-lg font-extrabold font-display">$1.50</div>
              <div className="text-xs text-muted-foreground mt-1">Base fuel rate</div>
            </div>
            <div className="p-4 bg-accent/30 rounded-lg border border-border">
              <div className="text-lg font-extrabold font-display">5¢</div>
              <div className="text-xs text-muted-foreground mt-1">Band size</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-bold font-display">Calculator</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter miles and MPG. The diesel price stays tied to the federal benchmark.
          </p>
          <div className="grid gap-3 mt-4">
            <label className="grid gap-1 text-sm font-bold">
              Federal EIA diesel price ($/gal)
              <input
                type="number"
                value={currentPrice}
                readOnly
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg cursor-not-allowed opacity-75"
              />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Average MPG
              <input
                type="number"
                min={0.1}
                step={0.1}
                value={mpg}
                onChange={(e) => setMpg(Math.max(parseFloat(e.target.value) || 0.1, 0.1))}
                className="w-full px-4 py-3 bg-accent/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </label>
            <label className="grid gap-1 text-sm font-bold">
              Loaded miles
              <input
                type="number"
                min={0}
                step={1}
                value={miles}
                onChange={(e) => setMiles(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-accent/30 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </label>
            <div className="flex gap-3 flex-wrap mt-1">
              <button onClick={resetDefaults} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button onClick={jumpToBand} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent/30 border border-border font-bold hover:bg-accent transition-colors">
                <ArrowDown className="w-4 h-4" /> Jump to band
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results + Band lookup */}
      <div className="grid md:grid-cols-[1fr_360px] gap-5">
        {/* Results */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-md">
          <h2 className="text-lg font-bold font-display">Results</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Clean quote-ready outputs based on the current diesel band.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4" style={{ justifyContent: "start" }}>
            <MetricCard label="Matched FSC %" value={percent(results.band.pct)} />
            <MetricCard label="FSC $ / mile" value={money(results.cpm, 4)} />
            <MetricCard label="Trip FSC total" value={money(results.total)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(240px,450px)_minmax(220px,320px)] gap-3 mt-3" style={{ justifyContent: "start" }}>
            <div className="p-3 bg-accent/30 rounded-lg border border-border">
              <strong className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Matched band</strong>
              <span>{results.band.label} (from {money(currentPrice, 3)})</span>
            </div>
            <div className="p-3 bg-accent/30 rounded-lg border border-border">
              <strong className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Fuel over base</strong>
              <span>{money(results.delta, 3)} above base</span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/30 text-sm">
            Per-mile FSC formula: <strong>(current price − $1.50) ÷ MPG</strong>
          </div>
        </div>

        {/* Band lookup - collapsible */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-md">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold font-display">Band lookup</h2>
              <p className="text-sm text-muted-foreground mt-1">Shows the active band first. Expand only if you need the full schedule.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold whitespace-nowrap">
              5¢ bands
            </span>
          </div>

          {/* Collapsible summary */}
          <button
            onClick={() => setTableOpen(!tableOpen)}
            className="w-full flex items-center justify-between gap-3 p-3 border border-border rounded-lg bg-accent/30 cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <div className="text-left">
              <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-0.5">Current band</span>
              <strong className="block">{results.band.label}</strong>
            </div>
            <div className="flex items-center gap-2 font-extrabold text-primary whitespace-nowrap">
              <span>{percent(results.band.pct)}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${tableOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {tableOpen && (
            <div className="mt-2 max-h-[360px] overflow-auto rounded-lg border border-border bg-accent/30">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="sticky top-0 bg-card text-xs uppercase tracking-wider text-muted-foreground p-2.5 text-left border-b border-border">Band</th>
                    <th className="sticky top-0 bg-card text-xs uppercase tracking-wider text-muted-foreground p-2.5 text-left border-b border-border">FSC %</th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((b, i) => (
                    <tr
                      key={i}
                      ref={i === results.idx ? activeRowRef : undefined}
                      className={`${i === results.idx ? "bg-primary/10 font-semibold" : ""} border-b border-border/30`}
                    >
                      <td className="p-2.5">{b.label}</td>
                      <td className="p-2.5 tabular-nums">{percent(b.pct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-lg bg-accent/30 border border-border min-w-0">
    <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    <div className="mt-1.5 text-lg font-extrabold font-display tracking-tight text-[#ff4545] whitespace-nowrap">{value}</div>
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
