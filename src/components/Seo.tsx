import { Helmet } from "react-helmet-async";

const ORIGIN = "https://www.diyama.online";
const DEFAULT_IMAGE = `${ORIGIN}/logo.jpg`;
const SITE_NAME = "Diyama Solutions";

export interface SeoProps {
  /** Full <title> text, already suffixed (e.g. "Our Services | Diyama Solutions"). */
  title: string;
  /** Meta description, roughly 150 characters, natural and keyword-aware. */
  description: string;
  /** Route path starting with "/" (e.g. "/services"). Used to build the canonical URL. */
  path: string;
  /** Absolute image URL for social cards. Defaults to the Diyama logo. */
  image?: string;
  /** Open Graph type. Defaults to "website". */
  type?: string;
  /** One or more JSON-LD objects rendered as separate <script> tags. */
  jsonLd?: object | object[];
}

const Seo = ({
  title,
  description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  jsonLd,
}: SeoProps) => {
  const canonical = `${ORIGIN}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Page-level JSON-LD */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
