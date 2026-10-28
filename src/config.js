/* Supabase connection (Supabase -> Project Settings -> API).
   url     = "Project URL"                (env-var name used in docs: SUPABASE_URL)
   anonKey = "anon public" key            (env-var name used in docs: SUPABASE_ANON_KEY)
   These two values are PUBLIC by design: Row Level Security decides what they may do.
   NEVER paste the "service_role" key anywhere in this project.
   Leave both empty and the site simply shows the content from src/data/portfolio.js. */
window.CMS_CONFIG = { url: "", anonKey: "" };
