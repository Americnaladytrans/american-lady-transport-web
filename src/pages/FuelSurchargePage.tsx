import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FuelSurchargeBanner } from "@/components/FuelSurchargeBanner";

const FuelSurchargePage = () => (
  <div className="min-h-screen flex flex-col">
    <SEOHead
      title="Fuel Surcharge Calculator | American Lady Transport"
      description="Calculate fuel surcharge percentages and per-mile costs using DOE/EIA on-highway diesel benchmarks. Free fuel surcharge lookup tool for freight and trucking."
      canonicalPath="/fuel-surcharge"
    />
    <Header />
    <main className="flex-1 pt-44 pb-16 flex items-center justify-center bg-muted">
      <div className="container mx-auto px-4">
        <FuelSurchargeBanner />
      </div>
    </main>
    <Footer />
  </div>
);

export default FuelSurchargePage;
