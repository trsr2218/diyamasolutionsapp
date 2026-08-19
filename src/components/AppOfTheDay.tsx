import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { appOfTheDay, msUntilNextLusakaDay } from "@/lib/appOfTheDay";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/**
 * The daily app spotlight on the homepage.
 *
 * The pick itself lives in `@/lib/appOfTheDay`. This component only keeps it
 * current: the homepage is prerendered, so the static HTML carries whatever the
 * build day chose, and the first client render plus a timer at Lusaka midnight
 * put the right app on screen without needing a redeploy.
 */
const AppOfTheDay = () => {
  const [app, setApp] = useState(() => appOfTheDay());

  useEffect(() => {
    // Correct the prerendered pick immediately on mount.
    setApp(appOfTheDay());

    let timer: ReturnType<typeof setTimeout>;
    const scheduleSwap = () => {
      // A second past midnight, so the new day has definitely started.
      timer = setTimeout(() => {
        setApp(appOfTheDay());
        scheduleSwap();
      }, msUntilNextLusakaDay() + 1000);
    };
    scheduleSwap();

    // A phone that was asleep at midnight fires timers late, so re-check on return.
    const onWake = () => {
      if (!document.hidden) setApp(appOfTheDay());
    };
    document.addEventListener("visibilitychange", onWake);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onWake);
    };
  }, []);

  if (!app) return null;

  const isExternal = app.url!.startsWith("http");

  return (
    <motion.div variants={fadeUp} className="mb-10">
      <div className="card-elevated overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Screenshot */}
          <div className="relative h-52 sm:h-64 md:h-auto md:min-h-[320px] overflow-hidden order-1 md:order-2">
            <img
              src={app.image}
              alt={`${app.name} screenshot`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent md:bg-gradient-to-l" />
            <span className="absolute top-3 right-3 text-[11px] font-mono bg-background/90 text-muted-foreground px-2 py-1 rounded">
              {app.domain}
            </span>
          </div>

          {/* Copy */}
          <div className="p-6 sm:p-8 flex flex-col justify-center order-2 md:order-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent mb-3">
              <Sparkles size={13} />
              App of the day
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-bold leading-tight">{app.name}</h3>
            <p className="text-primary font-medium text-sm mt-1">{app.tagline}</p>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{app.description}</p>

            <p className="flex items-start gap-2 text-sm mt-4">
              <Check size={16} className="text-accent mt-0.5 shrink-0" />
              <span className="text-foreground/80">{app.freeOffer}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a
                href={app.url!}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                Try {app.name} free <ArrowRight size={15} />
              </a>
              <Link to="/apps" className="text-primary font-medium text-sm hover:underline">
                See the whole range
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              A different app every day. {isExternal ? "Opens in a new tab." : "No signup, it runs in your browser."}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppOfTheDay;
