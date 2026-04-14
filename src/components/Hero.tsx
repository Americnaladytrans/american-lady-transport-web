import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  return (
    <section className="relative bg-primary">
      <div className="relative w-full min-h-[130vh]">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center select-none"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/40 to-primary/70" />

        {/* Headline centered */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="container mx-auto px-4 pt-24">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-cream animate-fade-up animation-delay-100 leading-tight">
                Trusted Freight Brokerage & 3PL Logistics
                <span className="block text-patriot-red mt-2">Across the U.S. and Canada</span>
              </h1>

              <p className="text-base md:text-lg text-cream/80 max-w-xl mx-auto animate-fade-up animation-delay-200 leading-relaxed">
                Connecting shippers with vetted carriers for on-time, hassle-free
                delivery across the continental U.S. and into Canada.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons pinned lower — one on each side */}
        <div className="absolute bottom-44 left-0 right-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center max-w-3xl mx-auto animate-fade-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/shippers" className="group">
                  Get a Freight Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/carriers">Become a Carrier</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats bar at the very bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 pb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up animation-delay-400">
              {[
                { value: "40+ Years", label: "In Business" },
                { value: "7 Days a Week", label: "Support" },
                { value: "All 50 States", label: "& Canada" },
                { value: "Vetted Carriers", label: "Safety First" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-serif font-bold text-cream drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-cream/80 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
