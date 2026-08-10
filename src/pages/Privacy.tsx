import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const Privacy = () => {
  return (
    <div className="section-padding">
      <Seo {...pageSeo["/privacy"]} path="/privacy" />
      <div className="container-narrow mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          {/* A fixed date, not new Date(). A policy that always claims to have been
              updated today tells a reader nothing and looks careless to a Play reviewer. */}
          <p>Last updated: 10 August 2026</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide directly, including your name, email, phone number, and any details submitted through our forms (consultation requests, reviews, affiliate signups, and AI conversations).</p>
          <h2 className="font-display text-xl font-semibold text-foreground">How We Use Your Information</h2>
          <p>We use your information to provide our services, respond to inquiries, improve our platform, and communicate with you about relevant updates. We do not sell your personal data.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">AI Conversations</h2>
          <p>Conversations with Diyama AI are stored temporarily (up to 24 hours) and then automatically deleted. We do not use conversation data for training purposes.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Data Security</h2>
          <p>We implement industry-standard security measures to protect your information. Data is stored securely and access is restricted to authorized personnel only.</p>
          {/* Google Play requires a privacy policy URL that covers the app itself, and
              the Data Safety declaration in Play Console must match what this says.
              Diyama Ops keeps everything on the device, so the honest answer is "none". */}
          <h2 className="font-display text-xl font-semibold text-foreground">Diyama Ops, our Android app</h2>
          <p>Diyama Ops (package name com.diyama.os) is the internal operations app published by Diyama Solutions Ltd on Google Play. This section is the privacy policy for that app.</p>
          <p><strong className="text-foreground">We collect nothing.</strong> Diyama Ops has no account, no sign in, and no server of its own. Everything you type into it, your tasks, goals, notes, client records, time boxes and daily logs, is written to storage on your own device and stays there. None of it is transmitted to Diyama Solutions or to anyone else.</p>
          <p><strong className="text-foreground">No analytics, no advertising, no tracking.</strong> The app contains no analytics SDK, no advertising SDK and no third party tracker. It does not collect a device identifier or an advertising ID.</p>
          <p><strong className="text-foreground">Permissions and why they exist.</strong> Notifications, so the app can remind you about a task, tell you a time box has finished, or tell you a break is over. Exact alarms, so those reminders arrive at the minute you set rather than whenever the system feels like it. Restart notification and wake lock, so a reminder you set survives a reboot and can still wake the screen. Internet access, which the app framework declares by default and which the app uses only to load its own bundled content. The app asks for no location, no camera, no contacts and no files.</p>
          <p><strong className="text-foreground">Calendar access, if you allow it.</strong> Diyama Ops can ask for permission to read and write your device calendar. This is optional and the app works fully without it. If you allow it, the app writes the events you create in Diyama Ops into your device calendar so they appear in your normal calendar app, and it reads the current day's events back so you can see your whole day in one place. Calendar data is read on the device and displayed on the device. It is never transmitted to Diyama Solutions or to any third party, and it is never stored anywhere but your own phone. You can withdraw the permission at any time in Android Settings, and events the app already wrote to your calendar remain yours to keep or delete like any other calendar entry.</p>
          <p><strong className="text-foreground">Deleting your data.</strong> Because the data never leaves the device, uninstalling the app, or clearing its storage in Android Settings, deletes all of it permanently. There is no copy for us to delete on your behalf.</p>
          <p><strong className="text-foreground">Children.</strong> Diyama Ops is a business tool. It is not directed at children under 13 and we do not knowingly collect data from anyone.</p>
          <h2 className="font-display text-xl font-semibold text-foreground">Contact</h2>
          <p>For privacy-related questions about this website or about Diyama Ops, contact us at getitdonerapid@gmail.com or call 0966138238.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
