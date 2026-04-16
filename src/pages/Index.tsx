import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import LatestPosts from "@/components/LatestPosts";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight, Fuel } from "lucide-react";
const Index = () => {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="American Lady Transport | Freight Brokerage & 3PL Logistics | Willis, TX"
        description="Trusted Texas freight brokerage and 3PL logistics company with 40+ years experience. FTL, LTL, flatbed, heavy haul & expedited shipping across all 48 states and Canada. Get a free freight quote."
        canonicalPath="/"
      />
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <WhyChooseUs />
        <section className="py-10 bg-background">
          <div className="container mx-auto px-4 text-center">
            <Link
              to="/fuel-surcharge"
              className="inline-flex items-center gap-2 bg-success text-success-foreground px-8 py-4 rounded-md font-bold text-lg hover:bg-success/90 transition-colors shadow-md"
            >
              <Fuel className="w-5 h-5" /> Fuel Surcharge Calculator <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
        <LatestPosts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
