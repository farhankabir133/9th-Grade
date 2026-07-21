
-- Aggressively drop all foreign keys, alter user_id columns to text, then recreate RLS

-- Step 1: Drop ALL foreign key constraints in public schema
do $$
declare
  rec record;
begin
  for rec in select conname, conrelid::regclass as table_name from pg_constraint where contype = 'f' and connamespace = 'public'::regnamespace
  loop
    execute format('alter table %s drop constraint %I', rec.table_name, rec.conname);
  end loop;
end $$;

-- Step 2: Drop all RLS policies
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can manage own subject strengths" on public.subject_strengths;
drop policy if exists "Users can manage own exam history" on public.exam_history;
drop policy if exists "Users can manage own exam answers" on public.exam_answers;
drop policy if exists "Users can manage own flashcards" on public.flashcards;
drop policy if exists "Users can manage own source documents" on public.source_documents;
drop policy if exists "Users can view own questions" on public.question_bank;
drop policy if exists "Service can insert questions" on public.question_bank;
drop policy if exists "Users can manage own review queue" on public.review_queue;
drop policy if exists "Users can view own generation logs" on public.generation_logs;
drop policy if exists "Service can insert generation logs" on public.generation_logs;
drop policy if exists "Users can view own reports" on public.question_reports;
drop policy if exists "Users can create reports" on public.question_reports;
drop policy if exists "Admins can manage all reports" on public.question_reports;
drop policy if exists "Users can view own roles" on public.user_roles;
drop policy if exists "Admins can manage all roles" on public.user_roles;
drop policy if exists "Users can manage own memory schedule" on public.memory_schedules;
drop policy if exists "Users can manage own memory items" on public.memory_items;
drop policy if exists "Users can manage own analytics" on public.user_analytics;
drop policy if exists "Users can manage own daily stats" on public.daily_stats;
drop policy if exists "Authenticated users can view circulars" on public.circulars;
drop policy if exists "Admins can manage circulars" on public.circulars;
drop policy if exists "Everyone can view leaderboard" on public.leaderboard_entries;
drop policy if exists "Admins can manage leaderboard" on public.leaderboard_entries;

-- Step 3: Alter user_id columns from uuid to text
alter table public.profiles alter column id type text using id::text;
alter table public.subject_strengths alter column user_id type text using user_id::text;
alter table public.exam_history alter column user_id type text using user_id::text;
alter table public.flashcards alter column user_id type text using user_id::text;
alter table public.source_documents alter column user_id type text using user_id::text;
alter table public.question_bank alter column user_id type text using user_id::text;
alter table public.review_queue alter column user_id type text using user_id::text;
alter table public.generation_logs alter column user_id type text using user_id::text;
alter table public.question_reports alter column user_id type text using user_id::text;
alter table public.user_roles alter column user_id type text using user_id::text;
alter table public.memory_schedules alter column user_id type text using user_id::text;
alter table public.memory_items alter column user_id type text using user_id::text;
alter table public.user_analytics alter column user_id type text using user_id::text;
alter table public.daily_stats alter column user_id type text using user_id::text;
alter table public.leaderboard_entries alter column user_id type text using user_id::text;

-- Step 4: Recreate RLS policies with text comparisons
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid()::text = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid()::text = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid()::text = id);

create policy "Users can manage own subject strengths" on public.subject_strengths
  for all using (auth.uid()::text = user_id);

create policy "Users can manage own exam history" on public.exam_history
  for all using (auth.uid()::text = user_id);

create policy "Users can manage own exam answers" on public.exam_answers
  for all using (
    exists (
      select 1 from public.exam_history
      where exam_history.id = exam_answers.exam_history_id
      and exam_history.user_id = auth.uid()::text
    )
  );

create policy "Users can manage own flashcards" on public.flashcards
  for all using (auth.uid()::text = user_id);

create policy "Users can manage own source documents" on public.source_documents
  for all using (auth.uid()::text = user_id);

create policy "Users can view own questions" on public.question_bank
  for select using (auth.uid()::text = user_id);
create policy "Service can insert questions" on public.question_bank
  for insert with check (true);

create policy "Users can manage own review queue" on public.review_queue
  for all using (auth.uid()::text = user_id);

create policy "Users can view own generation logs" on public.generation_logs
  for select using (auth.uid()::text = user_id);
create policy "Service can insert generation logs" on public.generation_logs
  for insert with check (true);

create policy "Users can view own reports" on public.question_reports
  for select using (auth.uid()::text = user_id);
create policy "Users can create reports" on public.question_reports
  for insert with check (auth.uid()::text = user_id);
create policy "Admins can manage all reports" on public.question_reports
  for all using (public.is_admin());

create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid()::text = user_id);
create policy "Admins can manage all roles" on public.user_roles
  for all using (public.is_admin());

create policy "Users can manage own memory schedule" on public.memory_schedules
  for all using (auth.uid()::text = user_id);

create policy "Users can manage own memory items" on public.memory_items
  for all using (auth.uid()::text = user_id);

create policy "Users can manage own analytics" on public.user_analytics
  for all using (auth.uid()::text = user_id);

create policy "Users can manage own daily stats" on public.daily_stats
  for all using (auth.uid()::text = user_id);

create policy "Authenticated users can view circulars" on public.circulars
  for select using (auth.role() = 'authenticated');
create policy "Admins can manage circulars" on public.circulars
  for all using (public.is_admin());

create policy "Everyone can view leaderboard" on public.leaderboard_entries
  for select using (true);
create policy "Admins can manage leaderboard" on public.leaderboard_entries
  for all using (public.is_admin());
