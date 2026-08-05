CREATE TABLE outbox_events (
  id UUID PRIMARY KEY,
  aggregate_id VARCHAR(255) NOT NULL,
  aggregate_type VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  retry_count INT DEFAULT 0 NOT NULL
);
CREATE INDEX idx_outbox_unprocessed ON outbox_events(occurred_at) WHERE processed_at IS NULL;
