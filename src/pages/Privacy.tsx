const Privacy = () => {
  return (
    <div className="section-padding">
      <div className="container-narrow mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide directly, including your name, email, phone number, and any details submitted through our forms (consultation requests, reviews, affiliate signups, and AI conversations).</p>
          <h2 className="font-display text-xl font-semibold text-foreground">How We Use Your Information</h2>
          <p>We use your information to provide our services, respond to inquiries, improve our platform, and communicate with you about relevant updates. We do not sell your personal data.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">AI Conversations</h2>
          <p>Conversations with Diyama AI are stored temporarily (up to 24 hours) and then automatically deleted. We do not use conversation data for training purposes.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Data Security</h2>
          <p>We implement industry-standard security measures to protect your information. Data is stored securely and access is restricted to authorized personnel only.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
          <p>For privacy-related questions, contact us at getitdonerapid@gmail.com or call 0966138238.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
