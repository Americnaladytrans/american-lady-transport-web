import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const carrierSchema = z.object({
  name: z.string().trim().min(1, "Contact name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  companyName: z.string().trim().min(1, "Company name is required").max(200),
  mcDotNumber: z.string().trim().min(1, "MC/DOT number is required").max(50),
  equipmentType: z.string().max(200).optional(),
  preferredLanes: z.string().max(500).optional(),
  insuranceDetails: z.string().max(1000).optional(),
});

const bullets = [
  "Consistent freight across the U.S. and on cross-border lanes to and from Canada",
  "Regular opportunities hauling construction machinery, construction materials, HVAC duct, sand blasters, and oilfield loads",
  "Quick setup and streamlined digital onboarding",
  "Clear rate confirmations and fast access to dispatch support",
  "Opportunities for both one-off loads and regular lanes",
  "Competitive trucking rates and on-time payment terms",
];

const CarriersPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    mcDotNumber: "",
    equipmentType: "",
    preferredLanes: "",
    insuranceDetails: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = carrierSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Ignore honeypot-filled submissions silently
    if (honeypot) return;

    setIsSubmitting(true);

    const message = `CARRIER SIGNUP REQUEST
----------------------
Company: ${formData.companyName}
MC/DOT: ${formData.mcDotNumber}
Equipment: ${formData.equipmentType}
Preferred Lanes: ${formData.preferredLanes}
Insurance: ${formData.insuranceDetails}`.trim();

    const subject = encodeURIComponent(`Carrier Onboarding - ${formData.companyName}`);
    const body = encodeURIComponent(
      `Contact Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${message}`
    );
    const mailtoUrl = `mailto:info@usealt.com?subject=${subject}&body=${body}`;

    toast({
      title: "Opening your email app...",
      description: "Your email client will open with the application pre-filled.",
    });
    window.location.href = mailtoUrl;
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Carrier & Owner-Operator Freight Opportunities | American Lady Transport"
        description="Join our carrier network for consistent freight opportunities. Flatbed, dry van, step-deck, and hotshot loads across the U.S. and Canada. Quick onboarding, competitive rates, and reliable payment."
        canonicalPath="/carriers"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              Carrier & Owner-Operator Freight
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Freight Opportunities for{" "}
              <span className="text-patriot-red">Carriers & Owner-Operators</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              We partner with professional trucking companies, carriers, and owner-operators, offering
              quality freight, clear communication, and on-time payment terms. Join our vetted carrier
              network for consistent loads nationwide.
            </p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Why Partner with American Lady Transport
              </h2>
              <div className="space-y-5 mb-10">
                {bullets.map((bullet, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-patriot-red mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-lg">{bullet}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Whether you're a flatbed carrier, dry van trucking company, or owner-operator looking
                for consistent freight — our carrier onboarding is quick and straightforward. We value
                reliable carriers and build long-term logistics partnerships.
              </p>
            </div>
          </div>
        </section>

        {/* Compliance Requirements */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
                Zero-Tolerance Policy
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                Carrier Approval & Compliance Requirements
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-10">
                To protect our shippers and maintain the integrity of our network, we enforce a strict
                zero-tolerance policy regarding carrier compliance and fraud. To onboard or book freight
                with us, carriers must meet the following baseline parameters:
              </p>

              <div className="space-y-5">
                {[
                  {
                    title: "Active Authority",
                    body: "Must hold active FMCSA interstate operating authority for a minimum of 6 consecutive months. \"Chameleon\" authorities or recently reinstated authorities will not be accepted.",
                  },
                  {
                    title: "Safety Rating",
                    body: "Must have an FMCSA safety rating of \"Satisfactory\" or \"None\" (unrated). Carriers with a \"Conditional\" or \"Unsatisfactory\" rating are strictly blocked.",
                  },
                  {
                    title: "Auto Liability",
                    body: "Minimum of $1,000,000 in commercial auto liability coverage.",
                  },
                  {
                    title: "Cargo Insurance",
                    body: "Minimum of $100,000 in motor truck cargo insurance. Policies must not contain exclusions for general freight commodities or unattended vehicles.",
                  },
                  {
                    title: "Onboarding Documents",
                    body: "A valid W-9 form (signed within the current calendar year) and a fully executed Broker-Carrier Agreement must be on file.",
                  },
                  {
                    title: "Certificate of Insurance (COI)",
                    body: "Your insurance agent must issue a COI naming our brokerage as an additional insured and certificate holder. We do not accept carrier-submitted PDF certificates.",
                  },
                  {
                    title: "Domestic Operations",
                    body: "All dispatching, tracking, and operational communications must be US-based. We do not work with offshore dispatch agencies or foreign call centers.",
                  },
                  {
                    title: "No Double-Brokering",
                    body: "The carrier that books the load must physically haul the load using their own scheduled equipment and drivers. Re-brokering, trip-leasing, or co-brokering our freight will result in immediate termination, forfeiture of payment, and reporting to Fraud Prevention databases.",
                  },
                  {
                    title: "Active Inspection History",
                    body: "For hotshot and box truck operations, carriers must have at least one roadside inspection recorded in the FMCSA SMS system within the last 12 months to verify active, legitimate operations.",
                  },
                  {
                    title: "Industry Report Cleared",
                    body: "Carriers must have a clean industry record. You will be permanently blocked from onboarding or deactivated from our network if you have any active reports or flags on Carrier411 (FreightGuard), MyCarrierPackets (MCP), CarrierAssure, or the TIA Watchdog.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-patriot-red mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-l-4 border-patriot-red bg-card rounded-r-xl p-6 shadow-sm">
                <p className="text-foreground font-semibold leading-relaxed">
                  Failure to maintain any of these standards at any point will result in immediate
                  removal from the load, deactivation from active use, and permanent blocking from our
                  network.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Carrier Form */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 shadow-elegant border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Sign Up as a Carrier
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="hp_url">Website</label>
                  <input type="text" id="hp_url" name="hp_url" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contact Name *</label>
                    <Input maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Jane Doe" className="h-12" />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                    <Input maxLength={20} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="(555) 123-4567" className="h-12" />
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <Input type="email" maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="dispatch@carrier.com" className="h-12" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Company Name *</label>
                    <Input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="ABC Trucking LLC" className="h-12" />
                    {errors.companyName && <p className="text-destructive text-sm mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">MC/DOT Number *</label>
                    <Input value={formData.mcDotNumber} onChange={(e) => setFormData({ ...formData, mcDotNumber: e.target.value })} placeholder="MC-123456" className="h-12" />
                    {errors.mcDotNumber && <p className="text-destructive text-sm mt-1">{errors.mcDotNumber}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Equipment Type</label>
                  <Input value={formData.equipmentType} onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })} placeholder="Van, flatbed, step-deck, RGN, etc." className="h-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Preferred Lanes & Regions</label>
                  <Input value={formData.preferredLanes} onChange={(e) => setFormData({ ...formData, preferredLanes: e.target.value })} placeholder="TX to Midwest, Southeast, cross-border, etc." className="h-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Insurance Details</label>
                  <Textarea maxLength={1000} value={formData.insuranceDetails} onChange={(e) => setFormData({ ...formData, insuranceDetails: e.target.value })} placeholder="Insurance provider, policy number, coverage amounts..." className="min-h-[100px] resize-none" />
                </div>
                <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Opening..." : (
                    <>
                      Submit Carrier Application
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default CarriersPage;
