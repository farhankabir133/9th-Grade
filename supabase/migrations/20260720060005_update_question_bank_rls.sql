
-- Update question_bank RLS to allow students to read approved questions
-- per personal-os-supabase-architecture 2.md §5

drop policy if exists "Users can view own questions" on public.question_bank;

create policy "Read approved questions" on public.question_bank
  for select using (
    review_status = 'approved'
    or (auth.jwt() ->> 'user_role') in ('reviewer','admin')
  );

create policy "Reviewers write questions" on public.question_bank
  for update using ((auth.jwt() ->> 'user_role') in ('reviewer','admin'));
