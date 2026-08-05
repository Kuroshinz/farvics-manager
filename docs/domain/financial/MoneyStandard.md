# Money Standard
All money values within AURA.MONEY are represented using the `Money` Value Object.
- Amounts are **always** integer minor units (e.g. cents). Floating-point math is strictly forbidden.
- Ratios are distributed via `allocate()` which prevents dropping pennies.
- Binds tightly with an ISO4217 `Currency` tracking locale and precision.
