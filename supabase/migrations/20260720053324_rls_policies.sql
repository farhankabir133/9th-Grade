
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.subject_strengths enable row level security;
alter table public.exam_history enable row level security;
alter table public.exam_answers enable row level security;
alter table public.flashcards enable row level security;
alter table public.source_documents enable row level security;
alter table public.question_bank enable row level security;
alter table public.review_queue enable row level security;
alter table public.generation_logs enable row level security;
alter table public.question_reports enable row level security;
alter table public.user_roles enable row level security;
alter table public.memory_schedules enable row level security;
alter table public.memory_items enable row level security;
alter table public.user_analytics enable row level security;
alter table public.daily_stats enable row level security;
alter table public.circulars enable row level security;
alter table public.leaderboard_entries enable row level security;

-- Helper functions
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- subject_strengths
create policy "Users can manage own subject strengths" on public.subject_strengths
  for all using (auth.uid() = user_id);

-- exam_history
create policy "Users can manage own exam history" on public.exam_history
  for all using (auth.uid() = user_id);

-- exam_answers
create policy "Users can manage own exam answers" on public.exam_answers
  for all using (
    exists (
      select 1 from public.exam_history
      where exam_history.id = exam_answers.exam_history_id
      and exam_history.user_id = auth.uid()
    )
  );

-- flashcards
create policy "Users can manage own flashcards" on public.flashcards
  for all using (auth.uid() = user_id);

-- source_documents
create policy "Users can manage own source documents" on public.source_documents
  for all using (auth.uid() = user_id);

-- question_bank
create policy "Users can view own questions" on public.question_bank
  for select using (auth.uid() = user_id);
create policy "Service can insert questions" on public.question_bank
  for insert with check (true);

-- review_queue
create policy "Users can manage own review queue" on public.review_queue
  for all using (auth.uid() = user_id);

-- generation_logs
create policy "Users can view own generation logs" on public.generation_logs
  for select using (auth.uid() = user_id);
create policy "Service can insert generation logs" on public.generation_logs
  for insert with check (true);

-- question_reports
create policy "Users can view own reports" on public.question_reports
  for select using (auth.uid() = user_id);
create policy "Users can create reports" on public.question_reports
  for insert with check (auth.uid() = user_id);
create policy "Admins can manage all reports" on public.question_reports
  for all using (public.is_admin());

-- user_roles
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);
create policy "Admins can manage all roles" on public.user_roles
  for all using (public.is_admin());

-- memory_schedules
create policy "Users can manage own memory schedule" on public.memory_schedules
  for all using (auth.uid() = user_id);

-- memory_items
create policy "Users can manage own memory items" on public.memory_items
  for all using (auth.uid() = user_id);

-- user_analytics
create policy "Users can manage own analytics" on public.user_analytics
  for all using (auth.uid() = user_id);

-- daily_stats
create policy "Users can manage own daily stats" on public.daily_stats
  for all using (auth.uid() = user_id);

-- circulars
create policy "Authenticated users can view circulars" on public.circulars
  for select using (auth.role() = 'authenticated');
create policy "Admins can manage circulars" on public.circulars
  for all using (public.is_admin());

-- leaderboard_entries
create policy "Everyone can view leaderboard" on public.leaderboard_entries
  for select using (true);
create policy "Admins can manage leaderboard" on public.leaderboard_entries
  for all using (public.is_admin());
