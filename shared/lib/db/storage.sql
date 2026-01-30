-- Supabase Storage Buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

-- Policies for avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update an avatar."
  on storage.objects for update
  with check ( bucket_id = 'avatars' );

-- Policies for logos
create policy "Logo images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'logos' );

create policy "Anyone can upload a logo."
  on storage.objects for insert
  with check ( bucket_id = 'logos' );

create policy "Anyone can update a logo."
  on storage.objects for update
  with check ( bucket_id = 'logos' );
