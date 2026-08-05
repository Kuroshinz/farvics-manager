# Runtime Foundation

## Startup Lifecycle
The bootstrapper enforces the exact startup sequence:
1. `Configuration`: Validate core environments.
2. `DI Container`: Instantiate the root dependencies.
3. `Infrastructure`: Register structural adapters (DB, Cache, etc.).
4. `Modules`: Discover and invoke `registerModule` on all business partitions.
5. `Health Checks`: Wait for `IHealthCheckProvider` to resolve as `Healthy`.
6. `Pipelines`: Ensure Mediator and Behaviors are registered.
7. `Ready`: Bootstrapper completes, ready for background workers or incoming requests.

## Shutdown Lifecycle
Initiated via `AbortSignal`. 
WorkerEngine loops terminate gracefully on `.stop()`. 
Mediator commands inherently shouldn't accept new traffic after signals are tripped.

## Worker Lifecycle
`WorkerEngine` manages endless polling operations (e.g. `EventDispatcher`). It isolates failures natively with exponential backoff up to 60s without terminating the actual node process.

## Error Flow
Domain exceptions or infrastructural faults thrown inside the Mediator pipeline travel outward until they are intercepted by `ErrorMapper.toProblemDetails()`. Standardized RFC7807 problem details are then yielded to the caller.

## Metrics Flow
`IMetrics` supports Counter, Gauge, Histogram, and Timer. Handled primarily through `InMemoryMetrics` right now. `RequestMiddleware` starts boundaries, and `AuditBehavior` yields metric tracking natively for all Domain Commands and Queries.
