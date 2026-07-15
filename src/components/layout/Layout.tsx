import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingCTA from "../FloatingCTA";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col font-body relative">
      {/* Global ambient glow — very subtle, always present */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% 0%, hsl(var(--primary)/0.04) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 40% at 90% 100%, hsl(var(--accent)/0.03) 0%, transparent 50%)",
        }}
      />
      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Layout;
