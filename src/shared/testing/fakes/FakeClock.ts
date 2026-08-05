import { IClock } from '../../core/Providers';

export class FakeClock implements IClock {
  private currentTime: Date;

  constructor(initialTime?: Date) {
    this.currentTime = initialTime || new Date();
  }

  now(): Date {
    return this.currentTime;
  }

  advance(ms: number): void {
    this.currentTime = new Date(this.currentTime.getTime() + ms);
  }

  set(time: Date): void {
    this.currentTime = time;
  }
}
