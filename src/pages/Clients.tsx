import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { clients } from "@/data/clients";
import aboutImg from "@/assets/about-team.jpg";
import PageTransition from "@/components/PageTransition";
import SitePreview from "@/components/SitePreview";
import Seo from "@/components/Seo";
import { pageSeo } from "@/seo/pageSeo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Clients = () => {
  const [filter, setFilter] = useState<"all" | "active" | "previous">("all");

  const filtered = filter === "all" ? clients : clients.filter((c) => c.status === filter);
  const activeCount = clients.filter((c) => c.status === "active").length;
  const previousCount = clients.filter((c) => c.status === "previous").length;

  return (
    <PageTransition>
      <Seo {...pageSeo["/clients"]} path="/clients" />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={aboutImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/75 to-foreground/50" />
        </div>
        <div className="relative z-10 section-padding">
          <div className="container-wide mx-auto text-primary-foreground">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Our Clients</h1>
              <p className="text-lg opacity-80">Real businesses we've worked with. Real outcomes. Real partnerships.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-b from-surface to-background">
        <div className="container-wide mx-auto">
          <div className="flex gap-2 mb-10">
            {[
              { key: "all", label: `All (${clients.length})` },
              { key: "active", label: `Active (${activeCount})` },
              { key: "previous", label: `Previous (${previousCount})` },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as "all" | "active" | "previous")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f.key ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((client) => (
              <motion.div key={client.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                  <div className="card-elevated p-6 h-full flex flex-col group">
                    {client.image && (
                      <SitePreview image={client.image} domain={client.domain ?? null} alt={`${client.name} website screenshot`} />
                    )}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-lg">{client.name}</h3>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ml-2 ${client.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {client.status === "active" ? "Active" : "Previous"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{client.shortDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {client.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-surface px-2 py-0.5 rounded-full text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      {client.linkStatus === "verified" && client.publicLink ? (
                        <a href={client.publicLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:underline">
                          Visit <ExternalLink size={12} />
                        </a>
                      ) : (
                        <p className="text-xs text-muted-foreground/60 italic">Link pending verification</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Clients;
