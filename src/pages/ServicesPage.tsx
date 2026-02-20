import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Truck, Package, Layers, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Truck,
    title: "Full Truckload (FTL) Freight",
    description:
      "We provide dry van and flatbed capacity across all 48 states and into Canada, matching your freight with reliable carriers for consistent coverage and competitive rates. Ideal for construction materials, palletized product, and industrial freight.",
  },
  {
    icon: Package,
    title: "Less-Than-Truckload (LTL) Shipping",
    description:
      "Flexible LTL freight options for palletized shipments with dependable transit times, appointment coordination, and clear communication from pickup to delivery. Affordable freight solutions for small businesses and large enterprises alike.",
  },
  {
    icon: Layers,
    title: "Flatbed & Heavy Haul Freight",
    description:
      "Specialized flatbed and open-deck solutions for construction materials, construction machinery, sand blasters, HVAC duct, and oilfield equipment, with careful attention to securement, routing, and site requirements.",
  },
  {
    icon: Zap,
    title: "Expedited & Hotshot Trucking",
    description:
      "Time-critical expedited freight solutions for urgent shipments, with fast response, priority scheduling, and proactive updates from dispatch to delivery. Perfect for last-minute construction or oilfield loads that must move now.",
  },
];

const benefits = [
  "Nationwide freight coverage across the U.S. with cross-border service to and from Canada",
  "Single point of contact from quote to proof of delivery",
  "Competitive pricing backed by a network of vetted carriers",
  "Flexible options for both spot and recurring freight",
  "40+ years of freight brokerage experience across all 48 states",
  "Specialized capacity for construction, oilfield, and industrial freight",
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Freight Brokerage Services | FTL, LTL, Flatbed & Expedited | American Lady Transport"
        description="Full truckload, LTL, flatbed, heavy haul, and expedited freight brokerage services. Nationwide coverage across 48 states and Canada. Construction materials, oilfield equipment & industrial freight specialists."
        canonicalPath="/services"
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Freight Brokerage",
          "provider": {
            "@type": "LocalBusiness",
            "name": "American Lady Transport"
          },
          "areaServed": "United States, Canada",
          "description": "Full truckload (FTL), less-than-truckload (LTL), flatbed & heavy haul, and expedited freight brokerage services across the U.S. and Canada."
        }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              Freight Brokerage Services
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Freight Brokerage Services:{" "}
              <span className="text-patriot-red">FTL, LTL, Flatbed & Expedited</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              As a trusted 3PL logistics provider in Willis, TX, we connect shippers with vetted carriers
              for construction machinery freight, construction materials shipping, oilfield freight brokerage,
              and more — across all 48 states and Canada.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Our Logistics Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
          </div>
        </section>

        {/* Key Benefits */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Why Choose Our Freight Brokerage
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-patriot-red mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="hero" size="xl" asChild>
                <Link to="/shippers" className="group">
                  Request a Freight Quote
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
