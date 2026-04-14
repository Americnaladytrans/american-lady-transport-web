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

        {/* Buttons and headline just below the header */}
        <div className="absolute left-0 right-0 top-36 z-30 flex justify-between items-start px-4 md:top-40 md:px-8">
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

        {/* Headline just below buttons */}
        <div className="absolute left-0 right-0 top-52 z-20 md:top-56">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-serif text-2xl md:text-3xl lg:text-5xl font-bold text-cream animate-fade-up animation-delay-100 leading-tight">
                Bridging the Gap Between Shipments and Solutions.
              </h1>
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
