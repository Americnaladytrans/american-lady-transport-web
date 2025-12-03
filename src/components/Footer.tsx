import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-patriot-red flex items-center justify-center">
                <span className="text-accent-foreground font-serif font-bold text-xl">AL</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">American Lady Transport</h3>
                <p className="text-sm text-primary-foreground/70">Freight Brokerage</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed mb-6">
              Connecting shippers with reliable carriers across America. 
              Based in Willis, Texas, we deliver honest, dependable freight brokerage services.
            </p>
            <div className="flex gap-4">
              <a
                href="tel:+18172492990"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-patriot-red transition-colors"
                aria-label="Call us"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@usealt.com"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-patriot-red transition-colors"
                aria-label="Email us"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "#services", label: "Services" },
                { href: "#about", label: "About Us" },
                { href: "#why-us", label: "Why Choose Us" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-patriot-red mt-0.5" />
                <span className="text-primary-foreground/70">Willis, Texas</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-patriot-red mt-0.5" />
                <a href="tel:+18172492990" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  (817) 249-2990
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-patriot-red mt-0.5" />
                <a href="mailto:info@usealt.com" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors break-all">
                  info@usealt.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} American Lady Transport. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/60">
            MC# XXXXXX | USDOT# XXXXXXX
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
