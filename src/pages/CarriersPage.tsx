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
  "Consistent freight across the U.S. and on cross-border lanes to and from Canada",
  "Regular opportunities hauling construction machinery, construction materials, HVAC duct, sand blasters, and oilfield loads",
  "Quick setup and streamlined digital onboarding",
  "Clear rate confirmations and fast access to dispatch support",
  "Opportunities for both one-off loads and regular lanes",
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const message = `
CARRIER SIGNUP REQUEST
----------------------
Company: ${formData.companyName}
MC/DOT: ${formData.mcDotNumber}
Equipment: ${formData.equipmentType}
Preferred Lanes: ${formData.preferredLanes}
Insurance: ${formData.insuranceDetails}
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
        title: "Carrier Application Sent!",
        description: "Our team will review your information and reach out soon.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        companyName: "",
        mcDotNumber: "",
        equipmentType: "",
        preferredLanes: "",
        insuranceDetails: "",
      });
    } catch (error: any) {
      console.error("Error sending carrier signup:", error);
      toast({
        title: "Error",
        description: "Failed to send application. Please try again or call us directly.",
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
              For Carriers
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Freight Opportunities for{" "}
              <span className="text-patriot-red">Carriers & Owner-Operators</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              We partner with professional carriers and owner-operators, offering quality freight,
              clear communication, and on-time payment terms.
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
                  Why Partner with American Lady
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
                  Whether you're a flatbed carrier, truckload carrier, or owner-operator looking
                  for consistent freight — our carrier onboarding is quick and straightforward.
                </p>
              </div>

              {/* Carrier Form */}
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Sign Up as a Carrier
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Contact Name *
                      </label>
                      <Input
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jane Doe"
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
                      placeholder="dispatch@carrier.com"
                      className="h-12"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Name *
                      </label>
                      <Input
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        placeholder="ABC Trucking LLC"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        MC/DOT Number *
                      </label>
                      <Input
                        required
                        value={formData.mcDotNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, mcDotNumber: e.target.value })
                        }
                        placeholder="MC-123456"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Equipment Type
                    </label>
                    <Input
                      value={formData.equipmentType}
                      onChange={(e) =>
                        setFormData({ ...formData, equipmentType: e.target.value })
                      }
                      placeholder="Van, flatbed, step-deck, RGN, etc."
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Lanes & Regions
                    </label>
                    <Input
                      value={formData.preferredLanes}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredLanes: e.target.value })
                      }
                      placeholder="TX to Midwest, Southeast, cross-border, etc."
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Insurance Details
                    </label>
                    <Textarea
                      maxLength={1000}
                      value={formData.insuranceDetails}
                      onChange={(e) =>
                        setFormData({ ...formData, insuranceDetails: e.target.value })
                      }
                      placeholder="Insurance provider, policy number, coverage amounts..."
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
                        Submit Carrier Application
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

export default CarriersPage;
