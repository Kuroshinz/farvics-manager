const fs = require('fs');
const path = require('path');

const dir = path.join('d:', 'ManagerMn', 'docs', 'architecture');

const files = {
  '01-architecture-design-document.md': `# AURA.MONEY - Architecture Design Document (ADD)

## 1. Vision
Build a long-term AI Financial Platform supporting millions of users, while maintaining pragmatic, modular engineering.

## 2. Engineering Principles
- Platform First
- Strict Boundaries (Hexagonal & Clean Architecture)
- Pragmatic Extensibility (Avoid premature complexity)
- At-least-once Event Delivery with Loop Protection

## 3. Architecture Style
- **Modular Monolith**: Single deployment, strict internal module boundaries.
- **Domain Driven Design (DDD)**: Business logic is the core. Every Aggregate Root MUST implement Optimistic Concurrency Control (\`version\`, \`updatedAt\`).
- **CQRS (Light)**: Separation of commands and queries. Projections are eventually consistent.
- **Event Driven Architecture**: Transactional Outbox pattern.

## 4. Automation & Loop Protection (Category A)
To prevent recursive automation triggers, the event bus implements:
- \`CorrelationId\` & \`CausationId\` tracking across all events.
- \`HopCount\` (Max Depth = 5).
- Rule Circuit Breakers and duplicate detection.

## 5. Plugin Architecture (Category B)
- **V1**: Compile-time, trusted first-party plugins only. Architectural isolation without runtime sandboxing.
- **V2 (Future)**: Wasm/Isolates for third-party marketplace execution.

## 6. Observability (Category A)
First-class platform capability including Structured Logging, Distributed Trace IDs, Metrics, and Audit Trails.
`,

  '02-domain-model-specification.md': `# AURA.MONEY - Domain Model Specification (DMS)

## 1. Ledger Context
- **Aggregate Roots**: \`Account\` (includes \`version\`, \`updatedAt\`), \`Transaction\` (includes \`version\`, \`updatedAt\`)
- **Entities**: \`Category\`
- **Domain Policies**: Optimistic locking enforced on all mutations. ConcurrencyException thrown on conflict.

## 2. Automation Context
- **Aggregate Roots**: \`Rule\` (includes \`version\`, \`updatedAt\`)
- **Domain Policies**: Circuit breakers applied per rule execution graph to prevent infinite loops.
`,

  '05-platform-capability-map.md': `# AURA.MONEY - Platform Capability Map

## 1. Observability (Category A)
- **Owner**: Platform Team
- **Capabilities**: Structured Logging, Correlation Tracking, Distributed Trace IDs, Health Checks, Error Classification.

## 2. Event Bus & Automation Loop Protection
- **Capabilities**: Outbox Dispatcher, Dead Letter Queue (DLQ), Hop Count Validation, Causation Tracking.

## 3. Projection Rebuild Engine (Category B)
- **Capabilities**: Replay retained events from the Outbox (based on configurable retention window).
`,

  '06-event-catalog.md': `# AURA.MONEY - Event Catalog

## Universal Event Metadata
All events strictly require:
- \`correlationId\`: Tracks the entire user workflow.
- \`causationId\`: The ID of the event/command that triggered this.
- \`hopCount\`: Incremented per cascaded event (Max 5).

## 1. \`TransactionCreated\`
- **Aggregate**: \`Transaction\`
- **Payload**: \`{ transactionId, accountId, amount, currency }\`
`,

  '10-plugin-system-specification.md': `# AURA.MONEY - Plugin System Specification

## 1. V1 Architecture (Current)
- Compile-time inclusion only.
- Restricted to trusted, first-party modules.
- Architectural boundary enforced via Dependency Injection. No runtime sandboxing.

## 2. V2 Architecture (Future Category C)
- Marketplace readiness via WebAssembly (Wasm) or V8 Isolates.
- Strict iframe sandboxing for UI widgets.
`,

  '11-architecture-change-log.md': `# AURA.MONEY - Architecture Change Log

## 1. Automation Loop Protection
- **Status**: ACCEPTED (Category A - Mandatory)
- **Rationale**: Infinite loops in the Automation Engine pose an existential risk (DDOS, cost overrun).
- **Impact**: Added \`HopCount\`, \`CorrelationId\`, \`CausationId\`, and Circuit Breakers to the Event Bus and Automation modules.

## 2. Optimistic Concurrency Control
- **Status**: ACCEPTED (Category A - Mandatory)
- **Rationale**: Financial data cannot tolerate Lost Update Anomalies.
- **Impact**: All Aggregate Roots now include \`version\` and \`updatedAt\`. Repositories enforce locking and throw \`ConcurrencyException\`.

## 3. Observability Expansion
- **Status**: ACCEPTED (Category A - Mandatory)
- **Rationale**: Required for production triage and distributed tracing.
- **Impact**: Upgraded Observability to a first-class Platform Capability.

## 4. Projection Rebuild Engine
- **Status**: PARTIALLY ACCEPTED (Category B - Required Before Prod)
- **Rationale**: A full Event Sourcing engine is premature.
- **Impact**: Outbox will retain events for a configurable window to allow limited replays and projection rebuilds, paving the way for a future Event Store.

## 5. Plugin Runtime Isolation
- **Status**: PARTIALLY ACCEPTED (Category B - Required Before Prod)
- **Rationale**: Building a Wasm sandbox is too complex for V1.
- **Impact**: V1 supports only compiled, trusted, first-party plugins. Interfaces are designed for future sandbox migration (Category C).
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, filename), content);
}
console.log('Successfully updated architecture documents and generated change log.');
