import { Truck, Package, Layers, Zap, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Truck,
    title: "Full Truckload (FTL)",
    description:
      "Dry van and flatbed capacity across the U.S. and Canada for construction materials, palletized product, and industrial freight.",
  },
  {
    icon: Package,
    title: "Less-Than-Truckload (LTL)",
    description:
      "Cost-effective shipping for smaller palletized freight through carrier networks with competitive rates and reliable transit times.",
  },
  {
    icon: Layers,
    title: "Partial Truckload",
    description:
      "Ideal for shipments too large for LTL but not enough to fill a full trailer. Your freight stays on one truck — fewer touches, less damage risk, and faster delivery.",
  },
  {
    icon: Shield,
    title: "Heavy Haul & Oversized",
    description:
      "Specialized solutions for construction machinery, HVAC duct, sand blasters, and oilfield equipment requiring step-decks, double drops, or RGN trailers.",
  },
  {
    icon: Zap,
    title: "Expedited & Hotshot",
    description:
      "Time-critical freight with fast response and priority scheduling for urgent construction or oilfield loads.",
  },
];

const Services = () => {
  return (
    <section id="services" className="pt-20 pb-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Freight Services Across the U.S. and Canada
          </h2>
          <p className="text-muted-foreground text-lg">
            From full truckloads to expedited hotshot loads, we connect you with vetted carriers
            for reliable, on-time delivery.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl p-8 shadow-elegant hover:shadow-lg transition-all duration-300 border border-border hover:border-patriot-red/20"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-patriot-red/10 transition-colors">
                <service.icon className="w-7 h-7 text-primary group-hover:text-patriot-red transition-colors" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" asChild>
            <Link to="/services" className="group">
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
