import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
