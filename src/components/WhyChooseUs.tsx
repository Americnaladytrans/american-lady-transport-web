import { Star, Handshake, TrendingUp, HeadphonesIcon } from "lucide-react";

const reasons = [
  {
    icon: Handshake,
    title: "Personal Touch",
    description: "You're not just a number. We take the time to understand your needs and deliver solutions that work for you.",
  },
  {
    icon: Star,
    title: "Vetted Carriers",
    description: "Every carrier in our network is thoroughly screened for safety, reliability, and professionalism.",
  },
  {
    icon: TrendingUp,
    title: "Competitive Rates",
    description: "Our industry relationships and efficient operations mean better rates passed on to you.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Questions at midnight? We're here. Real people, real answers, whenever you need them.",
  },
];

const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
            Why Choose Us
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
            The American Lady <span className="text-patriot-red">Difference</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            In a world of automated systems and distant call centers, we offer something different—
            genuine partnership and accountability.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex gap-6 p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <reason.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Experience the Difference?
          </h3>
          <p className="text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
            Let us show you what true freight brokerage partnership looks like. 
            Get your free quote today.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-patriot-red text-accent-foreground px-8 py-4 rounded-md font-semibold text-lg hover:bg-patriot-red-light transition-colors shadow-lg"
          >
            Get Your Free Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
