# Farvics Manager - Plugin System Specification

## 1. V1 Architecture (Current)
- Compile-time inclusion only.
- Restricted to trusted, first-party modules.
- Architectural boundary enforced via Dependency Injection. No runtime sandboxing.

## 2. V2 Architecture (Future Category C)
- Marketplace readiness via WebAssembly (Wasm) or V8 Isolates.
- Strict iframe sandboxing for UI widgets.

