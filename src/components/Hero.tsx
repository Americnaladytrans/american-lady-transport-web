import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[130vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/50" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-36 py-[145px]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-cream mb-6 animate-fade-up animation-delay-100 leading-tight">
            Nationwide Freight Brokerage
            <span className="block text-patriot-red">Across the U.S. and Canada</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-cream/80 mb-4 max-w-2xl mx-auto animate-fade-up animation-delay-200 leading-relaxed">
            American Lady Transportation is a Texas-based freight brokerage that connects
            shippers with vetted carriers for on-time, hassle-free delivery anywhere in the
            continental U.S. and cross-border into Canada.
          </p>
          <p className="text-base text-cream/60 mb-10 max-w-2xl mx-auto animate-fade-up animation-delay-200">
            We specialize in construction-related freight, oilfield freight, and other industrial
            shipments that demand reliable capacity and clear communication.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up animation-delay-300">
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

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up animation-delay-400">
            {[
              { value: "40+ Years", label: "In Business" },
              { value: "U.S. & Canada", label: "Coverage" },
              { value: "7 Days a Week", label: "Support" },
              { value: "MC170463", label: "Licensed & Bonded" },
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

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
