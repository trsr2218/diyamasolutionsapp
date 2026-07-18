import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Clock } from "lucide-react";
import { articles } from "@/data/articles";
import learnImg from "@/assets/learn-workspace.jpg";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const ORIGIN = "https://www.diyama.online";

const learnJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Learn with Diyama",
  description: pageSeo["/learn"].description,
  url: `${ORIGIN}/learn`,
  isPartOf: { "@type": "WebSite", name: "Diyama Solutions", url: `${ORIGIN}/` },
  hasPart: articles.map((a) => ({
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    articleSection: a.category,
    keywords: a.tags.join(", "),
    url: `${ORIGIN}/learn/${a.id}`,
    author: { "@type": "Organization", name: "Diyama Solutions" },
    publisher: {
      "@type": "Organization",
      name: "Diyama Solutions",
      logo: { "@type": "ImageObject", url: `${ORIGIN}/logo.jpg` },
    },
  })),
};

const categories = ["All", ...Array.from(new Set(articles.map((a) => a.category)))];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Learn = () => {
  const [filter, setFilter] = useState("All");
  const [level, setLevel] = useState<"all" | "beginner" | "advanced">("all");

  const filtered = articles
    .filter((a) => filter === "All" || a.category === filter)
    .filter((a) => level === "all" || a.level === level);

  return (
    <PageTransition>
      <Seo {...pageSeo["/learn"]} path="/learn" jsonLd={learnJsonLd} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={learnImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Learn with Diyama</h1>
              <p className="text-lg opacity-80">
                Free guides, practical advice, and actionable insights to help your business grow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-wide mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filter === cat ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-8">
            {([
              { key: "all", label: "All levels" },
              { key: "beginner", label: "Beginner" },
              { key: "advanced", label: "Advanced" },
            ] as const).map((l) => (
              <button
                key={l.key}
                onClick={() => setLevel(l.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  level === l.key ? "bg-accent text-accent-foreground shadow-sm" : "bg-muted text-muted-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article) => (
              <motion.div key={article.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link to={`/learn/${article.id}`} className="card-elevated p-6 h-full flex flex-col hover:border-primary/30 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">{article.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        article.level === "beginner" ? "bg-primary/10 text-primary" : "bg-warm/10 text-warm"
                      }`}>
                        {article.level}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2 flex-1">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> Article</span>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No articles match your filters. Try adjusting them.</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg inline-block">
              Want to suggest a topic for a future guide? <a href="mailto:getitdonerapid@gmail.com" className="text-primary underline">Let us know</a>.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Learn;
