# Personal OS — Supabase (PostgreSQL) Architecture
### Authentication, Authorization, Schema & Updated Backend Design

This replaces Firebase/Firestore with Supabase across the stack. The single biggest win: **Postgres + `pgvector` lets your relational data and your RAG vector store live in one database**, so the retrieval layer from the AI pipeline doc is no longer a separate system — it's just tables.

---

## 1. Why This Fits Your Project Well

- **Row Level Security (RLS)** gives you authorization enforced *at the database layer*, not just in application code — a client can query Postgres directly and still can't see another user's data, even if your API has a bug.
- **`pgvector`** means `sourceDocuments` embeddings, `questionBank`, `examHistory`, and `users` all live in one relational database with foreign keys and joins — no separate vector DB to run or pay for.
- **Supabase Auth** is Postgres-native: every authenticated request carries a JWT with the user's `auth.uid()`, which RLS policies reference directly. Authorization logic isn't duplicated between backend and database.
- Free tier is generous enough for a real launch, and self-hosting Supabase later (if you ever outgrow the free tier) is a straightforward migration since it's just Postgres underneath.

---

## 2. Authentication Architecture

### 2.1 Supabase Auth setup
- **Providers**: Email/password (primary), optional Google OAuth (very common in Bangladesh — low-friction signup), and **anonymous/guest sessions** (Supabase supports anonymous sign-in natively as of recent versions — this replaces your current custom guest-session logic).
- **Session tokens**: Supabase issues a JWT (`access_token`) + refresh token on sign-in. The JWT contains `sub` (user id), `role`, and any custom claims you add.
- **Guest → registered merge**: when an anonymous user signs up for real, Supabase's `auth.updateUser()` on an anonymous session converts it in place — the `auth.uid()` stays the same, so all their existing rows (exam history, flashcards) are already correctly owned and need no data migration. This is meaningfully simpler than your current Firestore guest-merge logic.

### 2.2 Auth flow

```
Client (Supabase JS SDK)
   │
   ├─ signInAnonymously() ──────────► session with auth.uid() = anon-uuid
   │                                   (RLS-visible rows created under this id)
   │
   ├─ updateUser({email, password}) ─► same auth.uid(), now permanent account
   │                                   (all prior rows automatically stay owned)
   │
   └─ signInWithPassword() /
      signInWithOAuth('google')  ────► returns JWT, stored client-side,
                                        attached to every Supabase request
                                        and to every backend API call
```

### 2.3 Custom claims for roles
Supabase lets you attach custom claims to the JWT via a Postgres function hooked into the auth flow (`auth.hook.custom_access_token`). Use this to embed the user's role (`student`, `reviewer`, `admin`) directly in the token so both RLS policies and your Express middleware can check it without an extra DB round-trip:

```sql
-- Custom access token hook: injects role into JWT claims
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role text;
begin
  select role into user_role from public.user_roles where user_id = (event->>'user_id')::uuid;
  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(coalesce(user_role, 'student')));
  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;
```

---

## 3. Authorization Model

Three roles cover your needs:

| Role | Can do |
|---|---|
| `student` (default) | Read/write only their own `exam_history`, `flashcards`, `user_answers`; read published `question_bank` |
| `reviewer` | Everything a student can, plus read/write `review_queue`, approve/edit/reject `question_bank` entries |
| `admin` | Everything, plus manage `user_roles`, view `generation_logs`, manage `source_documents` |

Roles are enforced in **two places redundantly** (this is intentional — defense in depth):
1. **RLS policies** in Postgres (§4) — the real security boundary.
2. **Express middleware** — checks the JWT's `user_role` claim before even hitting the DB, mainly for clean API error responses (401/403) rather than relying on a Postgres error bubbling up.

```typescript
// server/middleware/requireRole.ts
export function requireRole(...allowed: Array<"student" | "reviewer" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.auth?.claims?.user_role ?? "student";
    if (!allowed.includes(role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

// usage
router.post("/api/review/:id/approve", requireAuth, requireRole("reviewer", "admin"), approveHandler);
```

---

## 4. Full Postgres Schema

```sql
-- ============================================================
-- ROLES
-- ============================================================
create type app_role as enum ('student', 'reviewer', 'admin');

create table user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'student',
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users(id)
);

-- ============================================================
-- USER PROFILE (extends auth.users, which Supabase manages)
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  total_exams_taken int not null default 0,
  average_score numeric(5,2) not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_exam_date timestamptz
);

create table subject_strengths (
  user_id uuid references auth.users(id) on delete cascade,
  subject text not null,
  strength_score numeric(5,2) not null default 0 check (strength_score between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, subject)
);

-- ============================================================
-- EXAM HISTORY
-- ============================================================
create table exam_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_type text not null,
  difficulty text not null,
  subjects text[] not null,
  score numeric(5,2) not null,
  total_questions int not null,
  duration_seconds int not null,
  completed_at timestamptz not null default now()
);

create table exam_answers (
  id uuid primary key default gen_random_uuid(),
  exam_history_id uuid not null references exam_history(id) on delete cascade,
  question_id uuid not null references question_bank(id),
  user_selected_index int not null,
  correct_index int not null,
  is_correct boolean not null,
  time_spent_seconds int not null
);

-- ============================================================
-- FLASHCARDS (Leitner system)
-- ============================================================
create table flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  front text not null,
  back text not null,
  subject text not null,
  leitner_box int not null default 1 check (leitner_box between 1 and 5),
  next_review_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================
-- RAG SOURCE CORPUS  (ground truth for generation)
-- ============================================================
create extension if not exists vector;

create table source_documents (
  id uuid primary key default gen_random_uuid(),
  exam_type text not null,
  subject text not null,
  topic text,
  source_type text not null check (source_type in ('past_question','syllabus','rulebook','gk_factsheet')),
  content text not null,
  embedding vector(1024),           -- dims depend on embedding model (e.g. bge-m3)
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create index on source_documents using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- ============================================================
-- QUESTION BANK (published, servable content)
-- ============================================================
create table question_bank (
  id uuid primary key default gen_random_uuid(),
  exam_type text not null,
  subject text not null,
  topic text,
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  question text not null,
  options text[] not null,
  correct_index int not null,
  explanation_bn text,
  explanation_en text,
  source_document_ids uuid[] default '{}',
  generated_by text,                 -- model name/version
  embedding vector(1024),            -- for duplicate detection
  review_status text not null default 'pending'
    check (review_status in ('pending','approved','rejected','flagged')),
  reviewed_by uuid references auth.users(id),
  confidence_score numeric(4,3),
  usage_count int not null default 0,
  report_count int not null default 0,
  created_at timestamptz not null default now()
);

create index on question_bank using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index on question_bank (exam_type, subject, difficulty, review_status);

-- ============================================================
-- REVIEW QUEUE
-- ============================================================
create table review_queue (
  id uuid primary key default gen_random_uuid(),
  question_bank_id uuid not null references question_bank(id) on delete cascade,
  assigned_to uuid references auth.users(id),
  status text not null default 'queued' check (status in ('queued','in_review','resolved')),
  reviewer_notes text,
  decision text check (decision in ('approve','reject','edit_and_approve')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- ============================================================
-- GENERATION LOGS (cost/quality observability — admin only)
-- ============================================================
create table generation_logs (
  id uuid primary key default gen_random_uuid(),
  task_type text not null,
  model_used text not null,
  prompt_tokens int,
  completion_tokens int,
  latency_ms int,
  passed_validation boolean,
  retry_count int default 0,
  cost_usd numeric(10,6),
  created_at timestamptz not null default now()
);

-- ============================================================
-- USER-REPORTED ISSUES (trust/QA signal from §5 of prior doc)
-- ============================================================
create table question_reports (
  id uuid primary key default gen_random_uuid(),
  question_bank_id uuid not null references question_bank(id) on delete cascade,
  reported_by uuid references auth.users(id),
  reason text,
  created_at timestamptz not null default now()
);
```

---

## 5. Row Level Security Policies

RLS is off by default per table in Postgres — you must explicitly enable and define policies. This is the actual authorization enforcement layer.

```sql
-- ============================================================
-- PROFILES: users manage only their own row
-- ============================================================
alter table profiles enable row level security;

create policy "read own profile" on profiles
  for select using (auth.uid() = id);

create policy "update own profile" on profiles
  for update using (auth.uid() = id);

-- ============================================================
-- EXAM HISTORY / ANSWERS: strictly own data
-- ============================================================
alter table exam_history enable row level security;

create policy "own exam history" on exam_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table exam_answers enable row level security;

create policy "own exam answers" on exam_answers
  for all using (
    exists (
      select 1 from exam_history eh
      where eh.id = exam_answers.exam_history_id and eh.user_id = auth.uid()
    )
  );

-- ============================================================
-- FLASHCARDS: strictly own data
-- ============================================================
alter table flashcards enable row level security;

create policy "own flashcards" on flashcards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- QUESTION BANK: everyone reads approved content;
-- only reviewers/admins can write
-- ============================================================
alter table question_bank enable row level security;

create policy "read approved questions" on question_bank
  for select using (
    review_status = 'approved'
    or (auth.jwt() ->> 'user_role') in ('reviewer','admin')
  );

create policy "reviewers write questions" on question_bank
  for update using ((auth.jwt() ->> 'user_role') in ('reviewer','admin'));

-- Inserts happen only via the backend's service-role key (bypasses RLS by design —
-- see §6.2), so no public insert policy is defined here at all.

-- ============================================================
-- REVIEW QUEUE: reviewers/admins only
-- ============================================================
alter table review_queue enable row level security;

create policy "reviewers manage queue" on review_queue
  for all using ((auth.jwt() ->> 'user_role') in ('reviewer','admin'));

-- ============================================================
-- SOURCE DOCUMENTS: readable by reviewers/admins; students never
-- query this table directly (backend uses it for retrieval only)
-- ============================================================
alter table source_documents enable row level security;

create policy "reviewers read source docs" on source_documents
  for select using ((auth.jwt() ->> 'user_role') in ('reviewer','admin'));

-- ============================================================
-- GENERATION LOGS: admin only
-- ============================================================
alter table generation_logs enable row level security;

create policy "admin reads logs" on generation_logs
  for select using ((auth.jwt() ->> 'user_role') = 'admin');

-- ============================================================
-- QUESTION REPORTS: any authenticated user can file; only
-- reviewers/admins can read the list
-- ============================================================
alter table question_reports enable row level security;

create policy "any user files report" on question_reports
  for insert with check (auth.uid() = reported_by);

create policy "reviewers read reports" on question_reports
  for select using ((auth.jwt() ->> 'user_role') in ('reviewer','admin'));
```

---

## 6. Updated Backend Architecture

### 6.1 Two Supabase clients, two trust levels
This is the most important operational rule in the whole redesign:

```typescript
// server/lib/supabase.ts

// 1. Anon client — respects RLS, used when acting AS the requesting user
export const supabaseAsUser = (accessToken: string) =>
  createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

// 2. Service-role client — BYPASSES RLS entirely. Server-only, never
// exposed to the client, used only for trusted backend operations like
// publishing generated questions or writing generation_logs.
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
```

**Rule:** any request that should be scoped to "this user's own data" uses `supabaseAsUser` with their token — RLS does the authorization work for you, and you can't accidentally leak another user's row even with a coding mistake. Only the generation pipeline (writing to `question_bank`, `generation_logs`, `source_documents`) uses `supabaseAdmin`, and that code path is never triggered directly by a client request — only by your scheduled jobs or reviewer-approved actions.

### 6.2 Auth middleware

```typescript
// server/middleware/requireAuth.ts
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ error: "Invalid session" });

  req.auth = {
    userId: data.user.id,
    claims: jwtDecode(token), // for role checks
    client: supabaseAsUser(token),
  };
  next();
}
```

### 6.3 Updated API surface

| Route | Auth | Notes |
|---|---|---|
| `POST /api/exams/complete` | student | writes via `req.auth.client` (RLS-scoped) |
| `GET /api/flashcards` | student | RLS-scoped |
| `GET /api/bank/questions` | student | reads approved `question_bank` only, served from cache |
| `POST /api/ai/adaptive-question` | student | live generation fallback if bank is thin for that topic/difficulty |
| `POST /api/review/:id/approve` | reviewer, admin | uses `supabaseAdmin` to publish |
| `GET /api/admin/generation-logs` | admin | uses `supabaseAdmin` |
| `POST /api/reports` | student | RLS insert-only policy enforces they can only report, not read others' reports |

### 6.4 Background jobs
Bank replenishment (the generation pipeline from the previous doc) runs as a scheduled job (e.g. Supabase Edge Function on a cron trigger, or a simple node-cron process alongside your Express server) — **not** in the request path of a user's exam session. It uses `supabaseAdmin` throughout: retrieves from `source_documents`, generates, validates, writes to `question_bank` as `pending`, and creates the `review_queue` row.

---

## 7. Security Checklist Specific to This Migration

- **Service role key** must only ever exist server-side (env var, never in client bundle). Treat a leak of this key as equivalent to a full database compromise, since it bypasses every RLS policy.
- Every table that stores user data must have RLS **enabled** — a table with RLS off is fully public by default once your anon key is (necessarily) exposed client-side. Audit this explicitly before launch; it's the most common Supabase misconfiguration.
- Don't put `user_role` determination logic in a table the user can write to themselves (`user_roles` has no public write policy above — assignment only happens via `supabaseAdmin`, i.e. an admin action).
- Rotate the service role key if it's ever committed to a repo, even briefly.

---

## 8. Migration Notes from Firestore

- `users/{uid}` → `profiles` (1:1, keyed by `auth.users.id`) + `subject_strengths` (1:many).
- `examHistory` documents with nested `answers` arrays → normalized into `exam_history` + `exam_answers` tables — this also makes per-question analytics (e.g. "which questions are most commonly missed") a simple SQL query instead of an application-level aggregation.
- Firestore's guest-session logic can be deleted entirely in favor of Supabase anonymous auth (§2.2) — meaningfully less code to maintain.
- The separate vector-store plan from the previous doc collapses into `source_documents.embedding` / `question_bank.embedding` — one less system to run.

---

## 9. Build Order

1. Set up Supabase project, run the schema DDL (§4), enable RLS on every table before writing any application code against it.
2. Implement `requireAuth` + `requireRole` middleware and the two-client pattern (§6.1) — get this right before building features on top of it.
3. Migrate auth flows: anonymous sign-in, email/password, guest-to-registered conversion.
4. Port `exam_history`/`flashcards` read-write paths to Supabase, using `supabaseAsUser` so RLS is doing the authorization work.
5. Wire the RAG/generation pipeline to `source_documents` + `question_bank` using `supabaseAdmin`, as a background job, not inline with user requests.
6. Build the reviewer queue UI against `review_queue`.
