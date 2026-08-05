import { Money } from '../Money';
import { Currency } from '../Currency';
import { BusinessDate } from '../Calendar';

export class CurrencyPair {
  constructor(
    public readonly base: Currency,
    public readonly quote: Currency
  ) {
    if (base.equals(quote)) throw new Error('Base and quote currencies must be different');
  }
  
  equals(other: CurrencyPair): boolean {
    return this.base.equals(other.base) && this.quote.equals(other.quote);
  }
}

export class ExchangeRate {
  constructor(
    public readonly pair: CurrencyPair,
    public readonly rate: number,
    public readonly date: BusinessDate
  ) {
    if (rate <= 0) throw new Error('Exchange rate must be strictly positive');
  }
}

export class ConversionPolicy {
  static validate(money: Money, rate: ExchangeRate): void {
    if (!money.currency.equals(rate.pair.base)) {
      throw new Error('Money currency does not match ExchangeRate base currency');
    }
  }
}

export class MoneyConverter {
  static convert(money: Money, rate: ExchangeRate): Money {
    ConversionPolicy.validate(money, rate);
    const baseMajor = money.amount / Math.pow(10, money.currency.precision);
    const targetMajor = baseMajor * rate.rate;
    return Money.fromMajor(targetMajor, rate.pair.quote);
  }
}
