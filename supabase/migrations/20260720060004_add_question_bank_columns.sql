
-- Add missing columns to question_bank per personal-os-supabase-architecture 2.md

alter table public.question_bank
  add column if not exists review_status text not null default 'pending'
    check (review_status in ('pending','approved','rejected','flagged')),
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists confidence_score numeric(4,3),
  add column if not exists usage_count integer not null default 0,
  add column if not exists report_count integer not null default 0;

create index if not exists idx_question_bank_review_status on public.question_bank(review_status);
create index if not exists idx_question_bank_exam_type_subject on public.question_bank(exam_type, subject);
