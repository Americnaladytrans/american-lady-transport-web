import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img src={logo} alt="American Lady Transport LLC - freight brokerage and 3PL logistics Willis Texas" className="h-16 w-auto" />
              <div>
                <h3 className="font-serif text-xl font-bold">
                  American Lady Transportation
                </h3>
                <p className="text-sm text-primary-foreground/70">Freight Brokerage</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 max-w-md leading-relaxed mb-6">
              Freight brokerage and 3PL logistics services across the United States and Canada.
              Willis, TX-based, licensed and bonded freight broker — MC170463.
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
                { href: "/services", label: "Services" },
                { href: "/us-canada-cross-border-freight", label: "Cross-Border Freight" },
                { href: "/shippers", label: "For Shippers" },
                { href: "/carriers", label: "For Carriers" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
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
                <a
                  href="tel:+18172492990"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  (817) 249-2990
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-patriot-red mt-0.5" />
                <a
                  href="mailto:info@usealt.com"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  info@usealt.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} American Lady Transportation. All rights reserved. MC170463.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
