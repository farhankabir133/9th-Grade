
-- Drop the old SM-2 review_queue (empty, unused) and replace with reviewer approval queue
-- per personal-os-supabase-architecture 2.md §4

-- Drop old table and its dependencies
drop table if exists public.review_queue cascade;

-- Recreate as reviewer approval queue
-- Note: question_bank_id is text to match question_bank.id type
create table public.review_queue (
  id uuid primary key default gen_random_uuid(),
  question_bank_id text not null references public.question_bank(id) on delete cascade,
  assigned_to uuid references auth.users(id),
  status text not null default 'queued' check (status in ('queued','in_review','resolved')),
  reviewer_notes text,
  decision text check (decision in ('approve','reject','edit_and_approve')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Indexes for reviewer queue
create index idx_review_queue_status on public.review_queue(status);
create index idx_review_queue_assigned_to on public.review_queue(assigned_to);
create index idx_review_queue_question_bank_id on public.review_queue(question_bank_id);

-- Drop old RLS policy and recreate for reviewer queue
drop policy if exists "Users can manage own review queue" on public.review_queue;

create policy "Reviewers manage review queue" on public.review_queue
  for all using ((auth.jwt() ->> 'user_role') in ('reviewer','admin'));
