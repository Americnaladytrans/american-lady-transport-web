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
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-cream animate-fade-up animation-delay-100 leading-tight">
                Bridging the Gap Between Shipments and Solutions.
              </h1>
            </div>
          </div>
        </div>

        {/* Buttons just below the fixed header, left and right sides */}
        <div className="absolute left-0 right-0 top-40 z-20 flex justify-between px-4 md:px-8 pointer-events-none">
          <Button variant="hero" size="xl" asChild className="pointer-events-auto">
            <Link to="/shippers" className="group">
              Get a Freight Quote
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="hero-outline" size="xl" asChild className="pointer-events-auto">
            <Link to="/carriers">Become a Carrier</Link>
          </Button>
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
