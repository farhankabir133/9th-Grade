
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Core tables
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text not null,
  phone text,
  exam_type text not null check (exam_type in ('BCS', 'Admission', 'SSC', 'HSC')),
  target_year integer not null default 2027,
  streak integer not null default 0,
  xp integer not null default 0,
  level integer not null default 1,
  learning_style text check (learning_style in ('visual', 'analytical', 'verbal', 'interactive')),
  readiness_score integer not null default 0,
  predicted_rank integer not null default 0,
  total_students integer not null default 0,
  passing_probability integer not null default 0,
  consistency_score integer not null default 0,
  district text not null default '',
  archetype text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subject_strengths (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  subject text not null,
  score integer not null default 0,
  color text not null default '#64748b',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, subject)
);

create table public.exam_history (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  exam_type text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  time_spent_seconds integer not null default 0,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.exam_answers (
  id bigint generated always as identity primary key,
  exam_history_id bigint references public.exam_history(id) on delete cascade not null,
  question_id text not null,
  selected_index integer,
  correct_index integer not null,
  is_correct boolean not null,
  subject text not null,
  topic text not null,
  created_at timestamptz not null default now()
);

create table public.flashcards (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  front text not null,
  back text not null,
  subject text not null,
  topic text not null,
  next_review_date timestamptz not null,
  interval_days integer not null default 1,
  repetition_count integer not null default 0,
  easiness_factor numeric not null default 2.5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.source_documents (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users,
  title text not null,
  content text not null,
  subject text not null,
  exam_type text not null,
  processed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.question_bank (
  id text primary key,
  user_id uuid references auth.users,
  subject text not null,
  topic text not null,
  difficulty text not null,
  question_text text not null,
  options jsonb not null,
  correct_index integer not null,
  explanations jsonb not null,
  concept text not null,
  cognitive_dimension text not null,
  uniqueness_score integer not null,
  difficulty_score integer not null,
  concept_depth_score integer not null,
  syllabus_relevance_score integer not null,
  distractor_quality_score integer not null,
  overall_quality_score integer not null,
  recruitment_relevance text not null,
  is_fallback boolean not null default false,
  exam_type text not null,
  created_at timestamptz not null default now()
);

create table public.review_queue (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  question_id text not null,
  subject text not null,
  priority integer not null default 50,
  review_count integer not null default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.generation_logs (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users,
  exam_type text not null,
  subject text not null,
  topic text not null,
  difficulty text not null,
  questions_requested integer not null,
  questions_generated integer not null,
  is_fallback boolean not null default false,
  model_used text not null,
  duration_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.question_reports (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  question_id text not null,
  reason text not null,
  details text,
  status text not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  role text not null,
  exam_type text not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

-- Additional feature tables
create table public.memory_schedules (
  user_id uuid references auth.users not null primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memory_items (
  id text not null primary key,
  user_id uuid references auth.users not null,
  topic_id text not null,
  topic text not null,
  subject text not null,
  easiness_factor numeric not null default 2.5,
  interval_days integer not null default 0,
  repetition_count integer not null default 0,
  next_review_date timestamptz not null,
  last_review_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_memory_items_user_id on public.memory_items(user_id);
create index idx_memory_items_next_review on public.memory_items(next_review_date);

create table public.user_analytics (
  user_id uuid references auth.users not null primary key,
  total_xp integer not null default 0,
  cur_level integer not null default 1,
  cumulative_percentile numeric not null default 0,
  cohort_rank integer not null default 0,
  streak integer not null default 0,
  mastery_heatmap jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_stats (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  date date not null,
  xp_earned integer not null default 0,
  questions_solved integer not null default 0,
  correct_answers integer not null default 0,
  time_spent_seconds integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, date)
);

create index idx_daily_stats_user_id on public.daily_stats(user_id);

create table public.circulars (
  id text primary key,
  title text not null,
  organization text not null,
  vacancy_count integer not null default 0,
  deadline date not null,
  admit_card_date date,
  countdown_days integer not null default 0,
  link text not null default '#',
  syllabus_overview text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leaderboard_entries (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users not null,
  rank integer not null,
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  exam_target text not null,
  district text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

create index idx_leaderboard_entries_exam_target on public.leaderboard_entries(exam_target);
create index idx_leaderboard_entries_district on public.leaderboard_entries(district);

-- Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.subject_strengths
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.flashcards
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.source_documents
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.memory_schedules
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.memory_items
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.user_analytics
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.circulars
  for each row execute procedure public.handle_updated_at();

create trigger set_updated_at before update on public.leaderboard_entries
  for each row execute procedure public.handle_updated_at();
