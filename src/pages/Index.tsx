import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import WhyChooseUs from "@/components/WhyChooseUs";
import LatestPosts from "@/components/LatestPosts";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FuelSurchargeBanner } from "@/components/FuelSurchargeBanner";
import { TetrisLoadSpaceBanner } from "@/components/TetrisLoadSpaceBanner";
import { PartialRateProBanner } from "@/components/PartialRateProBanner";

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
          <div className="container mx-auto px-4">
            <h2 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Partner Apps
            </h2>
            <PartialRateProBanner />
            <TetrisLoadSpaceBanner />
            <FuelSurchargeBanner />
          </div>
        </section>
        <LatestPosts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
