import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  return (
    <section className="relative">
      {/* Image with buttons overlay */}
      <div className="relative w-full bg-primary">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="pointer-events-none w-full h-auto select-none"
        />

        

        {/* Buttons just below the header */}
        <div className="absolute left-0 right-0 top-2 z-[60] flex justify-between items-start px-4 md:px-8">
          <Button variant="hero-outline" size="xl" asChild>
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

      {/* Text section below the image */}
      <div className="bg-gradient-to-b from-primary from-80% to-background pb-16 pt-8 -mt-4">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-10">
            <h1 className="font-serif text-xl md:text-2xl lg:text-4xl font-bold text-cream animate-fade-up animation-delay-100 leading-tight whitespace-nowrap">
              Bridging the Gap Between Shipments and Solutions.
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up animation-delay-400">
            {[
              { value: "40+ Years", label: "In Business" },
              { value: "7 Days a Week", label: "Support" },
              { value: "All 50 States", label: "& Canada" },
              { value: "Vetted Carriers", label: "Safety First" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-cream">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-cream/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
