import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const bullets = [
  "Single point of contact for all your lanes across the U.S. and into Canada",
  "Real-time updates and proactive communication on every active load",
  "Flexible capacity for both spot shipments and ongoing commitments",
  "Access to a broad carrier network for construction machinery, construction materials, HVAC duct, sand blasters, and oilfield freight",
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        },
      });
      if (error) throw error;

      toast({
        title: "Quote Request Sent!",
        description: "We'll review your freight details and get back to you shortly.",
      });
      setFormData({
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
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              For Shippers
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Freight Solutions for <span className="text-patriot-red">Shippers</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              As a licensed freight broker, American Lady Transportation matches your freight
              profile with dependable carriers, negotiates competitive rates, and manages every
              step from pickup to proof of delivery so you can focus on your business.
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
                  Why Ship with American Lady
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
                  Whether you're a freight broker for construction materials, need HVAC duct
                  shipping, or are looking for an oilfield equipment freight partner — we've got
                  the capacity and the expertise.
                </p>
              </div>

              {/* Quote Form */}
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Request a Freight Quote
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <Input
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone *
                      </label>
                      <Input
                        required
                        maxLength={20}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      maxLength={255}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@company.com"
                      className="h-12"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Pickup City/State/ZIP *
                      </label>
                      <Input
                        required
                        value={formData.pickupLocation}
                        onChange={(e) =>
                          setFormData({ ...formData, pickupLocation: e.target.value })
                        }
                        placeholder="Houston, TX 77001"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Delivery City/State/ZIP *
                      </label>
                      <Input
                        required
                        value={formData.deliveryLocation}
                        onChange={(e) =>
                          setFormData({ ...formData, deliveryLocation: e.target.value })
                        }
                        placeholder="Toronto, ON M5V"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Freight Type & Weight
                      </label>
                      <Input
                        value={formData.freightType}
                        onChange={(e) => setFormData({ ...formData, freightType: e.target.value })}
                        placeholder="Construction machinery, 45,000 lbs"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Equipment Needed
                      </label>
                      <Input
                        value={formData.equipmentNeeded}
                        onChange={(e) =>
                          setFormData({ ...formData, equipmentNeeded: e.target.value })
                        }
                        placeholder="Flatbed, step-deck, etc."
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ready Date
                    </label>
                    <Input
                      type="date"
                      value={formData.readyDate}
                      onChange={(e) => setFormData({ ...formData, readyDate: e.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Special Requirements
                    </label>
                    <Textarea
                      maxLength={1000}
                      value={formData.specialRequirements}
                      onChange={(e) =>
                        setFormData({ ...formData, specialRequirements: e.target.value })
                      }
                      placeholder="Jobsite delivery, crane needed, limited access, etc."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
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
