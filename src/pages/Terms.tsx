import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const Terms = () => {
  return (
    <div className="section-padding">
      <Seo {...pageSeo["/terms"]} path="/terms" />
      <div className="container-narrow mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Acceptance of Terms</h2>
          <p>By accessing and using the Diyama Solutions platform, you agree to these terms. If you do not agree, please do not use our services.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Services</h2>
          <p>Diyama Solutions provides business consulting, digital marketing, growth strategy, and related services. Service details, deliverables, and pricing are agreed upon before engagement begins.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">AI Assistant</h2>
          <p>The Diyama AI assistant provides general business guidance. It is not a substitute for professional legal, financial, or medical advice. Use AI-generated recommendations at your own discretion.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Reviews & Content</h2>
          <p>By submitting a review, you grant Diyama Solutions permission to display it publicly (if you opted in). We reserve the right to moderate content for quality and appropriateness.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Affiliate Program</h2>
          <p>Affiliate commissions are paid after the referred client completes their first payment. Fraudulent referrals will result in program removal and forfeiture of commissions.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
          <p>For questions about these terms, contact us at getitdonerapid@gmail.com.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
