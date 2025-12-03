import { Truck, Package, Shield, Clock, MapPinned, FileCheck } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Full Truckload (FTL)",
    description: "Dedicated trucks for your full shipments. Direct delivery with no stops, maximizing speed and security.",
  },
  {
    icon: Package,
    title: "Less Than Truckload (LTL)",
    description: "Cost-effective shipping for smaller loads. Share truck space without sacrificing service quality.",
  },
  {
    icon: Shield,
    title: "Secure Transport",
    description: "Vetted carriers with comprehensive insurance. Your freight is protected every mile of the journey.",
  },
  {
    icon: Clock,
    title: "Expedited Shipping",
    description: "Time-sensitive deliveries handled with urgency. When it has to be there fast, we deliver.",
  },
  {
    icon: MapPinned,
    title: "Nationwide Coverage",
    description: "From Texas to all 48 contiguous states. Our carrier network spans the entire country.",
  },
  {
    icon: FileCheck,
    title: "Freight Management",
    description: "End-to-end logistics coordination. Real-time tracking and transparent communication.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            Comprehensive Freight Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From full truckloads to expedited shipping, we connect you with the right carriers 
            to move your freight efficiently and affordably.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
