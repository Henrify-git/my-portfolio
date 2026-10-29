# Admin dashboard setup (Supabase)

**Architecture:** your site is static (HTML/CSS/JS on Vercel). Visitors' browsers read *published* content from Supabase; you edit it at **`/admin`**. Security is enforced by Supabase **Row Level Security** in the database, not by hiding buttons.
**Until you do the steps below, nothing changes: the site keeps showing `src/data/portfolio.js`.**

## Environment values (only two, both PUBLIC by design)
| Name | Where to find it | Where it goes |
|---|---|---|
| `SUPABASE_URL` | Supabase -> Project Settings -> API -> *Project URL* | `url` in `src/config.js` |
| `SUPABASE_ANON_KEY` | same page -> *anon public* key | `anonKey` in `src/config.js` |

Never use or paste the **service_role** key anywhere. This project does not need it. (A static Vercel site has no server to hide secrets in, so the anon key is committed on purpose; RLS limits it to read-only access to published content.)

## 1. Create the project
1. supabase.com -> **New project** (pick a region near your visitors, save the database password).
2. **SQL Editor -> New query**, paste all of `supabase/schema.sql`, click **Run**. It creates the tables, indexes, constraints, security rules and the `media` storage bucket. Safe to re-run.

## 2. Create your admin login
1. **Authentication -> Users -> Add user -> Create new user**: your email + a strong password, tick *Auto Confirm User*.
2. **Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up"** (so strangers can't make accounts).
3. **SQL Editor**, run (use your email):
```sql
insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
```
Only users listed in `admins` can change anything. A valid login that isn't listed is refused by the database.

## 3. Connect the site
Paste the two values into `src/config.js`, commit and push to GitHub. Vercel redeploys automatically (no build settings needed).

## 4. First login
Open `https://YOUR-SITE.vercel.app/admin`, sign in, go to **Settings -> Import starter content** (once). This copies everything now in `src/data/portfolio.js` into the database, so nothing disappears. From now on edit in the dashboard.

## Verify security on YOUR project (2 minutes)
Replace the two values, run in a terminal:
```
URL=https://xxxx.supabase.co ; KEY=your-anon-key
# 1) Visitors see only published designs (no "published":false rows):
curl "$URL/rest/v1/designs?select=name,published" -H "apikey: $KEY" -H "Authorization: Bearer $KEY"
# 2) Visitors must NOT be able to write. Expect an error mentioning "row-level security":
curl -X POST "$URL/rest/v1/tools" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d '{"name":"hack"}'
# 3) Visitors must NOT be able to upload. Expect an error:
curl -X POST "$URL/storage/v1/object/media/x.txt" -H "apikey: $KEY" -H "Authorization: Bearer $KEY" -d hi
```

## Run locally
`node serve.js` -> http://localhost:3000 (site) and http://localhost:3000/admin (dashboard).

## What you can edit
Profile and hero, ID badge, projects (add / edit / duplicate / delete / reorder / publish / draft), designs and story pages (images, chapters, live link), about, roles/services, statistics, tools strip, resume PDF, email, social links, colors with live preview, nav and heading labels, footer text, show/hide sections, SEO title/description/share image, media library.

## Honest limits
- **Not included, because the site has no such sections:** testimonials, experience, education. Adding them needs new design work first (otherwise the controls would do nothing).
- **Not editable:** fonts and section *order* (fixed by the design). Section *visibility* is.
- **Drafts** exist per project, design and role. Profile/text changes publish when you click "Save & publish".
- **"Preview website"** opens the live site; color changes preview inside the dashboard before you save.
- Content loads in the visitor's browser, so changes appear on the next page load (no redeploy). Search engines that don't run JavaScript see the built-in fallback text and default title.
- If Supabase is down or paused (free projects pause after inactivity), the site shows the content from `src/data/portfolio.js`. Keep that file reasonably up to date as a backup.
- Uploads: images (JPG/PNG/WebP/GIF), PDFs, and videos (MP4/WebM, Selected work cards only) are all limited to 10 MB each.
- **Upgrading an existing project to allow videos:** run once in SQL Editor:
```sql
update storage.buckets set file_size_limit = 10485760,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','application/pdf','video/mp4','video/webm']
where id = 'media';
```
