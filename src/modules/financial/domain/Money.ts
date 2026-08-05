import { Currency } from './Currency';

export class Money {
  constructor(
    public readonly amount: number, // Integer minor units
    public readonly currency: Currency
  ) {
    if (!Number.isInteger(amount)) {
      throw new Error('Money amount must be an integer (minor units). Floating points are forbidden.');
    }
  }

  static fromMajor(amount: number, currency: Currency): Money {
    return new Money(Math.round(amount * Math.pow(10, currency.precision)), currency);
  }

  static zero(currency: Currency): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    return new Money(Math.round(this.amount * multiplier), this.currency);
  }

  allocate(ratios: number[]): Money[] {
    const total = ratios.reduce((a, b) => a + b, 0);
    let remainder = this.amount;
    const results = ratios.map(ratio => {
      const share = Math.floor(this.amount * (ratio / total));
      remainder -= share;
      return new Money(share, this.currency);
    });

    for (let i = 0; i < remainder; i++) {
      results[i] = new Money(results[i].amount + 1, this.currency);
    }
    return results;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency.equals(other.currency);
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount > other.amount;
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount < other.amount;
  }
  
  isZero(): boolean {
    return this.amount === 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  isNegative(): boolean {
    return this.amount < 0;
  }

  format(): string {
    const major = this.amount / Math.pow(10, this.currency.precision);
    return new Intl.NumberFormat(this.currency.locale, {
      style: 'currency',
      currency: this.currency.code
    }).format(major);
  }

  private assertSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error(`Currency mismatch: ${this.currency.code} vs ${other.currency.code}`);
    }
  }
}
