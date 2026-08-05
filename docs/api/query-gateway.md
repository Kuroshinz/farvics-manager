# Backend For Frontend (BFF) & Query Gateway

## Gateway Lifecycle
The BFF layer acts as the absolute barrier before any raw data hits the React boundaries or external SDKs.
- `DashboardGateway` groups multiple specific mediator calls by orchestrating `DashboardAggregator`.
- This fundamentally solves the N+1 API fetching problem on the frontend.
- Caching wraps the outer aggregator explicitly. `executeCached` checks internal sets using exact `tags`.

## Cache & Invalidation
The `QueryCache` interface natively supports Tag-based invalidation. When the Projection Runtime safely persists an update to a Read Model, the `CacheInvalidation` service triggers `invalidateByTag('budget_projection')`, instantly dropping stale memory.

## SDK Abstraction
The `FarvicsClient` provides strongly-typed methods: `query()`, `mutate()`, and `subscribe()`. This enables any UI or generic AI Agent to consume the API without knowing the underlying network transport (HTTP vs WebSocket vs Supabase Realtime).

## Realtime Hooks
`FarvicsRealtimeClient` abstracts live data subscriptions. It provides a generic `subscribe(channel, callback)` which can be safely hooked into React `useEffect` loops or Redux stores without leaking Supabase SDK logic.

