import { MoneyValidator } from '../validators';

describe('Enterprise Domain Capabilities', () => {
  it('should instantiate domain validators', () => {
    const validator = new MoneyValidator();
    expect(validator).toBeDefined();
  });
});
