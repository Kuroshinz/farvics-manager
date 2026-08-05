import { SystemClock } from '../providers/SystemClock';
import { CryptoIdGenerator } from '../providers/CryptoIdGenerator';
import { JsonSerializer } from '../serialization/JsonSerializer';

describe('Providers', () => {
  it('SystemClock returns a Date', () => {
    const clock = new SystemClock();
    expect(clock.now()).toBeInstanceOf(Date);
  });

  it('CryptoIdGenerator generates UUID', () => {
    const gen = new CryptoIdGenerator();
    expect(typeof gen.generate()).toBe('string');
  });

  it('JsonSerializer serializes and deserializes', () => {
    const serializer = new JsonSerializer();
    const data = { foo: 'bar' };
    const serialized = serializer.serialize(data);
    expect(typeof serialized).toBe('string');
    expect(serializer.deserialize(serialized)).toEqual(data);
  });
});
