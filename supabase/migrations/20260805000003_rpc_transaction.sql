CREATE TABLE idempotency_keys (
    key VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Note: The exact parsing logic inside loop relies on plpgsql jsonb handling.
CREATE OR REPLACE FUNCTION execute_transaction_batch(ops JSONB, idemp_key VARCHAR DEFAULT NULL)
RETURNS VOID AS $$
DECLARE
    op JSONB;
BEGIN
    -- Idempotency check natively leverages Unique Constraint Violation (HTTP 409/23505)
    IF idemp_key IS NOT NULL THEN
        INSERT INTO idempotency_keys (key) VALUES (idemp_key);
    END IF;

    FOR op IN SELECT * FROM jsonb_array_elements(ops) LOOP
        -- For robust architecture, explicit mappings per table are recommended,
        -- but dynamic SQL illustrates the abstraction boundary constraint.
        -- EXECUTE format('INSERT INTO %I...', op->>'table')
    END LOOP;
END;
$$ LANGUAGE plpgsql;
