import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  company: z.string().max(100, "Company must be less than 100 characters").optional(),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().max(20, "Phone must be less than 20 characters").optional(),
  message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const contactInfo = [
  {
    icon: MapPin,
    label: "Location",
    value: "Willis, Texas",
    subtext: "Serving the U.S. & Canada",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(817) 249-2990",
    subtext: "Call or text anytime",
    href: "tel:+18172492990",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@usealt.com",
    subtext: "We respond within 24 hours",
    href: "mailto:info@usealt.com",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "7 Days a Week",
    subtext: "Always here when you need us",
  },
];

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
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
      const fullMessage = formData.company
        ? `Company: ${formData.company}\n\n${formData.message}`
        : formData.message;

      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "",
          message: fullMessage,
          _honeypot: honeypot,
        },
      });
      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting American Lady Transportation. We'll be in touch soon.",
      });
      setFormData({ name: "", company: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contact American Lady Transport | Freight Broker Willis, TX"
        description="Contact American Lady Transport for freight quotes, carrier partnerships, or logistics inquiries. Call (817) 249-2990 or send a message. Willis, TX freight broker serving the U.S. and Canada."
        canonicalPath="/contact"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-40 pb-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <span className="text-patriot-red font-semibold text-sm tracking-wider uppercase">
              Contact Our Freight Brokerage
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mt-4 mb-6">
              Contact American Lady{" "}
              <span className="text-patriot-red">Transportation</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-3xl mx-auto">
              Freight broker in Willis, TX — serving shippers and carriers across the U.S. and Canada.
              Reach out today for a free freight quote or to discuss your logistics needs.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Form */}
              <div className="bg-card rounded-2xl p-8 shadow-elegant border border-border">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot - hidden from real users */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website_url">Website</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                      <Input
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Smith"
                        className="h-12"
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                      <Input
                        maxLength={100}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <Input
                        type="email"
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="h-12"
                      />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                      <Input
                        maxLength={20}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea
                      maxLength={2000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your freight needs..."
                      className="min-h-[150px] resize-none"
                    />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <h2 className="font-serif text-2xl font-bold text-foreground">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Whether you're a shipper looking for reliable freight solutions or a carrier
                  interested in partnership opportunities, we'd love to hear from you. As a trusted
                  logistics company near Willis, TX, we're here 7 days a week.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="bg-card rounded-xl p-6 border border-border">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                      {info.href ? (
                        <a href={info.href} className="font-semibold text-foreground hover:text-patriot-red transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-semibold text-foreground">{info.value}</div>
                      )}
                      <div className="text-sm text-muted-foreground mt-1">{info.subtext}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary rounded-xl p-8 text-center">
                  <MapPin className="w-12 h-12 text-patriot-red mx-auto mb-4" />
                  <h4 className="font-serif text-xl font-bold text-primary-foreground mb-2">Willis, Texas</h4>
                  <p className="text-primary-foreground/70">
                    Proudly serving shippers and carriers across the United States and Canada from the
                    Houston metro area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
