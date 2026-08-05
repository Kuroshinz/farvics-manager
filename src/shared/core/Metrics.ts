export interface ICounter {
  increment(value?: number, labels?: Record<string, string>): void;
}

export interface IHistogram {
  observe(value: number, labels?: Record<string, string>): void;
}

export interface IGauge {
  set(value: number, labels?: Record<string, string>): void;
  increment(value?: number, labels?: Record<string, string>): void;
  decrement(value?: number, labels?: Record<string, string>): void;
}

export interface ITimer {
  start(): void;
  stop(labels?: Record<string, string>): void;
}

export interface IMetrics {
  getCounter(name: string): ICounter;
  getHistogram(name: string): IHistogram;
  getGauge(name: string): IGauge;
  getTimer(name: string): ITimer;
}
