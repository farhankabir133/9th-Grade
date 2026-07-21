
-- Remove pg_cron-based scheduling in favor of native Edge Function cron
-- per config.toml [functions.replenish-bank.schedule]

select cron.unschedule('replenish-question-bank') where exists (
  select 1 from cron.job where jobname = 'replenish-question-bank'
);
