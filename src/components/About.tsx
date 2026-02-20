import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoBadge from "@/assets/logo-badge.png";

const features = [
  "Licensed and bonded freight broker (MC170463)",
  "Vetted carrier network with safety and compliance standards",
  "40+ years in the freight industry",
  "Personalized service with direct communication",
  "24/7 communication on active loads",
  "Serving shippers across North America",
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              About Us
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              About American Lady{" "}
              <span className="text-patriot-red">Transport</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>
                American Lady Transport is a Willis, TX-based, licensed and bonded freight
                broker coordinating shipments throughout the United States and Canada. We focus
                on construction machinery, construction materials, HVAC duct, sand blasters,
                oilfield equipment, and other industrial freight.
              </p>
              <p>
                With over 40 years in the industry as a Texas-based freight brokerage, we
                understand the heartbeat of American logistics. Every load matters, every
                deadline counts, and every relationship is built on trust.
              </p>
            </div>

            {/* Feature List */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-patriot-red mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="default" size="lg" asChild>
                <Link to="/about" className="group">
                  Learn More About Us
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-primary rounded-2xl p-12 text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-8">
                <img
                  src={logoBadge}
                  alt="American Lady Transport freight brokerage logo - Willis Texas"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-4">
                American Lady Transport
              </h3>
              <p className="text-primary-foreground/70 mb-2">Willis, Texas</p>
              <p className="text-primary-foreground/50 text-sm mb-6">MC170463</p>
              <div className="flex justify-center gap-2">
                <div className="w-16 h-1 bg-patriot-red rounded"></div>
                <div className="w-4 h-1 bg-cream/30 rounded"></div>
                <div className="w-4 h-1 bg-cream/30 rounded"></div>
              </div>
              <blockquote className="mt-8 text-primary-foreground/80 italic">
                "Moving freight with integrity, one load at a time."
              </blockquote>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-patriot-red/20 rounded-2xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-4 border-primary/20 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
