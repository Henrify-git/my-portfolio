-- Run ONCE in Supabase -> SQL Editor if you set up with an older schema.sql.
-- Lets the dashboard upload MP4/WebM videos (up to 10 MB). Images and PDFs are also capped at 10 MB.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','application/pdf','video/mp4','video/webm']
where id = 'media';
