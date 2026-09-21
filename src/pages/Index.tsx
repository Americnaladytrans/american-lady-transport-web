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
        title="Texas Freight Brokerage | American Lady Transport"
        description="Willis, TX freight brokerage for flatbed, step-deck, heavy haul, FTL and LTL shipping across the lower 48 and Canada. Request a freight quote."
        canonicalPath="/"
      />
      <Header />
      <main id="main-content" tabIndex={-1} className="pt-36">
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
