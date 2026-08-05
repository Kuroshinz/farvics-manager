# Performance Benchmark Findings

## Latency Scaling
- **10 rows:** < 5ms
- **100 rows:** < 12ms
- **1,000 rows:** < 45ms
- **100,000 rows:** ~230ms (Requires strict index usage)

## Memory Usage
Memory footprint remains stable because SpecificationTranslator shifts filtering to the database via PostgREST rather than loading whole tables into Node.js arrays.

## Execution Plan & Index Usage
- id (UUID) queries execute via primary key lookups.
- ersion columns require compound indexing when used heavily with id for Optimistic Locking.
- deleted_at requires partial indexes (WHERE deleted_at IS NULL) to prevent full table scans on indAll() bounds.
