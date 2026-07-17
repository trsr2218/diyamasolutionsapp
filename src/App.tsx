import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import Apps from "./pages/Apps";
import Partners from "./pages/Partners";
import DiyamaAI from "./pages/DiyamaAI";
import BusinessFit from "./pages/BusinessFit";
import Consultations from "./pages/Consultations";
import Learn from "./pages/Learn";
import Article from "./pages/Article";
import Affiliate from "./pages/Affiliate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/services" element={<Services />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/ai" element={<DiyamaAI />} />
        <Route path="/business-fit" element={<BusinessFit />} />
        <Route path="/consultations" element={<Consultations />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:slug" element={<Article />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
