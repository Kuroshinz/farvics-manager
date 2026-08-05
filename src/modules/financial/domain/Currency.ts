export class Currency {
  constructor(
    public readonly code: string,
    public readonly precision: number,
    public readonly symbol: string,
    public readonly locale: string
  ) {
    if (!/^[A-Z]{3}$/.test(code)) throw new Error('Invalid ISO4217 currency code');
  }

  static USD(): Currency { return new Currency('USD', 2, '$', 'en-US'); }
  static EUR(): Currency { return new Currency('EUR', 2, '€', 'de-DE'); }
  static GBP(): Currency { return new Currency('GBP', 2, '£', 'en-GB'); }
  static JPY(): Currency { return new Currency('JPY', 0, '¥', 'ja-JP'); }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }
}
