import { Suspense, type ComponentType } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import {
  Services, Pricing, Clients, Apps, Partners, DiyamaAI, BusinessFit, Consultations,
  Learn, Article, Affiliate, About, Contact, Privacy, Terms,
} from "./pages/lazyPages";

const queryClient = new QueryClient();

// Holds the page height while a page's code downloads, so the footer does not jump up.
const lazyPage = (Page: ComponentType) => (
  <Suspense fallback={<div className="min-h-screen" />}>
    <Page />
  </Suspense>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/services" element={lazyPage(Services)} />
        <Route path="/pricing" element={lazyPage(Pricing)} />
        <Route path="/clients" element={lazyPage(Clients)} />
        <Route path="/apps" element={lazyPage(Apps)} />
        <Route path="/partners" element={lazyPage(Partners)} />
        <Route path="/ai" element={lazyPage(DiyamaAI)} />
        <Route path="/business-fit" element={lazyPage(BusinessFit)} />
        <Route path="/consultations" element={lazyPage(Consultations)} />
        <Route path="/learn" element={lazyPage(Learn)} />
        <Route path="/learn/:slug" element={lazyPage(Article)} />
        <Route path="/affiliate" element={lazyPage(Affiliate)} />
        <Route path="/about" element={lazyPage(About)} />
        <Route path="/contact" element={lazyPage(Contact)} />
        <Route path="/privacy" element={lazyPage(Privacy)} />
        <Route path="/terms" element={lazyPage(Terms)} />
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
