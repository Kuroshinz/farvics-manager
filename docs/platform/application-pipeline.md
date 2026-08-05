# Application Pipeline Foundation

## Execution Flow
The Application Pipeline implements a CQRS Mediator pattern combined with a Middleware Pipeline. 
Every incoming request (Command or Query) is dispatched via the IMediator abstraction.
Before hitting the primary ICommandHandler or IQueryHandler, the request traverses a sequence of IPipelineBehavior contracts.

## Dependency Diagram
`
[External Triggers: API, Cron, Jobs]
       ¦
       ?
   [IMediator]
       ¦
       ?
[IPipelineBehavior 1...N]
       ¦
       ?
[ICommandHandler / IQueryHandler]
       ¦
       ?
[Application / Domain Layers]
`

## Extension Strategy
New behaviors can be plugged into the pipeline purely by implementing IPipelineBehavior<TRequest, TResponse>.
No core logic needs to change. The IMediator dynamically wires the pipeline decorators before executing the handler.
Behaviors optionally implement eforeExecute, fterExecute, and handleError alongside the core handle(next) delegate.

## Future Middleware Order
Recommended execution sequence for behaviors (Outside-In):
1. **Request**
2. **Validation** (Fail fast before processing)
3. **Authorization** (Ensure actor can perform action)
4. **Logging** (Record intent and payload)
5. **Metrics** (Start tracking execution time/metrics)
6. **Transaction** (Begin UnitOfWork)
7. **Use Case** (Execute Command/Query handler)
8. **Event Publishing** (Dispatch accumulated domain events)
9. **Audit** (Record successful outcome)
10. **Response** (Return Result<T> to caller)
