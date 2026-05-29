import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import CrossBorderPage from "./pages/CrossBorderPage";
import ShippersPage from "./pages/ShippersPage";
import CarriersPage from "./pages/CarriersPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import FuelSurchargePage from "./pages/FuelSurchargePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/*
        basename normalizes Vite's BASE_URL so the same code works whether the site
        is served at root (pplx.app, americanladytrans.com — base is "./" or "/")
        or under a subpath like /american-lady-transport-web/ (GitHub Pages).
      */}
      <BrowserRouter basename={(() => {
        const raw = import.meta.env.BASE_URL;
        if (!raw || raw === "./" || raw === "/") return "/";
        return raw.replace(/\/$/, "");
      })()}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/us-canada-cross-border-freight" element={<CrossBorderPage />} />
          <Route path="/shippers" element={<ShippersPage />} />
          <Route path="/carriers" element={<CarriersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/fuel-surcharge" element={<FuelSurchargePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
