import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90" />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-full px-4 py-2 mb-8 animate-fade-up">
            <MapPin className="w-4 h-4 text-patriot-red" />
            <span className="text-cream/90 text-sm font-medium">Willis, Texas</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-cream mb-6 animate-fade-up animation-delay-100 leading-tight">
            Delivering America's
            <span className="block text-patriot-red">Freight Forward</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-cream/80 mb-10 max-w-2xl mx-auto animate-fade-up animation-delay-200 leading-relaxed">
            Trusted freight brokerage services connecting shippers with reliable carriers. 
            From Texas to every corner of the nation—on time, every time.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up animation-delay-300">
            <Button variant="hero" size="xl" asChild>
              <a href="#contact" className="group">
                Contact Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#services">Our Services</a>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up animation-delay-400">
            {[
              { value: "50,000+", label: "Loads Delivered" },
              { value: "48 & Canada", label: "Areas Covered" },
              { value: "7 Days a Week", label: "Support" },
              { value: "100%", label: "Commitment" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-cream">{stat.value}</div>
                <div className="text-sm text-cream/60 mt-1">{stat.label}</div>
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
