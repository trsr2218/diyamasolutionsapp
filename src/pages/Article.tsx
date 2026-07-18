import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { articles } from "@/data/articles";
import PageTransition from "@/components/PageTransition";
import Seo from "@/components/Seo";

const ORIGIN = "https://www.diyama.online";

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.id === slug);

  if (!article) return <Navigate to="/learn" replace />;

  const related = articles.filter((a) => a.id !== article.id && a.category === article.category);
  const suggestions = related.length > 0 ? related : articles.filter((a) => a.id !== article.id).slice(0, 2);

  const canonicalUrl = `${ORIGIN}/learn/${article.id}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    keywords: article.tags.join(", "),
    image: `${ORIGIN}/logo.jpg`,
    author: { "@type": "Organization", name: "Diyama Solutions" },
    publisher: {
      "@type": "Organization",
      name: "Diyama Solutions",
      logo: { "@type": "ImageObject", url: `${ORIGIN}/logo.jpg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <PageTransition>
      <Seo
        title={`${article.title} | Diyama Learn`}
        description={article.excerpt}
        path={`/learn/${article.id}`}
        type="article"
        jsonLd={articleJsonLd}
      />
      <div className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-narrow mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/learn" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={14} /> Back to all guides
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                article.level === "beginner" ? "bg-primary/10 text-primary" : "bg-warm/10 text-warm"
              }`}>
                {article.level}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 pb-8 border-b">
              <span className="flex items-center gap-1.5"><Clock size={14} /> {article.readTime} read</span>
              <span className="flex items-center gap-1.5"><BookOpen size={14} /> Diyama Solutions</span>
            </div>

            <div className="prose prose-neutral max-w-none prose-headings:font-display prose-headings:font-semibold prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/80 prose-li:text-foreground/80">
              <ReactMarkdown
                components={{
                  a: ({ href, children }) =>
                    href && href.startsWith("/") ? (
                      <Link to={href}>{children}</Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            <div className="mt-12 card-elevated p-6 bg-primary/5 border-primary/20">
              <h3 className="font-display font-semibold text-lg mb-2">Want hands-on help with this?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Reading is a start. Doing is faster with a partner. Tell us where you are stuck and we will map the next move together.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/consultations" className="btn-primary text-sm inline-flex items-center gap-2">
                  Book a Consultation <ArrowRight size={14} />
                </Link>
                <Link to="/ai" className="btn-outline-primary text-sm">Ask Diyama AI</Link>
              </div>
            </div>

            {suggestions.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-xl font-semibold mb-5">Keep learning</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {suggestions.slice(0, 2).map((a) => (
                    <Link key={a.id} to={`/learn/${a.id}`} className="card-elevated p-5 block hover:border-primary/30 transition-all">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{a.category}</span>
                      <h3 className="font-display font-semibold mt-1.5 mb-1.5">{a.title}</h3>
                      <p className="text-xs text-muted-foreground">{a.readTime} read</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Article;
