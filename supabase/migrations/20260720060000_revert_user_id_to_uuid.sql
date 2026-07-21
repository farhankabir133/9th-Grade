
-- Revert user_id columns from text back to uuid with auth.users references
-- This migration drops and recreates user_id columns as uuid

-- Step 1: Drop all RLS policies
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

-- Step 2: Drop indexes on user_id columns
drop index if exists idx_memory_items_user_id;
drop index if exists idx_memory_items_next_review;
drop index if exists idx_daily_stats_user_id;
drop index if exists idx_leaderboard_entries_exam_target;
drop index if exists idx_leaderboard_entries_district;

-- Step 3: Drop foreign key constraints
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.subject_strengths drop constraint if exists subject_strengths_user_id_fkey;
alter table public.exam_history drop constraint if exists exam_history_user_id_fkey;
alter table public.source_documents drop constraint if exists source_documents_user_id_fkey;
alter table public.question_bank drop constraint if exists question_bank_user_id_fkey;
alter table public.review_queue drop constraint if exists review_queue_user_id_fkey;
alter table public.generation_logs drop constraint if exists generation_logs_user_id_fkey;
alter table public.question_reports drop constraint if exists question_reports_user_id_fkey;
alter table public.user_roles drop constraint if exists user_roles_user_id_fkey;
alter table public.memory_schedules drop constraint if exists memory_schedules_user_id_fkey;
alter table public.memory_items drop constraint if exists memory_items_user_id_fkey;
alter table public.user_analytics drop constraint if exists user_analytics_user_id_fkey;
alter table public.daily_stats drop constraint if exists daily_stats_user_id_fkey;
alter table public.leaderboard_entries drop constraint if exists leaderboard_entries_user_id_fkey;

-- Step 4: Drop unique constraints that involve user_id
alter table public.subject_strengths drop constraint if exists subject_strengths_user_id_subject_key;
alter table public.user_roles drop constraint if exists user_roles_user_id_role_key;
alter table public.daily_stats drop constraint if exists daily_stats_user_id_date_key;

-- Step 5: Drop user_id/id columns and recreate as uuid
alter table public.profiles drop column id;
alter table public.profiles add column id uuid not null primary key default gen_random_uuid();

alter table public.subject_strengths drop column user_id;
alter table public.subject_strengths add column user_id uuid not null default gen_random_uuid();

alter table public.exam_history drop column user_id;
alter table public.exam_history add column user_id uuid not null default gen_random_uuid();

alter table public.flashcards drop column user_id;
alter table public.flashcards add column user_id uuid not null default gen_random_uuid();

alter table public.source_documents drop column user_id;
alter table public.source_documents add column user_id uuid;

alter table public.question_bank drop column user_id;
alter table public.question_bank add column user_id uuid;

alter table public.review_queue drop column user_id;
alter table public.review_queue add column user_id uuid not null default gen_random_uuid();

alter table public.generation_logs drop column user_id;
alter table public.generation_logs add column user_id uuid;

alter table public.question_reports drop column user_id;
alter table public.question_reports add column user_id uuid not null default gen_random_uuid();

alter table public.user_roles drop column user_id;
alter table public.user_roles add column user_id uuid not null default gen_random_uuid();

alter table public.memory_schedules drop column user_id;
alter table public.memory_schedules add column user_id uuid not null primary key default gen_random_uuid();

alter table public.memory_items drop column user_id;
alter table public.memory_items add column user_id uuid not null default gen_random_uuid();

alter table public.user_analytics drop column user_id;
alter table public.user_analytics add column user_id uuid not null primary key default gen_random_uuid();

alter table public.daily_stats drop column user_id;
alter table public.daily_stats add column user_id uuid not null default gen_random_uuid();

alter table public.leaderboard_entries drop column user_id;
alter table public.leaderboard_entries add column user_id uuid not null default gen_random_uuid();

-- Step 6: Recreate unique constraints
alter table public.subject_strengths add constraint subject_strengths_user_id_subject_key unique(user_id, subject);
alter table public.user_roles add constraint user_roles_user_id_role_key unique(user_id, role);
alter table public.daily_stats add constraint daily_stats_user_id_date_key unique(user_id, date);

-- Step 7: Recreate indexes
create index idx_memory_items_user_id on public.memory_items(user_id);
create index idx_memory_items_next_review on public.memory_items(next_review_date);
create index idx_daily_stats_user_id on public.daily_stats(user_id);
create index idx_leaderboard_entries_exam_target on public.leaderboard_entries(exam_target);
create index idx_leaderboard_entries_district on public.leaderboard_entries(district);

-- Step 8: Recreate foreign keys
alter table public.profiles add constraint profiles_id_fkey foreign key (id) references auth.users(id) on delete cascade;
alter table public.subject_strengths add constraint subject_strengths_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.exam_history add constraint exam_history_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.source_documents add constraint source_documents_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.question_bank add constraint question_bank_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.review_queue add constraint review_queue_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.generation_logs add constraint generation_logs_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.question_reports add constraint question_reports_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.user_roles add constraint user_roles_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.memory_schedules add constraint memory_schedules_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.memory_items add constraint memory_items_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.user_analytics add constraint user_analytics_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.daily_stats add constraint daily_stats_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table public.leaderboard_entries add constraint leaderboard_entries_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

-- Step 9: Recreate RLS policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can manage own subject strengths" on public.subject_strengths
  for all using (auth.uid() = user_id);

create policy "Users can manage own exam history" on public.exam_history
  for all using (auth.uid() = user_id);

create policy "Users can manage own exam answers" on public.exam_answers
  for all using (
    exists (
      select 1 from public.exam_history
      where exam_history.id = exam_answers.exam_history_id
      and exam_history.user_id = auth.uid()
    )
  );

create policy "Users can manage own flashcards" on public.flashcards
  for all using (auth.uid() = user_id);

create policy "Users can manage own source documents" on public.source_documents
  for all using (auth.uid() = user_id);

create policy "Users can view own questions" on public.question_bank
  for select using (auth.uid() = user_id);
create policy "Service can insert questions" on public.question_bank
  for insert with check (true);

create policy "Users can manage own review queue" on public.review_queue
  for all using (auth.uid() = user_id);

create policy "Users can view own generation logs" on public.generation_logs
  for select using (auth.uid() = user_id);
create policy "Service can insert generation logs" on public.generation_logs
  for insert with check (true);

create policy "Users can view own reports" on public.question_reports
  for select using (auth.uid() = user_id);
create policy "Users can create reports" on public.question_reports
  for insert with check (auth.uid() = user_id);
create policy "Admins can manage all reports" on public.question_reports
  for all using (public.is_admin());

create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins can manage all roles" on public.user_roles
  for all using (public.is_admin());

create policy "Users can manage own memory schedule" on public.memory_schedules
  for all using (auth.uid() = user_id);

create policy "Users can manage own memory items" on public.memory_items
  for all using (auth.uid() = user_id);

create policy "Users can manage own analytics" on public.user_analytics
  for all using (auth.uid() = user_id);

create policy "Users can manage own daily stats" on public.daily_stats
  for all using (auth.uid() = user_id);

create policy "Authenticated users can view circulars" on public.circulars
  for select using (auth.role() = 'authenticated');
create policy "Admins can manage circulars" on public.circulars
  for all using (public.is_admin());

create policy "Everyone can view leaderboard" on public.leaderboard_entries
  for select using (true);
create policy "Admins can manage leaderboard" on public.leaderboard_entries
  for all using (public.is_admin());
