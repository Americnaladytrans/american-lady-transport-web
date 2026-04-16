import { ExternalLink, Zap } from 'lucide-react';
import partialLogo from '@/assets/partial-rate-pro-logo.png';

export function PartialRateProBanner() {
  return (
    <a
      href="https://partial-pro.lovable.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="group block mt-2"
    >
      <div className="relative overflow-hidden rounded-lg mx-auto max-w-2xl border border-indigo-500/30 bg-gradient-to-r from-[hsl(230,60%,22%)] via-[hsl(255,50%,30%)] to-[hsl(280,60%,24%)] p-[1.5px] shadow-md transition-shadow hover:shadow-lg hover:shadow-indigo-500/20">
        <div className="relative overflow-hidden rounded-[7px] bg-gradient-to-r from-[hsl(230,60%,14%)] via-[hsl(255,50%,22%)] to-[hsl(280,50%,18%)] px-5 py-2.5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          <div className="relative flex items-center justify-center gap-3 text-white">
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400/90">Sponsored</span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <div className="flex items-center gap-2">
              <img src={partialLogo} alt="Partial Rate Pro" className="h-6 w-6 rounded" />
              <span className="text-sm font-extrabold tracking-tight">Partial Rate Pro</span>
              <span className="hidden sm:inline text-xs text-white/80">— The Ultimate LTL Rating Tool</span>
            </div>
            <div className="w-px h-5 bg-white/20" />
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/15 rounded-full px-3 py-1 border border-white/20 group-hover:bg-white/25 transition-colors">
              Visit Now <ExternalLink className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
