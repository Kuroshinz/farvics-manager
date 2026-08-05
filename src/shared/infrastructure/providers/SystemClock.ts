import { IClock } from '../../core/Providers';

export class SystemClock implements IClock {
  now(): Date {
    return new Date();
  }
}
