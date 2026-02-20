import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  pickupLocation: z.string().trim().min(1, "Pickup location is required"),
  deliveryLocation: z.string().trim().min(1, "Delivery location is required"),
  freightType: z.string().max(200).optional(),
  equipmentNeeded: z.string().max(200).optional(),
  readyDate: z.string().optional(),
  specialRequirements: z.string().max(1000).optional(),
});

const bullets = [
  "Single point of contact for all your freight lanes across the U.S. and into Canada",
  "Real-time updates and proactive communication on every active load",
  "Flexible capacity for both spot shipments and ongoing commitments",
  "Access to a broad carrier network for construction machinery, construction materials, HVAC duct, sand blasters, and oilfield freight",
  "Affordable freight solutions for small businesses and enterprise shippers",
  "Competitive truck shipping rates with transparent pricing",
];

const ShippersPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupLocation: "",
    deliveryLocation: "",
    freightType: "",
    equipmentNeeded: "",
    readyDate: "",
    specialRequirements: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = quoteSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const message = `
FREIGHT QUOTE REQUEST
---------------------
Pickup: ${formData.pickupLocation}
Delivery: ${formData.deliveryLocation}
Freight Type: ${formData.freightType}
Equipment Needed: ${formData.equipmentNeeded}
Ready Date: ${formData.readyDate}
Special Requirements: ${formData.specialRequirements}
      `.trim();

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message,
          _honeypot: honeypot,
        },
      });
      if (error) throw error;

      toast({
        title: "Quote Request Sent!",
        description: "We'll review your freight details and get back to you shortly.",
      });
      setFormData({
        name: "", email: "", phone: "", pickupLocation: "", deliveryLocation: "",
        freightType: "", equipmentNeeded: "", readyDate: "", specialRequirements: "",
      });
    } catch (error: any) {
      console.error("Error sending quote request:", error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Freight Solutions for Shippers | Get a Free Quote | American Lady Transport"
        description="Get competitive freight shipping rates from a trusted Texas freight broker. FTL, LTL, flatbed, and expedited freight quotes. Free estimates for construction, oilfield, and industrial shipments nationwide."
        canonicalPath="/shippers"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              Freight Shipping for Shippers
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Freight Solutions for <span className="text-patriot-red">Shippers</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              As a licensed freight broker and 3PL logistics provider, American Lady Transportation matches
              your freight profile with dependable carriers, negotiates competitive rates, and manages every
              step from pickup to proof of delivery — so you can focus on your business.
            </p>
          </div>
        </section>

        {/* Benefits + Form */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              {/* Benefits */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Why Ship with American Lady Transport
                </h2>
                <div className="space-y-5 mb-10">
                  {bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-patriot-red mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-lg">{bullet}</span>
                    </div>
                  ))
                  }
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Whether you need a freight broker for construction materials, HVAC duct
                  shipping, oilfield equipment freight, or any industrial load — we've got
                  the capacity, the expertise, and the nationwide freight shipping solutions
                  to get your freight delivered on time.
                </p>
              </div>

              {/* Quote Form */}
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Request a Free Freight Quote
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="hp_website">Website</label>
                    <input type="text" id="hp_website" name="hp_website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                      <Input maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Smith" className="h-12" />
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
                    <Input type="email" maxLength={255} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="john@company.com" className="h-12" />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Pickup City/State/ZIP *</label>
                      <Input value={formData.pickupLocation} onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })} placeholder="Houston, TX 77001" className="h-12" />
                      {errors.pickupLocation && <p className="text-destructive text-sm mt-1">{errors.pickupLocation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Delivery City/State/ZIP *</label>
                      <Input value={formData.deliveryLocation} onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })} placeholder="Toronto, ON M5V" className="h-12" />
                      {errors.deliveryLocation && <p className="text-destructive text-sm mt-1">{errors.deliveryLocation}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Freight Type & Weight</label>
                      <Input value={formData.freightType} onChange={(e) => setFormData({ ...formData, freightType: e.target.value })} placeholder="Construction machinery, 45,000 lbs" className="h-12" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Equipment Needed</label>
                      <Input value={formData.equipmentNeeded} onChange={(e) => setFormData({ ...formData, equipmentNeeded: e.target.value })} placeholder="Flatbed, step-deck, etc." className="h-12" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Ready Date</label>
                    <Input type="date" value={formData.readyDate} onChange={(e) => setFormData({ ...formData, readyDate: e.target.value })} className="h-12" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Special Requirements</label>
                    <Textarea maxLength={1000} value={formData.specialRequirements} onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })} placeholder="Jobsite delivery, crane needed, limited access, etc." className="min-h-[100px] resize-none" />
                  </div>
                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : (
                      <>
                        Submit Quote Request
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ShippersPage;
