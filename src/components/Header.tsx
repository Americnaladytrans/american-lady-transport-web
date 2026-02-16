import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/us-canada-cross-border-freight", label: "Cross-Border" },
    { href: "/shippers", label: "Shippers" },
    { href: "/carriers", label: "Carriers" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar with logo */}
      <div className="bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-24 relative">
            {/* Logo - Centered */}
            <Link to="/" className="flex items-center">
              <img src={logo} alt="American Lady Transport LLC" className="h-20 w-auto" />
            </Link>

            {/* Mobile Menu Button - Right */}
            <button
              className="lg:hidden text-primary-foreground p-2 absolute right-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar - Below logo */}
      <nav className="hidden lg:block bg-navy-dark/95 backdrop-blur-md border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 h-11">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                  location.pathname === link.href
                    ? "text-patriot-red"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary/95 backdrop-blur-md py-4 border-b border-primary-foreground/10 animate-fade-in">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`font-medium py-2 transition-colors ${
                    location.pathname === link.href
                      ? "text-patriot-red"
                      : "text-primary-foreground/80 hover:text-primary-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+18172492990"
                className="flex items-center gap-2 text-primary-foreground/80 py-2"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">(817) 249-2990</span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
