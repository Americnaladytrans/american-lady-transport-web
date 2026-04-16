import { useState, useMemo, useRef, useCallback, useEffect } from "react";
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

const money = (n: number, d = 2) => `$${n.toFixed(d)}`;
const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

/* ── Shared font style helpers ── */
const fontBody = { fontFamily: "'Satoshi', 'DM Sans', sans-serif" };
const fontDisplay = { fontFamily: "'Cabinet Grotesk', 'Playfair Display', sans-serif" };

/* ── Metric Card ── */
const MetricCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-3 rounded-lg border min-w-0" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)" }}>
    <div className="text-xs uppercase tracking-widest" style={{ color: "var(--fsc-text-muted)", letterSpacing: ".11em" }}>{label}</div>
    <div className="mt-1.5 text-lg font-extrabold tracking-tight whitespace-nowrap" style={{ ...fontDisplay, color: "#ff4545", letterSpacing: "-.04em" }}>{value}</div>
  </div>
);

/* ── Main Calculator ── */
const FuelSurchargeCalculator = () => {
  const [currentPrice] = useState(DEFAULTS.currentPrice);
  const [mpg, setMpg] = useState(DEFAULTS.mpg);
  const [miles, setMiles] = useState(DEFAULTS.miles);
  const detailsRef = useRef<HTMLDetailsElement>(null);
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
    if (detailsRef.current && !detailsRef.current.open) {
      detailsRef.current.open = true;
    }
    setTimeout(() => {
      activeRowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  useEffect(() => {
    const el = detailsRef.current;
    if (!el) return;
    const handler = () => {
      if (el.open) {
        setTimeout(() => {
          activeRowRef.current?.scrollIntoView({ block: "nearest" });
        }, 50);
      }
    };
    el.addEventListener("toggle", handler);
    return () => el.removeEventListener("toggle", handler);
  }, []);

  return (
    <div style={fontBody}>
      {/* Hero section */}
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-5 mb-5">
        {/* Left: Hero copy */}
        <div className="fsc-card p-5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest"
            style={{ background: "var(--fsc-surface-2)", border: "1px solid var(--fsc-border)", color: "var(--fsc-text-muted)", letterSpacing: ".11em" }}>
            <Fuel className="w-4 h-4" /> On-highway diesel
          </span>
          <h2 className="mt-4" style={{ ...fontDisplay, fontSize: "clamp(1.8rem,1.25rem + 1.3vw,2.5rem)", fontWeight: 800, lineHeight: .98, letterSpacing: "-.045em", color: "var(--fsc-text)" }}>
            Fast fuel surcharge lookup for freight quotes.
          </h2>
          <p className="mt-4 max-w-prose" style={{ color: "var(--fsc-text-muted)" }}>
            Uses the federal EIA diesel benchmark, rounds up to the next 5-cent band, and matches the correct FSC percentage based on your $1.50 base.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="p-3.5 rounded-lg border" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)" }}>
              <strong className="block text-lg" style={{ ...fontDisplay, fontWeight: 800, letterSpacing: "-.03em", color: "#6daa45" }}>$5.643</strong>
              <span className="block mt-1 text-xs" style={{ color: "var(--fsc-text-muted)" }}>Current federal diesel price</span>
            </div>
            <div className="p-3.5 rounded-lg border" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)" }}>
              <strong className="block text-lg" style={{ ...fontDisplay, fontWeight: 800, letterSpacing: "-.03em", color: "var(--fsc-text)" }}>$1.50</strong>
              <span className="block mt-1 text-xs" style={{ color: "var(--fsc-text-muted)" }}>Base fuel rate</span>
            </div>
            <div className="p-3.5 rounded-lg border" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)" }}>
              <strong className="block text-lg" style={{ ...fontDisplay, fontWeight: 800, letterSpacing: "-.03em", color: "var(--fsc-text)" }}>5¢</strong>
              <span className="block mt-1 text-xs" style={{ color: "var(--fsc-text-muted)" }}>Band size</span>
            </div>
          </div>
        </div>

        {/* Right: Calculator */}
        <div className="fsc-card p-4">
          <h2 style={{ ...fontDisplay, fontSize: "clamp(1.15rem,1rem + .5vw,1.35rem)", fontWeight: 750, letterSpacing: "-.03em", color: "var(--fsc-text)" }}>Calculator</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--fsc-text-muted)" }}>
            Enter miles and MPG. The diesel price stays tied to the federal benchmark.
          </p>
          <div className="grid gap-3 mt-4">
            <label className="grid gap-1 text-sm font-bold" style={{ color: "var(--fsc-text)" }}>
              Federal EIA diesel price ($/gal)
              <input type="number" value={currentPrice} readOnly className="fsc-input opacity-75 cursor-not-allowed" />
            </label>
            <label className="grid gap-1 text-sm font-bold" style={{ color: "var(--fsc-text)" }}>
              Average MPG
              <input type="number" min={0.1} step={0.1} value={mpg}
                onChange={(e) => setMpg(Math.max(parseFloat(e.target.value) || 0.1, 0.1))}
                className="fsc-input" />
            </label>
            <label className="grid gap-1 text-sm font-bold" style={{ color: "var(--fsc-text)" }}>
              Loaded miles
              <input type="number" min={0} step={1} value={miles}
                onChange={(e) => setMiles(parseInt(e.target.value) || 0)}
                className="fsc-input" />
            </label>
            <div className="flex gap-3 flex-wrap mt-1">
              <button onClick={resetDefaults}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-colors"
                style={{ background: "var(--fsc-primary)", color: "var(--fsc-text-inverse)" }}>
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button onClick={jumpToBand}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold transition-colors"
                style={{ background: "var(--fsc-surface-2)", border: "1px solid var(--fsc-border)", color: "var(--fsc-text)" }}>
                <ArrowDown className="w-4 h-4" /> Jump to band
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results + Band lookup */}
      <div className="grid md:grid-cols-[1fr_360px] gap-5">
        {/* Results */}
        <div className="fsc-card p-4">
          <h2 style={{ ...fontDisplay, fontSize: "clamp(1.15rem,1rem + .5vw,1.35rem)", fontWeight: 750, letterSpacing: "-.03em", color: "var(--fsc-text)" }}>Results</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--fsc-text-muted)" }}>
            Clean quote-ready outputs based on the current diesel band.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4" style={{ justifyContent: "start" }}>
            <MetricCard label="Matched FSC %" value={percent(results.band.pct)} />
            <MetricCard label="FSC $ / mile" value={money(results.cpm, 4)} />
            <MetricCard label="Trip FSC total" value={money(results.total)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(240px,450px)_minmax(220px,320px)] gap-3 mt-3" style={{ justifyContent: "start" }}>
            <div className="p-3 rounded-lg border" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)", overflowWrap: "anywhere" }}>
              <strong className="block text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--fsc-text-muted)", letterSpacing: ".11em" }}>Matched band</strong>
              <span style={{ color: "var(--fsc-text)" }}>{results.band.label} (from {money(currentPrice, 3)})</span>
            </div>
            <div className="p-3 rounded-lg border" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)", overflowWrap: "anywhere" }}>
              <strong className="block text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--fsc-text-muted)", letterSpacing: ".11em" }}>Fuel over base</strong>
              <span style={{ color: "var(--fsc-text)" }}>{money(results.delta, 3)} above base</span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg text-sm" style={{
            background: "color-mix(in oklab, var(--fsc-warning) 9%, var(--fsc-surface))",
            border: "1px solid color-mix(in oklab, var(--fsc-warning) 24%, transparent)",
            overflowWrap: "anywhere",
            lineHeight: 1.3,
            color: "var(--fsc-text)"
          }}>
            Per-mile FSC formula: <strong>(current price − $1.50) ÷ MPG</strong>
          </div>
        </div>

        {/* Band lookup */}
        <div className="fsc-card p-4">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2 style={{ ...fontDisplay, fontSize: "clamp(1.15rem,1rem + .5vw,1.35rem)", fontWeight: 750, letterSpacing: "-.03em", color: "var(--fsc-text)" }}>Band lookup</h2>
              <p className="mt-1 text-sm" style={{ color: "var(--fsc-text-muted)" }}>Shows the active band first. Expand only if you need the full schedule.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
              style={{ background: "var(--fsc-primary-soft)", color: "var(--fsc-primary)" }}>
              5¢ bands
            </span>
          </div>

          {/* Native details/summary for the collapsible */}
          <details ref={detailsRef} className="fsc-disclosure">
            <summary className="fsc-summary">
              <div className="text-left">
                <span className="block text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--fsc-text-muted)", letterSpacing: ".11em" }}>Current band</span>
                <strong className="block" style={{ color: "var(--fsc-text)" }}>{results.band.label}</strong>
              </div>
              <div className="flex items-center gap-2 font-extrabold whitespace-nowrap" style={{ color: "var(--fsc-primary)" }}>
                <span>{percent(results.band.pct)}</span>
                <span className="fsc-chev" aria-hidden="true">▾</span>
              </div>
            </summary>
            <div className="mt-2 max-h-[360px] overflow-auto rounded-lg border" style={{ background: "var(--fsc-surface-2)", borderColor: "var(--fsc-border)" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="sticky top-0 text-xs uppercase tracking-wider p-2.5 text-left border-b"
                      style={{ background: "var(--fsc-surface)", color: "var(--fsc-text-muted)", borderColor: "var(--fsc-divider)", letterSpacing: ".1em" }}>Band</th>
                    <th className="sticky top-0 text-xs uppercase tracking-wider p-2.5 text-left border-b"
                      style={{ background: "var(--fsc-surface)", color: "var(--fsc-text-muted)", borderColor: "var(--fsc-divider)", letterSpacing: ".1em" }}>FSC %</th>
                  </tr>
                </thead>
                <tbody>
                  {bands.map((b, i) => (
                    <tr key={i} ref={i === results.idx ? activeRowRef : undefined}
                      className={i === results.idx ? "fsc-row-active" : ""}
                      style={{ borderBottom: "1px solid color-mix(in oklab, var(--fsc-text) 6%, transparent)" }}>
                      <td className="p-2.5" style={{ color: "var(--fsc-text)" }}>{b.label}</td>
                      <td className="p-2.5 tabular-nums" style={{ color: "var(--fsc-text)" }}>{percent(b.pct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 pb-4 text-center text-xs" style={{ color: "var(--fsc-text-muted)" }}>
        Uses the federal EIA U.S. on-highway diesel benchmark for band matching. Percentage schedule is rebased to a $1.50 fuel baseline.
      </p>
    </div>
  );
};

const FuelSurchargePage = () => (
  <div className="min-h-screen">
    <SEOHead
      title="Fuel Surcharge Calculator | American Lady Transport"
      description="Calculate fuel surcharge percentages and per-mile costs using DOE/EIA on-highway diesel benchmarks. Free fuel surcharge lookup tool for freight and trucking."
      canonicalPath="/fuel-surcharge"
    />
    <Header />
    <main className="pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-[1180px]">
        <FuelSurchargeCalculator />
      </div>
    </main>
    <Footer />
  </div>
);

export default FuelSurchargePage;
