-- Wave 6.4.8: Production Hardening — Workspace isolation for financial tables
-- Adds workspace_id + tenant_id columns, RLS policies, and a working transaction executor.

-- 1. Add workspace_id + tenant_id to all financial tables (idempotent)
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'financial_accounts',
    'financial_categories',
    'financial_journals',
    'financial_journal_entries',
    'financial_budgets',
    'financial_goals',
    'financial_exchange_rates',
    'financial_reconciliation_records',
    'financial_recurring_transactions'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'workspace_id') THEN
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE', t);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'tenant_id') THEN
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN tenant_id UUID', t);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'balance') AND t = 'financial_accounts' THEN
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN balance BIGINT NOT NULL DEFAULT 0', t);
    END IF;
  END LOOP;
END $$;

-- Indexes for workspace-scoped queries
CREATE INDEX IF NOT EXISTS idx_financial_accounts_ws ON public.financial_accounts(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_journals_ws ON public.financial_journals(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_journal_entries_ws ON public.financial_journal_entries(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_budgets_ws ON public.financial_budgets(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_goals_ws ON public.financial_goals(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_categories_ws ON public.financial_categories(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_exchange_rates_ws ON public.financial_exchange_rates(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_financial_reconciliation_ws ON public.financial_reconciliation_records(workspace_id) WHERE deleted_at IS NULL;

-- 2. RLS policies: workspace members can read/write only their workspace's financial rows
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'financial_accounts',
    'financial_categories',
    'financial_journals',
    'financial_journal_entries',
    'financial_budgets',
    'financial_goals',
    'financial_exchange_rates',
    'financial_reconciliation_records',
    'financial_recurring_transactions'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS pol_%s_ws_select ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS pol_%s_ws_insert ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS pol_%s_ws_update ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS pol_%s_ws_delete ON public.%I', t, t);
    EXECUTE format('CREATE POLICY pol_%s_ws_select ON public.%I FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND deleted_at IS NULL))', t, t);
    EXECUTE format('CREATE POLICY pol_%s_ws_insert ON public.%I FOR INSERT WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND deleted_at IS NULL))', t, t);
    EXECUTE format('CREATE POLICY pol_%s_ws_update ON public.%I FOR UPDATE USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND deleted_at IS NULL))', t, t);
    EXECUTE format('CREATE POLICY pol_%s_ws_delete ON public.%I FOR DELETE USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND deleted_at IS NULL))', t, t);
  END LOOP;
END $$;

-- 3. Fix execute_transaction_batch: implement real dynamic DML with RLS enforcement
CREATE OR REPLACE FUNCTION public.execute_transaction_batch(ops JSONB, idemp_key VARCHAR DEFAULT NULL)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  op JSONB;
  tbl TEXT;
  act TEXT;
  payload JSONB;
  match JSONB;
  id_val TEXT;
  cols TEXT[];
  col TEXT;
  vals TEXT[];
  val TEXT;
  set_clause TEXT;
  match_clause TEXT;
BEGIN
  -- Idempotency guard
  IF idemp_key IS NOT NULL THEN
    BEGIN
      INSERT INTO public.idempotency_keys (key) VALUES (idemp_key);
    EXCEPTION WHEN unique_violation THEN
      RETURN; -- Already processed
    END;
  END IF;

  FOR op IN SELECT * FROM jsonb_array_elements(ops) LOOP
    tbl := op->>'table';
    act := op->>'action';
    payload := COALESCE(op->'payload', '{}'::jsonb);
    match := COALESCE(op->'match', '{}'::jsonb);

    IF act = 'insert' THEN
      cols := ARRAY(SELECT jsonb_object_keys(payload));
      vals := ARRAY(
        SELECT CASE
          WHEN jsonb_typeof(payload->key) = 'string' THEN quote_literal(payload->>key)
          WHEN payload->key IS NULL THEN 'NULL'
          ELSE (payload->>key)
        END
        FROM jsonb_object_keys(payload) AS key
      );
      EXECUTE format('INSERT INTO public.%I (%s) VALUES (%s)', tbl, array_to_string(cols, ','), array_to_string(vals, ','));

    ELSIF act = 'update' THEN
      set_clause := (
        SELECT string_agg(format('%I = %s', key, CASE
            WHEN jsonb_typeof(payload->key) = 'string' THEN quote_literal(payload->>key)
            WHEN payload->key IS NULL THEN 'NULL'
            ELSE (payload->>key)
          END), ', ')
        FROM jsonb_object_keys(payload) AS key
      );
      match_clause := (
        SELECT string_agg(format('%I = %s', key, CASE
            WHEN jsonb_typeof(match->key) = 'string' THEN quote_literal(match->>key)
            WHEN match->key IS NULL THEN 'NULL'
            ELSE (match->>key)
          END), ' AND ')
        FROM jsonb_object_keys(match) AS key
      );
      IF match_clause IS NULL OR match_clause = '' THEN
        RAISE EXCEPTION 'UPDATE without match clause is not allowed';
      END IF;
      EXECUTE format('UPDATE public.%I SET %s WHERE %s', tbl, set_clause, match_clause);

    ELSIF act = 'delete' THEN
      match_clause := (
        SELECT string_agg(format('%I = %s', key, CASE
            WHEN jsonb_typeof(match->key) = 'string' THEN quote_literal(match->>key)
            WHEN match->key IS NULL THEN 'NULL'
            ELSE (match->>key)
          END), ' AND ')
        FROM jsonb_object_keys(match) AS key
      );
      IF match_clause IS NULL OR match_clause = '' THEN
        RAISE EXCEPTION 'DELETE without match clause is not allowed';
      END IF;
      EXECUTE format('DELETE FROM public.%I WHERE %s', tbl, match_clause);
    END IF;
  END LOOP;
END;
$$;
