import { useEffect, useState } from "react";
import { Menu, X, Phone, Sun, Moon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-optimized.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/us-canada-cross-border-freight", label: "Cross-Border" },
    { href: "/shippers", label: "Shippers" },
    { href: "/carriers", label: "Carriers" },
    { href: "/about", label: "About" },
    { href: "/fuel-surcharge", label: "Fuel Surcharge" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar with logo */}
      <div className="bg-primary border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-36 relative">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="American Lady Transport LLC" className="h-32 w-auto" />
            </Link>
            <div className="absolute right-0 flex flex-col items-end gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="grid h-[42px] w-[42px] place-items-center rounded-full border border-border bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                {isDark ? <Moon className="h-[18px] w-[18px]" strokeWidth={2} /> : <Sun className="h-[18px] w-[18px]" strokeWidth={2} />}
              </button>
              <button
                className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-primary-foreground/10 bg-primary text-primary-foreground transition-colors hover:bg-navy-light"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-primary py-4 border-b border-primary-foreground/10 animate-fade-in">
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
