# Currency Conversion Domain
Isolates all exchange logic. 
Requires an explicit `ExchangeRate` composed of a `CurrencyPair`.
The `MoneyConverter` safely transforms standard `Money` instances across domains.
