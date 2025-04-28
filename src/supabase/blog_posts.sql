-- Blog posts table for InvestbotIQ
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null, -- Markdown
  author text,
  status text default 'draft', -- 'draft' or 'published'
  published_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Everyone can read, only admins can write
create policy "Enable read access for all" on blog_posts
  for select using (true);

create policy "Enable admin write access" on blog_posts
  for all using (auth.role() = 'admin');
