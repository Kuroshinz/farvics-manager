import { IMetrics, ICounter, IGauge, IHistogram, ITimer } from '../../core/Metrics';

class InMemoryCounter implements ICounter {
  private count = 0;
  increment(value = 1): void { this.count += value; }
  get(): number { return this.count; }
}

class InMemoryGauge implements IGauge {
  private value = 0;
  set(val: number): void { this.value = val; }
  increment(val = 1): void { this.value += val; }
  decrement(val = 1): void { this.value -= val; }
  get(): number { return this.value; }
}

class InMemoryHistogram implements IHistogram {
  private values: number[] = [];
  observe(val: number): void { this.values.push(val); }
}

class InMemoryTimer implements ITimer {
  private startTime = 0;
  start(): void { this.startTime = Date.now(); }
  stop(): void { /* log or track duration */ }
}

export class InMemoryMetrics implements IMetrics {
  private counters = new Map<string, InMemoryCounter>();
  private gauges = new Map<string, InMemoryGauge>();
  private histograms = new Map<string, InMemoryHistogram>();

  getCounter(name: string): ICounter {
    if (!this.counters.has(name)) this.counters.set(name, new InMemoryCounter());
    return this.counters.get(name)!;
  }

  getGauge(name: string): IGauge {
    if (!this.gauges.has(name)) this.gauges.set(name, new InMemoryGauge());
    return this.gauges.get(name)!;
  }

  getHistogram(name: string): IHistogram {
    if (!this.histograms.has(name)) this.histograms.set(name, new InMemoryHistogram());
    return this.histograms.get(name)!;
  }

  getTimer(name: string): ITimer {
    return new InMemoryTimer();
  }
}
