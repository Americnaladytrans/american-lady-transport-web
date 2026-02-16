import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const bullets = [
  "Northbound and southbound coverage between major U.S. and Canadian markets",
  "Support with documentation details and coordination alongside your customs brokerage partners",
  "Options for both full truckload and LTL palletized freight",
  "Routing designed to minimize border wait times and service interruptions",
];

const CrossBorderPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              Cross-Border Freight
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Cross-Border Shipping Between the{" "}
              <span className="text-patriot-red">U.S. and Canada</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              American Lady Transportation arranges cross-border truckload and LTL freight between
              the U.S. and Canada, coordinating with your customs broker to keep freight moving
              smoothly and reduce delays at the border.
            </p>
          </div>
        </section>

        {/* Details */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <Globe className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                  Shipping freight from the U.S. to Canada — and back
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  As a Canada cross-border freight broker, we handle the logistics so you can focus
                  on your business. Our team coordinates documentation and works alongside your
                  customs brokerage partners to keep your freight on schedule.
                </p>
                <div className="space-y-4">
                  {bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-patriot-red mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary rounded-2xl p-10 text-center">
                <h3 className="font-serif text-2xl font-bold text-primary-foreground mb-4">
                  U.S.–Canada Coverage
                </h3>
                <p className="text-primary-foreground/70 mb-8">
                  Full truckload and LTL freight between major markets in both countries with
                  routing optimized for minimal border delays.
                </p>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/shippers" className="group">
                    Get a Cross-Border Quote
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CrossBorderPage;
