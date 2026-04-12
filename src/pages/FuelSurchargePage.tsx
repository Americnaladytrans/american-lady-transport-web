import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

const FuelSurchargePage = () => {
  const [currentPrice, setCurrentPrice] = useState(5.643);
  const [baselinePrice, setBaselinePrice] = useState(1.25);
  const [mpg, setMpg] = useState(6.5);
  const [miles, setMiles] = useState(1200);
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
    const bp = baselinePrice || 0;
    const m = Math.max(mpg || 0.1, 0.1);
    const mi = Math.max(miles || 0, 0);
    let idx = bands.findIndex(b => cp >= b.low && cp <= b.high);
    if (idx === -1) {
      if (cp > bands[bands.length - 1].high) idx = bands.length - 1;
      else idx = 0;
    }
    const band = bands[idx] ?? bands[0];
    const delta = Math.max(cp - bp, 0);
    const cpm = delta / m;
    const total = cpm * mi;
    return { idx, band, delta, cpm, total };
  }, [currentPrice, baselinePrice, mpg, miles, bands]);

  const money = (n: number, d = 2) => `$${n.toFixed(d)}`;
  const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

  const resetDefaults = () => {
    setCurrentPrice(5.643);
    setBaselinePrice(1.25);
    setMpg(6.5);
    setMiles(1200);
  };

  const jumpToBand = useCallback(() => {
    activeRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Fuel Surcharge Calculator | American Lady Transport"
        description="Calculate fuel surcharge percentages and per-mile costs using DOE/EIA on-highway diesel benchmarks. Free fuel surcharge lookup tool for freight and trucking."
        canonicalPath="/fuel-surcharge"
      />
      <Header />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-accent/30 border border-border rounded-xl p-6 shadow-md">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border text-xs uppercase tracking-widest text-muted-foreground">
                <Fuel className="w-4 h-4" /> On-highway diesel
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-4 font-display">
                Rate freight faster with live fuel surcharge logic.
              </h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Use the DOE/EIA on-highway diesel benchmark as your current fuel price input, match the correct percentage band, and optionally calculate truckload fuel surcharge by the cents-per-mile method your customers or carrier contracts use.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold font-display">$10.00</div>
                  <div className="text-xs text-muted-foreground mt-1">Range schedule ceiling</div>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold font-display">$5.643</div>
                  <div className="text-xs text-muted-foreground mt-1">Prefilled current diesel price</div>
                </div>
                <div className="p-4 bg-background rounded-lg border border-border">
                  <div className="text-lg font-bold font-display">5¢</div>
                  <div className="text-xs text-muted-foreground mt-1">Band size per tier</div>
                </div>
              </div>
            </div>

            {/* Calculator */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold font-display">Calculator</h2>
              <p className="text-sm text-muted-foreground mt-1">Change the current price, baseline, MPG, or miles. The app updates the surcharge band and the per-mile FSC instantly.</p>
              <div className="grid gap-4 mt-5">
                <label className="grid gap-1.5 text-sm font-semibold">
                  Current on-road diesel price ($/gal)
                  <input type="number" min={0} step={0.001} value={currentPrice} onChange={e => setCurrentPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Baseline fuel price ($/gal)
                  <input type="number" min={0} step={0.01} value={baselinePrice} onChange={e => setBaselinePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Average MPG
                  <input type="number" min={0.1} step={0.1} value={mpg} onChange={e => setMpg(parseFloat(e.target.value) || 0.1)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Loaded miles
                  <input type="number" min={0} step={1} value={miles} onChange={e => setMiles(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                </label>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={resetDefaults} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                    <RotateCcw className="w-4 h-4" /> Reset defaults
                  </button>
                  <button onClick={jumpToBand} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-background border border-border font-bold hover:bg-accent transition-colors">
                    <ArrowDown className="w-4 h-4" /> Jump to matched band
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results + Table */}
          <div className="grid md:grid-cols-[360px_1fr] gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-md space-y-4">
              <div>
                <h2 className="text-xl font-bold font-display">Results</h2>
                <p className="text-sm text-muted-foreground mt-1">Percentage band results work well for schedules, while cents-per-mile is common in truckload contracts.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Matched FSC %</div>
                  <div className="mt-2 text-2xl font-extrabold font-display tracking-tight">{percent(results.band.pct)}</div>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">FSC $ / mile</div>
                  <div className="mt-2 text-2xl font-extrabold font-display tracking-tight">{money(results.cpm, 4)}</div>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Trip FSC total</div>
                  <div className="mt-2 text-2xl font-extrabold font-display tracking-tight">{money(results.total)}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-background border border-border">
                  <strong>Matched price band:</strong> {results.band.label}
                </div>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <strong>Fuel over baseline:</strong> {money(results.delta, 3)} above baseline
                </div>
              </div>
              <div className="p-4 rounded-lg bg-accent border border-border text-sm">
                This app starts with a percentage schedule in 5-cent bands and also shows the per-mile formula many trucking contracts use:{" "}
                <strong>(current fuel price − baseline fuel price) ÷ MPG</strong>.
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold font-display">Range Schedule</h2>
              <p className="text-sm text-muted-foreground mt-1">Extended through $10.00 per gallon using 5-cent bands. The highlighted row shows the active price bracket.</p>
              <div className="mt-5 max-h-[620px] overflow-auto rounded-lg border border-border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground p-3 text-left border-b border-border">From</th>
                      <th className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground p-3 text-left border-b border-border">To</th>
                      <th className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground p-3 text-left border-b border-border">FSC %</th>
                      <th className="sticky top-0 bg-muted text-xs uppercase tracking-wider text-muted-foreground p-3 text-left border-b border-border">Band</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bands.map((b, i) => (
                      <tr
                        key={i}
                        ref={i === results.idx ? activeRowRef : undefined}
                        className={`${i === results.idx ? "bg-primary/10 font-semibold" : ""} border-b border-border/50`}
                      >
                        <td className="p-3 tabular-nums">{money(b.low)}</td>
                        <td className="p-3 tabular-nums">{money(b.high)}</td>
                        <td className="p-3 tabular-nums">{percent(b.pct)}</td>
                        <td className="p-3">{b.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FuelSurchargePage;
