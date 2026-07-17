// Vite inlines env vars at build time. A stray BOM (U+FEFF), zero-width, or
// whitespace character in the deployment env value would otherwise be baked
// into the URL/key and, once placed in a fetch Authorization header, make the
// browser throw "String contains non ISO-8859-1 code point" for every Supabase
// call. Supabase URLs and JWT keys are printable ASCII with no spaces, so keep
// only those bytes and drop everything else.
const clean = (v: string | undefined) =>
  (v ?? "").replace(/[^\x21-\x7E]/g, "");

export const SUPABASE_URL = clean(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_PUBLISHABLE_KEY = clean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
