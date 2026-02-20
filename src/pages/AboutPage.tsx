import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CheckCircle } from "lucide-react";
import logoBadge from "@/assets/logo-badge.png";

const trustPoints = [
  "Licensed freight broker operating under federal regulations (MC 170463)",
  "Vetted carrier network with safety and compliance standards",
  "24/7 communication on active loads",
  "On-time performance and service reliability as our primary KPIs",
  "Trusted freight brokerage — a proven partner in the logistics industry",
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="About American Lady Transport | Freight Broker | Willis, TX"
        description="American Lady Transport is a licensed and bonded freight brokerage based in Willis, TX with 40+ years in the logistics industry. Trusted 3PL partner for shippers and carriers across the U.S. and Canada."
        canonicalPath="/about"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              About Our Freight Brokerage
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              About American Lady{" "}
              <span className="text-patriot-red">Transportation</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              Willis, TX-based freight brokerage and 3PL logistics company. Licensed, bonded, and serving shippers across North America since 1984.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our <span className="text-patriot-red">Story</span>
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>
                    American Lady Transportation is a Willis, TX-based, licensed and bonded freight
                    broker coordinating shipments throughout the United States and Canada. As a leading
                    3PL logistics provider, we focus on construction machinery, construction materials,
                    HVAC duct, sand blasters, oilfield equipment, and other industrial freight that
                    demands reliable capacity and experienced handling.
                  </p>
                  <p>
                    American Lady started in Ft Worth, Texas, in 1984 and relocated to Willis,
                    Texas, in 2024. Our mission remains simple:
                    provide honest, reliable logistics services that shippers, receivers, and carriers
                    can count on.
                  </p>
                  <p>
                    With over 40 years as a Texas-based freight brokerage, we understand the heartbeat
                    of American logistics. Every load matters, every deadline counts, and every
                    relationship is built on trust. That's what makes us one of the best freight brokers
                    for small business and enterprise shippers alike.
                  </p>
                </div>

                {/* Trust Points */}
                <div className="mt-10 space-y-4">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                    Why Trust Our Logistics Company
                  </h3>
                  {trustPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-patriot-red mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
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
                    American Lady Transportation
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
                <div className="absolute -top-4 -right-4 w-24 h-24 border-4 border-patriot-red/20 rounded-2xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-4 border-primary/20 rounded-2xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
